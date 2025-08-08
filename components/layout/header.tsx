"use client";
import {Authenticated, Unauthenticated} from "convex/react";
import {SignInButton, UserButton} from "@clerk/nextjs";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {usePathname} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

function AppBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink className={"text-accent"} href="/">Accueil</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, idx) => (
                    <React.Fragment key={segment}>
                        <BreadcrumbSeparator className={"text-accent"} />
                        <BreadcrumbItem>
                            {idx === segments.length - 1 ? (
                                <BreadcrumbPage className={"text-accent"} >
                                    {decodeURIComponent(segment.replace(/-/g, " "))}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink className={"text-accent"} href={`/${segments.slice(0, idx + 1).join("/")}`}>
                                    {decodeURIComponent(segment.replace(/-/g, " "))}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default function Header() {
    return (
        <header
            className="sticky rounded-t-lg top-0 z-1 flex items-center justify-between px-6 py-3 bg-primary text-foreground shadow-lg border-b border-[var(--border)]"
            style={{ minHeight: "64px", height: "64px" }}
            role="banner"
        >
            <div className="flex items-center justify-center gap-4">
                <SidebarTrigger className={"bg-accent text-primary hover:bg-foreground hover:text-accent"} />
                <AppBreadcrumb />
            </div>
            <nav className="flex items-center gap-4" aria-label="Utilisateur">
                <Unauthenticated>
                    <SignInButton mode="modal">
                        <span className="font-medium text-primary hover:underline">Connexion</span>
                    </SignInButton>
                </Unauthenticated>
                <Authenticated>
                    <UserButton />
                </Authenticated>
            </nav>
        </header>
    );
}