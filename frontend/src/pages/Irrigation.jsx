import React, { useState } from 'react';
import { modelAPI } from '../services/api';

export default function Irrigation() {
  const [form, setForm] = useState({
    crop: 'Rice',
    soil_moisture: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    growth_stage: 'Vegetative',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Vegetables', 'Potato'];
  const growthStages = ['Sowing', 'Vegetative', 'Flowering', 'Harvest'];

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
        soil_moisture: parseFloat(form.soil_moisture) || 0,
        temperature: parseFloat(form.temperature) || 0,
        humidity: parseFloat(form.humidity) || 0,
        rainfall: parseFloat(form.rainfall) || 0,
        growth_stage: form.growth_stage,
      };
      const res = await modelAPI.predictIrrigation(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const getNeedLevelColor = (level) => {
    switch (level) {
      case 'High':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="pt-6 min-h-[60vh]">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-2">Irrigation Predictor</h1>
          <p className="text-gray-600 mb-4">
            Get AI-powered irrigation recommendations based on crop and environmental conditions.
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
                <span className="text-sm text-gray-700">Soil Moisture (%)</span>
                <input
                  name="soil_moisture"
                  type="number"
                  step="0.1"
                  value={form.soil_moisture}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 45"
                  required
                />
                <span className="text-xs text-gray-500 mt-1">Current moisture level</span>
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
                <span className="text-sm text-gray-700">Recent Rainfall (mm)</span>
                <input
                  name="rainfall"
                  type="number"
                  step="0.1"
                  value={form.rainfall}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 20"
                  required
                />
                <span className="text-xs text-gray-500 mt-1">Last 7 days</span>
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Growth Stage</span>
                <select
                  name="growth_stage"
                  value={form.growth_stage}
                  onChange={handleChange}
                  className="mt-1 input"
                  required
                >
                  {growthStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Analyzing…' : 'Get Recommendation'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    crop: 'Rice',
                    soil_moisture: '',
                    temperature: '',
                    humidity: '',
                    rainfall: '',
                    growth_stage: 'Vegetative',
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
              <div className={`border p-6 rounded-lg ${getNeedLevelColor(result.irrigation_need)}`}>
                <h3 className="text-xl font-semibold mb-4">
                  Irrigation Recommendation
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Irrigation Need</p>
                    <p className="text-3xl font-bold" style={{ color: result.irrigation_need === 'High' ? '#dc2626' : result.irrigation_need === 'Medium' ? '#d97706' : '#16a34a' }}>
                      {result.irrigation_need}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Water Amount</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {result.recommended_amount_mm} mm
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ≈ {result.recommended_amount_liters_per_sqm} L/m²
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Frequency</p>
                      <p className="text-lg font-semibold text-purple-700">
                        {result.frequency}
                      </p>
                    </div>
                  </div>

                  {result.factors && (
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="text-sm text-gray-600 mb-3">Impact Factors</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Soil Moisture</p>
                          <p className="text-base font-semibold text-blue-600">
                            {result.factors.soil_moisture_impact}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Temperature</p>
                          <p className="text-base font-semibold text-orange-600">
                            {result.factors.temperature_impact}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Humidity</p>
                          <p className="text-base font-semibold text-green-600">
                            {result.factors.humidity_impact}%
                          </p>
                        </div>
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
