import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { DayTabs } from "@/components/DayTabs";
import { IOSInstallPrompt } from "@/components/IOSInstallPrompt";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a475d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Vosburgh Charleston Weekend",
  description:
    "Itinerary for the Vosburgh family visit to Charleston, May 21–25, 2026.",
  applicationName: "Charleston",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Charleston",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <DayTabs />
        <main>{children}</main>
        <IOSInstallPrompt />
      </body>
    </html>
  );
}
