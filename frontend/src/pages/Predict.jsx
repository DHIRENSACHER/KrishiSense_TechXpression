import React, { useState } from 'react';
import { modelAPI } from '../services/api';

export default function Predict() {
  const [form, setForm] = useState({
    temperature: '',
    rainfall: '',
    soil_ph: '',
    area: '',
    season: 'kharif',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        temperature: parseFloat(form.temperature) || 0,
        rainfall: parseFloat(form.rainfall) || 0,
        soil_ph: parseFloat(form.soil_ph) || 0,
        area: parseFloat(form.area) || 0,
        season: form.season,
      };
      const res = await modelAPI.predictCrop(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 min-h-[60vh]">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-2">Crop Predictor</h1>
          <p className="text-gray-600 mb-4">Enter the field parameters and get an AI recommendation.</p>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Temperature (°C)</span>
                <input name="temperature" value={form.temperature} onChange={handleChange} className="mt-1 input" placeholder="e.g. 28" />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Rainfall (mm)</span>
                <input name="rainfall" value={form.rainfall} onChange={handleChange} className="mt-1 input" placeholder="e.g. 200" />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Soil pH</span>
                <input name="soil_ph" value={form.soil_ph} onChange={handleChange} className="mt-1 input" placeholder="e.g. 6.5" />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Area (hectares)</span>
                <input name="area" value={form.area} onChange={handleChange} className="mt-1 input" placeholder="e.g. 1.2" />
              </label>
            </div>

            <label className="flex flex-col">
              <span className="text-sm text-gray-700">Season</span>
              <select name="season" value={form.season} onChange={handleChange} className="mt-1 input">
                <option value="kharif">Kharif</option>
                <option value="rabi">Rabi</option>
                <option value="zaid">Zaid</option>
              </select>
            </label>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Predicting…' : 'Predict'}
              </button>
              <button type="button" onClick={() => { setForm({ temperature:'', rainfall:'', soil_ph:'', area:'', season:'kharif' }); setResult(null); setError(null); }} className="btn-ghost">
                Reset
              </button>
            </div>
          </form>

          <div className="mt-6">
            {error && <div className="text-red-600">{error}</div>}
            {result && (
              <div className="bg-white p-4 rounded shadow mt-4">
                <h3 className="text-xl font-semibold mb-2">Prediction</h3>
                <p className="text-2xl font-bold text-gray-900">{result.prediction}</p>
                {result.confidence !== undefined && (
                  <p className="text-sm text-gray-600">Confidence: {Math.round((result.confidence || 0) * 100)}%</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
