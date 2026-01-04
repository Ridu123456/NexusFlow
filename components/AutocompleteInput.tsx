import React, { useState, useEffect, useRef } from 'react';
import { getPlaceSuggestions } from '../services/geminiService';

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  leftIcon?: React.ReactNode;
  autoFocus?: boolean;
  className?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  leftIcon, 
  autoFocus, 
  className 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounce API calls
    const timer = setTimeout(async () => {
      if (value.length >= 3 && showSuggestions) {
        const results = await getPlaceSuggestions(value);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, showSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div className="relative z-20" ref={wrapperRef}>
      <div className={`flex items-center bg-white border border-gray-300 rounded-lg p-3 transition-colors ${className}`}>
        {leftIcon && <div className="mr-3">{leftIcon}</div>}
        <input 
          value={value} 
          onChange={handleInputChange}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto animate-slide-up z-50">
          {suggestions.map((item, index) => (
            <li 
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 border-b last:border-0 border-gray-50 flex items-center"
            >
              <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
              {item}
            </li>
          ))}
        </ul>
      )}
      <style>{`
        .animate-slide-up {
          animation: slideUpFade 0.2s ease-out;
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AutocompleteInput;