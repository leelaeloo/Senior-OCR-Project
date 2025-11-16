import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const chironGoRound = localFont({
  src: "../components/fonts/ChironGoRoundTC-VariableFont_wght.ttf",
  variable: "--font-chiron-go-round",
  display: "swap",
});

export const metadata: Metadata = {
  title: "읽어드림",
  description: "어르신을 위한 똑똑한 안경",
  manifest: "/manifest.json",
  themeColor: "#fbbf24",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "읽어드림",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={chironGoRound.variable}>
      <body className={`bg-gray-50 ${chironGoRound.className}`}>{children}</body>
    </html>
  );
}
