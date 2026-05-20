import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import "./globals.css";
import ClientLayout from "./client-layout";
import { icon } from "leaflet";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Zahran Market`,
    template: `%s | ${SITE_NAME}`,
  },
  icons: "/logo.png",
  description: SITE_DESCRIPTION,
  keywords: ["زهران ماركت", "تسوق", "سوبر ماركت", "مواد غذائية", "توصيل", "الزقازيق", "الشرقية"],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#dc2626" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
