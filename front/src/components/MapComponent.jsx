import { useRef, useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import './MapComponent.css';

const libraries = ["places"];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};
const defaultCenter = {
  lat: 30.0444, // Default to Cairo, Egypt
  lng: 31.2357,
};

function MapComponent({ onLocationSelect }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [marker, setMarker] = useState(null);
  const [currentCenter, setCurrentCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef();

  // Try to get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setCurrentCenter(location);
          setMarker(location);
          if (onLocationSelect) {
            onLocationSelect(location);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, [onLocationSelect]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback((event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarker(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  }, [onLocationSelect]);

  if (loadError) {
    return (
      <div className="map-error">
        <p>Error loading Google Maps. Please check your internet connection and try again.</p>
        <p>Technical details: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="map-loading">Loading maps...</div>;
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={currentCenter}
        onClick={onMapClick}
        onLoad={onMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      
      <div className="map-controls">
        <button 
          className="locate-me-button"
          onClick={() => {
            if (userLocation) {
              setCurrentCenter(userLocation);
              setMarker(userLocation);
              if (onLocationSelect) {
                onLocationSelect(userLocation);
              }
              if (mapRef.current) {
                mapRef.current.panTo(userLocation);
              }
            } else if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };
                  setUserLocation(location);
                  setCurrentCenter(location);
                  setMarker(location);
                  if (onLocationSelect) {
                    onLocationSelect(location);
                  }
                  if (mapRef.current) {
                    mapRef.current.panTo(location);
                  }
                },
                (error) => {
                  console.error("Error getting current location:", error);
                  alert("Unable to get your current location. Please select your location manually on the map.");
                }
              );
            }
          }}
        >
          Use My Current Location
        </button>
      </div>
      
      {marker && (
        <div className="selected-location">
          <p>Selected Location: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
}

export default MapComponent; 