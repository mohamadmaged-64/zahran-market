"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import { usePathname } from "next/navigation"; // ضفنا هاد السطر

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // هون بنقرأ الرابط الحالي
  const isAdmin = pathname?.startsWith("/admin"); // هون بنفحص إذا إحنا بصفحة الأدمن

  return (
    <ThemeProvider>
      <StoreProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            {/* إذا مش أدمن، اعرض النافبار */}
            {!isAdmin && <Navbar />}
            
            {/* شلنا المسافة العلوية الكبيرة إذا كنا بصفحة الأدمن */}
            <main className={isAdmin ? "flex-1 bg-gray-50 dark:bg-gray-900" : "flex-1 pt-28 md:pt-36"}>
              {children}
            </main>
            
            {/* إذا مش أدمن، اعرض الفوتر */}
            {!isAdmin && <Footer />}
          </div>
          
          {/* إذا مش أدمن، اعرض السلة الجانبية */}
          {!isAdmin && <CartDrawer />}
          
          <Toaster
            position="top-center"
            toastOptions={{
              className: "rtl",
              duration: 3000,
              style: {
                fontFamily: "Tajawal, sans-serif",
                borderRadius: "12px",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </CartProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}