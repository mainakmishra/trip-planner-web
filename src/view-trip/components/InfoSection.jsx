import React, { useState, useCallback } from 'react';
import GlobalAPI from '@/services/GlobalAPI';
import { IoLocationOutline, IoCalendarOutline, IoPeopleOutline, IoWalletOutline } from "react-icons/io5";

function InfoSection({ tripInfo }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePhotoFetched = useCallback((url) => {
    setPhotoUrl(url);
    setIsLoading(false);
  }, []);

  if (!tripInfo?.tripData?.destination) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-100 rounded-2xl" />
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GlobalAPI
        name={tripInfo?.tripData?.destination}
        address={tripInfo?.tripData?.destination}
        onPhotoFetched={handlePhotoFetched}
        type="destination"
      />
      
      {/* Hero Image */}
      <div className="relative overflow-hidden rounded-2xl">
        {isLoading ? (
          <div className="h-64 md:h-80 bg-gray-100 animate-pulse" />
        ) : (
          <img 
            src={photoUrl} 
            alt={tripInfo?.tripData?.destination}
            className="w-full h-64 md:h-80 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            {tripInfo?.tripData?.destination}
          </h1>
          <p className="text-white/80 flex items-center gap-2">
            <IoLocationOutline className="w-4 h-4" />
            From {tripInfo?.tripData?.source}
          </p>
        </div>
      </div>

      {/* Trip Details */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700">
          <IoCalendarOutline className="w-4 h-4 text-gray-500" />
          {tripInfo?.userSelection?.days} {tripInfo?.userSelection?.days > 1 ? "days" : "day"}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700">
          <IoPeopleOutline className="w-4 h-4 text-gray-500" />
          {tripInfo?.userSelection?.companions}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700">
          <IoWalletOutline className="w-4 h-4 text-gray-500" />
          {tripInfo?.userSelection?.budget} budget
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
