"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronRight, Bell, ChevronDown } from "lucide-react";
import type { UserRole } from "@/lib/roles";
import { LogoutButton } from "@/components/logout-button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Topbar({
  name,
  email,
  role,
}: {
  name?: string | null;
  email?: string | null;
  role: UserRole;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const NON_CLICKABLE_SEGMENTS = ["logistics", "rbac"];

  // Generate breadcrumbs from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    const isClickable = !NON_CLICKABLE_SEGMENTS.includes(segment);

    return {
      label:
        segment === "dashboard"
          ? "Home"
          : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href,
      isLast,
      isClickable,
    };
  });


  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          {breadcrumbs.length === 0 ? (
            <span className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
              Home
            </span>
          ) : (
            breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <ChevronRight className="mx-2 h-4 w-4" />}
                {crumb.isClickable && !crumb.isLast ? (
                  <Link
                    href={crumb.href}
                    className="font-medium text-zinc-500 transition-colors hover:text-zinc-900 hover:underline dark:hover:text-zinc-50"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      crumb.isLast
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500"
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </nav>

      {/* Mobile Title (visible if breadcrumbs hidden or mobile) */}
      <div className="md:hidden font-semibold text-zinc-900 dark:text-zinc-50">
        Dropty CRM
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications (Placeholder) */}
        <button className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          {/* Profile Icon Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground dark:bg-zinc-50 dark:text-zinc-900">
              <span className="text-xs font-bold">
                {name?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                {name ?? "User"}
              </p>
              <p className="text-[10px] text-zinc-500 capitalize">{role}</p>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-zinc-400 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                  {name ?? "User"}
                </p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{email}</p>
              </div>

              <div className="p-1">
                <div className="mb-1 px-2 py-1.5 text-xs font-medium text-zinc-400">
                  Settings
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </div>
                <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800"></div>

                <LogoutButton>
                  <div className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </div>
                </LogoutButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}