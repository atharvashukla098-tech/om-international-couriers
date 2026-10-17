"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';

interface SearchHUDProps {
  onSelectLocation: (lng: number, lat: number, placeName: string) => void;
  visible?: boolean;
  className?: string;
}

interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number];
}

export default function SearchHUD({ onSelectLocation, visible = true, className }: SearchHUDProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (token) {
      try {
        const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${token}&limit=5&types=place,address,poi,locality,country`;
        const res = await fetch(mapboxUrl);
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          setResults(data.features);
          setIsOpen(true);
          setSelectedIndex(-1);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Mapbox search fallback to Nominatim:', e);
      }
    }

    // Free OpenStreetMap Nominatim fallback
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`;
      const res = await fetch(nominatimUrl);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const features = data.map((item: { place_id: number; display_name: string; lon: string; lat: string }) => ({
          id: item.place_id.toString(),
          place_name: item.display_name,
          center: [parseFloat(item.lon), parseFloat(item.lat)] as [number, number],
        }));
        setResults(features);
        setIsOpen(true);
        setSelectedIndex(-1);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(value);
    }, 300);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.place_name);
    setResults([]);
    setIsOpen(false);
    onSelectLocation(result.center[0], result.center[1], result.place_name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
      className={`fixed ${className || 'top-20'} left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-none`}
    >
      <div ref={containerRef} className="w-full relative pointer-events-auto">
        <div className="backdrop-blur-md bg-slate-950/90 border border-white/10 rounded-2xl px-3.5 py-2 sm:px-5 sm:py-3 shadow-2xl flex items-center gap-2 sm:gap-3">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            maxLength={100}
            autoComplete="off"
            spellCheck="false"
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search any city, airport, or corridor..."
            className="flex-1 bg-transparent text-white text-xs sm:text-sm placeholder:text-white/40 outline-none font-sans"
          />

          {isLoading && <Loader2 className="w-4 h-4 text-white/40 animate-spin shrink-0" />}
          {!isLoading && query && (
            <button onClick={clearSearch} className="shrink-0 p-1">
              <X className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-slate-900/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors border-b border-white/[0.04] last:border-b-0 ${
                    selectedIndex === index ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span className="text-sm text-white/80 truncate">{result.place_name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
