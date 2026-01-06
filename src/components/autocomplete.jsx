import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { getPlaceSuggestions } from '../services/geoapify';

/**
 * Autocomplete component for place search
 * Uses Geoapify API for suggestions
 */
const Autocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Fetch suggestions from Geoapify
  const fetchSuggestions = useCallback(async (input) => {
    const trimmedInput = input.trim();
    
    if (trimmedInput.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const results = await getPlaceSuggestions(trimmedInput, { limit: 5 });
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized debounced function
  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedFetchSuggestions]);

  const handleInputChange = useCallback((event) => {
    const value = event.target.value;
    setQuery(value);
    setIsSuggestionSelected(false);
    setHighlightedIndex(-1);
    debouncedFetchSuggestions(value);
  }, [debouncedFetchSuggestions]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    setIsSuggestionSelected(true);
    onSelect(suggestion);
  }, [onSelect]);

  const handleKeyDown = useCallback((event) => {
    if (suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : 0
        );
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  }, [suggestions, highlightedIndex, handleSuggestionClick]);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  // Render suggestion item
  const renderSuggestion = (suggestion, index) => {
    const isHighlighted = highlightedIndex === index;
    
    return (
      <li
        key={suggestion.place_id || index}
        onClick={() => handleSuggestionClick(suggestion)}
        onMouseEnter={() => setHighlightedIndex(index)}
        role="option"
        aria-selected={isHighlighted}
        className={`p-3 cursor-pointer transition-all ${
          isHighlighted ? 'bg-pink-100' : 'hover:bg-pink-50'
        }`}
      >
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-gray-700">{suggestion.description}</span>
        </div>
      </li>
    );
  };

  // Render suggestions list content
  const renderSuggestionsContent = () => {
    if (query.length < 2) {
      return (
        <li className="p-3 text-gray-500">
          Type at least 2 characters to see suggestions
        </li>
      );
    }

    if (isLoading) {
      return (
        <li className="p-3 text-gray-500 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Searching...
        </li>
      );
    }

    if (suggestions.length > 0) {
      return suggestions.map(renderSuggestion);
    }

    if (!isSuggestionSelected) {
      return <li className="p-3 text-gray-500">No results found</li>;
    }

    return null;
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter a location"
          aria-label="Search for a location"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={suggestions.length > 0}
          className="w-full p-3 pl-12 text-lg bg-pink-50 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-300 placeholder-pink-400 transition-all shadow-md"
        />
        <svg
          className="absolute left-3 top-3.5 h-6 w-6 text-pink-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <ul
        id="suggestions-list"
        role="listbox"
        className="mt-2 bg-white border border-pink-100 rounded-lg shadow-lg"
      >
        {renderSuggestionsContent()}
      </ul>
    </div>
  );
};

export default Autocomplete;