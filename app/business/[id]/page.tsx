'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Business {
  id: number;
  name: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  country: string;
  is_premium: number;
  created_at: string;
}

const categoryEmoji: { [key: string]: string } = {
  'Restaurants': '🍽️',
  'Lawyers': '⚖️',
  'Doctors': '🏥',
  'Grocery Stores': '🛒',
  'Hair & Beauty': '💇',
  'Accountants': '📊',
  'Real Estate': '🏠',
  'Travel Agents': '✈️',
  'Other': '🏢',
};

export default function BusinessDetail() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/businesses/${params.id}`)
      .then(res => {
        if (!res.ok) { setNotFound(true); setLoading(false); return null; }
        return res.json();
      })
      .then(data => {
        if (data) { setBusiness(data); setLoading(false); }
      });
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-500">Loading...</div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800">Business not found</h1>
        <button onClick={() => router.push('/')} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg">Go Home</button>
      </div>
    </div>
  );

  if (!business) return null;

  const emoji = categoryEmoji[business.category] || '🏢';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white py-4 px-6 flex items-center gap-4">
        <button onClick={() => router.push('/')} className="text-white hover:text-yellow-300 flex items-center gap-1">
          ← Back
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-yellow-400 text-red-700 font-bold w-8 h-8 flex items-center justify-center rounded text-lg">த</div>
          <span className="font-bold text-lg"><span className="text-yellow-300">Tamil</span>Business.com</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Business Header Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="bg-gray-100 h-48 flex items-center justify-center text-8xl">
            {emoji}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
                    {business.category}
                  </span>
                  {business.is_premium == 1 && (
                    <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
                      ⭐ Premium
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-1">📍 {business.city}, {business.country}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">
              {business.description || 'No description provided yet.'}
            </p>

            {business.address && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">📍 Address</h3>
                <p className="text-gray-600">{business.address}</p>
                <p className="text-gray-600">{business.city}, {business.country}</p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact</h2>
            <div className="space-y-4">
              {business.phone && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <a href={`tel:${business.phone}`} className="text-red-600 font-semibold hover:underline">
                    📞 {business.phone}
                  </a>
                </div>
              )}
              {business.email && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <a href={`mailto:${business.email}`} className="text-red-600 font-semibold hover:underline break-all">
                    ✉️ {business.email}
                  </a>
                </div>
              )}
              {business.website && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Website</p>
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-red-600 font-semibold hover:underline break-all">
                    🌐 Visit Website
                  </a>
                </div>
              )}
              {!business.phone && !business.email && !business.website && (
                <p className="text-gray-400 text-sm">No contact info provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}