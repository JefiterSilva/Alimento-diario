import React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Alimento Diário | Devocionais Bíblicos Diários",
  description: "Devocionais bíblicos diários para fortalecer sua fé e crescimento espiritual.",
  keywords: ["devocionais bíblicos", "devocional diário", "palavra de Deus"],
  authors: [{ name: "Alimento Diário" }],
  creator: "Alimento Diário",
  publisher: "Alimento Diário",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://alimento-diario.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://alimento-diario.vercel.app',
    siteName: 'Alimento Diário',
    title: 'Alimento Diário | Devocionais Bíblicos Diários',
    description: 'Devocionais bíblicos diários para fortalecer sua fé e crescimento espiritual.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alimento Diário | Devocionais Bíblicos Diários',
    description: 'Devocionais bíblicos diários para fortalecer sua fé e crescimento espiritual.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={playfair.variable}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
