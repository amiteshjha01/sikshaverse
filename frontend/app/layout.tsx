import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SikshaVerse | Learn, Build, Grow",
  description: "A premium educational platform for developers and learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
