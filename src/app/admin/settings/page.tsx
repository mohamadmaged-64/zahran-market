"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Save, Key, Globe, Mail, Phone, MapPin } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    site_name: "زهران ماركت",
    site_description: "السوق الإلكتروني المتكامل للتسوق",
    phone: "19688",
    email: "info@zahranmarket.com",
    address: "الشرقية ، الزقازيق ، حي الزهور",
    delivery_fee: "15",
    free_delivery_threshold: "200",
    working_hours: "8:00 صباحًا - 12:00 مساءً",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("تم حفظ الإعدادات بنجاح");
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">الإعدادات</h1>

      <div className="max-w-3xl space-y-6">
        {/* General settings */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">الإعدادات العامة</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المتجر</label>
                <input type="text" value={settings.site_name} onChange={(e) => setSettings((p) => ({ ...p, site_name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وصف الموقع</label>
                <input type="text" value={settings.site_description} onChange={(e) => setSettings((p) => ({ ...p, site_description: e.target.value }))} className="input-field" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact settings */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">معلومات الاتصال</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
                <input type="text" value={settings.phone} onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                <input type="email" value={settings.email} onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
              <input type="text" value={settings.address} onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ساعات العمل</label>
              <input type="text" value={settings.working_hours} onChange={(e) => setSettings((p) => ({ ...p, working_hours: e.target.value }))} className="input-field" />
            </div>
          </div>
        </div>

        {/* Delivery settings */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">إعدادات التوصيل</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رسوم التوصيل (ريال)</label>
              <input type="number" value={settings.delivery_fee} onChange={(e) => setSettings((p) => ({ ...p, delivery_fee: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحد الأدنى للتوصيل المجاني (ريال)</label>
              <input type="number" value={settings.free_delivery_threshold} onChange={(e) => setSettings((p) => ({ ...p, free_delivery_threshold: e.target.value }))} className="input-field" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </div>
  );
}
