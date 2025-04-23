"use client"

import * as React from "react"
import {
    House, LayoutDashboard, PawPrint, Sun, User,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {KindeUser} from "@kinde-oss/kinde-auth-nextjs/types";
import {TeamSwitcher} from "@/components/team-switcher";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    user: KindeUser<Record<string, any>>;
};

// This is sample data.
const data = {
    teams: [
        {
            name: "Pawramid",
            logo: PawPrint,
            plan: "Enterprise",
        }
    ],
    navMain: [
        {
            title: "Main",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "Clients",
                    url: "/dashboard/clients",
                    icon: User,
                },
                {
                    title: "Pets",
                    url: "/dashboard/pets",
                    icon: PawPrint,
                },
            ],
        },
        {
            title: "Services",
            items: [
                {
                    title: "Boarding",
                    url: "/dashboard/boardings",
                    icon: House,
                },
                {
                    title: "Daycare",
                    url: "/dashboard/daycares",
                    icon: Sun,
                },
            ],
        }
    ],
}

export function AppSidebar({user, ...props}: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
