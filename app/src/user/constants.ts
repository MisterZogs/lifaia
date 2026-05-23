import { LayoutDashboard, Settings, Shield } from "lucide-react";
import { routes } from "wasp/client/router";

// Les noms sont des clés i18n traduites dans UserMenuItems/UserDropdown via t(item.name)
export const userMenuItems = [
  {
    name: "my_assistant",
    to: routes.ChatRoute.to,
    icon: LayoutDashboard,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "account_settings",
    to: routes.AccountRoute.to,
    icon: Settings,
    isAuthRequired: false,
    isAdminOnly: false,
  },
  {
    name: "admin",
    to: routes.AdminRoute.to,
    icon: Shield,
    isAuthRequired: false,
    isAdminOnly: true,
  },
] as const;
