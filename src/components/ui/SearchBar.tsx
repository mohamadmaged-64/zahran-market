"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const { searchProducts } = useStore();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await searchProducts(query);
      setResults(res.slice(0, 5));
      setShowResults(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowResults(true)}
          placeholder="ابحث عن منتجات..."
          className="w-full pr-10 pl-12 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-slide-down">
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                router.push(`/products/${product.id}`);
                setShowResults(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
            >
              <img
                src={product.image_url || "/images/placeholder.svg"}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </p>
                <p className="text-xs text-primary-600 font-bold">
                  {product.price.toLocaleString("ar-SA")} ﷼
                </p>
              </div>
            </button>
          ))}
          <button
            onClick={() => {
              router.push(`/search?q=${encodeURIComponent(query)}`);
              setShowResults(false);
            }}
            className="w-full px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium border-t border-gray-100 dark:border-gray-700 text-center"
          >
            عرض جميع النتائج ({results.length})
          </button>
        </div>
      )}
    </div>
  );
}
