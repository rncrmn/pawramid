import {Boarding, Client, Daycare, Pet} from "@prisma/client";

export type ClientEssentials = Omit<
    Client,
    "id" | "userId" | "createdAt" | "updatedAt"
>;

export type PetEssentials = Omit<
    Pet,
    "id" | "userId" | "createdAt" | "updatedAt"
>;

export type BoardingEssentials = Omit<
    Boarding,
    "id" | "userId" | "createdAt" | "updatedAt"
>;

export type DaycareEssentials = Omit<
    Daycare,
    "id" | "userId" | "createdAt" | "updatedAt"
>;