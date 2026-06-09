'use client';
import { useState, useEffect } from 'react';

type Business = {
  id: number;
  name: string;
  category: string;
  city: string;
  country: string;
  is_premium: boolean;
};

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/businesses')
      .then(res => res.json())
      .then(data => {
        setBusinesses(data);
        setFilteredBusinesses(data);
      });

    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUser(data); });
  }, []);

  const handleSearch = () => {
    const results = businesses.filter(biz => {
      const matchesSearch = searchQuery === '' ||
        biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = locationQuery === '' ||
        biz.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
        biz.country.toLowerCase().includes(locationQuery.toLowerCase());
      return matchesSearch && matchesLocation;
    });
    setFilteredBusinesses(results);
  };

  const handleCategoryClick = (categoryName: string) => {
    const results = businesses.filter(biz =>
      biz.category.toLowerCase().includes(categoryName.toLowerCase())
    );
    setFilteredBusinesses(results);
    setSearchQuery(categoryName);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setLocationQuery('');
    setFilteredBusinesses(businesses);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-700 text-white py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 text-red-800 font-black text-xl w-9 h-9 rounded-lg flex items-center justify-center shadow">
              த
            </div>
            <div>
              <span className="text-xl font-black tracking-tight">Tamil</span>
              <span className="text-xl font-light tracking-tight">Business</span>
              <span className="text-yellow-400 font-bold">.com</span>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a href="/submit" className="bg-white text-red-700 px-3 py-1.5 rounded font-semibold hover:bg-red-50 text-sm">
              + Add Business
            </a>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-yellow-300 font-semibold text-sm hidden sm:inline">👋 {user.name}</span>
                <button onClick={handleLogout} className="border border-white px-3 py-1.5 rounded hover:bg-red-600 text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <a href="/login" className="border border-white px-3 py-1.5 rounded hover:bg-red-600 text-sm">
                Login
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="bg-red-700 text-white py-10 px-4 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold mb-2">Find Tamil Businesses Worldwide</h2>
        <p className="text-base sm:text-lg mb-6 text-red-100">Restaurants, Lawyers, Doctors, Shops and more</p>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="flex-1 px-4 py-3 rounded text-gray-800 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <input
            type="text"
            placeholder="City or Country"
            className="sm:w-40 px-4 py-3 rounded text-gray-800 text-base"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded text-base">
            Search
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Browse by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              onClick={() => handleCategoryClick(cat.name)}
              className="border rounded-lg p-3 text-center hover:border-red-700 hover:shadow-md cursor-pointer transition">
              <div className="text-3xl mb-1">{cat.icon}</div>
              <div className="font-semibold text-gray-700 text-sm">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Businesses */}
      <section className="py-6 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            {searchQuery || locationQuery
              ? `${filteredBusinesses.length} result(s) found`
              : filteredBusinesses.length > 0 ? 'Listed Businesses' : 'No businesses yet'}
          </h3>
          {(searchQuery || locationQuery) && (
            <button onClick={handleClearSearch} className="text-red-600 hover:underline text-sm font-medium">
              ✕ Clear
            </button>
          )}
        </div>

        {filteredBusinesses.length === 0 && (searchQuery || locationQuery) ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <h4 className="text-lg font-bold text-gray-700 mb-2">No businesses found</h4>
            <p className="text-gray-500 mb-4">Try a different search term or category</p>
            <button onClick={handleClearSearch} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
              Show All Businesses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusinesses.map((biz) => (
              <div key={biz.id} onClick={() => window.location.href = `/business/${biz.id}`}
                className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                {biz.is_premium == 1 && (
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded mb-2 inline-block">⭐ FEATURED</span>
                )}
                <div className="bg-gray-100 h-28 rounded mb-3 flex items-center justify-center text-5xl">
                  {biz.category === 'Restaurants' ? '🍛' :
                   biz.category === 'Lawyers' ? '⚖️' :
                   biz.category === 'Doctors' ? '🏥' :
                   biz.category === 'Grocery Stores' ? '🛒' :
                   biz.category === 'Hair & Beauty' ? '💇' :
                   biz.category === 'Accountants' ? '📊' :
                   biz.category === 'Real Estate' ? '🏠' :
                   biz.category === 'Travel Agents' ? '✈️' : '🏢'}
                </div>
                <h4 className="font-bold text-base text-gray-800">{biz.name}</h4>
                <p className="text-red-600 text-sm">{biz.category}</p>
                <p className="text-gray-500 text-sm">{biz.city}, {biz.country}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 px-4 text-center mt-12">
        <p className="text-lg font-semibold text-white mb-2">TamilBusiness.com</p>
        <p className="text-sm">Connecting Tamil businesses worldwide</p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <a href="/submit" className="text-yellow-400 hover:underline">Add Your Business</a>
          <a href="/login" className="text-yellow-400 hover:underline">Login</a>
          <a href="/signup" className="text-yellow-400 hover:underline">Sign Up</a>
        </div>
      </footer>
    </main>
  );
}