"use client"

import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"

import { NavMain } from "@/components/nav-main"
import { adminAndManagerRoles, adminOnlyRoles, allRoles, hasRoleAccess } from "@/lib/admin-roles"
import { authClient } from "@/lib/auth-client"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  ClipboardListIcon,
  ContactIcon,
  ImagesIcon,
  InboxIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react"

const data = {
  app: {
    name: "Baseplate Admin",
    initial: "B",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      allowedRoles: allRoles,
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Users",
      url: "/users",
      allowedRoles: adminOnlyRoles,
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Leads",
      url: "/leads",
      allowedRoles: adminAndManagerRoles,
      icon: (
        <InboxIcon
        />
      ),
    },
    {
      title: "Contacts",
      url: "/contacts",
      allowedRoles: adminAndManagerRoles,
      icon: (
        <ContactIcon
        />
      ),
    },
    {
      title: "Blog",
      url: "/blog",
      allowedRoles: adminOnlyRoles,
      icon: (
        <NewspaperIcon
        />
      ),
    },
    {
      title: "Media",
      url: "/media",
      allowedRoles: adminAndManagerRoles,
      icon: (
        <ImagesIcon
        />
      ),
    },
    {
      title: "Activity",
      url: "/activity",
      allowedRoles: adminOnlyRoles,
      icon: (
        <ClipboardListIcon
        />
      ),
    },
    {
      title: "Settings",
      url: "/settings",
      allowedRoles: allRoles,
      icon: (
        <Settings2Icon
        />
      ),
    },
  ],
}

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1)
  }

  return pathname
}

function isNavItemActive(pathname: string, itemUrl: string) {
  const normalizedPathname = normalizePathname(pathname)
  const normalizedItemUrl = normalizePathname(itemUrl)

  if (normalizedItemUrl === "/dashboard") {
    return normalizedPathname === normalizedItemUrl
  }

  return normalizedPathname === normalizedItemUrl || normalizedPathname.startsWith(`${normalizedItemUrl}/`)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { data: session } = authClient.useSession()
  const navMain = data.navMain
    .filter((item) => hasRoleAccess(session?.user.role, item.allowedRoles))
    .map((item) => ({
      ...item,
      isActive: isNavItemActive(pathname, item.url),
    }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={data.app.name}
            >
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="font-serif text-lg font-semibold leading-none">{data.app.initial}</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">{data.app.name}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
