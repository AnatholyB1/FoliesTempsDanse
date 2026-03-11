import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {FileMusic, Glasses, Leaf, Proportions, Shirt, User2, UserCheck} from "lucide-react";
import Link from "next/link";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const items: SidebarItem[] = [
  {
    title: "Costumes",
    href: "/costumes",
    icon: <Shirt className="w-4 h-4" />,
  },
  {
    title: "Accessoires",
    href: "/accessoires",
    icon: <Glasses className="w-4 h-4" />,
  },
  {
    title: "Utilisateurs",
    href: "/users",
    icon: <UserCheck className="w-4 h-4" />,
  },
  {
    title: "Saisons",
    href: "/saisons",
    icon: <Leaf className="w-4 h-4" />,
  },
  {
    title: "Blocs",
    href: "/blocs",
    icon: <Proportions className="w-4 h-4" />,
  },
  {
    title: "Tableaux",
    href: "/tableaux",
    icon: <FileMusic className="w-4 h-4" />,
  },
];

const profileItem: SidebarItem = {
  title: "Mon profil",
  href: "/mon-profil",
  icon: <User2 className="w-4 h-4" />,
};

export default function AppSidebar() {
  return (
    <Sidebar variant={"inset"}>
      {/* ── Brand header ───────────────────────────────────── */}
      <SidebarHeader className="py-5 px-4">
        <Link href="/" className="group flex flex-col gap-0.5 select-none">
          <span
            className="text-lg font-bold leading-tight text-sidebar-foreground group-hover:text-primary transition-colors"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            les Folies
          </span>
          <span
            className="text-lg font-bold leading-tight text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Temps&apos;Danse
          </span>
          {/* Gold decorative line */}
          <span
            className="mt-1.5 block h-px w-10 rounded-full transition-all group-hover:w-full duration-500"
            style={{ background: "var(--gold)" }}
            aria-hidden
          />
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Navigation ─────────────────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs tracking-widest uppercase text-muted-foreground/70 font-medium px-2 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className="flex flex-row items-center gap-3 text-sidebar-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-primary">{item.icon}</span>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="py-4 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={profileItem.href}
                className="flex flex-row items-center gap-3 text-sidebar-foreground hover:text-primary transition-colors"
              >
                <span className="text-primary">{profileItem.icon}</span>
                <span className="font-medium">{profileItem.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="my-1" />
        <div className="flex flex-col gap-1 px-1">
          <Link
            href="/mentions-legales"
            className="text-xs text-muted-foreground/60 hover:text-primary transition-colors px-2 py-0.5 rounded"
          >
            Mentions légales
          </Link>
          <Link
            href="/politique-de-confidentialite"
            className="text-xs text-muted-foreground/60 hover:text-primary transition-colors px-2 py-0.5 rounded"
          >
            Confidentialité
          </Link>
          <Link
            href="/condition-d-utilisation"
            className="text-xs text-muted-foreground/60 hover:text-primary transition-colors px-2 py-0.5 rounded"
          >
            CGU
          </Link>
        </div>
        <p
          className="text-xs text-muted-foreground/50 text-center tracking-wide mt-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          © {new Date().getFullYear()} Folies Temps&apos;Danse
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
