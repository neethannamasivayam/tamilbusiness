'use client';

import { useEffect, useState, useRef } from 'react';
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

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Photo {
  id: number;
  business_id: number;
  url: string;
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [upgradingPremium, setUpgradingPremium] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    fetch(`/api/businesses/${params.id}`)
      .then(res => {
        if (!res.ok) { setNotFound(true); setLoading(false); return null; }
        return res.json();
      })
      .then(data => {
        if (data) { setBusiness(data); setLoading(false); }
      });

    fetch(`/api/reviews?business_id=${params.id}`)
      .then(res => res.json())
      .then(data => setReviews(data));

    fetch(`/api/photos?business_id=${params.id}`)
      .then(res => res.json())
      .then(data => setPhotos(Array.isArray(data) ? data : []));
  }, [params.id]);

  const handleUpgradePremium = async () => {
    if (!business) return;
    setUpgradingPremium(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: business.id, business_name: business.name }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setUpgradingPremium(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.url) { alert('Upload failed. Please try again.'); setUploadingPhoto(false); return; }
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: params.id, url: uploadData.url }),
      });
      fetch(`/api/photos?business_id=${params.id}`)
        .then(res => res.json())
        .then(data => setPhotos(Array.isArray(data) ? data : []));
    } catch {
      alert('Upload failed. Please try again.');
    }
    setUploadingPhoto(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { alert('Please select a star rating!'); return; }
    setSubmitting(true);
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: params.id, reviewer_name: reviewerName, rating, comment }),
    });
    setSubmitted(true);
    setSubmitting(false);
    fetch(`/api/reviews?business_id=${params.id}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    setContactSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: business?.name,
          business_email: business?.email,
          sender_name: contactName,
          sender_email: contactEmail,
          sender_phone: contactPhone,
          message: contactMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setContactError(data.error || 'Failed to send message.');
      } else {
        setContactSubmitted(true);
      }
    } catch {
      setContactError('Something went wrong. Please try again.');
    }
    setContactSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

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
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const mapQuery = encodeURIComponent(`${business.address}, ${business.city}, ${business.country}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white py-4 px-6 flex items-center gap-4">
        <button onClick={() => router.push('/')} className="text-white hover:text-yellow-300">← Back</button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-yellow-400 text-red-700 font-bold w-8 h-8 flex items-center justify-center rounded text-lg">த</div>
          <span className="font-bold text-lg"><span className="text-yellow-300">Tamil</span>Business.com</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Business Header Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          {photos.length > 0 ? (
            <div className="h-48 overflow-hidden">
              <img src={photos[0].url} alt={business.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="bg-gray-100 h-48 flex items-center justify-center text-8xl">{emoji}</div>
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full">{business.category}</span>
              {business.is_premium == 1 && (
                <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">⭐ Premium</span>
              )}
              {averageRating && (
                <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                  ⭐ {averageRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1">📍 {business.city}, {business.country}</p>
            <div className="mt-4">
              {business.is_premium == 1 ? (
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-semibold inline-block">⭐ Premium Listing Active</span>
              ) : (
                <button onClick={handleUpgradePremium} disabled={upgradingPremium}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg disabled:opacity-50">
                  {upgradingPremium ? 'Redirecting...' : '⭐ Upgrade to Premium — $9.99/month'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Photos {photos.length > 0 && <span className="text-gray-400 font-normal text-base">({photos.length})</span>}
            </h2>
            <button onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold disabled:opacity-50">
              {uploadingPhoto ? '⏳ Uploading...' : '📷 Add Photo'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>
          {photos.length === 0 ? (
            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-500 font-medium">No photos yet</p>
              <p className="text-gray-400 text-sm mt-1">Click to upload the first photo</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-xl cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedPhoto(photo.url)}>
                  <img src={photo.url} alt="Business photo" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}>
            <div className="relative max-w-3xl w-full">
              <button className="absolute -top-10 right-0 text-white text-2xl font-bold" onClick={() => setSelectedPhoto(null)}>✕</button>
              <img src={selectedPhoto} alt="Full view" className="w-full rounded-xl max-h-[80vh] object-contain" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* About */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{business.description || 'No description provided yet.'}</p>
            {business.address && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">📍 Address</h3>
                <p className="text-gray-600">{business.address}</p>
                <p className="text-gray-600">{business.city}, {business.country}</p>
                {mapsKey && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <iframe width="100%" height="250" style={{ border: 0 }} loading="lazy" allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${mapQuery}`} />
                  </div>
                )}
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
                  <a href={`tel:${business.phone}`} className="text-red-600 font-semibold hover:underline">📞 {business.phone}</a>
                </div>
              )}
              {business.email && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <a href={`mailto:${business.email}`} className="text-red-600 font-semibold hover:underline break-all">✉️ {business.email}</a>
                </div>
              )}
              {business.website && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Website</p>
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-red-600 font-semibold hover:underline break-all">🌐 Visit Website</a>
                </div>
              )}
              {!business.phone && !business.email && !business.website && (
                <p className="text-gray-400 text-sm">No contact info provided.</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Send a Message</h2>
          <p className="text-gray-500 text-sm mb-4">Contact {business.name} directly through our directory.</p>

          {contactSubmitted ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
              ✅ Your message has been sent! The business will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3">
              {contactError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{contactError}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                  <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="john@email.com"
                    className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone</label>
                <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 416 555 0000"
                  className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea required value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}
                  rows={4} placeholder={`Hi, I'd like to learn more about ${business.name}...`}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300" />
              </div>
              <button type="submit" disabled={contactSubmitting}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50">
                {contactSubmitting ? 'Sending...' : '✉️ Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal text-base">({reviews.length})</span>}
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-sm mb-4">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4 mb-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">{review.reviewer_name}</span>
                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
          {submitted ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">✅ Thank you for your review!</div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="border-t pt-4">
              <h3 className="font-bold text-gray-800 mb-3">Write a Review</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Your name" required value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300" />
                <div>
                  <label className="text-sm text-gray-600 font-medium">Rating</label>
                  <div className="flex gap-3 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)}
                        style={{ fontSize: '2rem', cursor: 'pointer', background: 'none', border: 'none', opacity: star <= rating ? 1 : 0.3 }}>
                        ⭐
                      </button>
                    ))}
                  </div>
                  {rating > 0 && <p className="text-sm text-gray-500 mt-1">You selected {rating} star{rating !== 1 ? 's' : ''}</p>}
                </div>
                <textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)}
                  rows={3} className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300" />
                <button type="submit" disabled={submitting}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}