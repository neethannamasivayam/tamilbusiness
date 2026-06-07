export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-700 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">TamilBusiness.com</h1>
        <nav className="flex gap-4">
          <a href="/register-business" className="bg-white text-red-700 px-4 py-2 rounded font-semibold hover:bg-red-50">
            Add Your Business
          </a>
          <a href="/login" className="border border-white px-4 py-2 rounded hover:bg-red-600">
            Login
          </a>
        </nav>
      </header>

      {/* Hero Search Section */}
      <section className="bg-red-700 text-white py-16 px-6 text-center">
        <h2 className="text-4xl font-bold mb-2">Find Tamil Businesses Worldwide</h2>
        <p className="text-lg mb-8 text-red-100">Restaurants, Lawyers, Doctors, Shops and more</p>
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="What are you looking for? (e.g. Restaurant)"
            className="flex-1 px-4 py-3 rounded text-gray-800 text-lg"
          />
          <input
            type="text"
            placeholder="City or Country"
            className="w-48 px-4 py-3 rounded text-gray-800 text-lg"
          />
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded text-lg">
            Search
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Restaurants", icon: "🍛" },
            { name: "Lawyers", icon: "⚖️" },
            { name: "Doctors", icon: "🏥" },
            { name: "Grocery Stores", icon: "🛒" },
            { name: "Hair & Beauty", icon: "💇" },
            { name: "Accountants", icon: "📊" },
            { name: "Real Estate", icon: "🏠" },
            { name: "Travel Agents", icon: "✈️" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="border rounded-lg p-4 text-center hover:border-red-700 hover:shadow-md cursor-pointer transition"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-gray-700">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Featured Businesses</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Anjappar Restaurant", category: "Restaurant", city: "Toronto, Canada", rating: 4.5 },
            { name: "Tamil Legal Services", category: "Lawyer", city: "London, UK", rating: 4.8 },
            { name: "Murugan Grocery", category: "Grocery", city: "Chennai, India", rating: 4.2 },
          ].map((biz) => (
            <div key={biz.name} className="border rounded-lg p-5 hover:shadow-lg transition">
              <div className="bg-gray-200 h-32 rounded mb-3 flex items-center justify-center text-gray-400">
                No Photo
              </div>
              <h4 className="font-bold text-lg text-gray-800">{biz.name}</h4>
              <p className="text-red-600 text-sm">{biz.category}</p>
              <p className="text-gray-500 text-sm">{biz.city}</p>
              <p className="text-yellow-500 mt-1">{"★".repeat(Math.floor(biz.rating))} {biz.rating}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 px-6 text-center mt-12">
        <p className="text-lg font-semibold text-white mb-2">TamilBusiness.com</p>
        <p className="text-sm">Connecting Tamil businesses worldwide</p>
      </footer>
    </main>
  );
}