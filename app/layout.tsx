import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/session-provider";
import { MusicProvider } from "@/components/music-provider";
import { SelectionClearer } from "@/components/selection-clearer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Our Valentine's Story",
  description: "A liquid gold heart holding treasured memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans antialiased">
        <SessionProvider>
          <MusicProvider>
            <SelectionClearer>
              {children}
              <Toaster />
            </SelectionClearer>
          </MusicProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
