import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// -------------------------------------------------------------------------------------------------
// Font
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// -------------------------------------------------------------------------------------------------
// Metadata
export const metadata: Metadata = {
  title: "DealHive",
  description: "Give your customers a better deal.",
};

// -------------------------------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
