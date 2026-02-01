"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/debouncing";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);

    fetch(`/api/search?q=${debouncedQuery}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div className="relative w-80">
      <div className={`relative transition-all duration-300 ${focused ? 'scale-105' : ''}`}>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search movies, series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="input pl-11 pr-4 py-2.5 rounded-full bg-gray-900 border-gray-800 focus:border-red-500/50 placeholder-gray-500"
        />
      </div>

      {/* Dropdown */}
      {query && focused && (
        <div className="absolute top-14 w-full glass rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          {loading && (
            <div className="flex items-center gap-3 p-4">
              <div className="loading-spinner w-5 h-5"></div>
              <span className="text-sm text-gray-400">Searching...</span>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-4 text-center">
              <span className="text-2xl block mb-2">🔍</span>
              <p className="text-sm text-gray-400">No results found</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {results.map((video) => (
                <div
                  key={video._id}
                  onClick={() => {
                    router.push(`/watch/${video._id}`);
                    setQuery("");
                    setResults([]);
                  }}
                  className="flex items-center gap-4 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-16 h-10 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{video.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {video.isPremium && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          ⭐ Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
