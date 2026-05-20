"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-500 mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
