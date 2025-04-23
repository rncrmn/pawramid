import {useContext} from "react";
import {ClientContext} from "@/contexts/client-context-provider";

export function useClientContext() {
    const context = useContext(ClientContext);

    if (!context) {
        throw new Error("useClientContext must be used within a ClientContextProvider")
    }

    return context;
}