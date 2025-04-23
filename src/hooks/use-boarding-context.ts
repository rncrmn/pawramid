import {useContext} from "react";
import {BoardingContext} from "@/contexts/boarding-context-provider";

export function useBoardingContext() {
    const context = useContext(BoardingContext);

    if (!context) {
        throw new Error("useBoardingContext must be used within a BoardingContextProvider")
    }

    return context;
}