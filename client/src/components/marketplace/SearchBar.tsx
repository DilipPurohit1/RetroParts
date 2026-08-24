import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search by part name, OEM #, vehicle make or model...',
  className = '',
  autoFocus = false,
}) => {
  const [internalValue, setInternalValue] = useState<string>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) onSearch(internalValue);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-surface-raised border border-border hover:border-border-strong focus:border-accent rounded pl-10 pr-24 py-2.5 text-[13px] text-text-primary placeholder-text-muted outline-none transition-colors"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {internalValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {onSearch && (
            <button
              type="button"
              onClick={() => onSearch(internalValue)}
              className="px-3 py-1 rounded bg-accent hover:bg-accent-hover text-white text-[12px] font-medium transition-colors"
            >
              Search
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
