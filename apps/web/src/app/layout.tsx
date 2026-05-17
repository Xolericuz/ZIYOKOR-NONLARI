import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZIYOKOR NONLARI — Non Marketplace',
  description: '30 xil turdagi eng mazali va sifatli non mahsulotlari. GPS, real-time buyurtma va yetkazib berish.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'ZIYOKOR NONLARI',
    description: 'Non marketplace platformasi',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
