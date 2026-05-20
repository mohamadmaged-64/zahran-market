"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2 } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS, SITE_NAME } from "@/lib/constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("تم إرسال رسالتك بنجاح");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("حدث خطأ. حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>الرئيسية</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">اتصل بنا</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">اتصل بنا</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact form */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">أرسل لنا رسالة</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="اسمك" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="example@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الجوال</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="05xxxxxxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموضوع *</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="input-field">
                  <option value="">اختر الموضوع</option>
                  <option value="طلب">طلب منتج</option>
                  <option value="شكوى">شكوى</option>
                  <option value="اقتراح">اقتراح</option>
                  <option value="استفسار">استفسار</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الرسالة *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="input-field resize-none"
                placeholder="اكتب رسالتك هنا..."
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</>
              ) : (
                <><Send className="w-4 h-4" /> إرسال الرسالة</>
              )}
            </button>
          </form>
        </div>

        {/* Contact info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">معلومات الاتصال</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">الهاتف</p>
                  <a href={`tel:${CONTACT_INFO.phone}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">العنوان</p>
                  <p className="font-medium text-gray-900 dark:text-white">{CONTACT_INFO.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ساعات العمل</p>
                  <p className="font-medium text-gray-900 dark:text-white">{CONTACT_INFO.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
