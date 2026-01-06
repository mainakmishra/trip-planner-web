import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IoStarSharp, IoTimeOutline, IoTicketOutline } from 'react-icons/io5';
import GlobalAPI from '@/services/GlobalAPI';

function PlaceCard({ placeInfo }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.svg');
  const [loading, setLoading] = useState(true);

  const handlePhotoFetched = useCallback((url) => {
    setPhotoUrl(url || '/placeholder.svg');
    setLoading(false);
  }, []);

  return (
    <Link 
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeInfo?.name)}`}
      target="_blank"
      className="group block"
    >
      <GlobalAPI
        name={placeInfo?.name}
        address={placeInfo?.address}
        onPhotoFetched={handlePhotoFetched}
        type="place"
      />

      <div className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all duration-300">
        <div className="shrink-0 overflow-hidden rounded-lg">
          {loading ? (
            <div className="w-24 h-24 bg-gray-100 animate-pulse" />
          ) : (
            <img 
              src={photoUrl} 
              alt={placeInfo?.name}
              className="w-24 h-24 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 line-clamp-1">{placeInfo?.name}</h3>
            {placeInfo?.rating && (
              <div className="flex items-center gap-1 text-sm text-gray-600 shrink-0">
                <IoStarSharp className="w-3.5 h-3.5 text-amber-400" />
                {placeInfo.rating}
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2">{placeInfo?.details}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {placeInfo?.bestTimeToVisit && (
              <span className="flex items-center gap-1">
                <IoTimeOutline className="w-3 h-3" />
                {placeInfo.bestTimeToVisit}
              </span>
            )}
            {placeInfo?.ticketPricing && (
              <span className="flex items-center gap-1">
                <IoTicketOutline className="w-3 h-3" />
                {placeInfo.ticketPricing}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCard;
