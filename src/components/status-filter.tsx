'use client'

import {useRouter} from 'next/navigation'
import {Status} from '@prisma/client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {transformStatus} from "@/lib/utils";

type StatusFilterProps = {
    pageName: string
    currentStatus?: string
    searchParamsResults: { [key: string]: string | undefined }
}

export default function StatusFilter({
                                         pageName,
                                         currentStatus = "All",
                                         searchParamsResults
                                     }: StatusFilterProps) {
    const router = useRouter()


    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParamsResults as Record<string, string>)

        if (!status || status === "all") {
            // Remove the status parameter completely from URL if "All" is selected
            params.delete('status')
        } else {
            params.set('status', status)
        }

        // Reset to first page when changing filter
        params.set('page', '1')
        router.push(`/dashboard/${pageName}?${params.toString()}`)
    }

    // Format status for display
    const formatStatus = (status: string): string => {
        if (status === '') return 'test'
        return status.split('_').map(
            word => word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ')
    }

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select
                value={currentStatus.toLowerCase()} // Ensure "completed" is selected if the currentStatus is "completed"
                onValueChange={handleStatusChange}
            >
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="All"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {
                        Object.values(Status).map(stat => (
                            <SelectItem key={stat} value={stat.toLowerCase()}>
                                {transformStatus(stat)}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </div>
    )
}