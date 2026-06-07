export default function RegisterBusiness() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">TamilBusiness.com</a>
        <a href="/login" className="border border-white px-4 py-2 rounded hover:bg-red-600">
          Login
        </a>
      </header>

      {/* Form */}
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Your Business</h1>
        <p className="text-gray-500 mb-8">Fill in the details below. Your listing will be reviewed before going live.</p>

        <form className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
            <input type="text" placeholder="e.g. Anjappar Restaurant" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
            <select className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500">
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

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
            <textarea rows={4} placeholder="Describe your business..." className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input type="tel" placeholder="+1 416 000 0000" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input type="email" placeholder="business@email.com" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Website (optional)</label>
            <input type="url" placeholder="https://yourwebsite.com" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input type="text" placeholder="Street address" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="City" className="border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input type="text" placeholder="Country" className="border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition">
            Submit for Approval
          </button>

          <p className="text-center text-sm text-gray-400">Your listing will be reviewed within 24-48 hours.</p>
        </form>
      </div>
    </main>
  );
}