"use client";

import {
  PiBellDuotone,
  PiCaretUpDown,
  PiCoffeeDuotone,
  PiFilesDuotone,
  PiGearSixDuotone,
  PiGlobeDuotone,
  PiHouseDuotone,
  PiSignOutDuotone,
  PiUserCircleDuotone,
  PiUserDuotone,
  PiPlusDuotone,
} from "react-icons/pi";
import { GoIssueOpened } from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession, useUser } from "@/lib/store";

const navigation = [
  { name: "Dashboard", href: "/", icon: PiHouseDuotone },
  { name: "Issues", href: "/issues", icon: GoIssueOpened },
  { name: "Documents", href: "/documents", icon: PiFilesDuotone },
  { name: "Portal", href: "/portal", icon: PiGlobeDuotone },
  { name: "Notifications", href: "/notifications", icon: PiBellDuotone },
  { name: "Profile", href: "/profile", icon: PiUserCircleDuotone },
  { name: "Settings", href: "/settings", icon: PiGearSixDuotone },
];

export function Sidebar({
  ...props
}: React.ComponentProps<typeof ShadcnSidebar>) {
  const pathname = usePathname();
  const user = useUser();
  const { loading } = useSession();
  const { isMobile } = useSidebar();

  if (pathname.startsWith("/auth")) return null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <TooltipProvider delayDuration={300}>
      <ShadcnSidebar variant="inset" {...props}>
        {/* ─── Header / Workspace switcher ─── */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30 text-white">
                      <PiCoffeeDuotone className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                      <span className="truncate font-semibold">Mocha</span>
                      <span className="truncate text-xs text-muted-foreground">
                        Workspace
                      </span>
                    </div>
                    <PiCaretUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
                  align="start"
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-widest">
                    Workspaces
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border-violet-500/30">
                      <PiCoffeeDuotone className="size-4 shrink-0 text-violet-400" />
                    </div>
                    <span className="font-medium">Mocha</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      document.dispatchEvent(
                        new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
                      );
                    }}
                    className="ml-1 h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-lg border border-white/5 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white transition-colors self-center"
                  >
                    <PiPlusDuotone className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Open Actions (⌘K)</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* ─── Navigation ─── */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.name}
                          >
                            <Link href={item.href}>
                              <item.icon
                                className={
                                  isActive
                                    ? "text-violet-400"
                                    : "text-muted-foreground"
                                }
                              />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ─── Footer / User menu ─── */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {loading ? (
                <div className="flex items-center gap-3 px-2 py-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-2.5 w-16 rounded" />
                  </div>
                </div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user.isAdmin ? "Administrator" : "Team Member"}
                        </span>
                      </div>
                      <PiCaretUpDown className="ml-auto size-4 text-muted-foreground" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    {/* User header */}
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-3 px-2 py-2">
                        <Avatar className="h-9 w-9 rounded-lg">
                          <AvatarImage
                            src={user.avatar}
                            alt={user.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {user.email ?? "user@example.com"}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="gap-2">
                        <PiUserDuotone className="size-4 text-muted-foreground" />
                        <span>Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                      <PiSignOutDuotone className="size-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </ShadcnSidebar>
    </TooltipProvider>
  );
}
