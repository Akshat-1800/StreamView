"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/debouncing";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="relative w-72">
      <input
        type="text"
        placeholder="Search movies or series..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
      />

      {/* Dropdown */}
      {query && (
        <div className="absolute top-11 w-full bg-gray-900 rounded shadow-lg z-50">
          {loading && (
            <p className="p-3 text-sm text-gray-400">Searching...</p>
          )}

          {!loading && results.length === 0 && (
            <p className="p-3 text-sm text-gray-400">No results</p>
          )}

          {!loading &&
            results.map((video) => (
              <div
                key={video._id}
                onClick={() => {
                  router.push(`/watch/${video._id}`);
                  setQuery("");
                  setResults([]);
                }}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium">{video.title}</p>
                  {video.isPremium && (
                    <span className="text-xs text-purple-400">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
