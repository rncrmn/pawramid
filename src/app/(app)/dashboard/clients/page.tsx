import React, {Suspense} from 'react'
import ClientsTable from "@/components/clients-table";
import ClientButton from "@/components/client-button";
import type {Metadata} from "next";
import {checkAuthenticationAndMembership, getQueryClients} from "@/lib/server-utils";
import TablePagination from "@/components/table-pagination";
import ClientContextProvider from "@/contexts/client-context-provider";
import SearchForm from "@/components/search-form";
import EntriesPerPage from "@/components/entries-per-page";
import {parseSearchParams} from "@/lib/utils";

type PageProps = {
    searchParams: Promise<{
        search?: string;
        page?: string;
        entries?: string;
    }>
}

export const metadata: Metadata = {
    title: "All Clients - Pawramid",
    description: "",
};

export default async function Page({searchParams}: PageProps) {
    await checkAuthenticationAndMembership();

    const searchParamsResults = await searchParams;
    const {search, page, entries} = await parseSearchParams(searchParamsResults);

    const {clients, totalPages, totalClients, currentPage} = await getQueryClients({
        search,
        page,
        entries
    });

    return (
        <ClientContextProvider data={clients}>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                        <p className="text-xl font-semibold">All Clients</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <SearchForm pageName="clients" initialSearch={search}/>
                        <ClientButton actionType="add">Add New Client</ClientButton>
                    </div>
                </div>
                <Suspense fallback={<div>Loading clients...</div>}>
                    <ClientsTable/>
                </Suspense>
                <div className="flex justify-between space-x-3">
                    <div>
                        <EntriesPerPage pageName="clients" entries={entries} totalItems={totalClients}
                                        searchParamsResults={searchParamsResults}/></div>
                    <div>
                        <TablePagination pageName="clients" currentPage={currentPage!}
                                         totalPages={totalPages!}
                                         searchParamsResults={searchParamsResults}/>
                    </div>
                </div>
            </div>
        </ClientContextProvider>
    )
}