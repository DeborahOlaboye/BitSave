import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BitSave - Bank on Your Bitcoin",
  description: "Bitcoin-backed banking for everyone. Save, Send, and Spend with Bitcoin-backed MUSD.",
  keywords: ["Bitcoin", "Crypto", "Banking", "MUSD", "Mezo", "DeFi", "Savings", "Remittance"],
  authors: [{ name: "BitSave Team" }],
  openGraph: {
    title: "BitSave - Bank on Your Bitcoin",
    description: "Experience the future of finance with instant transactions, zero fees, and complete self-custody.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
