import React from 'react'
import {Button} from "@/components/ui/button";
import Image from "next/image";

export default function HomeHeroSection() {
    return (
        <div className="w-full py-4 md:py-8">
            <div className="max-w-6xl mx-auto py-2 md:py-4 px-6">
                <div className="text-center flex flex-col justify-center items-center gap-6">
                    <div className="max-w-4xl space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 leading-tight">
                            Simple Boarding Management
                            <span className="text-indigo-400"> Without the Paperwork</span>
                        </h1>
                        <p className="text-lg">Finally ditch the clipboard and manage your boarding & daycare with
                            confidence.
                            Designed specifically for small boarding businesses like yours.</p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4">
                            <span className="text-gray-100">✅ Track arrivals & departures</span>
                            <span className="text-gray-100">✅ Manage client details</span>
                            <span className="text-gray-100">✅ Manage pet details</span>
                        </div>
                    </div>
                    <Button className="mt-6">Get Started</Button>
                    <Image src="/boardings-preview.png" alt="boarding preview" width={1280} height={720}
                           className="rounded-xl border-5"/>
                </div>

            </div>
        </div>
    )
}
