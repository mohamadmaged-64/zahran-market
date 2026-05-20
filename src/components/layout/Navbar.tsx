"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Phone, MapPin, ChevronDown, Store, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchBar from "@/components/ui/SearchBar";
import { SITE_NAME, CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const pathname = usePathname();
  const { itemCount, setCartOpen } = useCart();
  const { categories } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowCategories(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHome
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div className="hidden md:block bg-primary-700 text-white text-xs">
        <div className="container-custom flex items-center justify-between py-1.5">
          <div className="flex items-center gap-4">
            <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-1 hover:text-primary-200 transition-colors">
              <Phone className="w-3 h-3" />
              {CONTACT_INFO.phone}
            </a>
            <span className="text-primary-300">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {CONTACT_INFO.address}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>{CONTACT_INFO.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={cn("border-b", (isScrolled || !isHome) ? "border-gray-100 dark:border-gray-800" : "border-transparent")}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Store className="w-7 h-7 md:w-8 md:h-8 text-primary-600" />
              <span className="text-xl md:text-2xl font-bold text-primary-600">
                {SITE_NAME}
              </span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-lg">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <ThemeToggle />

              <Link
                href="/contact"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                <Phone className="w-4 h-4" />
                اتصل بنا
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
        </div>
      </nav>

      {/* Categories nav */}
      <div className="hidden md:block bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            <Link
              href="/"
              className={cn(
                "px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors",
                pathname === "/"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              الرئيسية
            </Link>
            <Link
              href="/products"
              className={cn(
                "px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors",
                pathname === "/products"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              جميع المنتجات
            </Link>
            <Link
              href="/offers"
              className={cn(
                "px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors",
                pathname === "/offers"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              العروض
            </Link>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={cn(
                  "px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors",
                  pathname === `/categories/${cat.slug}`
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {cat.name}
              </Link>
            ))}
            {categories.length > 8 && (
              <div className="relative">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  المزيد <ChevronDown className="w-3 h-3" />
                </button>
                {showCategories && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {categories.slice(8).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-black/50 animate-fade-in" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile menu panel */}
      <div
        className={cn(
          "md:hidden fixed top-16 right-0 bottom-0 w-72 bg-white dark:bg-gray-950 z-50 shadow-2xl transform transition-transform duration-300 overflow-y-auto",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 space-y-2">
          <Link
            href="/"
            className={cn(
              "block px-4 py-3 rounded-xl font-medium transition-colors",
              pathname === "/" ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            الرئيسية
          </Link>
          <Link
            href="/products"
            className={cn(
              "block px-4 py-3 rounded-xl font-medium transition-colors",
              pathname === "/products" ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            جميع المنتجات
          </Link>
          <Link
            href="/offers"
            className={cn(
              "block px-4 py-3 rounded-xl font-medium transition-colors",
              pathname === "/offers" ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            العروض والتخفيضات
          </Link>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
            <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">التصنيفات</p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-sm transition-colors",
                  pathname === `/categories/${cat.slug}` ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
            <Link
              href="/contact"
              className={cn(
                "block px-4 py-3 rounded-xl font-medium transition-colors",
                pathname === "/contact" ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              اتصل بنا
            </Link>
            <Link
              href="/cart"
              className={cn(
                "block px-4 py-3 rounded-xl font-medium transition-colors",
                pathname === "/cart" ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              سلة التسوق ({itemCount})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
