
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Navbar from "./components/Navbar";
import { Providers } from "./providers";
import { SearchProvider } from "./context/SearchContext";
// TODO: Add auth check logic here if needed
// import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <SearchProvider>
            <Navbar />
            {children}
          </SearchProvider>
        </Providers>
      </body>
    </html>
  );
}
