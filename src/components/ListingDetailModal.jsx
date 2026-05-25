import { useState } from 'react';
import { X, Star, MapPin, BedDouble, Wifi, Laptop, Coffee, Shield, CheckCircle, Home } from 'lucide-react';

// Amenity Icon Map
const AmenityIcon = ({ name }) => {
  const normName = name.toLowerCase();
  if (normName.includes('wi-fi') || normName.includes('wifi')) return <Wifi size={16} />;
  if (normName.includes('workspace') || normName.includes('desk')) return <Laptop size={16} />;
  if (normName.includes('security')) return <Shield size={16} />;
  if (normName.includes('kitchen') || normName.includes('coffee')) return <Coffee size={16} />;
  return <CheckCircle size={16} />;
};

export default function ListingDetailModal({
  listing,
  onClose,
  onBook,
  isBooked
}) {
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!listing) return null;

  const handleBookClick = () => {
    onBook(listing.id);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Banner */}
        <div className={`details-modal-image ${listing.theme}`}>
          <button
            className="btn-favorite"
            style={{ top: '20px', right: '20px', backgroundColor: 'white', color: 'black' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Large listing icon */}
            <div style={{ transform: 'scale(1.8)' }}>
              {listing.type === 'Studio' && <Coffee size={40} />}
              {listing.type === 'Apartment' && <BedDouble size={40} />}
              {listing.type === 'House' && <Home size={40} />}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="details-modal-content">
          <div className="details-meta">
            <div>
              <h2 className="details-title">{listing.title}</h2>
              <div className="details-location">
                <MapPin size={16} style={{ color: '#10b981' }} />
                <span>{listing.location.address}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span className="details-rooms">
                {listing.beds} Bed{listing.beds > 1 ? 's' : ''} &bull; {listing.baths} Bath{listing.baths > 1 ? 's' : ''}
              </span>
              <div className="card-rating" style={{ fontSize: '15px' }}>
                <Star size={16} fill="#f59e0b" />
                <span>{listing.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="details-section-title">About this stay</div>
          <p className="details-description">{listing.description}</p>

          <div className="details-section-title">Amenities offered</div>
          <div className="amenities-list">
            {listing.amenities.map((amenity, i) => (
              <div key={i} className="amenity-item">
                <AmenityIcon name={amenity} />
                <span>{amenity}</span>
              </div>
            ))}
          </div>

          {/* Booking Confirmation / Controls */}
          <div className="details-footer">
            <div className="details-price">
              <span>${listing.price}</span> / night
            </div>

            {bookingSuccess ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600 }}>
                <CheckCircle size={20} />
                <span>Booking confirmed!</span>
              </div>
            ) : isBooked ? (
              <button
                className="btn-book"
                disabled
                style={{ backgroundColor: '#64748b', cursor: 'not-allowed' }}
              >
                Already Booked
              </button>
            ) : (
              <button className="btn-book" onClick={handleBookClick}>
                Book this stay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
