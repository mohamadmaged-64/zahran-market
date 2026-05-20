export const SITE_NAME = "زهران ماركت";
export const SITE_DESCRIPTION = "السوق الإلكتروني المتكامل - أفضل المنتجات الطازجة والمواد الغذائية";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://zahran-market.vercel.app";

export const DELIVERY_FEE = 15;
export const FREE_DELIVERY_THRESHOLD = 200;

export const CONTACT_INFO = {
  phone: "19866",
  email: "info@zahranmarket.com",
  address: "الشرقية - الزقازيق - حي الزهور",
  workingHours: "8:00 صباحا - 12:00 ليلا",
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/zahranmarket",
  twitter: "https://twitter.com/zahranmarket",
  instagram: "https://instagram.com/zahranmarket",
  whatsapp: "https://wa.me/966551234567",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  خضروات: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&q=80",
  فواكه: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80",
  لحوم: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&q=80",
  دواجن: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80",
  ألبان: "https://images.unsplash.com/photo-1628088062854-b1870b58a8b5?w=400&q=80",
  مخبوزات: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80",
  مشروبات: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
  "مواد غذائية": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  منظفات: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&q=80",
  "عناية شخصية": "https://images.unsplash.com/photo-1556228578-392cc034cf11?w=400&q=80",
  أطفال: "https://images.unsplash.com/photo-1584828289989-5a37c0d2cfee?w=400&q=80",
  حلويات: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
};
