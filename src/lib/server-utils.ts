import "server-only";
import {prisma} from "@/lib/prisma";
import {Status} from "@prisma/client";
import {endOfMonth, endOfToday, startOfMonth, startOfToday, subDays, subMonths} from "date-fns";
import {calculateTrend} from "@/lib/utils";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";

/** get user **/
export async function getUser() {
    const {getUser} = getKindeServerSession();
    return await getUser();
}

async function getQueryWithStatusFilter({
                                            status = '',
                                            page = 1,
                                            entries = 10,
                                            userId
                                        }: {
    status?: string;
    page?: number;
    entries?: number;
    userId: string;
}) {
    // Calculate pagination values
    const skip = (page - 1) * entries;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any = {userId};

    if (status && status !== '') {
        // Ensure we're using a valid Status enum value
        where.status = Status[status.toUpperCase() as keyof typeof Status];
    } else {
        // If no status is provided, exclude "COMPLETED" boardings
        where.status = {not: Status.COMPLETED};
    }

    return {
        where,
        skip,
        take: entries,
        orderBy: {createdAt: 'desc' as const}
    };
}


/** clients **/
export async function getQueryClients({
                                          search = '',
                                          page = 1,
                                          entries = 10
                                      }: {
    search?: string;
    page?: number;
    entries?: number;
} = {}) {
    // Get user
    const user = await getUser();

    // Calculate pagination values
    const skip = (page - 1) * entries;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {userId: user.id}; // Base condition
    if (search) {
        where.name = {contains: search}; // Add a search filter
    }

    try {
        // Get clients with pagination and search
        const clients = await prisma.client.findMany({
            where,
            skip,
            take: entries,
            orderBy: {createdAt: 'desc'}
        });

        // Get total count for pagination
        const totalClients = await prisma.client.count({where});

        return {
            clients,
            totalClients,
            totalPages: Math.ceil(totalClients / entries),
            currentPage: page
        };
    } catch (error) {
        console.error("Error fetching clients:", error);

        // Return a consistent structure even on error
        return {
            clients: [],
            totalPages: 0,
            currentPage: page,
            error: "Could not fetch clients"
        };
    }
}

export async function getNewClients() {
    // Get user
    const user = await getUser();

    const now = new Date()
    const currentStart = startOfMonth(now)
    const currentEnd = endOfMonth(now)
    const previousStart = startOfMonth(subMonths(now, 1))
    const previousEnd = endOfMonth(subMonths(now, 1))

    const [current, previous] = await Promise.all([
        prisma.client.count({
            where: {userId: user.id, createdAt: {gte: currentStart, lte: currentEnd}}
        }),
        prisma.client.count({
            where: {userId: user.id, createdAt: {gte: previousStart, lte: previousEnd}}
        })
    ])

    const trend = calculateTrend(current, previous)
    return {current, trend}
}

/** pets **/
export async function getQueryPets({
                                       search = '',
                                       page = 1,
                                       entries = 10
                                   }: {
    search?: string;
    page?: number;
    entries?: number;
} = {}) {
    // Get user
    const user = await getUser();

    // Calculate pagination values
    const skip = (page - 1) * entries;

    // Always include userId, conditionally add name search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {userId: user.id}; // Base condition
    if (search) {
        where.name = {contains: search}; // Add a search filter
    }

    try {
        // Get clients with pagination and search
        const pets = await prisma.pet.findMany({
            where,
            skip,
            take: entries,
            orderBy: {createdAt: 'desc'}
        });

        // Get total count for pagination
        const totalPets = await prisma.pet.count({where});

        return {
            pets,
            totalPets,
            totalPages: Math.ceil(totalPets / entries),
            currentPage: page
        };
    } catch (error) {
        console.error("Error fetching pets:", error);

        // Return a consistent structure even on error
        return {
            pets: [],
            totalPages: 0,
            currentPage: page,
            error: "Could not fetch pets"
        };
    }
}

export async function getNewPets() {
    // Get user
    const user = await getUser();

    const now = new Date()
    const currentStart = startOfMonth(now)
    const currentEnd = endOfMonth(now)
    const previousStart = startOfMonth(subMonths(now, 1))
    const previousEnd = endOfMonth(subMonths(now, 1))

    const [current, previous] = await Promise.all([
        prisma.pet.count({
            where: {userId: user.id, createdAt: {gte: currentStart, lte: currentEnd}}
        }),
        prisma.pet.count({
            where: {userId: user.id, createdAt: {gte: previousStart, lte: previousEnd}}
        })
    ])

    const trend = calculateTrend(current, previous)
    return {current, trend}
}


