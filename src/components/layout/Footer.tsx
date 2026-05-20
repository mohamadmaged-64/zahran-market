import Link from "next/link";
import { Store, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, MessageCircle } from "lucide-react";
import { SITE_NAME, CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 border-t border-gray-800">
      {/* Main footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Store className="w-7 h-7 text-primary-500" />
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              وجهتك الأولى للتسوق الإلكتروني للمواد الغذائية والمنتجات الطازجة. نوفر لك أفضل المنتجات بأفضل الأسعار مع خدمة توصيل سريعة.
            </p>
            <div className="flex items-center gap-3">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>

              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">جميع المنتجات</Link>
              </li>
              <li>
                <Link href="/offers" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">العروض والتخفيضات</Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">سلة التسوق</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">اتصل بنا</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-4">التصنيفات</h3>
            <ul className="space-y-3">
              <li><Link href="/categories/%D8%AE%D8%B6%D8%B1%D9%88%D8%A7%D8%AA" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">خضروات</Link></li>
              <li><Link href="/categories/%D9%81%D9%88%D8%A7%D9%83%D9%87" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">فواكه</Link></li>
              <li><Link href="/categories/%D9%84%D8%AD%D9%88%D9%85" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">لحوم</Link></li>
              <li><Link href="/categories/%D8%A3%D9%84%D8%A8%D8%A7%D9%86" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">ألبان</Link></li>
              <li><Link href="/categories/%D9%85%D8%B4%D8%B1%D9%88%D8%A8%D8%A7%D8%AA" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">مشروبات</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">معلومات الاتصال</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">الهاتف</p>
                  <a href={`tel:${CONTACT_INFO.phone}`} className="text-white hover:text-primary-500 transition-colors">
                    19866
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-white hover:text-primary-500 transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">العنوان</p>
                  <p className="text-white text-sm">حي الزهور ، مقابل كافيه ارمادا</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">ساعات العمل</p>
                  <p className="text-white text-sm">{CONTACT_INFO.workingHours}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {SITE_NAME}. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-gray-500">
           Designed by: DE MOH
          </p>
        </div>
      </div>
    </footer>
  );
}
