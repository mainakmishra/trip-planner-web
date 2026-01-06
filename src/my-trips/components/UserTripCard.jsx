import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IoCalendarOutline, IoPeopleOutline, IoWalletOutline } from 'react-icons/io5';
import GlobalAPI from '@/services/GlobalAPI';

function UserTripCard({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.svg');
  const [loading, setLoading] = useState(true);

  const handlePhotoFetched = useCallback((url) => {
    setPhotoUrl(url || '/placeholder.svg');
    setLoading(false);
  }, []);

  return (
    <Link to={`/view-trip/${trip?.id}`} className="group block">
      <GlobalAPI
        name={trip?.tripData?.destination}
        address={trip?.tripData?.destination}
        onPhotoFetched={handlePhotoFetched}
        type="destination"
      />

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
        {loading ? (
          <div className="h-44 bg-gray-100 animate-pulse" />
        ) : (
          <div className="relative overflow-hidden">
            <img 
              src={photoUrl} 
              alt={trip?.tripData?.destination}
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <h3 className="absolute bottom-3 left-4 text-lg font-semibold text-white">
              {trip?.tripData?.destination}
            </h3>
          </div>
        )}
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full">
              <IoCalendarOutline className="w-3 h-3" />
              {trip?.userSelection?.days} days
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full">
              <IoWalletOutline className="w-3 h-3" />
              {trip?.userSelection?.budget}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full">
              <IoPeopleOutline className="w-3 h-3" />
              {trip?.userSelection?.companions}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCard;
