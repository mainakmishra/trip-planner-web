import React, { useState, useEffect } from 'react';
import { IoAirplaneOutline, IoTrainOutline, IoCarOutline, IoTimeOutline, IoOpenOutline, IoBusOutline, IoRefreshOutline, IoSearchOutline } from 'react-icons/io5';
import { searchTransportData, getAirportCode } from '@/services/geminiSearch';

function Transport({ tripInfo }) {
  const [transportData, setTransportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const source = tripInfo?.tripData?.source || '';
  const destination = tripInfo?.tripData?.destination || '';
  const distanceByRoad = transportData?.distanceByRoad || tripInfo?.tripData?.distanceByRoad || tripInfo?.tripData?.distancebyRoad;
  const timeByRoad = transportData?.timeByRoad || tripInfo?.tripData?.timeTotravelByRoad || tripInfo?.tripData?.timeToTravelByRoad;

  // Get airport codes for display
  const depIata = getAirportCode(source);
  const arrIata = getAirportCode(destination);

  // Fetch transport data on mount
  useEffect(() => {
    if (source && destination) {
      fetchTransportData();
    }
  }, [source, destination]);

  const fetchTransportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchTransportData(source, destination);
      if (result.error) {
        setError(result.error);
      }
      setTransportData(result);
    } catch (err) {
      console.error('Failed to fetch transport data:', err);
      setError('Failed to search for transport options');
    }
    setLoading(false);
  };

  const flights = transportData?.flights || [];
  const trains = transportData?.trains || [];

  // Booking links
  const bookingLinks = {
    flights: [
      {
        name: 'Google Flights',
        url: `https://www.google.com/search?q=flights+from+${encodeURIComponent(source)}+to+${encodeURIComponent(destination)}`,
        icon: '✈️'
      },
      {
        name: 'MakeMyTrip',
        url: 'https://www.makemytrip.com/flights/',
        icon: '🎫'
      },
    ],
    trains: [
      {
        name: 'IRCTC',
        url: 'https://www.irctc.co.in/nget/train-search',
        icon: '🚂'
      },
      {
        name: 'ConfirmTkt',
        url: 'https://www.confirmtkt.com/',
        icon: '✅'
      },
    ],
    buses: [
      {
        name: 'RedBus',
        url: 'https://www.redbus.in/',
        icon: '🚌'
      },
      {
        name: 'MakeMyTrip',
        url: 'https://www.makemytrip.com/bus-tickets/',
        icon: '🚍'
      },
    ]
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Getting There
        </h2>
        <button
          onClick={fetchTransportData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <IoRefreshOutline className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Searching...' : 'Refresh'}
        </button>
      </div>

      {/* Distance Info */}
      {(distanceByRoad || timeByRoad) && (
        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl mb-6">
          {distanceByRoad && (
            <div className="flex items-center gap-2 text-gray-700">
              <IoCarOutline className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{distanceByRoad}</span>
            </div>
          )}
          {timeByRoad && (
            <div className="flex items-center gap-2 text-gray-700">
              <IoTimeOutline className="w-5 h-5 text-gray-500" />
              <span>{timeByRoad} by road</span>
            </div>
          )}
        </div>
      )}

      {/* Route Summary */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl mb-6">
        <p className="text-blue-800">
          <span className="font-semibold">{source}</span>
          {depIata && <span className="text-blue-500 text-sm ml-1">({depIata})</span>}
          <span className="mx-3 text-blue-400">→</span>
          <span className="font-semibold">{destination}</span>
          {arrIata && <span className="text-blue-500 text-sm ml-1">({arrIata})</span>}
        </p>
        <p className="text-blue-600 text-xs mt-1 flex items-center gap-1">
          <IoSearchOutline className="w-3 h-3" />
          Powered by Google Search
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-xl mb-6">
          <IoRefreshOutline className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Searching for real-time transport data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-6">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchTransportData}
            className="mt-2 text-xs text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Transport Data Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Flights */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IoAirplaneOutline className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Flights</h3>
                {flights.length > 0 && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {flights.length} found
                  </span>
                )}
              </div>
            </div>

            {flights.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {flights.map((flight, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {flight.airline}
                      </span>
                      <span className="text-xs text-blue-600 font-mono">
                        {flight.flightNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{flight.departureTime}</span>
                      <span>→</span>
                      <span>{flight.arrivalTime}</span>
                      {flight.duration && (
                        <span className="text-gray-400">• {flight.duration}</span>
                      )}
                    </div>
                    {flight.frequency && (
                      <p className="text-xs text-gray-400 mt-1">{flight.frequency}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">
                {loading ? 'Searching...' : 'No direct flights found'}
              </p>
            )}

            {/* Booking Links */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Book tickets:</p>
              <div className="flex gap-2">
                {bookingLinks.flights.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-lg transition-colors"
                  >
                    <span>{link.icon}</span>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Trains */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IoTrainOutline className="w-5 h-5 text-orange-600" />
                <h3 className="font-medium text-gray-900">Trains</h3>
                {trains.length > 0 && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {trains.length} found
                  </span>
                )}
              </div>
            </div>

            {trains.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {trains.map((train, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {train.name}
                      </span>
                      <span className="text-xs text-orange-600 font-mono">
                        {train.number}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{train.departureTime}</span>
                      <span>→</span>
                      <span>{train.arrivalTime}</span>
                      {train.duration && (
                        <span className="text-gray-400">• {train.duration}</span>
                      )}
                    </div>
                    {train.frequency && (
                      <p className="text-xs text-gray-400 mt-1">{train.frequency}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">
                {loading ? 'Searching...' : 'No direct trains found'}
              </p>
            )}

            {/* Booking Links */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Book tickets:</p>
              <div className="flex gap-2">
                {bookingLinks.trains.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs rounded-lg transition-colors"
                  >
                    <span>{link.icon}</span>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buses Section */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <IoBusOutline className="w-5 h-5 text-green-600" />
          <h3 className="font-medium text-gray-900">Buses</h3>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Book bus tickets on these platforms:
        </p>
        <div className="flex gap-2">
          {bookingLinks.buses.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm rounded-lg transition-colors"
            >
              <span>{link.icon}</span>
              {link.name}
              <IoOpenOutline className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Source Note */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        ✨ Transport data searched via Google • Always verify timings on official websites before booking
      </p>
    </div>
  );
}

export default Transport;
