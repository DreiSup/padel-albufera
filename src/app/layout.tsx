import type { Metadata } from "next";
import { Barlow_Condensed, Instrument_Sans } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pádel & Pickleball Albufera | Construcción de pistas llave en mano",
  description:
    "Construimos tu pista de pádel o pickleball llave en mano. 17 años de obra deportiva, garantía de 10 años. España, Francia, Alemania y Bélgica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${instrumentSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
