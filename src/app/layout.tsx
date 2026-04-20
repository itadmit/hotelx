import type { Metadata } from "next";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import { ThemeProvider, themeInitScript } from "@/lib/theme";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hotelx.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "HotelX — The Concierge Operating System",
  description:
    "A QR-first guest experience platform. Guests scan, staff respond, managers see everything — beautifully.",
  manifest: "/manifest.json",
  openGraph: {
    title: "HotelX — The Concierge Operating System",
    description:
      "QR concierge for hotels — lift in-room spend, raise your Booking score, cut calls to reception. Live in 48 hours.",
    url: siteUrl,
    siteName: "HotelX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HotelX — The Concierge Operating System",
    description:
      "QR concierge for hotels — lift in-room spend, raise your Booking score, cut calls to reception.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HotelX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} antialiased font-sans bg-background text-foreground`}
      >
        <GoogleAnalytics />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
