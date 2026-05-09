"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/roles";
import { useState } from "react";
import { ChevronDown, Truck, UserCheck ,Plane,CalendarCheck, BellIcon } from "lucide-react";

import {
  LayoutDashboard,
  Users,
  UserRound,
  Settings,
  Building2,
  WarehouseIcon,
  ShoppingBasketIcon,
  WalletCardsIcon,
  HistoryIcon,
  FileText
} from "lucide-react";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  feature?: string;          // 👈 from API
  children?: NavItem[];
};


const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    feature: "dashboard",
  },
  {
    href: "/dashboard/customers",
    label: "Customers",
    icon: <UserRound className="h-4 w-4" />,
    feature: "customer",
  },
  {
    href: "/dashboard/staff",
    label: "Staff",
    icon: <Users className="h-4 w-4" />,
    feature: "staff",
  },
  {
  href: "/dashboard/Airlines",
  label: "Airlines",
  icon: <Plane className="h-4 w-4" />,
  feature: "airlines",
  },
  {
  href: "/dashboard/booking",
  label: "Booking",
  icon: <CalendarCheck className="h-4 w-4" />,
  feature: "booking",
  },
    {
    href: "/dashboard/logistics",
    label: "Logistics",
    icon: <Truck className="h-4 w-4" />,
    children: [
      {
        href: "/dashboard/logistics/crew",
        label: "Crew",
        icon: <UserCheck className="h-4 w-4" />,
        feature: "crew",
      },
    ],
  },
  // {
  //   href: "/dashboard/bookings",
  //   label: "Bookings",
  //   icon: <ShoppingBasketIcon className="h-4 w-4" />,
  //   // roles: ["admin", "manager"],
  // },
  // {
  //   href: "/dashboard/vehicles",
  //   label: "Vehicles",
  //   icon: <UserRound className="h-4 w-4" />,
  //   roles: ["admin", "manager"],
  // },
  // {
  //   href: "/dashboard/airlines",
  //   label: "Airlines",
  //   icon: <UserRound className="h-4 w-4" />,
  //   roles: ["admin", "manager"],
  // },
  {
    href: "/dashboard/ratecard",
    label: "Rate Card",
    icon: <FileText className="h-4 w-4" />,
    feature: "manage_ratecard",
  },
  {
    href: "/dashboard/cities",
    label: "Cities",
    icon: <HistoryIcon className="h-4 w-4" />,
    feature: "manage_cities",
  },
    {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: <BellIcon className="h-4 w-4" />,
    feature: "manage_notifications",
  },

 

  // {
  //   href: "/dashboard/rate-card",
  //   label: "Rate Card",
  //   icon: <WalletCardsIcon className="h-4 w-4" />,
  //   roles: ["admin", "manager"],
  // },

  // ✅ RBAC (parent)
  {
    href: "/dashboard/rbac",
    label: "RBAC",
    icon: <WalletCardsIcon className="h-4 w-4" />,
    feature: "role_and_permission",
    children: [
      {
        href: "/dashboard/rbac/admin",
        label: "Admin",
        icon: <UserRound className="h-4 w-4" />,
        feature: "admin",
      },
      {
        href: "/dashboard/rbac/roles-permission",
        label: "Roles & Permissions",
        icon: <UserRound className="h-4 w-4" />,
        feature: "role_and_permission",
      },
      {
        href: "/dashboard/rbac/feature",
        label: "Feature",
        icon: <UserRound className="h-4 w-4" />,
        feature: "role_and_permission",
      },
    ],
  },
  {
    href: "/dashboard/systemslog",
    label: "System",
    icon: <Settings className="h-4 w-4" />,
    feature: "settings",
     children: [
      {
        href: "/dashboard/systemslog/settings",
        label: "Settings",
        icon: <UserRound className="h-4 w-4" />,
        feature: "settings",
      },
      {
        href: "/dashboard/systemslog/system-log",
        label: "System-log",
        icon: <UserRound className="h-4 w-4" />,
        feature: "settings",
      },
    ]
    
  },
];

// export function Sidebar(
//   // { role }: { role: UserRole }
//   { permissions }: { permissions: PermissionMap }
// ) {
export function Sidebar({
  permissions,
}: {
  permissions: PermissionMap;
}) {

  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))};

    const canViewItem = (item: NavItem) => {
      if (!item.feature) return true;
        return can(permissions, item.feature, "view");
    };
  

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-6 dark:border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">Dropty CRM</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {/* {NAV_ITEMS.filter((i) => !i.roles || i.roles.includes(role)).map( */}
        {NAV_ITEMS.filter(canViewItem).map((item) => {
          // (item) => {
            const isOpen = openMenus[item.label];

            // ✅ Parent with children (Staff)
            // if (item.children) {
            //   return (
            //     <div key={item.label} className="space-y-1">
            //       {/* Parent button */}
            //       <button
            //         onClick={() => toggleMenu(item.label)}
            //         className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            //       >
            //         <div className="flex items-center gap-3">
            //           {item.icon}
            //           <span>{item.label}</span>
            //         </div>

            //         <ChevronDown
            //           className={cn(
            //             "h-4 w-4 transition-transform duration-200",
            //             isOpen && "rotate-180"
            //           )}
            //         />
            //       </button>

            //       {/* Children (collapsed by default) */}
            //       {isOpen && (
            //         <div className="relative ml-4 space-y-1 border-l border-zinc-200 pl-4 dark:border-zinc-800">
            //           {item.children.map((child) => {
            //             const active = pathname === child.href;

            //             return (
            //               <Link
            //                 key={child.href}
            //                 href={child.href!}
            //                 className={cn(
            //                   "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            //                   active
            //                     ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
            //                     : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            //                 )}
            //               >
            //                 <span>{child.label}</span>
            //               </Link>
            //             );
            //           })}
            //         </div>
            //       )}
            //     </div>
            //   );
            // }

            if (item.children) {
              const visibleChildren = item.children.filter(canViewItem);

              // ❗ hide parent if no child is visible
              if (!visibleChildren.length) return null;

              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>

                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openMenus[item.label] && "rotate-180"
                      )}
                    />
                  </button>

                  {openMenus[item.label] && (
                    <div className="ml-4 space-y-1 border-l pl-4">
                      {visibleChildren.map((child) => {
                        const active = pathname === child.href;

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                              active
                                ? "bg-zinc-100 dark:bg-zinc-800"
                                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                          >
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            if (!canViewItem(item)) return null;

            // ✅ Normal menu item
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          }
        )}
      </nav>
      
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-xs text-center text-zinc-400">© 2026 Dropty</p>
      </div>
    </aside>
  );
}
