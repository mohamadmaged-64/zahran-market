"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "@/context/StoreContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { products, loading, refreshProducts } = useStore();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setFiltered(
      products.filter(
        (p) =>
          p.name.includes(search) ||
          p.name_en?.includes(search)
      )
    );
  }, [products, search]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("تم حذف المنتج بنجاح");
      refreshProducts();
    } catch {
      toast.error("فشل حذف المنتج");
    }
    setDeleteId(null);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المنتجات</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus className="w-4 h-4" />
          إضافة منتج
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث عن منتج..."
          className="input-field pr-10"
        />
      </div>

      {/* Products table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                <th className="text-right p-4 font-medium">المنتج</th>
                <th className="text-right p-4 font-medium">التصنيف</th>
                <th className="text-right p-4 font-medium">السعر</th>
                <th className="text-right p-4 font-medium">المخزون</th>
                <th className="text-right p-4 font-medium">مميز</th>
                <th className="text-right p-4 font-medium">عرض</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    {search ? "لا توجد نتائج" : "لا توجد منتجات"}
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url || "/images/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.name_en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {product.category?.name || "-"}
                    </td>
                    <td className="p-4 font-bold text-primary-600">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                          : product.stock <= 5
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.is_featured ? (
                        <span className="text-green-500">نعم</span>
                      ) : (
                        <span className="text-gray-400">لا</span>
                      )}
                    </td>
                    <td className="p-4">
                      {product.is_offer ? (
                        <span className="badge-primary">عرض</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">تأكيد الحذف</h3>
            <p className="text-gray-500 text-sm mb-6">هل أنت متأكد من حذف هذا المنتج؟</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                حذف
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
