'use client'

import React, {useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";

type SearchFormProps = {
    pageName: string
    initialSearch?: string
}

export default function SearchForm({pageName, initialSearch = ''}: SearchFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(initialSearch)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Create new URLSearchParams
        const params = new URLSearchParams(searchParams.toString())

        // Update search param, reset to page 1 when searching
        if (search) {
            params.set('search', search)
        } else {
            params.delete('search')
        }
        params.set('page', '1')

        // Update URL
        router.push(`/dashboard/${pageName}?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="border p-2 pl-9 flex-grow"
                />
            </div>
        </form>
    )
}