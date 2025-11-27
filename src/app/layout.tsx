import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Header } from "../components/Header";
import { AlertProvider } from "../context/AlertContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PukPuk - Fertilizer Supply Chain Analytics",
  description: "AI-powered fertilizer supply chain management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <AlertProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </AlertProvider>
        </Providers>
      </body>
    </html>
  );
}
