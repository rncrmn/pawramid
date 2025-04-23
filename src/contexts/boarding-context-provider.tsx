"use client"

import React, {createContext, useOptimistic, useState} from "react";
import {Boarding, Pet} from "@prisma/client";
import {BoardingEssentials} from "@/lib/types";
import {addBoarding, deleteBoarding, editBoarding} from "@/actions/boarding-actions";
import {toast} from "sonner";

type BoardingContextProviderProps = {
    children: React.ReactNode
    data: Boarding[]
    petsData: Pet[]
}

type TBoardingContext = {
    boardings: Boarding[] | undefined
    selectedBoardingId: Boarding["id"] | null
    selectedBoarding: Boarding | undefined,
    numberOfBoardings: number | undefined,
    handleAddBoarding: (boarding: BoardingEssentials) => Promise<void>,
    handleEditBoarding: (boardingId: Boarding["id"], newBoardingData: BoardingEssentials) => Promise<void>,
    handleDeleteBoarding: (boardingId: Boarding["id"]) => Promise<void>,
    handleChangeSelectedBoardingId: (id: string) => void,
    pets: Pet[]
}

export const BoardingContext = createContext<TBoardingContext | null>(null);

export default function BoardingContextProvider({children, data, petsData}: BoardingContextProviderProps) {
    // state
    const [optimisticBoardings, setOptimisticBoardings] = useOptimistic(
        data || [],
        (state, {action, payload}) => {
            switch (action) {
                case "add":
                    return [{...payload, id: Math.random().toString()}, ...state];
                case "edit":
                    return state.map((boarding) => {
                        if (boarding.id === payload.id) {
                            return {...boarding, ...payload.newBoardingData};
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
    const [selectedBoardingId, setSelectedBoardingId] = useState<string | null>(null);

    // derived state
    const selectedBoarding: Boarding = optimisticBoardings.find((boarding: Boarding) => boarding.id === selectedBoardingId);
    const numberOfBoardings: number = optimisticBoardings.length;

    // event handlers/actions
    const handleAddBoarding = async (newBoarding: BoardingEssentials) => {
        setOptimisticBoardings({action: "add", payload: newBoarding});
        const error = await addBoarding(newBoarding);
        if (error) {
            toast.warning(error.message);
            return;
        }
    };

    const handleEditBoarding = async (boardingId: Boarding["id"], newBoardingData: BoardingEssentials) => {
        setOptimisticBoardings({action: "edit", payload: {id: boardingId, newBoardingData}});
        const error = await editBoarding(boardingId, newBoardingData);
        if (error) {
            toast.warning(error.message);
            return;
        }
    };

    const handleDeleteBoarding = async (boardingId: Boarding["id"]) => {
        setOptimisticBoardings({action: "delete", payload: boardingId});
        const error = await deleteBoarding(boardingId);
        if (error) {
            toast.warning(error.message);
            return;
        }
        setSelectedBoardingId(null);
    };

    const handleChangeSelectedBoardingId = (id: Boarding["id"]) => {
        setSelectedBoardingId(id);
    };

    return (
        <BoardingContext.Provider value={{
            boardings: optimisticBoardings,
            selectedBoardingId,
            selectedBoarding,
            numberOfBoardings,
            handleAddBoarding,
            handleEditBoarding,
            handleDeleteBoarding,
            handleChangeSelectedBoardingId,
            pets
        }}>
            {children}
        </BoardingContext.Provider>
    )
}
