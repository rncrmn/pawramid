"use client"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import PetButton from "@/components/pet-button";
import {usePetContext} from "@/hooks/use-pet-context";
import {startTransition,} from "react";
import {capitalizeFirstLetter} from "@/lib/utils";
import {clsx} from "clsx";

export default function PetsTable() {
    const {pets, handleChangeSelectedPetId, handleDeletePet} = usePetContext();

    if (!pets) {
        return EmptyView()
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Pet Type</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Sex</TableHead>
                    <TableHead>Fixed Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    pets.map((pet, index) => {
                        return (
                            <TableRow key={pet.id}>
                                <TableCell className="h-15">
                                    {String(1001 + index).padStart(4, '0')}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {pet.name}
                                </TableCell>
                                <TableCell className="h-15">
                                    <span
                                        className={clsx(
                                            "py-1 px-3 rounded-2xl font-medium",
                                            pet.petType === "DOG" ? "text-indigo-700 dark:text-indigo-500 bg-indigo-500/20 dark:bg-indigo-300/20" :
                                                "text-teal-700 dark:text-teal-500 bg-teal-500/20 dark:bg-teal-300/20"
                                        )}
                                    >{capitalizeFirstLetter(pet.petType)}</span>
                                </TableCell>
                                <TableCell className="h-15">{pet.breed}</TableCell>
                                <TableCell className="h-15"><span
                                    className={clsx("font-medium",
                                        pet.sex === "MALE" ? "text-indigo-700 dark:text-indigo-500" :
                                            "text-teal-700 dark:text-teal-500"
                                    )}
                                >{capitalizeFirstLetter(pet.sex)}</span></TableCell>
                                <TableCell className="h-15">{capitalizeFirstLetter(pet.fixed)}</TableCell>
                                <TableCell className="h-15">
                                    <div className="flex space-x-3">
                                        <PetButton actionType="edit"
                                                   onClick={() => {
                                                       handleChangeSelectedPetId(pet.id)
                                                   }}>edit</PetButton>
                                        <PetButton actionType="delete"
                                                   onClick={() => {
                                                       startTransition(async () => {
                                                           await handleDeletePet(pet.id)
                                                       })
                                                   }}>delete</PetButton>
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
                    <TableHead>Pet Type</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Sex</TableHead>
                    <TableHead>Fixed Status</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Microchip #</TableHead>
                    <TableHead>Actions</TableHead>
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