export default function Login() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white py-4 px-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">TamilBusiness.com</a>
      </header>

      {/* Login Form */}
      <div className="max-w-md mx-auto py-16 px-6">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Login</h1>
          <p className="text-gray-500 mb-6">Welcome back! Sign in to your account.</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" placeholder="you@email.com" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full border rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <button type="submit" className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition">
              Login
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Don't have an account? <a href="/signup" className="text-red-700 font-semibold hover:underline">Sign up</a>
            </p>
            <p className="text-sm text-gray-500">
              Are you a business? <a href="/register-business" className="text-red-700 font-semibold hover:underline">Add your business</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}