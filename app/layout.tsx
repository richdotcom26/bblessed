import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const DESCRIPTION =
  "BBLESSED – worship band aus Witten-Herbede. Christen, die Musik machen: Gottesdienste, Kirchentage, Bikergottesdienste, „Happy Birthday Jesus“-Konzerte und Livestreams seit 2004.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bblessed.de"),
  title: {
    default: "BBLESSED – worship band aus Witten-Herbede",
    template: "%s – BBLESSED",
  },
  description: DESCRIPTION,
  keywords: [
    "BBLESSED",
    "Be Blessed",
    "worship band",
    "Worship Band Witten",
    "christliche Band Ruhrgebiet",
    "Lobpreisband",
    "Witten-Herbede",
    "Happy Birthday Jesus Herbede",
    "Bikergottesdienst Band",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "BBLESSED",
    url: "https://www.bblessed.de/",
    title: "BBLESSED – worship band aus Witten-Herbede",
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "BBLESSED – worship band" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBLESSED – worship band aus Witten-Herbede",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "BBLESSED",
  alternateName: ["BBLESSED worship band", "Be Blessed"],
  url: "https://www.bblessed.de/",
  foundingDate: "2004",
  foundingLocation: { "@type": "Place", name: "Witten-Herbede, Deutschland" },
  genre: ["Worship", "Christian Rock", "Pop", "Folk"],
  description: DESCRIPTION,
  image: "https://www.bblessed.de/og.jpg",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${oswald.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
