import React, { useState } from 'react';
import { modelAPI } from '../services/api';

export default function SchemePredictor() {
  const [form, setForm] = useState({
    crop: 'Rice',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    land_size: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Jute', 'Sugarcane', 'Pulses', 'Vegetables', 'Fruits', 'Spices'];

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
        crop: form.crop,
        nitrogen: parseFloat(form.nitrogen) || 0,
        phosphorus: parseFloat(form.phosphorus) || 0,
        potassium: parseFloat(form.potassium) || 0,
        ph: parseFloat(form.ph) || 0,
        rainfall: parseFloat(form.rainfall) || 0,
        temperature: parseFloat(form.temperature) || 0,
        humidity: parseFloat(form.humidity) || 0,
        land_size: parseFloat(form.land_size) || 0,
      };
      const res = await modelAPI.predictScheme(payload);
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
          <h1 className="text-2xl font-bold mb-2">Government Scheme Predictor</h1>
          <p className="text-gray-600 mb-4">
            Enter your farm details to find the most suitable government scheme for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Crop Type</span>
                <select
                  name="crop"
                  value={form.crop}
                  onChange={handleChange}
                  className="mt-1 input"
                  required
                >
                  {crops.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Nitrogen (N)</span>
                <input
                  name="nitrogen"
                  type="number"
                  value={form.nitrogen}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 50"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Phosphorus (P)</span>
                <input
                  name="phosphorus"
                  type="number"
                  value={form.phosphorus}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 40"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Potassium (K)</span>
                <input
                  name="potassium"
                  type="number"
                  value={form.potassium}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 50"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Soil pH</span>
                <input
                  name="ph"
                  type="number"
                  step="0.1"
                  value={form.ph}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 6.5"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Rainfall (mm)</span>
                <input
                  name="rainfall"
                  type="number"
                  value={form.rainfall}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 1000"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Temperature (°C)</span>
                <input
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={form.temperature}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 28"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Humidity (%)</span>
                <input
                  name="humidity"
                  type="number"
                  step="0.1"
                  value={form.humidity}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 70"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Land Size (hectares)</span>
                <input
                  name="land_size"
                  type="number"
                  step="0.1"
                  value={form.land_size}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 1.5"
                  required
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Analyzing…' : 'Find Scheme'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    crop: 'Rice',
                    nitrogen: '',
                    phosphorus: '',
                    potassium: '',
                    ph: '',
                    rainfall: '',
                    temperature: '',
                    humidity: '',
                    land_size: '',
                  });
                  setResult(null);
                  setError(null);
                }}
                className="btn-ghost"
              >
                Reset
              </button>
            </div>
          </form>

          <div className="mt-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                {error}
              </div>
            )}
            {result && result.success && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-blue-900">
                  Recommended Scheme
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Best Match</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {result.recommended_scheme}
                    </p>
                    {result.confidence && (
                      <p className="text-sm text-gray-600 mt-2">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </p>
                    )}
                  </div>

                  {result.reason && (
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Reason</p>
                      <p className="text-gray-800">{result.reason}</p>
                    </div>
                  )}

                  {result.parameters_analyzed && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-600">Land Size</p>
                        <p className="text-lg font-semibold text-green-700">
                          {result.parameters_analyzed.land_size} ha
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-600">Soil Health</p>
                        <p className="text-lg font-semibold text-purple-700">
                          {result.parameters_analyzed.soil_health}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-600">Weather Risk</p>
                        <p className="text-lg font-semibold text-orange-700">
                          {result.parameters_analyzed.weather_risk}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
