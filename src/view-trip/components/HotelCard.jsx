import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IoStarSharp, IoLocationOutline } from 'react-icons/io5';
import GlobalAPI from '@/services/GlobalAPI';

function HotelCard({ hotelInfo, destination }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.svg');
  const [loading, setLoading] = useState(true);

  const handlePhotoFetched = useCallback((url) => {
    setPhotoUrl(url || '/placeholder.svg');
    setLoading(false);
  }, []);

  const formatPrice = (price) => {
    if (!price) return 'Check price';
    if (typeof price === 'string') return price;
    if (typeof price === 'object') {
      const firstPrice = Object.values(price)[0];
      return firstPrice || 'Check price';
    }
    return String(price);
  };

  return (
    <Link 
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelInfo?.name + ' ' + hotelInfo?.address)}`}
      target="_blank"
      className="group block"
    >
      <GlobalAPI
        name={hotelInfo?.name}
        address={hotelInfo?.address}
        onPhotoFetched={handlePhotoFetched}
        type="hotel"
        city={destination}
      />

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
        {loading ? (
          <div className="h-40 bg-gray-100 animate-pulse" />
        ) : (
          <img 
            src={photoUrl} 
            alt={hotelInfo?.name}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-gray-900 line-clamp-1">{hotelInfo?.name}</h3>
            {hotelInfo?.rating && (
              <div className="flex items-center gap-1 text-sm text-gray-600 shrink-0">
                <IoStarSharp className="w-4 h-4 text-amber-400" />
                {hotelInfo.rating}
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 flex items-center gap-1 line-clamp-1">
            <IoLocationOutline className="w-3 h-3 shrink-0" />
            {hotelInfo?.address}
          </p>
          
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(hotelInfo?.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default HotelCard;
