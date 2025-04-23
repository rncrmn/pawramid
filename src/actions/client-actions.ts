"use server"

import {prisma} from "@/lib/prisma";
import {clientFormSchema, clientIdSchema} from "@/lib/validations";
import {revalidatePath} from "next/cache";
import {checkAuthenticationAndMembership} from "@/lib/server-utils";

export const addClient = async (formData: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedClient = clientFormSchema.safeParse(formData);

    if (!validatedClient.success) {
        return {
            message: "Invalid client data.",
        };
    }

    try {
        await prisma.client.create({
            data: {
                userId: user.id,
                ...validatedClient.data
            },
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not add client.",
        };
    }

    revalidatePath("/(app)", "layout");
}

export const editClient = async (clientId: unknown, formData: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedClientId = clientIdSchema.safeParse(clientId);
    const validatedClient = clientFormSchema.safeParse(formData);

    if (!validatedClient.success || !validatedClientId.success) {
        return {
            message: "Invalid client data.",
        };
    }

    try {
        await prisma.client.update({
            where: {
                userId: user.id,
                id: validatedClientId.data,
            },
            data: validatedClient.data,
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not edit client.",
        };
    }

    revalidatePath("/(app)", "layout");
}

export const deleteClient = async (clientId: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedClientId = clientIdSchema.safeParse(clientId);

    if (!validatedClientId.success) {
        return {
            message: "Invalid client data.",
        };
    }

    try {
        await prisma.client.delete({
            where: {
                userId: user.id,
                id: validatedClientId.data,
            }
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not delete client.",
        };
    }

    revalidatePath("/(app)", "layout");
}