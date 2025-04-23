"use client"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import DaycareButton from "@/components/daycare-button";
import {startTransition, useMemo,} from "react";
import {useDaycareContext} from "@/hooks/use-daycare-context";
import {format} from "date-fns";
import {createPetNamesMap, transformStatus} from "@/lib/utils";
import {clsx} from "clsx";
import {BadgeCheck} from "lucide-react";

export default function DaycaresTable() {
    const {daycares, handleChangeSelectedDaycareId, handleDeleteDaycare, pets} = useDaycareContext();

    // Create a properly typed memoized mapping of pet IDs to names
    const petNamesMap = useMemo(() => createPetNamesMap(pets), [pets]);

    if (!daycares) {
        return EmptyView()
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pet Name</TableHead>
                    <TableHead>Check-in Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    daycares.map((daycare, index) => {
                        return (
                            <TableRow key={daycare.id}>
                                <TableCell className="h-15">
                                    {String(1001 + index).padStart(4, '0')}
                                </TableCell>
                                <TableCell
                                    className="font-medium">{petNamesMap[daycare.petId] || "Unknown Pet"}</TableCell>
                                <TableCell
                                    className="h-15">{format(new Date(daycare.checkInDateTime), "dd MMM yyyy")}</TableCell>
                                <TableCell className="h-15">{
                                    daycare.status !== "COMPLETED" ? <span
                                            className={clsx(
                                                "py-1 px-3 rounded-2xl font-medium text-sm",
                                                daycare.status === "CHECKED_IN" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-green-100 text-green-700"
                                            )}
                                        >{transformStatus(daycare.status)}</span> :
                                        <span
                                            className="text-purple-700 font-medium flex gap-1 items-center"><BadgeCheck
                                            className="size-4"/> Completed</span>
                                }</TableCell>
                                <TableCell className="h-15">
                                    <div className="flex space-x-3">
                                        {daycare.status !== "COMPLETED" && <DaycareButton actionType="edit"
                                                                                          onClick={() => {
                                                                                              handleChangeSelectedDaycareId(daycare.id)
                                                                                          }}>edit</DaycareButton>}

                                        <DaycareButton actionType="delete"
                                                       onClick={() => {
                                                           startTransition(async () => {
                                                               await handleDeleteDaycare(daycare.id)
                                                           })
                                                       }}>delete</DaycareButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    )
}

function EmptyView() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Check-in Date</TableHead>
                    <TableHead>Check-out Date</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="text-center" colSpan={6}>No data available yet</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}