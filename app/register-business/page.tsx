'use client';
import { useState } from 'react';

export default function RegisterBusiness() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      website: (form.elements.namedItem('website') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLInputElement).value,
      city: (form.elements.namedItem('city') as HTMLInputElement).value,
      country: (form.elements.namedItem('country') as HTMLInputElement).value,
    };

    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-red-700 text-white py-4 px-6">
          <a href="/" className="text-2xl font-bold">TamilBusiness.com</a>
        </header>
        <div className="max-w-md mx-auto py-16 px-6 text-center">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Submitted Successfully!</h1>
            <p className="text-gray-500 mb-6">Your business has been submitted for review. We will approve it within 24-48 hours.</p>
            <a href="/" className="bg-red-700 text-white px-6 py-3 rounded font-bold hover:bg-red-800">
              Back to Home
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-red-700 text-white py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">TamilBusiness.com</a>
        <a href="/login" className="border border-white px-4 py-2 rounded hover:bg-red-600">Login</a>
      </header>

      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Your Business</h1>
        <p className="text-gray-500 mb-8">Fill in the details below. Your listing will be reviewed before going live.</p>

        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
            <input name="name" required type="text" placeholder="e.g. Anjappar Restaurant" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
            <select name="category" required className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Select a category</option>
              <option>Restaurant</option>
              <option>Lawyer</option>
              <option>Doctor</option>
              <option>Grocery Store</option>
              <option>Hair & Beauty</option>
              <option>Accountant</option>
              <option>Real Estate</option>
              <option>Travel Agent</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
            <textarea name="description" required rows={4} placeholder="Describe your business..." className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input name="phone" type="tel" placeholder="+1 416 000 0000" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input name="email" type="email" placeholder="business@email.com" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Website (optional)</label>
            <input name="website" type="url" placeholder="https://yourwebsite.com" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input name="address" type="text" placeholder="Street address" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <input name="city" type="text" placeholder="City" className="border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input name="country" type="text" placeholder="Country" className="border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
          <p className="text-center text-sm text-gray-400">Your listing will be reviewed within 24-48 hours.</p>
        </form>
      </div>
    </main>
  );
}