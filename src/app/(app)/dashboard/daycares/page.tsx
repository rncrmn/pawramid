import type {Metadata} from "next";
import React, {Suspense} from "react";
import {checkAuthenticationAndMembership, getQueryDaycares} from "@/lib/server-utils";
import TablePagination from "@/components/table-pagination";
import DaycaresTable from "@/components/daycares-table";
import {prisma} from "@/lib/prisma";
import DaycareButton from "@/components/daycare-button";
import EntriesPerPage from "@/components/entries-per-page";
import StatusFilter from "@/components/status-filter";
import DaycareContextProvider from "@/contexts/daycare-context-provider";
import {parseSearchParams} from "@/lib/utils";

type PageProps = {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>
}

export const metadata: Metadata = {
    title: "All Daycares - Pawramid",
    description: "Generated by create next app",
};

export default async function Page({searchParams}: PageProps) {
    const user = await checkAuthenticationAndMembership();

    const searchParamsResults = await searchParams;
    const {status, page, entries} = await parseSearchParams(searchParamsResults);

    const {daycares, totalDaycares, totalPages, currentPage} = await getQueryDaycares({
        status,
        page,
        entries
    });

    const pets = await prisma.pet.findMany({
        where: {
            userId: user.id,
        }
    })

    return (
        <DaycareContextProvider data={daycares} petsData={pets}>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                        <p className="text-xl font-semibold">All Daycares</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <StatusFilter pageName="daycares" currentStatus={status}
                                      searchParamsResults={searchParamsResults}/>
                        <DaycareButton actionType="add">Add Daycare</DaycareButton>
                    </div>
                </div>
                <Suspense fallback={<div>Loading daycares...</div>}>
                    <DaycaresTable/>
                </Suspense>
                <div className="flex justify-between space-x-3">
                    <div>
                        <EntriesPerPage pageName="daycares" entries={entries} totalItems={totalDaycares}
                                        searchParamsResults={searchParamsResults}/></div>
                    <div>
                        <TablePagination pageName="daycares" currentPage={currentPage!}
                                         totalPages={totalPages!}
                                         searchParamsResults={searchParamsResults}/>
                    </div>
                </div>
            </div>
        </DaycareContextProvider>
    )
}