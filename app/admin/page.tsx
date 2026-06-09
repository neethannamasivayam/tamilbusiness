'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Business = {
  id: number;
  name: string;
  category: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  status: string;
  is_premium: number;
  created_at: string;
};

export default function AdminPanel() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setAuthError('');
      loadBusinesses('pending');
    } else {
      setAuthError('Incorrect password.');
    }
  };

  const loadBusinesses = async (status: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/businesses?status=${status}`);
    const data = await res.json();
    setBusinesses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleFilterChange = (status: string) => {
    setFilter(status);
    loadBusinesses(status);
  };

  const handleApprove = async (id: number) => {
    await fetch(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    loadBusinesses(filter);
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject and delete this business?')) return;
    await fetch(`/api/admin/businesses/${id}`, {
      method: 'DELETE',
    });
    loadBusinesses(filter);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="bg-yellow-400 text-red-700 font-bold w-12 h-12 flex items-center justify-center rounded-xl text-2xl mx-auto mb-3">த</div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-500 text-sm">TamilBusiness.com</p>
          </div>
          {authError && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{authError}</div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-red-700 font-bold w-8 h-8 flex items-center justify-center rounded text-lg">த</div>
          <span className="font-bold text-lg"><span className="text-yellow-300">Tamil</span>Business.com — Admin</span>
        </div>
        <button onClick={() => router.push('/')} className="text-white hover:text-yellow-300 text-sm">
          ← Back to Site
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Business Submissions</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize text-sm ${
                filter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">No {filter} businesses found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {businesses.map((biz) => (
              <div key={biz.id} className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="text-lg font-bold text-gray-800">{biz.name}</h2>
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{biz.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        biz.status === 'approved' ? 'bg-green-100 text-green-700' :
                        biz.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {biz.status}
                      </span>
                      {biz.is_premium == 1 && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">⭐ Premium</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">📍 {biz.city}, {biz.country}</p>
                    {biz.email && <p className="text-gray-500 text-sm">✉️ {biz.email}</p>}
                    {biz.phone && <p className="text-gray-500 text-sm">📞 {biz.phone}</p>}
                    <p className="text-gray-400 text-xs mt-1">Submitted: {new Date(biz.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`/business/${biz.id}`}
                      target="_blank"
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 text-center"
                    >
                      View
                    </a>
                    {biz.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(biz.id)}
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleReject(biz.id)}
                      className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}