import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/Navigation";
// Removed providers for simplicity
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RealeAgent - AI-Powered Real Estate",
  description: "Streamline your real estate transactions with AI-powered document generation",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RealeAgent",
  },
  openGraph: {
    title: "RealeAgent - AI-Powered Real Estate",
    description: "Streamline your real estate transactions with AI-powered document generation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealeAgent",
    description: "AI-powered real estate transaction assistant",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1976D2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
        suppressHydrationWarning
      >
        {/* Navigation will be added per-page to avoid conflicts with existing headers */}
        {children}
      </body>
    </html>
  );
}
