import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Listings from './components/Listings';
import Map from './components/Map';
import ChatBot from './components/ChatBot';
import ListingDetailModal from './components/ListingDetailModal';
import { listings } from './data/listings';
import { Sparkles, Calendar, Heart, MapPin, X, Star, Home } from 'lucide-react';

export default function App() {
  const getStoredJson = (key, fallbackValue) => {
    try {
      if (typeof window === 'undefined') return fallbackValue;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallbackValue;
    } catch {
      return fallbackValue;
    }
  };

  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState('explore');

  // Search filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // AI parsed filter states
  const [aiFilters, setAiFilters] = useState(null);

  // Favorites & Bookings (loaded from localStorage)
  const [savedListings, setSavedListings] = useState(() => getStoredJson('saved_listings', []));
  const [bookedListings, setBookedListings] = useState(() => getStoredJson('booked_listings', []));

  // Modals / Panels toggles
  const [selectedListing, setSelectedListing] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(() => getStoredJson('user_session', null));

  // Hover sync state
  const [hoveredListingId, setHoveredListingId] = useState(null);

  // Login credentials mock state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sync favorites to localStorage
  const handleToggleSave = (id) => {
    let updated;
    if (savedListings.includes(id)) {
      updated = savedListings.filter(item => item !== id);
    } else {
      updated = [...savedListings, id];
    }
    setSavedListings(updated);
    localStorage.setItem('saved_listings', JSON.stringify(updated));
  };

  // Sync bookings to localStorage
  const handleBookListing = (id) => {
    if (!bookedListings.includes(id)) {
      const updated = [...bookedListings, id];
      setBookedListings(updated);
      localStorage.setItem('booked_listings', JSON.stringify(updated));
    }
  };

  const handleCancelBooking = (id) => {
    const updated = bookedListings.filter(item => item !== id);
    setBookedListings(updated);
    localStorage.setItem('booked_listings', JSON.stringify(updated));
  };

  // Mock authentication logic
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail.trim()) {
      const session = { email: loginEmail };
      setUser(session);
      localStorage.setItem('user_session', JSON.stringify(session));
      setIsLoginModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  // Category change clears AI filters to ensure intuitive workflow
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setAiFilters(null); // Clear AI filters when switching categories
  };

  // Search submit clears AI filters
  const handleSearchSubmit = () => {
    setAiFilters(null);
  };

  // AI chat triggers filters
  const handleApplyAiFilters = (filters) => {
    setAiFilters(filters);
    // Sync category pill if AI specifies a type
    if (filters.type) {
      setSelectedCategory(filters.type);
    } else if (filters.minRating === 4.8) {
      setSelectedCategory('top-rated');
    } else if (filters.maxPrice === 45) {
      setSelectedCategory('budget');
    } else {
      setSelectedCategory('all');
    }
  };

  // Main listing filtering algorithm
  const getFilteredListings = () => {
    let result = [...listings];

    // 1. Prioritize AI search if active
    if (aiFilters) {
      if (aiFilters.city) {
        result = result.filter(item => item.location.city.toLowerCase() === aiFilters.city.toLowerCase());
      }
      if (aiFilters.type) {
        result = result.filter(item => item.type.toLowerCase() === aiFilters.type.toLowerCase());
      }
      if (aiFilters.maxPrice) {
        result = result.filter(item => item.price <= aiFilters.maxPrice);
      }
      if (aiFilters.minRating) {
        result = result.filter(item => item.rating >= aiFilters.minRating);
      }
      if (aiFilters.minBeds) {
        result = result.filter(item => item.beds >= aiFilters.minBeds);
      }
      if (aiFilters.amenities && aiFilters.amenities.length > 0) {
        result = result.filter(item =>
          aiFilters.amenities.every(amenity => item.amenities.includes(amenity))
        );
      }
      return result;
    }

    // 2. Normal User filters
    // Category pill filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'top-rated') {
        result = result.filter(item => item.rating >= 4.8);
      } else if (selectedCategory === 'budget') {
        result = result.filter(item => item.price <= 45);
      } else {
        result = result.filter(item => item.type === selectedCategory);
      }
    }

    // Keyword search filter (city, district, address, title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.location.city.toLowerCase().includes(q) ||
        item.location.district.toLowerCase().includes(q) ||
        item.location.address.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
      );
    }

    // Beds filter synced with guests
    if (guests > 1) {
      result = result.filter(item => item.beds >= guests - 1);
    }

    return result;
  };

  const filteredListings = getFilteredListings();

  // Selected city logic for map centering
  const getSelectedCity = () => {
    if (aiFilters && aiFilters.city) return aiFilters.city;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (q.includes('hanoi')) return 'Hanoi';
      if (q.includes('ho chi minh') || q.includes('saigon') || q.includes('hcmc')) return 'Ho Chi Minh City';
      if (q.includes('da nang') || q.includes('danang')) return 'Da Nang';
    }
    return 'all';
  };

  // Listings titles
  const getListingsTitle = () => {
    if (aiFilters) {
      return "AI Recommends Stays";
    }
    const city = getSelectedCity();
    if (city !== 'all') {
      return `Featured in ${city}`;
    }
    return "Featured Stays";
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedListings.length}
        tripsCount={bookedListings.length}
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* RENDER EXPLORE VIEW */}
      {activeTab === 'explore' && (
        <>
          <Hero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            onSearch={handleSearchSubmit}
          />

          <Stats />

          {/* Main Grid + Map Layout */}
          <main className="main-content">
            <div className="container">
              {aiFilters && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e6f7f2', border: '1px solid #10b981', color: '#065f46', padding: '12px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '14.5px' }}>
                  <Sparkles size={18} style={{ flexShrink: 0 }} />
                  <span>
                    AI filters active: <strong>{aiFilters.city || 'Any city'}</strong>
                    {aiFilters.type ? ` · ${aiFilters.type}` : ''}
                    {aiFilters.maxPrice ? ` · Under $${aiFilters.maxPrice}` : ''}
                    {aiFilters.amenities?.length > 0 ? ` · With ${aiFilters.amenities.join(', ')}` : ''}
                  </span>
                  <button
                    onClick={() => setAiFilters(null)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#065f46', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
                  >
                    Clear AI Filters
                  </button>
                </div>
              )}

              <div className="listings-layout-split">
                <Listings
                  listings={filteredListings}
                  title={getListingsTitle()}
                  savedListings={savedListings}
                  onToggleSave={handleToggleSave}
                  setSelectedListing={setSelectedListing}
                  hoveredListingId={hoveredListingId}
                  setHoveredListingId={setHoveredListingId}
                />

                <Map
                  listings={filteredListings}
                  hoveredListingId={hoveredListingId}
                  setHoveredListingId={setHoveredListingId}
                  setSelectedListing={setSelectedListing}
                  selectedCity={getSelectedCity()}
                />
              </div>
            </div>
          </main>
        </>
      )}

      {/* RENDER TRIPS VIEW */}
      {activeTab === 'trips' && (
        <main className="main-content" style={{ flex: 1 }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: '24px' }}>My Trips & Bookings</h2>
            {bookedListings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Calendar size={48} style={{ margin: '0 auto 16px auto', color: '#cbd5e1' }} />
                <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No trips booked yet</p>
                <p style={{ fontSize: '14px', marginBottom: '20px' }}>Explore listings and book your stays to see them here.</p>
                <button className="btn-signup" onClick={() => setActiveTab('explore')}>Start Exploring</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {listings.filter(item => bookedListings.includes(item.id)).map(item => (
                  <div key={item.id} style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', gap: '20px', flexWrap: 'wrap' }}>
                    <div className={`details-modal-image ${item.theme}`} style={{ width: '120px', height: '120px', borderRadius: '12px', flexShrink: 0 }}>
                      <Home size={32} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '220px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{item.title}</h3>
                      <div className="card-location" style={{ marginTop: '4px', marginBottom: '8px' }}>
                        <MapPin size={14} />
                        <span>{item.location.address}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#64748b' }}>
                        <span>Beds: {item.beds}</span>
                        <span>Baths: {item.baths}</span>
                        <span>Rating: ★{item.rating}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', minWidth: '150px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800 }}>${item.price} <span style={{ fontSize: '13px', fontWeight: 400, color: '#64748b' }}>/ night</span></div>
                      <button
                        onClick={() => handleCancelBooking(item.id)}
                        style={{ color: '#ef4444', border: '1px solid #fee2e2', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', background: '#fef2f2', fontWeight: 600, fontSize: '13px' }}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* RENDER SAVED VIEW */}
      {activeTab === 'saved' && (
        <main className="main-content" style={{ flex: 1 }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: '24px' }}>Saved Listings</h2>
            {savedListings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Heart size={48} style={{ margin: '0 auto 16px auto', color: '#cbd5e1' }} />
                <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No saved listings</p>
                <p style={{ fontSize: '14px', marginBottom: '20px' }}>Tap the heart on listing cards to save them.</p>
                <button className="btn-signup" onClick={() => setActiveTab('explore')}>Start Exploring</button>
              </div>
            ) : (
              <div className="listings-grid">
                {listings.filter(item => savedListings.includes(item.id)).map(item => (
                  <div key={item.id} className="listing-card">
                    <div className={`card-image-container ${item.theme}`} style={{ height: '180px' }} onClick={() => setSelectedListing(item)}>
                      <Home className="card-icon" />
                      <button
                        type="button"
                        className="btn-favorite active"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(item.id);
                        }}
                      >
                        <Heart size={18} fill="#ef4444" />
                      </button>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title" onClick={() => setSelectedListing(item)}>{item.title}</h3>
                      <div className="card-location">
                        <MapPin size={14} />
                        <span>{item.location.district}, {item.location.city}</span>
                      </div>
                      <div className="card-info">
                        <div className="card-price">
                          <span className="card-price-value">${item.price}</span> / night
                        </div>
                        <div className="card-rating">
                          <Star size={14} fill="#f59e0b" />
                          <span>{item.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Bottom Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-left">
            &copy; 2026 NestFind &middot; Terms &middot; Privacy &middot; Sitemap
          </div>
          <div className="footer-right">
            {/* Simple mock social links */}
            <span className="social-icon">Instagram</span>
            <span className="social-icon">Twitter</span>
            <span className="social-icon">Facebook</span>
          </div>
        </div>
      </footer>

      {/* Floating AI ChatBot Drawer */}
      <ChatBot
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onApplyFilters={handleApplyAiFilters}
        listings={listings}
        setSelectedListing={setSelectedListing}
      />


      {/* Listing Details Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onBook={handleBookListing}
          isBooked={bookedListings.includes(selectedListing.id)}
        />
      )}

      {/* Mock Authentication Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Log in / Sign up</h3>
              <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="modal-body">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
