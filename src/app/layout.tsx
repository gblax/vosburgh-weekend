import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { DayTabs } from "@/components/DayTabs";
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

export const metadata: Metadata = {
  title: "Vosburgh Charleston Weekend",
  description:
    "Itinerary for the Vosburgh family visit to Charleston, May 21–25, 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased">
        <DayTabs />
        <main>{children}</main>
      </body>
    </html>
  );
}
