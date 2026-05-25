import { Search, Calendar, Users, Home, Building, Hotel, Star, DollarSign, Layers } from 'lucide-react';

export default function Hero({
  searchQuery,
  setSearchQuery,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  selectedCategory,
  setSelectedCategory,
  onSearch
}) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const categories = [
    { id: 'all', label: 'All types', icon: Layers },
    { id: 'Studio', label: 'Studio', icon: Hotel },
    { id: 'Apartment', label: 'Apartment', icon: Building },
    { id: 'House', label: 'House', icon: Home },
    { id: 'top-rated', label: 'Top rated', icon: Star },
    { id: 'budget', label: 'Budget-friendly', icon: DollarSign }
  ];

  return (
    <section className="hero-section">
      <div className="container">
        <h1 className="hero-title">Find your perfect stay</h1>
        <p className="hero-subtitle">
          Thousands of apartments, studios, and homes across Vietnam and beyond
        </p>

        {/* Search Bar Panel */}
        <form onSubmit={handleSearchSubmit} className="search-container">
          {/* Location Search */}
          <div className="search-field location">
            <label htmlFor="search-loc">Where</label>
            <div className="search-field-input-wrapper">
              <Search size={16} />
              <input
                id="search-loc"
                type="text"
                placeholder="Search by city, district, or landmark"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="search-divider"></div>

          {/* Check-In Date */}
          <div className="search-field">
            <label htmlFor="search-in">Check-in</label>
            <div className="search-field-input-wrapper">
              <Calendar size={16} />
              <input
                id="search-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </div>

          <div className="search-divider"></div>

          {/* Check-Out Date */}
          <div className="search-field">
            <label htmlFor="search-out">Check-out</label>
            <div className="search-field-input-wrapper">
              <Calendar size={16} />
              <input
                id="search-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div className="search-divider"></div>

          {/* Guests */}
          <div className="search-field">
            <label htmlFor="search-guests">Guests</label>
            <div className="search-field-input-wrapper">
              <Users size={16} />
              <select
                id="search-guests"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
              >
                <option value={1}>1 guest</option>
                <option value={2}>2 guests</option>
                <option value={3}>3 guests</option>
                <option value={4}>4+ guests</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-search">
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="categories-container">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
