'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {getPageNumbers} from "@/lib/utils";

type ClientPaginationProps = {
    pageName: string
    currentPage: number
    totalPages: number
    searchParamsResults: { [key: string]: string | undefined }
}

export default function TablePagination({
                                            pageName,
                                            currentPage,
                                            totalPages,
                                            searchParamsResults
                                        }: ClientPaginationProps) {
    // Create base search params that preserve the current search
    const createPageURL = (page: number) => {
        const params = new URLSearchParams(searchParamsResults as Record<string, string>)
        params.set('page', page.toString())
        return `/dashboard/${pageName}?${params.toString()}`
    }

    if (totalPages <= 1) return null

    // Function to determine which page numbers to show
    const pageNumbers = getPageNumbers(currentPage, totalPages)

    return (
        <Pagination className="my-4 w-auto">
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious href={createPageURL(currentPage - 1)}/>
                    </PaginationItem>
                )}

                {pageNumbers.map((pageNum, i) => (
                    pageNum === -1 ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis/>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                href={createPageURL(pageNum)}
                                isActive={pageNum === currentPage}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    )
                ))}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext href={createPageURL(currentPage + 1)}/>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    )
}