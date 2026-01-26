import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayoutHandler } from "@/components/layout/AdminLayoutHandler";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Catalogo",
  description: "Genera catálogos de productos de forma rápida y sencilla.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${geistSans.className} antialiased h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <AdminLayoutHandler />
          </Suspense>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
