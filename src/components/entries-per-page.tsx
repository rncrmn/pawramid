'use client'

import {useRouter} from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type PageSizeSelectorProps = {
    pageName: string
    entries: number
    totalItems?: number
    options?: number[]
    searchParamsResults: { [key: string]: string | undefined }
}

export default function EntriesPerPage({
                                           pageName,
                                           entries,
                                           totalItems,
                                           options = [5, 10, 15, 25, 50],
                                           searchParamsResults
                                       }: PageSizeSelectorProps) {
    const router = useRouter()

    // Don't render if we have 5 or fewer items
    if (totalItems !== undefined && totalItems <= 5) {
        return null;
    }

    const handlePageSizeChange = (value: string) => {
        const params = new URLSearchParams(searchParamsResults as Record<string, string>)
        params.set('entries', value)
        // Reset to the first page when changing page size
        params.set('page', '1')
        router.push(`/dashboard/${pageName}?${params.toString()}`)
    }

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
                value={entries.toString()}
                onValueChange={handlePageSizeChange}
            >
                <SelectTrigger className="w-16">
                    <SelectValue placeholder={entries.toString()}/>
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option} value={option.toString()}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
        </div>
    )
}