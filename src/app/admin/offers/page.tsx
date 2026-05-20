"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDateTime } from "@/lib/utils";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    image_url: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      const res = await fetch("/api/offers");
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setForm({ title: "", description: "", discount_percentage: "", image_url: "", start_date: "", end_date: "", is_active: true });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (offer: any) => {
    setForm({
      title: offer.title,
      description: offer.description || "",
      discount_percentage: offer.discount_percentage?.toString() || "",
      image_url: offer.image_url || "",
      start_date: offer.start_date?.slice(0, 10) || "",
      end_date: offer.end_date?.slice(0, 10) || "",
      is_active: offer.is_active,
    });
    setEditId(offer.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.discount_percentage) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        discount_percentage: parseFloat(form.discount_percentage),
      };
      const url = "/api/offers";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      toast.success(editId ? "تم تحديث العرض" : "تم إضافة العرض");
      resetForm();
      loadOffers();
    } catch {
      toast.error("فشل حفظ العرض");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/offers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("تم حذف العرض");
      loadOffers();
    } catch {
      toast.error("فشل حذف العرض");
    }
    setDeleteId(null);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة العروض</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus className="w-4 h-4" /> إضافة عرض
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editId ? "تعديل العرض" : "إضافة عرض جديد"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نسبة الخصم (%) *</label>
                <input type="number" value={form.discount_percentage} onChange={(e) => setForm((p) => ({ ...p, discount_percentage: e.target.value }))} className="input-field" min="0" max="100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رابط الصورة</label>
                <input type="text" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} className="input-field" dir="ltr" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ البداية</label>
                  <input type="date" value={form.start_date} onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ النهاية</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))} className="input-field" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">فعال</span>
              </label>
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

      {/* Offers list */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
              <th className="text-right p-4 font-medium">العنوان</th>
              <th className="text-right p-4 font-medium">الخصم</th>
              <th className="text-right p-4 font-medium">الحالة</th>
              <th className="text-right p-4 font-medium">التاريخ</th>
              <th className="p-4 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {offers.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">لا توجد عروض</td></tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {offer.image_url && <img src={offer.image_url} alt={offer.title} className="w-10 h-10 rounded-lg object-cover" />}
                      <span className="font-medium text-gray-900 dark:text-white">{offer.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="badge-primary">{offer.discount_percentage}%</span>
                  </td>
                  <td className="p-4">
                    {offer.is_active ? (
                      <span className="badge-success">فعال</span>
                    ) : (
                      <span className="badge-danger">غير فعال</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{formatDateTime(offer.created_at)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(offer)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(offer.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
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
            <p className="text-gray-500 text-sm mb-6">هل أنت متأكد من حذف هذا العرض؟</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium">حذف</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-900 py-2.5 rounded-lg font-medium">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
