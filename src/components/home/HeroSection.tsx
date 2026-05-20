"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Truck, Shield, Headphones, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "تسوق طازج كل يوم",
    subtitle: "أفضل الخضروات والفواكه الطازجة مباشرة من المزرعة",
    bg: "from-primary-900 to-primary-700",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    cta: "تسوق الآن",
    link: "/products",
  },
  {
    title: "عروض عيد الأضحى",
    subtitle: "خصومات تصل إلى 50% على مئات المنتجات",
    bg: "from-orange-900 to-red-800",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    cta: "استعرض العروض",
    link: "/offers",
  },
  {
    title: "توصيل سريع",
    subtitle: "عند الطلب بقيمة 200 جنيه أو أكثر",
    bg: "from-emerald-900 to-emerald-700",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&q=80",
    cta: "تسوق الآن",
    link: "/products",
  },
];

const features = [
  { icon: Truck, title: "توصيل سريع", desc: "توصيل خلال أقل من ساعة" },
  { icon: Shield, title: "منتجات طازجة", desc: "ضمان الجودة" },
  { icon: Headphones, title: "دعم 24/7", desc: "خدمة عملاء على مدار الساعة" },
  { icon: Clock, title: "توصيل مجاني", desc: "للطلبات فوق 200 جنيه" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative">
      {/* Hero slider */}
      <div className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-80 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container-custom">
                <div className="max-w-2xl animate-fade-in">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/80 mb-8">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-xl text-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {slide.cta}
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                i === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>

      {/* Features bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                  <feat.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{feat.title}</p>
                  <p className="text-xs text-gray-500">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
