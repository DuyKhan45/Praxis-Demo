import { Heart, Star, MapPin, Building, Home, Hotel, Smile, Sparkles } from 'lucide-react';

// Dynamic icon resolver
const ListingIcon = ({ name, className }) => {
  switch (name) {
    case 'building':
      return <Building className={className} />;
    case 'home':
      return <Home className={className} />;
    case 'hotel':
      return <Hotel className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'smile':
    default:
      return <Smile className={className} />;
  }
};

export default function Listings({
  listings,
  title,
  savedListings,
  onToggleSave,
  setSelectedListing,
  hoveredListingId,
  setHoveredListingId
}) {
  return (
    <div className="listings-section-wrapper">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <span className="see-all-link">See all &rarr;</span>
      </div>

      {listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No listings found</p>
          <p style={{ fontSize: '14px' }}>Try adjusting your filters, location query, or chat request.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((item) => {
            const isSaved = savedListings.includes(item.id);
            const isHovered = hoveredListingId === item.id;
            
            return (
              <div
                key={item.id}
                className={`listing-card ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredListingId(item.id)}
                onMouseLeave={() => setHoveredListingId(null)}
                style={isHovered ? { borderColor: '#10b981', transform: 'translateY(-6px)' } : {}}
              >
                {/* Image Placeholder */}
                <div 
                  className={`card-image-container ${item.theme}`}
                  onClick={() => setSelectedListing(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <ListingIcon name={item.icon} className="card-icon" />
                  
                  {/* Rating Tag */}
                  {item.tag && (
                    <span className={`card-tag ${item.tag.toLowerCase().replace(' ', '-')}`}>
                      {item.tag}
                    </span>
                  )}

                  {/* Favorite Toggle Button */}
                  <button
                    type="button"
                    className={`btn-favorite ${isSaved ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent opening details
                      onToggleSave(item.id);
                    }}
                    title={isSaved ? "Remove from saved" : "Save stay"}
                  >
                    <Heart size={18} fill={isSaved ? "#ef4444" : "none"} />
                  </button>
                </div>

                {/* Card Content Body */}
                <div className="card-body">
                  <h3 
                    className="card-title"
                    onClick={() => setSelectedListing(item)}
                  >
                    {item.title}
                  </h3>
                  
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
            );
          })}
        </div>
      )}
    </div>
  );
}
