
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
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (value.length >= 3 && showSuggestions) {
        setLoading(true);
        try {
          const results = await getPlaceSuggestions(value);
          setSuggestions(results);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 400);

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

  return (
    <div className="relative z-[60]" ref={wrapperRef}>
      <div className={`flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 transition-all focus-within:ring-2 focus-within:ring-brand-500/10 focus-within:bg-white dark:focus-within:bg-slate-700 ${className}`}>
        {leftIcon && <div className="mr-3 opacity-60 shrink-0">{leftIcon}</div>}
        <input 
          value={value} 
          onChange={(e) => { onChange(e.target.value); setShowSuggestions(true); }}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium"
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        {loading && (
          <div className="ml-2 animate-spin h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full shrink-0"></div>
        )}
        {!loading && value && (
          <button 
            onClick={() => { onChange(''); setSuggestions([]); }}
            className="ml-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-50 dark:border-slate-700 max-h-60 overflow-y-auto animate-fade-in z-[100] no-scrollbar">
          {suggestions.map((item, index) => (
            <li 
              key={index}
              onClick={() => handleSelect(item)}
              className="px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 border-b last:border-0 border-slate-50 dark:border-slate-700 flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"></div>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
