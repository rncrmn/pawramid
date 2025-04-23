"use client"

import React, {createContext, useOptimistic, useState} from "react";
import {Daycare, Pet} from "@prisma/client";
import {DaycareEssentials} from "@/lib/types";
import {addDaycare, deleteDaycare, editDaycare} from "@/actions/daycare-actions";
import {toast} from "sonner";

type DaycareContextProviderProps = {
    children: React.ReactNode
    data: Daycare[]
    petsData: Pet[]
}

type TDaycareContext = {
    daycares: Daycare[] | undefined
    selectedDaycareId: Daycare["id"] | null
    selectedDaycare: Daycare | undefined,
    numberOfDaycares: number | undefined,
    handleAddDaycare: (boarding: DaycareEssentials) => Promise<void>,
    handleEditDaycare: (boardingId: Daycare["id"], newDaycareData: DaycareEssentials) => Promise<void>,
    handleDeleteDaycare: (boardingId: Daycare["id"]) => Promise<void>,
    handleChangeSelectedDaycareId: (id: string) => void,
    pets: Pet[]
}

export const DaycareContext = createContext<TDaycareContext | null>(null);

export default function DaycareContextProvider({children, data, petsData}: DaycareContextProviderProps) {
    // state
    const [optimisticDaycares, setOptimisticDaycares] = useOptimistic(
        data || [],
        (state, {action, payload}) => {
            switch (action) {
                case "add":
                    return [{...payload, id: Math.random().toString()}, ...state];
                case "edit":
                    return state.map((boarding) => {
                        if (boarding.id === payload.id) {
                            return {...boarding, ...payload.newDaycareData};
                        }
                        return boarding;
                    });
                case "delete":
                    return state.filter((boarding) => boarding.id !== payload);
                default:
                    return state;
            }
        }
    );

    const pets = petsData || [];
    const [selectedDaycareId, setSelectedDaycareId] = useState<string | null>(null);

    // derived state
    const selectedDaycare: Daycare = optimisticDaycares.find((boarding: Daycare) => boarding.id === selectedDaycareId);
    const numberOfDaycares: number = optimisticDaycares.length;

    // event handlers/actions
    const handleAddDaycare = async (newDaycare: DaycareEssentials) => {
        setOptimisticDaycares({action: "add", payload: newDaycare});
        const error = await addDaycare(newDaycare);
        if (error) {
            toast.warning(error.message);
            return;
        }
    };

    const handleEditDaycare = async (boardingId: Daycare["id"], newDaycareData: DaycareEssentials) => {
        setOptimisticDaycares({action: "edit", payload: {id: boardingId, newDaycareData}});
        const error = await editDaycare(boardingId, newDaycareData);
        if (error) {
            toast.warning(error.message);
            return;
        }
    };

    const handleDeleteDaycare = async (boardingId: Daycare["id"]) => {
        setOptimisticDaycares({action: "delete", payload: boardingId});
        const error = await deleteDaycare(boardingId);
        if (error) {
            toast.warning(error.message);
            return;
        }
        setSelectedDaycareId(null);
    };

    const handleChangeSelectedDaycareId = (id: Daycare["id"]) => {
        setSelectedDaycareId(id);
    };

    return (
        <DaycareContext.Provider value={{
            daycares: optimisticDaycares,
            selectedDaycareId,
            selectedDaycare,
            numberOfDaycares,
            handleAddDaycare,
            handleEditDaycare,
            handleDeleteDaycare,
            handleChangeSelectedDaycareId,
            pets
        }}>
            {children}
        </DaycareContext.Provider>
    )
}
