import type { Metadata } from "next";
import "./globals.css";
import { Inter, Syne, Instrument_Serif } from "next/font/google";
import ConditionalHeader from "@/components/headers/ConditionalHeader";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "MedBlend",
  description: "MedBlendApp - The Future of Medical Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <RevealOnScroll />
        <ConditionalHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
