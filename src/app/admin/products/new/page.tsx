"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronLeft, Loader2, Upload } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { createClient } from "@/lib/supabase-client";
import { Category } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const { categories, refreshProducts } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    name_en: "",
    description: "",
    description_en: "",
    price: "",
    compare_price: "",
    image_url: "",
    category_id: "",
    unit: "كجم",
    min_order: "1",
    stock: "0",
    is_featured: false,
    is_offer: false,
    is_available: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("تم رفع الصورة بنجاح");
    } catch {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category_id) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        min_order: parseInt(form.min_order),
        stock: parseInt(form.stock),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      toast.success("تم إضافة المنتج بنجاح");
      refreshProducts();
      router.push("/admin/products");
    } catch {
      toast.error("فشل إضافة المنتج");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-primary-600">لوحة التحكم</Link>
        <span>/</span>
        <Link href="/admin/products" className="hover:text-primary-600">المنتجات</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">إضافة منتج</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">إضافة منتج جديد</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">معلومات المنتج</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم (عربي) *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم (إنجليزي)</label>
              <input type="text" name="name_en" value={form.name_en} onChange={handleChange} className="input-field" dir="ltr" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف (إنجليزي)</label>
              <textarea name="description_en" value={form.description_en} onChange={handleChange} rows={3} className="input-field resize-none" dir="ltr" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">السعر *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" step="0.01" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">السعر قبل الخصم</label>
              <input type="number" name="compare_price" value={form.compare_price} onChange={handleChange} className="input-field" step="0.01" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوحدة *</label>
              <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
                <option value="كجم">كجم</option>
                <option value="جرام">جرام</option>
                <option value="لتر">لتر</option>
                <option value="حبة">حبة</option>
                <option value="ربطة">ربطة</option>
                <option value="علبة">علبة</option>
                <option value="كرتونة">كرتونة</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التصنيف *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="input-field">
                <option value="">اختر التصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المخزون</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحد الأدنى للطلب</label>
              <input type="number" name="min_order" value={form.min_order} onChange={handleChange} className="input-field" min="1" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">منتج مميز</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_offer" checked={form.is_offer} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">عرض</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">متاح</span>
            </label>
          </div>
        </div>

        {/* Image upload */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">صورة المنتج</h2>
          <div className="flex items-center gap-4">
            <label className="flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-primary-500 transition-colors">
              {form.image_url ? (
                <img src={form.image_url} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">رفع صورة</span>
                    </>
                  )}
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
            {form.image_url && (
              <div className="flex-1">
                <input type="text" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} className="input-field text-xs" placeholder="أو أدخل رابط الصورة" />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</>
            ) : (
              "حفظ المنتج"
            )}
          </button>
          <Link href="/admin/products" className="btn-secondary">إلغاء</Link>
        </div>
      </form>
    </div>
  );
}
