import type {Metadata} from "next";
import {ClerkProvider} from "@clerk/nextjs";
import {Geist, Geist_Mono} from "next/font/google";
import {ConvexClientProvider} from "@/providers/ConvexClientProvider";
import Header from "@/components/layout/header";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import AppSidebar from "@/components/layout/app-sidebar"
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/sonner"


import './globals.css'

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"]});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FOLIES TEMPS DANSE",
    description: "A platform for dance enthusiasts",
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen `}
        >
        <ClerkProvider>
            <ConvexClientProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SidebarProvider>
                        <AppSidebar/>
                        <SidebarInset>
                            <main className="grid grow">
                                <Header/>
                                {children}
                            </main>
                            <Toaster/>
                        </SidebarInset>
                    </SidebarProvider>
                </ThemeProvider>
            </ConvexClientProvider>
        </ClerkProvider>
        </body>
        </html>
    );
}
