import puppeteer from 'puppeteer';
import axios from 'axios';
import { PDFParse } from 'pdf-parse';
import Scheme from '../models/Scheme.js';

/**
 * Generates a simple hash for content deduplication.
 * @param {string} content - Content to hash
 * @returns {string} Hash string
 */
const generateContentHash = (content) => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
};

/**
 * Sanitizes text extracted from PDF by removing extra spaces and newlines.
 * @param {string} text - Raw text
 * @returns {string} Cleaned text
 */
const cleanText = (text) => {
    if (!text) return "";
    return text
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "") // Remove non-printable characters
        .replace(/\s+/g, " ") // Collapse multiple spaces/newlines
        .trim();
};

/**
 * Extracts a description from PDF text using flexible header detection.
 * @param {string} text - Cleaned PDF text
 * @returns {string} Extracted description
 */
const extractDescription = (text) => {
    // Noise removal: Remove markers like "-- 1 of 3 --", "Page X", and TOC dots
    const noisePatterns = [
        /-- \d+ of \d+ --/g,
        /Page \d+/g,
        /\[\d+\]/g,
        /\.{3,}\s*\d+/g // Remove Table of Contents dots and page numbers (e.g. ".... 10")
    ];
    let sanitizedText = text;
    noisePatterns.forEach(p => sanitizedText = sanitizedText.replace(p, " "));

    const headers = [
        "Introduction",
        "Objectives",
        "Background",
        "Rationale",
        "About the Scheme",
        "About the program",
        "Preface"
    ];

    let extractedText = "";

    // Step 1: Header Search
    for (const header of headers) {
        const regex = new RegExp(`${header}[\\s:]*([\\s\\S]{50,2000}?)(?=\\s[2-9]\\.\\d|\\s[I-V]+\\.|Implementing|Administrative|Guidelines|Financial|\\n\\s*\\n)`, "i");
        const match = sanitizedText.match(regex);
        if (match && match[1].trim().length > 50) {
            extractedText = cleanText(match[1]);
            break;
        }
    }

    // Step 2: Line-based Fallback
    if (!extractedText || extractedText.length < 50) {
        const lines = sanitizedText.split(/\r?\n/).filter(l => l.trim().length > 40);
        if (lines.length > 0) {
            extractedText = cleanText(lines.slice(0, 5).join(" "));
        }
    }

    // Step 3: Raw Fragment Fallback
    if (!extractedText || extractedText.length < 50) {
        extractedText = cleanText(sanitizedText.substring(0, 1000));
    }

    // Final Post-processing: Shorten to ~200-250 chars for a cleaner UI
    if (extractedText.length < 50) {
        return "Government scheme information. View the official document for full details.";
    }

    // Target a very short summary (roughly 2-3 sentences)
    const maxLength = 250;
    let summary = extractedText;

    // Try to break at a sentence boundary within the first 300 chars
    const sentenceEnd = summary.indexOf('.', 150);
    if (sentenceEnd !== -1 && sentenceEnd < 350) {
        summary = summary.substring(0, sentenceEnd + 1);
    }

    if (summary.length > maxLength) {
        return summary.substring(0, maxLength).trim() + "...";
    }

    return summary;
};

/**
 * Extracts implementation period or date from PDF text.
 * @param {string} text - Cleaned PDF text
 * @returns {string} Extracted date info
 */
const extractDate = (text) => {
    const datePatterns = [
        /Implementation Period of Scheme([\s\S]*?)(?:\d|\n)/i,
        /Effective from([\s\S]*?)(?:\d|\n)/i,
        /Date of commencement([\s\S]*?)(?:\d|\n)/i
    ];

    for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) return cleanText(match[1]);
    }
    return "See document";
};

/**
 * Scrapes government agricultural scheme information using Puppeteer.
 * Fetches PDF links and parses content using pdf-parse.
 * @async
 * @returns {Promise<Array<Object>>} Array of scheme objects
 */
const scrapeSchemes = async () => {
    let browser;
    try {
        console.log('🌐 Launching browser for scraping...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        const url = 'https://agriwelfare.gov.in/en/Major';

        console.log(`📡 Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        console.log('📄 Extracting scheme links and publish dates from table...');
        const schemeLinks = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table tr')).slice(1);
            return rows.map(tr => {
                const cols = tr.querySelectorAll('td');
                if (cols.length < 4) return null;

                const linkElement = cols[3].querySelector('a');
                return {
                    title: cols[1].innerText.trim(),
                    publishDate: cols[2].innerText.trim(), // Extracting Publish Date from table
                    pdfUrl: linkElement ? linkElement.href : null
                };
            }).filter(item => item && item.pdfUrl);
        });

        console.log(`🔍 Found ${schemeLinks.length} potential schemes. Starting PDF parsing...`);
        const schemes = [];

        for (const scheme of schemeLinks) {
            try {
                console.log(`📥 Downloading PDF for: ${scheme.title}`);
                const response = await axios.get(scheme.pdfUrl, {
                    responseType: 'arraybuffer',
                    timeout: 25000 // Increased timeout for larger PDFs
                });

                const parser = new PDFParse({ data: response.data });
                const data = await parser.getText();
                const rawText = data.text;

                const description = extractDescription(rawText);

                schemes.push({
                    title: scheme.title,
                    description,
                    link: scheme.pdfUrl,
                    publishDate: scheme.publishDate,
                    sourceUrl: url,
                    contentHash: generateContentHash(scheme.title + description),
                });
            } catch (schemeError) {
                console.warn(`⚠️ Failed to parse scheme "${scheme.title}": ${schemeError.message}`);
            }
        }

        console.log(`✅ Scraped and parsed ${schemes.length} schemes successfully`);
        return schemes;
    } catch (error) {
        console.error(`❌ Scraping error: ${error.message}`);
        throw new Error(`Failed to scrape schemes: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
};

/**
 * Fetches and updates schemes in the database.
 * @async
 * @returns {Promise<Object>} Result with counts
 */
const updateSchemesInDB = async () => {
    try {
        const schemes = await scrapeSchemes();
        let newCount = 0;
        let updatedCount = 0;

        for (const schemeData of schemes) {
            const existing = await Scheme.findOne({
                $or: [
                    { contentHash: schemeData.contentHash },
                    { title: schemeData.title }
                ]
            });

            if (!existing) {
                await Scheme.create(schemeData);
                newCount++;
            } else {
                await Scheme.findByIdAndUpdate(existing._id, {
                    ...schemeData,
                    updatedAt: new Date()
                });
                updatedCount++;
            }
        }

        console.log(`✅ Scheme update complete: ${newCount} new, ${updatedCount} updated`);
        return { newCount, updatedCount };
    } catch (error) {
        console.error(`❌ Error updating schemes in DB: ${error.message}`);
        throw error;
    }
};

export { scrapeSchemes, updateSchemesInDB, generateContentHash };
