import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { GeoLocation } from '../../types';
import { Button } from '../ui/Button';
import { MapPin, LocateFixed, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  initialLocation?: GeoLocation;
  onLocationSelect: (location: GeoLocation) => void;
}

const LocationMarker: React.FC<{
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}> = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={position} />;
};

const FlyToLocation: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  map.flyTo(position, 13);
  return null;
};

const fetchAddressFromCoordinates = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'HamaraSheharApp/1.0 (your_email@example.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }

    const data = await response.json();
    return data.display_name || null;
  } catch (err) {
    console.error('Reverse geocoding error:', err);
    return null;
  }
};

const LocationPicker: React.FC<LocationPickerProps> = ({ initialLocation, onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('Getting your location...');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start in loading state
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Get user's current location when component mounts
  useEffect(() => {
    if (!initialLocation) {
      getUserLocation();
    } else {
      setPosition([initialLocation.latitude, initialLocation.longitude]);
      setAddress(initialLocation.address || 'Selected location');
      setIsLoading(false);
    }
  }, []);

  const handlePositionChange = async (lat: number, lng: number, customAddress?: string) => {
    const newPosition: [number, number] = [lat, lng];
    setPosition(newPosition);
    
    try {
      const addr = customAddress || await fetchAddressFromCoordinates(lat, lng) || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      setAddress(addr);
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        address: addr,
      });
      setError(null);
    } catch (err) {
      setError('Failed to get address for this location');
    }
  };

  const getUserLocation = () => {
    setIsLoading(true);
    setError(null);
    setAddress('Detecting your location...');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setAddress('Location not available');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const humanReadableAddress = await fetchAddressFromCoordinates(latitude, longitude);
          await handlePositionChange(latitude, longitude, humanReadableAddress || undefined);
        } catch (err) {
          setError('Failed to get address, but using your coordinates');
          await handlePositionChange(latitude, longitude);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(`Error: ${err.message}`);
        setAddress('Could not get your location');
        setIsLoading(false);
        // Don't set any position - keep map empty
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds timeout
        maximumAge: 0 // Don't use cached position
      }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results = await response.json();
      if (results.length > 0) {
        const firstResult = results[0];
        const lat = parseFloat(firstResult.lat);
        const lon = parseFloat(firstResult.lon);
        const locationAddress = firstResult.display_name || `Lat: ${lat.toFixed(6)}, Lng: ${lon.toFixed(6)}`;
        await handlePositionChange(lat, lon, locationAddress);
      } else {
        setSearchError('No results found for this search');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Failed to search for location');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location (e.g., Connaught Place)"
          className="border rounded p-2 w-full text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="default"
          leftIcon={<Search size={16} />}
          onClick={handleSearch}
          isLoading={searchLoading}
          disabled={searchLoading || isLoading}
        >
          Search
        </Button>
      </div>

      {searchError && (
        <div className="text-error-600 text-sm">{searchError}</div>
      )}

      {/* Map */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-64">
        {position ? (
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} onPositionChange={handlePositionChange} />
            <FlyToLocation position={position} />
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            {isLoading ? (
              <p className="text-gray-500">{address}</p>
            ) : error ? (
              <p className="text-error-500">{error}</p>
            ) : (
              <p className="text-gray-500">Location not available</p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          leftIcon={<LocateFixed size={16} />}
          onClick={getUserLocation}
          isLoading={isLoading}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? 'Detecting...' : 'Use My Current Location'}
        </Button>

        <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700">
          <MapPin size={16} className="flex-shrink-0 mr-2 text-primary-500" />
          <span className="truncate">{address}</span>
        </div>
      </div>

      {error && !isLoading && (
        <div className="text-error-600 text-sm">{error}</div>
      )}
    </div>
  );
};

export default LocationPicker;