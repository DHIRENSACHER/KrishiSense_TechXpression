import * as cheerio from 'cheerio';
import Scheme from '../models/Scheme.js';

/**
 * Mock HTML data simulating a government agricultural schemes page.
 */
const MOCK_HTML = `
<!DOCTYPE html>
<html>
<body>
  <div class="schemes-container">
    <div class="scheme-card" data-category="cereals">
      <h3 class="scheme-title">PM-KISAN Samman Nidhi</h3>
      <p class="scheme-description">Direct income support of Rs. 6000 per year to farmer families.</p>
      <a class="scheme-link" href="https://pmkisan.gov.in">Apply Now</a>
    </div>
    <div class="scheme-card" data-category="all">
      <h3 class="scheme-title">Pradhan Mantri Fasal Bima Yojana</h3>
      <p class="scheme-description">Crop insurance providing financial support in case of crop failure.</p>
      <a class="scheme-link" href="https://pmfby.gov.in">Apply Now</a>
    </div>
    <div class="scheme-card" data-category="horticulture">
      <h3 class="scheme-title">Mission for Integrated Development of Horticulture</h3>
      <p class="scheme-description">Subsidy up to 50% for horticulture farms and greenhouses.</p>
      <a class="scheme-link" href="https://midh.gov.in">Apply Now</a>
    </div>
    <div class="scheme-card" data-category="organic">
      <h3 class="scheme-title">Paramparagat Krishi Vikas Yojana</h3>
      <p class="scheme-description">Rs. 50,000 per hectare assistance for organic farming.</p>
      <a class="scheme-link" href="https://pgsindia-ncof.gov.in">Apply Now</a>
    </div>
  </div>
</body>
</html>
`;

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
 * Scrapes government agricultural scheme information.
 * Uses Cheerio for HTML parsing with mock data.
 * @async
 * @param {string} [url] - URL to scrape (not used in mock mode)
 * @returns {Promise<Array<Object>>} Array of scheme objects
 */
const scrapeSchemes = async (url = null) => {
    try {
        const html = MOCK_HTML;
        const $ = cheerio.load(html);
        const schemes = [];

        $('.scheme-card').each((index, element) => {
            const $card = $(element);
            const title = $card.find('.scheme-title').text().trim();
            const description = $card.find('.scheme-description').text().trim();
            const link = $card.find('.scheme-link').attr('href');
            const cropCategory = $card.attr('data-category') || 'all';

            if (title) {
                schemes.push({
                    title,
                    description,
                    link,
                    cropCategory,
                    sourceUrl: url || 'mock://government-schemes',
                    contentHash: generateContentHash(title + description),
                });
            }
        });

        console.log(`📋 Scraped ${schemes.length} schemes successfully`);
        return schemes;
    } catch (error) {
        console.error(`❌ Scraping error: ${error.message}`);
        throw new Error(`Failed to scrape schemes: ${error.message}`);
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
            const existing = await Scheme.findOne({ contentHash: schemeData.contentHash });

            if (!existing) {
                await Scheme.create(schemeData);
                newCount++;
            } else {
                await Scheme.findByIdAndUpdate(existing._id, { ...schemeData, updatedAt: new Date() });
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
