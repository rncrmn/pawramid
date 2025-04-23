"use client"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import BoardingButton from "@/components/boarding-button";
import {startTransition, useMemo,} from "react";
import {useBoardingContext} from "@/hooks/use-boarding-context";
import {format} from "date-fns";
import {createPetNamesMap, transformStatus} from "@/lib/utils";
import {clsx} from "clsx";
import {BadgeCheck} from "lucide-react";

export default function BoardingsTable() {
    const {boardings, handleChangeSelectedBoardingId, handleDeleteBoarding, pets} = useBoardingContext();

    // Create a properly typed memoized mapping of pet IDs to names
    const petNamesMap = useMemo(() => createPetNamesMap(pets), [pets]);

    if (!boardings) {
        return EmptyView()
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pet Name</TableHead>
                    <TableHead>Check-in Date</TableHead>
                    <TableHead>Check-out Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    boardings.map((boarding, index) => {
                        return (
                            <TableRow key={boarding.id}>
                                <TableCell className="h-15">
                                    {String(1001 + index).padStart(4, '0')}
                                </TableCell>
                                <TableCell
                                    className="font-medium">{petNamesMap[boarding.petId] || "Unknown Pet"}</TableCell>
                                <TableCell
                                    className="h-15">{format(new Date(boarding.checkInDateTime), "dd MMM yyyy")}</TableCell>
                                <TableCell
                                    className="h-15">{format(new Date(boarding.checkOutDateTime), "dd MMM yyyy")}</TableCell>
                                <TableCell className="h-15">{
                                    boarding.status !== "COMPLETED" ? <span
                                            className={clsx(
                                                "py-1 px-3 rounded-2xl font-medium text-sm",
                                                boarding.status === "CHECKED_IN" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-green-100 text-green-700"
                                            )}
                                        >{transformStatus(boarding.status)}</span> :
                                        <span
                                            className="text-purple-700 font-medium flex gap-1 items-center"><BadgeCheck
                                            className="size-4"/> Completed</span>
                                }</TableCell>
                                <TableCell className="h-15">
                                    <div className="flex space-x-3">
                                        {
                                            boarding.status !== "COMPLETED" && <BoardingButton actionType="edit"
                                                                                               onClick={() => {
                                                                                                   handleChangeSelectedBoardingId(boarding.id)
                                                                                               }}>edit</BoardingButton>
                                        }

                                        <BoardingButton actionType="delete"
                                                        onClick={() => {
                                                            startTransition(async () => {
                                                                await handleDeleteBoarding(boarding.id)
                                                            })
                                                        }}>delete</BoardingButton>
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