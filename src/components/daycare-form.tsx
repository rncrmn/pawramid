"use client"

import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {daycareFormSchema, TDaycareForm} from "@/lib/validations";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useDaycareContext} from "@/hooks/use-daycare-context";
import {Status} from "@prisma/client";
import {cn, transformStatus} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

type DaycareFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

export default function DaycareForm({actionType, onFormSubmission}: DaycareFormProps) {
    const {selectedDaycare, handleAddDaycare, handleEditDaycare, pets} = useDaycareContext()

    const {
        setValue,
        watch,
        trigger,
        getValues,
        formState: {errors},
    } = useForm<TDaycareForm>({
        resolver: zodResolver(daycareFormSchema),
        defaultValues:
            actionType === "edit"
                ? {
                    petId: selectedDaycare?.petId,
                    checkInDateTime: selectedDaycare?.checkInDateTime ? new Date(selectedDaycare.checkInDateTime) : undefined,
                    status: selectedDaycare?.status
                } as TDaycareForm
                : {
                    checkInDateTime: new Date()
                },
    });

    // Watch the date values for display in the UI
    const checkInDateTime = watch("checkInDateTime");

    return (
        <form action={
            async () => {
                const result = await trigger();
                if (!result) return;

                onFormSubmission()

                const daycareData = getValues()

                if (actionType === "add") {
                    await handleAddDaycare(daycareData);
                } else if (actionType === "edit") {
                    await handleEditDaycare(selectedDaycare!.id, daycareData);
                }
            }
        } className="flex flex-col gap-5">
            {/* Pet Name Field */}
            <div className="flex flex-col gap-1">
                <Label htmlFor="petId">Pet Name</Label>
                <Select
                    onValueChange={(value) => setValue("petId", value)}
                    value={watch("petId")}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {pets?.map((pet) => (
                                <SelectItem key={pet.id} value={pet.id}>
                                    {pet.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {errors.petId && <p className="text-red-500 text-xs">{errors.petId.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="checkInDateTime">Check In Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkInDateTime && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {checkInDateTime ? format(checkInDateTime, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={checkInDateTime}
                            onSelect={(date) => date && setValue("checkInDateTime", date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.checkInDateTime && <p className="text-red-500 text-xs">{errors.checkInDateTime.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="status">Status</Label>
                <Select
                    onValueChange={(value) => setValue("status", value as Status)}
                    value={watch("status")}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.values(Status).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {transformStatus(type)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <Button className="mt-1">
                {(actionType === "add") ? "Add Daycare" : "Update Daycare"}
            </Button>
        </form>
    )
}

