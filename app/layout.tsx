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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bblessed.de"),
  title: {
    default: "BBLESSED – worship band",
    template: "%s – BBLESSED",
  },
  description:
    "BBLESSED – worship band aus Witten-Herbede. Christen, die Musik machen: Gottesdienste, Kirchentage, Bikergottesdienste und Konzerte seit 2004.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${oswald.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
