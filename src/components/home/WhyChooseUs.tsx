"use client";

import { ShoppingBag, CreditCard, MapPin, Headphones } from "lucide-react";

const reasons = [
  {
    icon: ShoppingBag,
    title: "تشكيلة واسعة",
    desc: "آلاف المنتجات الطازجة والمواد الغذائية من أفضل الماركات",
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
  },
  {
    icon: CreditCard,
    title: "أسعار منافسة",
    desc: "أفضل الأسعار مع عروض وتخفيضات يومية",
    color: "bg-green-100 dark:bg-green-900/20 text-green-600",
  },
  {
    icon: MapPin,
    title: "توصيل سريع",
    desc: "نوصل طلبك لباب البيت في أسرع وقت",
    color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
  },
  {
    icon: Headphones,
    title: "دعم متواصل",
    desc: "فريق خدمة عملاء جاهز لمساعدتك على مدار الساعة",
    color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 md:py-14 bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <h2 className="section-title text-center block mb-10">
          لماذا تختار {process.env.NEXT_PUBLIC_SITE_NAME || "زهران ماركت"}؟
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="card p-6 text-center hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${reason.color} flex items-center justify-center mx-auto mb-4`}>
                <reason.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
