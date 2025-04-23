import {AppSidebar} from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import React from "react";
import {Toaster} from "@/components/ui/sonner";
import DashboardHeader from "@/components/dashboard-header";
import {cookies} from "next/headers";
import {checkAuthenticationAndMembership} from "@/lib/server-utils";

export default async function Layout({children,}: Readonly<{ children: React.ReactNode; }>) {
    // Authentication check
    const user = await checkAuthenticationAndMembership();

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar user={user}/>
                <SidebarInset>
                    <DashboardHeader/>
                    {children}
                </SidebarInset>
            </SidebarProvider>
            <Toaster position="top-right"/>
        </>
    )
}
