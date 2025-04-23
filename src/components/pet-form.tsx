"use client"

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {petFormSchema, TPetForm} from "@/lib/validations";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {usePetContext} from "@/hooks/use-pet-context";
import {Sex, PetType, Fixed} from "@prisma/client";
import {capitalizeFirstLetter} from "@/lib/utils";

type PetFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

export default function PetForm({actionType, onFormSubmission}: PetFormProps) {
    const {selectedPet, handleAddPet, handleEditPet, clients} = usePetContext()

    const {
        register,
        setValue,
        watch,
        trigger,
        getValues,
        formState: {errors},
    } = useForm<TPetForm>({
        resolver: zodResolver(petFormSchema),
        defaultValues:
            actionType === "edit"
                ? {
                    name: selectedPet?.name,
                    petType: selectedPet?.petType,
                    breed: selectedPet?.breed || "",
                    sex: selectedPet?.sex,
                    fixed: selectedPet?.fixed,
                    clientId: selectedPet?.clientId,
                } as TPetForm
                : undefined,
    });

    return (
        <form action={
            async () => {
                const result = await trigger();
                if (!result) return;

                onFormSubmission()

                const petData = getValues()

                if (actionType === "add") {
                    await handleAddPet(petData);
                } else if (actionType === "edit") {
                    await handleEditPet(selectedPet!.id, petData);
                }
            }
        } className="flex flex-col gap-5">
            {/* Pet Name Field */}
            <div className="flex flex-col gap-1">
                <Label htmlFor="name">Pet Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            {/* Pet Type and Breed Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="petType">Pet Type</Label>
                    <Select
                        onValueChange={(value) => setValue("petType", value as PetType)}
                        value={watch("petType")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Object.values(PetType).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {capitalizeFirstLetter(type)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.petType && <p className="text-red-500 text-xs">{errors.petType.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="breed">Breed <span className="text-xs text-gray-500">(optional)</span></Label>
                    <Input id="breed" {...register("breed")} />
                    {errors.breed && <p className="text-red-500 text-xs">{errors.breed.message}</p>}
                </div>
            </div>

            {/* Sex, Fixed Status, Age Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="sex">Sex</Label>
                    <Select
                        onValueChange={(value) => setValue("sex", value as Sex)}
                        value={watch("sex")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Object.values(Sex).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {capitalizeFirstLetter(type)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.sex && <p className="text-red-500 text-xs">{errors.sex.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="fixed">Fixed Status</Label>
                    <Select
                        onValueChange={(value) => setValue("fixed", value as Fixed)}
                        value={watch("fixed")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Object.values(Fixed).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {capitalizeFirstLetter(type)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.fixed && <p className="text-red-500 text-xs">{errors.fixed.message}</p>}
                </div>

            </div>

            {/* Microchip and Client Row */}
            <div className="grid grid-cols-1 gap-5">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="clientId">Client Name</Label>
                    <Select
                        onValueChange={(value) => setValue("clientId", value)}
                        value={watch("clientId")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {clients?.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.clientId && <p className="text-red-500 text-xs">{errors.clientId.message}</p>}
                </div>
            </div>

            {/* Submit Button */}
            <Button className="mt-1">
                {(actionType === "add") ? "Add Pet" : "Update Pet"}
            </Button>
        </form>
    )
}
