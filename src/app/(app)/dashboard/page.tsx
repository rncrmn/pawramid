import React from "react";
import {
    checkAuthenticationAndMembership,
    getCheckOutsToday,
    getNewClients,
    getNewPets,
    getTotalServices
} from "@/lib/server-utils";
import {StatsCard} from "@/components/stats-card";
import {redirect} from "next/navigation";

export default async function Page({searchParams}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Authorization check (use on local development)
    // await checkAuthenticationAndMembership();

    // use this live site
    const paymentValueFromUrl = (await searchParams).payment;

    await checkAuthenticationAndMembership(paymentValueFromUrl === "success" ? 5000 : 0)

    if (paymentValueFromUrl === "success") {
        return redirect("/dashboard")
    }

    const [
        totalServices,
        checkOutsToday,
        newClients,
        newPets
    ] = await Promise.all([
        getTotalServices(),
        getCheckOutsToday(),
        getNewClients(),
        getNewPets()
    ])
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div
                    className="flex flex-col justify-center items-center h-[calc(100vh-60px)] gap-4 p-4 md:gap-6 md:p-6">
                    <h1 className="text-3xl font-medium mb-6">Welcome to Pawramid</h1>
                    <div
                        className="max-w-[900px] w-full *:data-[slot=card]:shadow-xs grid grid-cols-1 lg:grid-cols-2  gap-8 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
                        <StatsCard
                            title="Total Services Completed"
                            value={totalServices.current}
                            trend={totalServices.trend}
                            trendLabel="this month"
                            description="Completed boarding and daycare services"
                        />
                        <StatsCard
                            title="Checking-out Today"
                            value={checkOutsToday.current}
                            trend={checkOutsToday.trend}
                            trendLabel="from yesterday"
                            description="Scheduled boarding check-outs"
                        />
                        <StatsCard
                            title="New Clients"
                            value={newClients.current}
                            trend={newClients.trend}
                            trendLabel="this month"
                            description="New client registrations"
                        />
                        <StatsCard
                            title="New Pets"
                            value={newPets.current}
                            trend={newPets.trend}
                            trendLabel="this month"
                            description="New pet registrations"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
