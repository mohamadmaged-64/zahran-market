"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const { categories, loading, refreshCategories } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", name_en: "", slug: "", image_url: "", description: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ name: "", name_en: "", slug: "", image_url: "", description: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      name_en: cat.name_en || "",
      slug: cat.slug,
      image_url: cat.image_url || "",
      description: cat.description || "",
    });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }
    setSubmitting(true);
    try {
      const url = editId ? "/api/categories" : "/api/categories";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...form } : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      toast.success(editId ? "تم تحديث التصنيف" : "تم إضافة التصنيف");
      refreshCategories();
      resetForm();
    } catch {
      toast.error("فشل حفظ التصنيف");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("تم حذف التصنيف");
      refreshCategories();
    } catch {
      toast.error("فشل حذف التصنيف");
    }
    setDeleteId(null);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة التصنيفات</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus className="w-4 h-4" /> إضافة تصنيف
        </button>
      </div>

      {/* Category form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editId ? "تعديل تصنيف" : "إضافة تصنيف جديد"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم (عربي) *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم (إنجليزي)</label>
                <input type="text" value={form.name_en} onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))} className="input-field" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الرابط المختصر *</label>
                <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="input-field" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رابط الصورة</label>
                <input type="text" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} className="input-field" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="input-field resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editId ? "تحديث" : "إضافة"}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary flex-1">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
              <th className="text-right p-4 font-medium">التصنيف</th>
              <th className="text-right p-4 font-medium">الرابط</th>
              <th className="text-right p-4 font-medium">الوصف</th>
              <th className="p-4 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">لا توجد تصنيفات</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {cat.image_url && (
                        <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{cat.name}</p>
                        <p className="text-xs text-gray-500">{cat.name_en}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400" dir="ltr">/{cat.slug}</td>
                  <td className="p-4 text-gray-500 truncate max-w-[200px]">{cat.description || "-"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
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

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">تأكيد الحذف</h3>
            <p className="text-gray-500 text-sm mb-6">هل أنت متأكد من حذف هذا التصنيف؟</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors">حذف</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-2.5 rounded-lg font-medium transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
