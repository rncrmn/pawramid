"use client"

import * as React from "react"

import {
    DropdownMenu
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

export function TeamSwitcher({
                                 teams,
                             }: {
    teams: {
        name: string
        logo: React.ElementType
    }[]
}) {
    const [activeTeam] = React.useState(teams[0])

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        asChild
                    >
                        <Link href="/dashboard">
                            <div
                                className="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <activeTeam.logo className="size-4"/>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium text-xl">
                                  {activeTeam.name}
                                </span>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
