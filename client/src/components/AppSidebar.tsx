"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Bell,
  Home,
  Calendar
} from "lucide-react"

import { NavItems } from "@/components/nav-items"
import { NavUser } from "@/components/nav-user"
import { AppBranding } from "@/components/app-branding"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/sidebar"

const data = {
  brand: {
      name: "Itinero",
      logo: GalleryVerticalEnd,
  },
  items: [
    {
      name: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      name: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      name: "Notifications",
      url: "#",
      icon: Bell,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppBranding brand={data.brand} />
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={data.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
