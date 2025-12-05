import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
  weight: "400", // Fallback or specific weight if variable font fails
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cheapestgpu.com'),
  title: {
    default: "cheapestGPU - The Internet's Cheapest GPU Marketplace",
    template: "%s | cheapestGPU"
  },
  description: "Track, compare, and deploy GPUs at the best prices. Real-time pricing from top providers like Lambda, RunPod, and more. Compute shouldn't cost a kidney.",
  keywords: ["GPU pricing", "cloud GPU", "H100 price", "A100 price", "cheap GPU comparison", "AI compute", "GPU marketplace"],
  authors: [{ name: "cheapestGPU Team" }],
  creator: "cheapestGPU",
  publisher: "cheapestGPU",
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cheapestgpu.com',
    title: "cheapestGPU - The Internet's Cheapest GPU Marketplace",
    description: "Track, compare, and deploy GPUs at the best prices. Real-time GPU pricing comparison.",
    siteName: 'cheapestGPU',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'cheapestGPU - The Internet\'s Cheapest GPU Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "cheapestGPU - The Internet's Cheapest GPU Marketplace",
    description: "Track, compare, and deploy GPUs at the best prices. Compute shouldn't cost a kidney.",
    images: ['/og-image.png'],
    creator: '@cheapestgpu',
  },
  icons: {
    icon: '/favicon-square.png',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "cheapestGPU",
  "url": "https://cheapestgpu.com",
  "description": "Track, compare, and deploy GPUs at the best prices.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://cheapestgpu.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pixelifySans.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
