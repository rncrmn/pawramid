"use server"

import {petFormSchema, petIdSchema} from "@/lib/validations";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {checkAuthenticationAndMembership} from "@/lib/server-utils";

export const addPet = async (formData: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedPet = petFormSchema.safeParse(formData);

    if (!validatedPet.success) {
        return {
            message: "Invalid pet data.",
        };
    }

    try {
        await prisma.pet.create({
            data: {
                userId: user.id,
                ...validatedPet.data
            },
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not add pet.",
        };
    }

    revalidatePath("/(app)", "layout");
}

export const editPet = async (petId: unknown, formData: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedPetId = petIdSchema.safeParse(petId);
    const validatedPet = petFormSchema.safeParse(formData);

    if (!validatedPet.success || !validatedPetId.success) {
        return {
            message: "Invalid pet data.",
        };
    }

    try {
        await prisma.pet.update({
            where: {
                userId: user.id,
                id: validatedPetId.data,
            },
            data: validatedPet.data,
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not edit pet.",
        };
    }

    revalidatePath("/(app)", "layout");
}

export const deletePet = async (petId: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedPetId = petIdSchema.safeParse(petId);

    if (!validatedPetId.success) {
        return {
            message: "Invalid pet data.",
        };
    }

    try {
        await prisma.pet.delete({
            where: {
                userId: user.id,
                id: validatedPetId.data,
            }
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not delete pet.",
        };
    }

    revalidatePath("/(app)", "layout");
}