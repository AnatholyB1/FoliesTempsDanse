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
import Link from "next/link";
import {User2} from "lucide-react";


function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            href="/"
          >
            Accueil
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, idx) => (
          <React.Fragment key={segment}>
            <BreadcrumbSeparator className="text-primary-foreground/40" />
            <BreadcrumbItem>
              {idx === segments.length - 1 ? (
                <BreadcrumbPage className="text-primary-foreground font-medium">
                  {decodeURIComponent(segment.replace(/-/g, " "))}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  href={`/${segments.slice(0, idx + 1).join("/")}`}
                >
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
      className="sticky top-0 z-50 flex items-center justify-between px-5 bg-primary text-primary-foreground shadow-md"
      style={{
        minHeight: "64px",
        height: "64px",
        borderBottom: "2px solid var(--gold)",
      }}
      role="banner"
    >
      {/* Left: trigger + brand/breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15 rounded-md transition-colors" />

        {/* Divider */}
        <span className="h-5 w-px bg-primary-foreground/25" aria-hidden />

        {/* Brand name — hidden on small screens, shown alongside breadcrumb on md+ */}
        <span
          className="hidden md:inline-block text-primary-foreground/90 font-semibold tracking-wider text-sm select-none"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          les Folies Temps&apos;Danse
        </span>

        {/* Divider */}
        <span className="hidden md:inline-block h-5 w-px bg-primary-foreground/25" aria-hidden />

        <AppBreadcrumb />
      </div>

      {/* Right: auth */}
      <nav className="flex items-center gap-3" aria-label="Utilisateur">
        <Unauthenticated>
          <SignInButton mode="modal">
            <span className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:cursor-pointer transition-colors border border-primary-foreground/30 hover:border-primary-foreground/60 rounded px-3 py-1">
              Connexion
            </span>
          </SignInButton>
        </Unauthenticated>
        <Authenticated>
          <Link
            href="/mon-profil"
            className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors border border-primary-foreground/20 hover:border-primary-foreground/50 rounded px-2.5 py-1"
          >
            <User2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mon profil</span>
          </Link>
          <UserButton />
        </Authenticated>
      </nav>
    </header>
  );
}
