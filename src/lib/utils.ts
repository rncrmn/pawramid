import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {Pet} from "@prisma/client";

export async function parseSearchParams(searchParams: {
    search?: string;
    status?: string;
    page?: string;
    entries?: string;
}) {
    const search = searchParams.search || '';
    const status = searchParams.status || '';
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    // Add a default page size (10) if not provided
    const entries = searchParams.entries ? parseInt(searchParams.entries) : 10;

    return {search, status, page, entries};
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function transformStatus(status: string): string {
    // Convert "CHECKED_IN" to "Check In"
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function createPetNamesMap(pets: Pet[]): Record<string, string> {
    if (!pets) return {} as Record<string, string>;

    return pets.reduce<Record<string, string>>((acc, pet) => {
        if (pet.id && pet.name) {
            acc[pet.id] = pet.name;
        }
        return acc;
    }, {});
}

export const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages = []

    // Always show the first page
    pages.push(1)

    // Current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (pages[pages.length - 1] !== i - 1) {
            pages.push(-1) // ellipsis
        }
        pages.push(i)
    }

    // Last page
    if (totalPages > 1) {
        if (pages[pages.length - 1] !== totalPages - 1) {
            pages.push(-1) // ellipsis
        }
        pages.push(totalPages)
    }

    return pages
}

export function calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return Number(((current - previous) / previous * 100).toFixed(1))
}