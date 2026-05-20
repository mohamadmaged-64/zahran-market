"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Star, Minus, Plus, ChevronLeft, Truck, Shield, RefreshCw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { getProduct, getProductsByCategory } = useStore();

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    const data = await getProduct(id);
    setProduct(data);
    if (data?.category_id) {
      const catProducts = await getProductsByCategory(data.category_id);
      setRelated(catProducts.filter((p) => p.id !== data.id).slice(0, 5));
    }
    setLoading(false);
  }

  if (loading) return <div className="container-custom py-20"><LoadingSpinner size="lg" /></div>;
  if (!product) return <div className="container-custom py-20 text-center text-gray-500">المنتج غير موجود</div>;

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const images = product.images?.length ? product.images : [product.image_url];

  return (
    <div className="container-custom py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">الرئيسية</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-primary-600">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={images[selectedImage] || "/images/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1.5 rounded-xl font-bold text-sm">
                -{discount}%
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? "border-primary-600" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating?.toFixed(1) || "0.0"} ({product.rating_count || 0} تقييم)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-xl text-gray-400 line-through">
                {formatCurrency(product.compare_price)}
              </span>
            )}
            <span className="text-sm text-gray-500">/{product.unit}</span>
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <span className="badge-success">متوفر</span>
            ) : (
              <span className="badge-danger">غير متوفر</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-sm text-orange-500">فقط {product.stock} قطع متبقية</span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">الوصف</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and add to cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => addItem(product, quantity)}
              disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
            >
              <ShoppingCart className="w-5 h-5" />
              أضف إلى السلة - {formatCurrency(product.price * quantity)}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <Truck className="w-5 h-5 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">توصيل سريع</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <Shield className="w-5 h-5 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">منتج أصلي</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <RefreshCw className="w-5 h-5 text-primary-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">إرجاع مجاني</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="section-title">منتجات ذات صلة</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
