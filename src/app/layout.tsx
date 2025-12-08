import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import Script from "next/script";
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
    default: "cheapestGPU - Enterprise GPU Cloud Pricing Comparison & Cost Optimization",
    template: "%s | cheapestGPU"
  },
  description: "Real-time GPU pricing comparison across 15+ cloud providers. Compare H100, A100, RTX 4090 rental costs for LLM training, ML inference, and AI development. Save up to 80% on GPU compute infrastructure for enterprise AI workloads.",
  keywords: [
    "GPU pricing comparison",
    "cloud GPU rental",
    "H100 gpu price",
    "A100 gpu cost",
    "enterprise gpu cloud",
    "LLM training gpu",
    "machine learning infrastructure",
    "AI compute pricing",
    "gpu cost optimization",
    "ML gpu rental",
    "cloud gpu for machine learning",
    "h100 vs a100 pricing",
    "cheapest gpu provider",
    "gpu rental for startups",
    "AI infrastructure cost",
    "spheron gpu pricing",
    "runpod pricing",
    "vast.ai comparison",
    "lambda labs gpu",
    "aws gpu vs cloud alternatives",
    "reduce ai compute costs",
    "gpu inference pricing"
  ],
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
    title: "cheapestGPU - Enterprise GPU Cloud Pricing Comparison & Cost Optimization",
    description: "Real-time GPU pricing comparison across 15+ providers. Compare H100, A100, RTX GPUs for LLM training and ML workloads. Save up to 80% on AI infrastructure costs.",
    siteName: 'cheapestGPU',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'cheapestGPU - GPU Cloud Pricing Comparison Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "cheapestGPU - Enterprise GPU Pricing Comparison",
    description: "Compare H100, A100, and RTX GPU rental prices across 15+ cloud providers. Optimize AI infrastructure costs for LLM training and machine learning workloads.",
    images: ['/og-image.png'],
    creator: '@cheapestgpu',
  },
  icons: {
    icon: '/favicon-square.png',
  },
  manifest: '/manifest.json',
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4T4KBTMFYQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4T4KBTMFYQ');
          `}
        </Script>
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
