'use client';
import { useState, useEffect } from 'react';

type Business = {
  id: number;
  name: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  status: string;
};

export default function AdminPanel() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchBusinesses();
  }, [filter]);

  async function fetchBusinesses() {
    setLoading(true);
    const res = await fetch(`/api/admin/businesses?status=${filter}`);
    const data = await res.json();
    setBusinesses(data);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/businesses`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchBusinesses();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-red-700 text-white py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">TamilBusiness.com</a>
        <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">ADMIN PANEL</span>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Business Listings</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded font-semibold capitalize ${filter === s ? 'bg-red-700 text-white' : 'bg-white text-gray-700 border'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : businesses.length === 0 ? (
          <p className="text-gray-500">No {filter} businesses found.</p>
        ) : (
          <div className="space-y-4">
            {businesses.map((biz) => (
              <div key={biz.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{biz.name}</h2>
                    <p className="text-red-600 font-semibold text-sm">{biz.category}</p>
                    <p className="text-gray-500 text-sm">{biz.city}, {biz.country}</p>
                    <p className="text-gray-600 mt-2">{biz.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      {biz.phone && <span>📞 {biz.phone}</span>}
                      {biz.email && <span>✉️ {biz.email}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {biz.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(biz.id, 'approved')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
                      >
                        Approve
                      </button>
                    )}
                    {biz.status !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(biz.id, 'rejected')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}