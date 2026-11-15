import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AmbienceProvider } from "@/context/AmbienceContext";
import { CursorProvider } from "@/context/CursorContext";
import AmbienceSweep from "@/components/AmbienceSweep";
import CustomCursor from "@/components/CustomCursor";
import MotionRootProvider from "@/components/MotionRootProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://verdure.dining"),
  title: "VERDURE — Modern Botanical Restaurant",
  description: "Seasonal plates crafted with quiet precision. 100% botanical cuisine and open-fire craft in a serene architectural atmosphere.",
  keywords: [
    "Verdure",
    "Modern Botanical Kitchen",
    "Seasonal Tasting",
    "Fine Dining",
    "Organic Sourcing",
    "Open Fire Craft",
  ],
  authors: [{ name: "ELEVORA" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "VERDURE — Modern Botanical Restaurant",
    description: "Seasonal plates crafted with quiet precision. 100% botanical cuisine and open-fire craft in a serene architectural atmosphere.",
    url: "https://verdure.dining",
    siteName: "VERDURE",
    images: [
      {
        url: "/images/hero-bowl.jpg",
        width: 1200,
        height: 675,
        alt: "VERDURE Modern Botanical Cuisine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#11261B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased selection:bg-[#1B3B2B] selection:text-[#F4F3EE] overflow-x-hidden min-h-screen">
        <AmbienceProvider>
          <CursorProvider>
            <MotionRootProvider>
              <div className="film-grain-overlay" aria-hidden="true" />
              <CustomCursor />
              <AmbienceSweep />
              {children}
            </MotionRootProvider>
          </CursorProvider>
        </AmbienceProvider>
      </body>
    </html>
  );
}
