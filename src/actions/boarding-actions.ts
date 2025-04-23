"use server"

import {boardingFormSchema, boardingIdSchema} from "@/lib/validations";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {checkAuthenticationAndMembership} from "@/lib/server-utils";

export const addBoarding = async (formData: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedBoarding = boardingFormSchema.safeParse(formData);

    if (!validatedBoarding.success) {
        return {
            message: "Invalid boardings data.",
        };
    }

    try {
        await prisma.boarding.create({
            data: {
                userId: user.id,
                ...validatedBoarding.data
            },
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not add boardings.",
        };
    }

    revalidatePath("/(app)", "layout");
}

export const editBoarding = async (boardingId: unknown, formData: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedBoardingId = boardingIdSchema.safeParse(boardingId);
    const validatedBoarding = boardingFormSchema.safeParse(formData);

    if (!validatedBoarding.success || !validatedBoardingId.success) {
        return {
            message: "Invalid boardings data.",
        };
    }

    try {
        await prisma.boarding.update({
            where: {
                userId: user.id,
                id: validatedBoardingId.data,
            },
            data: validatedBoarding.data,
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not edit boardings.",
        };
    }

    revalidatePath("/(app)", "layout");
}

export const deleteBoarding = async (boardingId: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedBoardingId = boardingIdSchema.safeParse(boardingId);

    if (!validatedBoardingId.success) {
        return {
            message: "Invalid boardings data.",
        };
    }

    try {
        await prisma.boarding.delete({
            where: {
                userId: user.id,
                id: validatedBoardingId.data,
            }
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not delete boardings.",
        };
    }

    revalidatePath("/(app)", "layout");
}