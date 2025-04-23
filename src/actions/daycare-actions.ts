"use server"

import {daycareFormSchema, daycareIdSchema} from "@/lib/validations";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {checkAuthenticationAndMembership} from "@/lib/server-utils";

export const addDaycare = async (formData: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedDaycare = daycareFormSchema.safeParse(formData);

    if (!validatedDaycare.success) {
        return {
            message: "Invalid daycares data.",
        };
    }

    try {
        await prisma.daycare.create({
            data: {
                userId: user.id,
                ...validatedDaycare.data
            },
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not add daycares.",
        };
    }

    revalidatePath("/(app)", "layout");
}

export const editDaycare = async (daycareId: unknown, formData: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedDaycareId = daycareIdSchema.safeParse(daycareId);
    const validatedDaycare = daycareFormSchema.safeParse(formData);

    if (!validatedDaycare.success || !validatedDaycareId.success) {
        return {
            message: "Invalid daycares data.",
        };
    }

    try {
        await prisma.daycare.update({
            where: {
                userId: user.id,
                id: validatedDaycareId.data,
            },
            data: validatedDaycare.data,
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not edit daycares.",
        };
    }

    revalidatePath("/(app)", "layout");
}

export const deleteDaycare = async (daycareId: unknown) => {
    // check authentication and membership
    const user = await checkAuthenticationAndMembership();

    const validatedDaycareId = daycareIdSchema.safeParse(daycareId);

    if (!validatedDaycareId.success) {
        return {
            message: "Invalid daycares data.",
        };
    }

    try {
        await prisma.daycare.delete({
            where: {
                userId: user.id,
                id: validatedDaycareId.data,
            }
        })
    } catch (error) {
        console.log(error);

        return {
            message: "Could not delete daycares.",
        };
    }

    revalidatePath("/(app)", "layout");
}