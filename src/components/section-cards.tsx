import {StatsCard} from "@/components/stats-card";
import {getCheckOutsToday, getNewClients, getNewPets, getTotalServices} from "@/lib/server-utils";


export default async function SectionCards() {
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
        <div
            className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
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
    )
}