/** boardings **/
export async function getQueryBoardings({
                                            status = '',
                                            page = 1,
                                            entries = 10
                                        }: {
    status?: string;
    page?: number;
    entries?: number;
} = {}) {
    const user = await getUser();
    const queryParams = await getQueryWithStatusFilter({status, page, entries, userId: user.id});

    try {
        const [boardings, totalBoardings] = await Promise.all([
            prisma.boarding.findMany(queryParams),
            prisma.boarding.count({where: queryParams.where})
        ]);

        return {
            boardings,
            totalBoardings,
            totalPages: Math.ceil(totalBoardings / entries),
            currentPage: page
        };
    } catch (error) {
        console.error("Error fetching boardings:", error);
        return {
            boardings: [],
            totalPages: 0,
            currentPage: page,
            error: "Could not fetch boardings"
        };
    }
}

/** daycares **/
export async function getQueryDaycares({
                                           status = '',
                                           page = 1,
                                           entries = 10
                                       }: {
    status?: string;
    page?: number;
    entries?: number;
} = {}) {
    const user = await getUser();
    const queryParams = await getQueryWithStatusFilter({status, page, entries, userId: user.id});

    try {
        const [daycares, totalDaycares] = await Promise.all([
            prisma.daycare.findMany(queryParams),
            prisma.daycare.count({where: queryParams.where})
        ]);

        return {
            daycares,
            totalDaycares,
            totalPages: Math.ceil(totalDaycares / entries),
            currentPage: page
        };
    } catch (error) {
        console.error("Error fetching daycares:", error);
        return {
            daycares: [],
            totalPages: 0,
            currentPage: page,
            error: "Could not fetch daycares"
        };
    }
}

/** total services **/
export async function getTotalServices() {
    // Get user
    const user = await getUser();

    const now = new Date()
    const currentStart = startOfMonth(now)
    const currentEnd = endOfMonth(now)
    const previousStart = startOfMonth(subMonths(now, 1))
    const previousEnd = endOfMonth(subMonths(now, 1))

    const [currentBoarding, currentDaycare, previousBoarding, previousDaycare] = await Promise.all([
        prisma.boarding.count({
            where: {
                userId: user.id,
                status: 'COMPLETED',
                updatedAt: {gte: currentStart, lte: currentEnd}
            }
        }),
        prisma.daycare.count({
            where: {
                userId: user.id,
                status: 'COMPLETED',
                updatedAt: {gte: currentStart, lte: currentEnd}
            }
        }),
        prisma.boarding.count({
            where: {
                userId: user.id,
                status: 'COMPLETED',
                updatedAt: {gte: previousStart, lte: previousEnd}
            }
        }),
        prisma.daycare.count({
            where: {
                userId: user.id,
                status: 'COMPLETED',
                updatedAt: {gte: previousStart, lte: previousEnd}
            }
        })
    ])

    const current = currentBoarding + currentDaycare
    const previous = previousBoarding + previousDaycare
    const trend = calculateTrend(current, previous)
    return {current, trend}
}

/** get checkout **/

export async function getCheckOutsToday() {
    // Get user
    const user = await getUser();

    const todayStart = startOfToday()
    const todayEnd = endOfToday()
    const yesterdayStart = subDays(todayStart, 1)
    const yesterdayEnd = subDays(todayEnd, 1)

    const [today, yesterday] = await Promise.all([
        prisma.boarding.count({
            where: {
                userId: user.id,
                checkOutDateTime: {gte: todayStart, lte: todayEnd}
            }
        }),
        prisma.boarding.count({
            where: {
                userId: user.id,
                checkOutDateTime: {gte: yesterdayStart, lte: yesterdayEnd}
            }
        })
    ])

    const trend = calculateTrend(today, yesterday)
    return {current: today, trend}
}


// check authentication and membership
export async function checkAuthenticationAndMembership(waitMs = 0) {
    // authentication check
    const {isAuthenticated, getUser} = getKindeServerSession();
    if (!(await isAuthenticated())) {
        return redirect("/api/auth/login");
    }

    // authorization check
    const user = await getUser();
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    const membership = await prisma.membership.findFirst({
        where: {
            userId: user.id,
        },
    });
    if (!membership || membership.status !== "active") {
        return redirect("/");
    }

    return user;
}