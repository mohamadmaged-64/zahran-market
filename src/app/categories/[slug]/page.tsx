"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Product, Category } from "@/lib/types";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { categories, products } = useStore();
  const [category, setCategory] = useState<Category | null>(null);
  const [catProducts, setCatProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = categories.find((c) => c.slug === slug);
    if (cat) {
      setCategory(cat);
    }
  }, [slug, categories]);

  useEffect(() => {
    if (category) {
      const filtered = products.filter(
        (p) => p.category_id === category.id && p.is_available
      );
      setCatProducts(filtered);
      setLoading(false);
    }
  }, [category, products]);

  if (loading) return <div className="container-custom py-20"><LoadingSpinner size="lg" /></div>;
  if (!category) return <div className="container-custom py-20 text-center text-gray-500">التصنيف غير موجود</div>;

  return (
    <div className="container-custom py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">المنتجات</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {category.name}
        </h1>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          جميع المنتجات
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {catProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">لا توجد منتجات في هذا التصنيف</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {catProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
