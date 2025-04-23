import {PetType, Sex, Fixed, Status} from '@prisma/client';
import {z} from "zod";

// Validation Schemas for Client
export const clientIdSchema = z.string().cuid();

export const clientFormSchema = z
    .object({
        name: z.string().trim().min(1, {message: "Name is required"}).max(100),
        address: z.string().trim().min(1, {message: "Address is required"}),
        phone: z.string()
            .trim()
            .min(1, {message: "Phone is required"})
            .regex(/^\+?[0-9\s\-()]+$/, {message: "Invalid phone number format"}),
        email: z.string().email({message: "Invalid email address"}),
    });

export type TClientForm = z.infer<typeof clientFormSchema>;

// Validation Schemas for Pet
export const petIdSchema = z.string().cuid();

export const petFormSchema = z
    .object({
        name: z.string().trim().min(1, {message: "Pet name is required"}).max(100),
        petType: z.nativeEnum(PetType, {
            errorMap: () => ({message: "Please select a valid pet type"})
        }),
        breed: z.union([z.literal(""), z.string().trim()]),
        sex: z.nativeEnum(Sex, {
            errorMap: () => ({message: "Please select a value"})
        }),
        fixed: z.nativeEnum(Fixed, {
            errorMap: () => ({message: "Please select a value"})
        }),
        clientId: clientIdSchema,
    });

export type TPetForm = z.infer<typeof petFormSchema>;

// Validation Schemas for Boarding
export const boardingIdSchema = z.string().cuid();

export const boardingFormSchema = z
    .object({
        checkInDateTime: z.date(),
        checkOutDateTime: z.date(),
        status: z.nativeEnum(Status, {
            errorMap: () => ({message: "Please select a valid service type"})
        }),
        petId: petIdSchema
    });

export type TBoardingForm = z.infer<typeof boardingFormSchema>;

// Validation Schemas for Daycare
export const daycareIdSchema = z.string().cuid();

export const daycareFormSchema = z
    .object({
        checkInDateTime: z.date(),
        status: z.nativeEnum(Status, {
            errorMap: () => ({message: "Please select a valid service type"})
        }),
        petId: petIdSchema
    });

export type TDaycareForm = z.infer<typeof boardingFormSchema>;