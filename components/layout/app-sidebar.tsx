import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {FileMusic, Glasses, Leaf, Proportions, Shirt, UserCheck} from "lucide-react";
import ExcelUploader from "@/components/ui/excel-uploader";
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
    icon: <Shirt className="w-4 h-4 text-primary" />,
  },
  {
    title: "Accessoires",
    href: "/accessoires",
    icon: <Glasses className="w-4 h-4 text-primary" />,
  },
  {
    title: "Utilisateurs",
    href: "/users",
    icon: <UserCheck className="w-4 h-4 text-primary" />,
  },
  {
    title: "Saisons",
    href: "/saisons",
    icon: <Leaf className="w-4 h-4 text-primary" />,
  },
  {
    title: "Tableaux",
    href: "/tableaux",
    icon: <Proportions className="w-4 h-4 text-primary" />,
  },
  {
    title: "Chorégraphies",
    href: "/choregraphies",
    icon: <FileMusic className="w-4 h-4 text-primary" />,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar variant={"inset"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <Link
                      className={
                        "flex flex-row items-center justify-center gap-2"
                      }
                      href={item.href}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <ExcelUploader />
      </SidebarFooter>
    </Sidebar>
  );
}