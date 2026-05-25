import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Hook/Sub-component to handle map panning and zooming programmatically
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true, duration: 0.8 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function Map({ 
  listings, 
  hoveredListingId, 
  setHoveredListingId, 
  setSelectedListing,
  selectedCity 
}) {
  // Determine map center and zoom based on current listings and selected city
  let center = [21.0285, 105.8522]; // Default: Hanoi
  let zoom = 12;

  if (selectedCity === 'Ho Chi Minh City') {
    center = [10.7769, 106.7009];
    zoom = 12;
  } else if (selectedCity === 'Da Nang') {
    center = [16.0544, 108.2022];
    zoom = 12;
  } else if (listings.length > 0) {
    // If a mix or search results, average the positions
    const avgLat = listings.reduce((sum, item) => sum + item.coordinates.lat, 0) / listings.length;
    const avgLng = listings.reduce((sum, item) => sum + item.coordinates.lng, 0) / listings.length;
    center = [avgLat, avgLng];
    zoom = listings.length === 1 ? 14 : 12;
  } else if (selectedCity === 'all') {
    center = [16.0471, 108.2067]; // Center of Vietnam
    zoom = 6;
  }

  // Helper to create price pill icons dynamically
  const createPriceIcon = (price, id) => {
    const isHovered = hoveredListingId === id;
    return L.divIcon({
      html: `<div class="custom-price-marker ${isHovered ? 'active' : ''}">$${price}</div>`,
      className: 'leaflet-price-marker-container',
      iconSize: [50, 24],
      iconAnchor: [25, 12]
    });
  };

  return (
    <div className="map-container-wrapper">
      {/* If there are no coordinates, display fallback */}
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Modern clean map theme
        />
        
        {/* Dynamic viewport adjustments */}
        <ChangeView center={center} zoom={zoom} />

        {/* Listings Markers */}
        {listings.map((item) => (
          <Marker
            key={item.id}
            position={[item.coordinates.lat, item.coordinates.lng]}
            icon={createPriceIcon(item.price, item.id)}
            eventHandlers={{
              mouseover: () => setHoveredListingId(item.id),
              mouseout: () => setHoveredListingId(null),
              click: () => setSelectedListing(item)
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
