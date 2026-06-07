export default function Signup() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">TamilBusiness.com</a>
      </header>

      {/* Signup Form */}
      <div className="max-w-md mx-auto py-16 px-6">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-6">Join TamilBusiness.com today — it's free.</p>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                <input type="text" placeholder="Ravi" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                <input type="text" placeholder="Kumar" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" placeholder="you@email.com" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input type="password" placeholder="••••••••" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <button type="submit" className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account? <a href="/login" className="text-red-700 font-semibold hover:underline">Login</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}