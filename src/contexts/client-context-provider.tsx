"use client"

import React, {createContext, useOptimistic, useState} from "react";
import {Client} from "@prisma/client";
import {ClientEssentials} from "@/lib/types";
import {addClient, deleteClient, editClient} from "@/actions/client-actions";
import {toast} from "sonner";

type ClientContextProviderProps = {
    children: React.ReactNode
    data: Client[] | undefined
}

type TClientContext = {
    clients: Client[] | undefined,
    selectedClientId: Client["id"] | null,
    selectedClient: Client | undefined,
    numberOfClients: number | undefined,
    handleAddClient: (client: ClientEssentials) => Promise<void>,
    handleEditClient: (clientId: Client["id"], newClientData: ClientEssentials) => Promise<void>,
    handleDeleteClient: (clientId: Client["id"]) => Promise<void>,
    handleChangeSelectedClientId: (id: string) => void,
}

export const ClientContext = createContext<TClientContext | null>(null);

export default function ClientContextProvider({children, data}: ClientContextProviderProps) {
    // state
    const [optimisticClients, setOptimisticClients] = useOptimistic(
        data || [],
        (state, {action, payload}) => {
            switch (action) {
                case "add":
                    return [{...payload, id: Math.random().toString()}, ...state];
                case "edit":
                    return state.map((client) => {
                        if (client.id === payload.id) {
                            return {...client, ...payload.newClientData};
                        }
                        return client;
                    });
                case "delete":
                    return state.filter((client) => client.id !== payload);
                default:
                    return state;
            }
        }
    );

    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    // derived state
    const selectedClient: Client = optimisticClients.find((client: Client) => client.id === selectedClientId);
    const numberOfClients: number = optimisticClients.length || 0;

    // event handlers/actions
    const handleAddClient = async (newClient: ClientEssentials) => {
        setOptimisticClients({action: "add", payload: newClient});
        const error = await addClient(newClient);
        if (error) {
            toast.warning(error.message);
            return;
        }
    };

    const handleEditClient = async (clientId: Client["id"], newClientData: ClientEssentials) => {
        setOptimisticClients({action: "edit", payload: {id: clientId, newClientData}});
        const error = await editClient(clientId, newClientData);
        if (error) {
            toast.warning(error.message);
            return;
        }
    };

    const handleDeleteClient = async (clientId: Client["id"]) => {
        setOptimisticClients({action: "delete", payload: clientId});
        const error = await deleteClient(clientId);
        if (error) {
            toast.warning(error.message);
            return;
        }
        setSelectedClientId(null);
    };

    const handleChangeSelectedClientId = (id: Client["id"]) => {
        setSelectedClientId(id);
    };

    return (
        <ClientContext.Provider value={{
            clients: optimisticClients,
            selectedClientId,
            selectedClient,
            numberOfClients,
            handleAddClient,
            handleEditClient,
            handleDeleteClient,
            handleChangeSelectedClientId
        }}>
            {children}
        </ClientContext.Provider>
    )
}
