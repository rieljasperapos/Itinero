"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  Home,
  Calendar,
  Bell,
  Map
} from "lucide-react";

import { NavItems } from "@/components/sidebar/nav-items";
import { NavUser } from "@/components/sidebar/nav-user";
import { AppBranding } from "@/components/sidebar/app-branding";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.accessToken}`,
            },
          }
        );
        setUnreadCount(response.data.data || 0); // Default to 0 if no data
      } catch (error) {
        console.error("Error fetching notifications count:", error);
      }
    };

    if (session?.user.accessToken) {
      fetchNotificationsCount();
    }
  }, [session?.user.accessToken]);

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
        name: `Notifications (${unreadCount})`, // Append count here
        url: "/notification",
        icon: Bell,
      },
      {
        name: `Map`,
        url: "/map",
        icon: Map
      },
    ],
  };

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
  );
}
