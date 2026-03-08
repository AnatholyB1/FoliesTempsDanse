import type {Metadata} from "next";
import {ClerkProvider} from "@clerk/nextjs";
import {Geist, Geist_Mono, Playfair_Display} from "next/font/google";
import {ConvexClientProvider} from "@/providers/ConvexClientProvider";
import Header from "@/components/layout/header";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import AppSidebar from "@/components/layout/app-sidebar"
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/sonner"


import './globals.css'
import {SearchProvider} from "@/components/global-search";

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"]});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "les Folies Temps'Danse",
  description: "Application de gestion des costumes et accessoires",
  keywords: ["costumes", "accessoires", "gestion", "danse", "folies temps danse"],
  authors: [{name: "Folies Temps'Danse", url: "https://www.folies-temps-danse.com"}],
  creator: "Folies Temps'Danse",
  openGraph: {
    title: "les Folies Temps'Danse",
    description: "Application de gestion des costumes et accessoires",
    url: "https://www.lesfoliestempsdanse.com",
    siteName: "Folies Temps'Danse",
    images: [
      {
        url: "/icon.ico",
        width: 1200,
        height: 630,
        alt: "Folies Temps'Danse - Gestion des costumes et accessoires",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/icon.ico",
    apple: "/icon.ico",
    shortcut: "/icon.ico",
  },
};


export default function RootLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased flex flex-col min-h-screen `}
    >
    <ClerkProvider telemetry={{ disabled: true }}>
      <ConvexClientProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SearchProvider>
            <SidebarProvider defaultOpen={false}>
              <AppSidebar/>
              <SidebarInset>
                <Header/>
                {children}
                <Toaster/>
              </SidebarInset>
            </SidebarProvider>
          </SearchProvider>
        </ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
    </body>
    </html>
  );
}
