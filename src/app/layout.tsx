import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SplashScreen } from "@/components/pwa/SplashScreen";
import { PWARegister } from "@/components/pwa/PWARegister";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#c9a227",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cagemind.ai"),
  title: "CageMind AI | UFC & MMA Analytics Platform",
  description: "Leverage automated data, live fight odds, and AI-driven prediction models to gain an edge.",
  keywords: ["UFC", "MMA", "AI Predictions", "Fight Odds", "Sports Betting", "CageMind AI"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CageMind AI",
    startupImage: [
      // iPhone SE / 5 (320x568)
      { url: "/icons/splash/splash-640x1136.png", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" },
      // iPhone 8 / 7 / 6s (375x667)
      { url: "/icons/splash/splash-750x1334.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
      // iPhone 8 Plus (414x736)
      { url: "/icons/splash/splash-1242x2208.png", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" },
      // iPhone X / XS / 11 Pro (375x812)
      { url: "/icons/splash/splash-1125x2436.png", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
      // iPhone XS Max / 11 Pro Max (414x896)
      { url: "/icons/splash/splash-1242x2688.png", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" },
      // iPhone 12 / 13 / 14 (390x844)
      { url: "/icons/splash/splash-1170x2532.png", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" },
      // iPhone 14 Pro / 15 (393x852)
      { url: "/icons/splash/splash-1179x2556.png", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
      // iPhone 14 Pro Max / 15 Plus (430x932)
      { url: "/icons/splash/splash-1290x2796.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
      // iPad Mini (768x1024)
      { url: "/icons/splash/splash-1536x2048.png", media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" },
      // iPad Pro 11" (834x1194)
      { url: "/icons/splash/splash-1668x2388.png", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" },
      // iPad Pro 12.9" (1024x1366)
      { url: "/icons/splash/splash-2048x2732.png", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CageMind AI | Predictive MMA Analytics",
    description: "The world's most advanced AI prediction engine for MMA.",
    url: "https://cagemind.ai",
    siteName: "CageMind AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CageMind AI Dashboard",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CageMind AI",
    description: "AI-driven UFC predictions and analytics.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.png" },
    ],
    shortcut: "/favicon.png",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <SplashScreen />
        <PWARegister />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

