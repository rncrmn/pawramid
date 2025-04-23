"use client"

import React, {createContext, useOptimistic, useState} from "react";
import {Pet, Client} from "@prisma/client";
import {PetEssentials} from "@/lib/types";
import {addPet, deletePet, editPet} from "@/actions/pet-actions";
import {toast} from "sonner";

type PetContextProviderProps = {
    children: React.ReactNode
    data: Pet[]
    clientsData: Client[]
}

type TPetContext = {
    pets: Pet[] | undefined
    selectedPetId: Pet["id"] | null
    selectedPet: Pet | undefined,
    numberOfPets: number | undefined,
    handleAddPet: (pet: PetEssentials) => Promise<void>,
    handleEditPet: (petId: Pet["id"], newPetData: PetEssentials) => Promise<void>,
    handleDeletePet: (petId: Pet["id"]) => Promise<void>,
    handleChangeSelectedPetId: (id: string) => void,
    clients: Client[] | undefined
}

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({children, data, clientsData}: PetContextProviderProps) {
    // state
    const [optimisticPets, setOptimisticPets] = useOptimistic(
        data || [],
        (state, {action, payload}) => {
            switch (action) {
                case "add":
                    return [{...payload, id: Math.random().toString()}, ...state];
                case "edit":
                    return state.map((pet) => {
                        if (pet.id === payload.id) {
                            return {...pet, ...payload.newPetData};
                        }
                        return pet;
                    });
                case "delete":
                    return state.filter((pet) => pet.id !== payload);
                default:
                    return state;
            }
        }
    );

    const clients = clientsData;
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    // derived state
    const selectedPet: Pet = optimisticPets.find((pet: Pet) => pet.id === selectedPetId);
    const numberOfPets: number = optimisticPets.length;

    // event handlers/actions
    const handleAddPet = async (newPet: PetEssentials) => {
        setOptimisticPets({action: "add", payload: newPet});
        const error = await addPet(newPet);
        if (error) {
            toast.warning(error.message);
            return;
        }
    };

    const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
        setOptimisticPets({action: "edit", payload: {id: petId, newPetData}});
        const error = await editPet(petId, newPetData);
        if (error) {
            toast.warning(error.message);
            return;
        }
    };

    const handleDeletePet = async (petId: Pet["id"]) => {
        setOptimisticPets({action: "delete", payload: petId});
        const error = await deletePet(petId);
        if (error) {
            toast.warning(error.message);
            return;
        }
        setSelectedPetId(null);
    };

    const handleChangeSelectedPetId = (id: Pet["id"]) => {
        setSelectedPetId(id);
    };

    return (
        <PetContext.Provider value={{
            pets: optimisticPets,
            selectedPetId,
            selectedPet,
            numberOfPets,
            handleAddPet,
            handleEditPet,
            handleDeletePet,
            handleChangeSelectedPetId,
            clients
        }}>
            {children}
        </PetContext.Provider>
    )
}
