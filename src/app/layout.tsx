import type { Metadata } from "next";
import { JetBrains_Mono, Roboto } from "next/font/google";
import "./globals.css";
import JsonLdSchema from "./components/JsonLdSchema";
import { TelemetryProvider } from "./components/TelemetryProvider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://avilaops.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ávila Ops - Infrastructure That Scales",
    template: "%s | Ávila Ops"
  },
  description: "Transformamos infraestrutura legacy em arquiteturas cloud-native escaláveis. DevOps Engineering, Cloud Architecture e Security Operations de classe mundial.",
  keywords: ["DevOps", "Cloud Architecture", "Azure", "AWS", "Kubernetes", "Infrastructure as Code", "CI/CD", "Automation", "Security Operations", "DevSecOps", "Site Reliability", "Terraform", "Docker"],
  authors: [{ name: "Ávila Ops" }],
  creator: "Ávila Ops",
  publisher: "Ávila Ops",
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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Ávila Ops",
    title: "Ávila Ops - Infrastructure That Scales",
    description: "From chaos to cloud-native. Transformamos sua infraestrutura para máxima performance e eficiência.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ávila Ops - Infrastructure That Scales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ávila Ops - Infrastructure That Scales",
    description: "From chaos to cloud-native. Transformamos sua infraestrutura para máxima performance e eficiência.",
    images: ["/og-image.png"],
    creator: "@avilaops",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "your-google-site-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <JsonLdSchema />
        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10B981" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AvilaOps" />

        {/* Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${roboto.variable} antialiased`}
      >
        <TelemetryProvider>
          {children}
        </TelemetryProvider>
      </body>
    </html>
  );
}
