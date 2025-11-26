import React, { useState, useEffect } from 'react';
import { Search, Filter, X, MapPin, Loader2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { IssueCategory, IssueStatus, GeoLocation } from '../../types';
import { categoryInfo, statusInfo } from '../../data/mockData';
import { useIssueStore } from '../../store/issueStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const IssueFilter: React.FC = () => {
  const { filters, setFilters, clearFilters, setUserLocation, userLocation } = useIssueStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (filters.nearMe && !isGettingLocation) {
      getUserLocation();
    }
  }, [filters.nearMe]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleCategoryChange = (category: IssueCategory | null) => {
    setFilters({ category });
  };

  const handleStatusChange = (status: IssueStatus | null) => {
    setFilters({ status });
  };

  const handleSortChange = (sortBy: 'newest' | 'oldest' | 'mostVoted' | 'leastVoted') => {
    setFilters({ sortBy });
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const getUserLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setFilters({ nearMe: false });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: GeoLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(location);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please try again.');
        setFilters({ nearMe: false });
        setIsGettingLocation(false);
      }
    );
  };

  const hasActiveFilters = filters.category !== null ||
    filters.status !== null ||
    filters.search !== '' ||
    filters.nearMe;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-2/3">
          <Input
            placeholder="Search for issues..."
            value={filters.search}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
            rightIcon={
              filters.search ? (
                <button onClick={() => setFilters({ search: '' })}>
                  <X size={18} />
                </button>
              ) : null
            }
            fullWidth
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant={filters.nearMe ? 'default' : 'outline'}
            onClick={() => setFilters({ nearMe: !filters.nearMe })}
            leftIcon={isGettingLocation ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
            fullWidth
            className="sm:w-auto"
          >
            Near Me
          </Button>

          <Button
            variant={isFilterOpen ? 'default' : 'outline'}
            onClick={toggleFilterPanel}
            leftIcon={<Filter size={16} />}
            fullWidth
            className="sm:w-auto"
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 bg-white text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {(filters.category ? 1 : 0) + (filters.status ? 1 : 0) + (filters.nearMe ? 1 : 0)}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              leftIcon={<X size={16} />}
              className="sm:w-auto"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.category === null ? 'secondary' : 'outline'}
                    size="xs"
                    onClick={() => handleCategoryChange(null)}
                  >
                    All
                  </Button>
                  {Object.entries(categoryInfo).map(([key, category]) => (
                    <Button
                      key={key}
                      variant={filters.category === key ? 'secondary' : 'outline'}
                      size="xs"
                      onClick={() => handleCategoryChange(key as IssueCategory)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.status === null ? 'secondary' : 'outline'}
                    size="xs"
                    onClick={() => handleStatusChange(null)}
                  >
                    All
                  </Button>
                  {Object.entries(statusInfo).map(([key, status]) => (
                    <Button
                      key={key}
                      variant={filters.status === key ? 'secondary' : 'outline'}
                      size="xs"
                      onClick={() => handleStatusChange(key as IssueStatus)}
                    >
                      {status.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.sortBy === 'newest' ? 'secondary' : 'outline'}
                    size="xs"
                    onClick={() => handleSortChange('newest')}
                  >
                    Newest
                  </Button>
                  <Button
                    variant={filters.sortBy === 'oldest' ? 'secondary' : 'outline'}
                    size="xs"
                    onClick={() => handleSortChange('oldest')}
                  >
                    Oldest
                  </Button>
                  <Button
                    variant={filters.sortBy === 'mostVoted' ? 'secondary' : 'outline'}
                    size="xs"
                    onClick={() => handleSortChange('mostVoted')}
                  >
                    Most Voted
                  </Button>
                  <Button
                    variant={filters.sortBy === 'leastVoted' ? 'secondary' : 'outline'}
                    size="xs"
                    onClick={() => handleSortChange('leastVoted')}
                  >
                    Least Voted
                  </Button>
                </div>
              </div>
            </div>

            {filters.nearMe && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Your Location</h3>
                {userLocation && (
                  <MapContainer
                    center={[userLocation.latitude, userLocation.longitude]}
                    zoom={13}
                    style={{ height: '300px', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[userLocation.latitude, userLocation.longitude]}>
                      <Popup>You are here</Popup>
                    </Marker>
                  </MapContainer>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IssueFilter;
