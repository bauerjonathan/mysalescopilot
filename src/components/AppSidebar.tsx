import { Headphones, Building2, Mic } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { title: t("nav.newSession"), url: "/app", icon: Mic },
    { title: t("nav.myCompany"), url: "/app/firma", icon: Building2 },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <Headphones className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Sales<span className="text-primary">Copilot</span>
          </span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">{t("nav.navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <NavLink to={item.url} end className="text-sidebar-foreground/80" activeClassName="text-sidebar-foreground font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
