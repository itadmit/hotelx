import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Hebrew } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  variable: "--font-hebrew",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "HotelX - Digital Guest Service Platform for Hotels",
    template: "%s | HotelX"
  },
  description: "Transform your hotel operations with HotelX - The leading digital guest service platform. QR-code ordering, real-time request management, and smart analytics. Increase guest satisfaction and operational efficiency.",
  keywords: [
    "hotel management system",
    "hotel guest service",
    "QR code hotel ordering",
    "hotel room service app",
    "digital hotel concierge",
    "hotel request management",
    "guest experience platform",
    "hotel operations software",
    "contactless hotel service",
    "hotel technology solution",
    "hotel digitization",
    "hotel automation",
    "guest satisfaction",
    "hotel PMS integration",
    "smart hotel system"
  ],
  authors: [{ name: "HotelX Team" }],
  creator: "HotelX",
  publisher: "HotelX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hotelx.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['he_IL', 'es_ES', 'fr_FR', 'de_DE'],
    url: 'https://hotelx.app',
    siteName: 'HotelX',
    title: 'HotelX - Digital Guest Service Platform for Hotels',
    description: 'Transform your hotel operations with HotelX. QR-code ordering, real-time management, and smart analytics for enhanced guest experience.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HotelX - Digital Guest Service Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HotelX - Digital Guest Service Platform for Hotels',
    description: 'Transform your hotel operations with QR-code ordering, real-time management, and smart analytics.',
    images: ['/og-image.jpg'],
    creator: '@hotelx',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // other: {
    //   'msvalidate.01': 'your-bing-verification-code',
    // },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontHeading.variable} ${fontHebrew.variable} antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
