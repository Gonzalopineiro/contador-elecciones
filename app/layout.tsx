import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { PWAProvider } from "./components/PWAProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contador Elecciones",
  description: "Aplicación para contar resultados de elecciones",
  manifest: "/manifest.json",
  themeColor: "#4ade80",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Contador Elecciones",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Contador Elecciones",
    title: "Contador Elecciones",
    description: "Aplicación para contar resultados de elecciones",
  },
  twitter: {
    card: "summary",
    title: "Contador Elecciones",
    description: "Aplicación para contar resultados de elecciones",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
