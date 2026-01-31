import React, { useState } from 'react';
import { modelAPI } from '../services/api';

export default function CropYield() {
  const [form, setForm] = useState({
    soil_moisture: '',
    soil_ph: '',
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
        soil_moisture: parseFloat(form.soil_moisture) || 0,
        soil_ph: parseFloat(form.soil_ph) || 0,
      };
      const res = await modelAPI.predictCropYield(payload);
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
          <h1 className="text-2xl font-bold mb-2">Crop Yield Predictor</h1>
          <p className="text-gray-600 mb-4">
            Enter soil parameters to predict expected crop yield per hectare.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Soil Moisture (%)</span>
                <input
                  name="soil_moisture"
                  type="number"
                  step="0.1"
                  value={form.soil_moisture}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 45.5"
                  required
                />
                <span className="text-xs text-gray-500 mt-1">
                  Optimal range: 40-60%
                </span>
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Soil pH</span>
                <input
                  name="soil_ph"
                  type="number"
                  step="0.1"
                  value={form.soil_ph}
                  onChange={handleChange}
                  className="mt-1 input"
                  placeholder="e.g. 6.5"
                  required
                />
                <span className="text-xs text-gray-500 mt-1">
                  Optimal range: 6.0-7.5
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Predicting…' : 'Predict Yield'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({ soil_moisture: '', soil_ph: '' });
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
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-green-900">
                  Yield Prediction
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <p className="text-sm text-gray-600">Expected Yield</p>
                    <p className="text-3xl font-bold text-green-700">
                      {result.predicted_yield} {result.unit}
                    </p>
                  </div>
                  
                  {result.factors && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-600">Moisture Impact</p>
                        <p className="text-lg font-semibold text-blue-700">
                          {result.factors.moisture_impact}%
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-600">pH Impact</p>
                        <p className="text-lg font-semibold text-purple-700">
                          {result.factors.ph_impact}%
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
