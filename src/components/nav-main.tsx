"use client"
import {type LucideIcon} from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,

} from "@/components/ui/sidebar"

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        items?: {
            title: string
            url: string
            icon?: LucideIcon
        }[]
    }[]
}) {
    return (
        <>
            {items.map((item) => (
                <SidebarGroup key={item.title}>
                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                    <SidebarMenu>
                        {item.items?.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                                <SidebarMenuButton tooltip={subItem.title} asChild>
                                    <a href={subItem.url}>
                                        {subItem.icon && <subItem.icon/>}
                                        <span>{subItem.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    )
}