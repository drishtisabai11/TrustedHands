import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import Button from '../ui/Button';

export interface SearchBarProps {
  initialQuery?: string;
  initialLocation?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  initialLocation = 'all',
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location && location !== 'all') params.set('location', location);

    navigate({
      pathname: '/providers',
      search: params.toString(),
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`
        bg-bone p-2.5 sm:p-3 rounded-lg border border-mist shadow-card
        flex flex-col md:flex-row items-stretch gap-2.5 font-sans ${className}
      `}
    >
      {/* Query Input */}
      <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-parchment rounded-md border border-mist/60 focus-within:border-mineral transition-colors">
        <Search className="w-4 h-4 text-mineral shrink-0" />
        <div className="flex-1 flex flex-col justify-center">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-subtle">
            What do you need help with?
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a service or trade (e.g. Electrician, Carpenter)..."
            className="w-full bg-transparent text-sm text-charcoal placeholder-charcoal-subtle focus:outline-none"
          />
        </div>
      </div>

      {/* Location Selector */}
      <div className="flex-1 md:max-w-xs flex items-center gap-3 px-3 py-2 bg-parchment rounded-md border border-mist/60 focus-within:border-mineral transition-colors">
        <MapPin className="w-4 h-4 text-mineral shrink-0" />
        <div className="flex-1 flex flex-col justify-center">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-subtle">
            Where do you need it?
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm text-charcoal focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Cities & Regions</option>
            <option value="mumbai">Mumbai & Suburbs</option>
            <option value="delhi">Delhi NCR</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="ahmedabad">Ahmedabad</option>
          </select>
        </div>
      </div>

      {/* Submit CTA */}
      <Button
        type="submit"
        variant="cta"
        size="lg"
        leftIcon={<Search className="w-4 h-4" />}
        className="shrink-0 font-medium px-6 h-auto py-3 md:py-0"
      >
        Find Professionals
      </Button>
    </form>
  );
};
