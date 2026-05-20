import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("EGP")} ج.م`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function getDiscountPercentage(price: number, comparePrice: number): number {
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0621-\u064A\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZHR-${timestamp}-${random}`;
}

export const ORDER_STATUS_OPTIONS: {
  value: string;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "قيد الانتظار", color: "badge-warning" },
  { value: "confirmed", label: "تم التأكيد", color: "badge-primary" },
  { value: "preparing", label: "قيد التحضير", color: "badge-primary" },
  { value: "shipped", label: "تم الشحن", color: "badge-primary" },
  { value: "delivered", label: "تم التوصيل", color: "badge-success" },
  { value: "cancelled", label: "ملغي", color: "badge-danger" },
];

export const PAYMENT_METHODS = [
  { value: "cash", label: "الدفع عند الاستلام" },
  { value: "card", label: "بطاقة ائتمان / فيزا" },
  { value: "pickup", label: "استلام من المتجر" },
];
