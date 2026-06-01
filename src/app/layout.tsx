import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "highlight.js/styles/github-dark.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ivan Leo",
  description: "Personal blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-white text-[#282828] flex flex-col">
        {/* Global Minimal Navigation */}
        <header className="max-w-[660px] w-full mx-auto px-6 pt-10 pb-4 flex justify-between items-baseline">
          <Link href="/" className="font-sans text-[15px] font-semibold text-[#282828] no-underline hover:text-[#676767] transition-colors">
            Ivan Leo
          </Link>
          <Link href="/blog" className="font-sans text-[14px] font-medium text-[#676767] no-underline hover:text-[#282828] transition-colors">
            /blog
          </Link>
        </header>

        {/* Content */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MM8QMY5JWN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MM8QMY5JWN');
          `}
        </Script>
      </body>
    </html>
  );
}
