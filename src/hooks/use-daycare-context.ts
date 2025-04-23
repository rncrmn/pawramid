import {useContext} from "react";
import {DaycareContext} from "@/contexts/daycare-context-provider";

export function useDaycareContext() {
    const context = useContext(DaycareContext);

    if (!context) {
        throw new Error("useDaycareContext must be used within a DaycareContextProvider")
    }

    return context;
}