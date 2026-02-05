import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Valentine's Gallery | Our Story",
  description: "Explore our treasured memories together in this interactive valentine's gallery. A collection of our most precious moments.",
  keywords: ["valentine", "memories", "love story", "gallery", "relationship"],
  authors: [{ name: "Eternal Flames" }],
  openGraph: {
    title: "Our Valentine's Story",
    description: "A beautiful collection of our most precious moments together",
    type: "website",
    locale: "en_US",
    siteName: "Eternal Flames",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Valentine's Story",
    description: "A beautiful collection of our most precious moments together",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ValentineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
