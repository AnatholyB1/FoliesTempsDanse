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
import { Glasses, Leaf, Shirt } from "lucide-react";
import ExcelUploader from "@/components/ui/excel-uploader";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const items: SidebarItem[] = [
  {
    title: "Costumes",
    href: "/costumes",
    icon: <Shirt className={"size-5"} />,
  },
  {
    title: "Accessoires",
    href: "/accessoires",
    icon: <Glasses className={"size-5"} />,
  },
  {
    title: "Saisons",
    href: "/saisons",
    icon: <Leaf className={"size-5"} />,
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
                    <a
                      className={
                        "flex flex-row items-center justify-center gap-2"
                      }
                      href={item.href}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
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
