"use client"

import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {boardingFormSchema, TBoardingForm} from "@/lib/validations";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useBoardingContext} from "@/hooks/use-boarding-context";
import {Status} from "@prisma/client";
import {cn, transformStatus} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

type BoardingFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

export default function BoardingForm({actionType, onFormSubmission}: BoardingFormProps) {
    const {selectedBoarding, handleAddBoarding, handleEditBoarding, pets} = useBoardingContext()

    const {
        setValue,
        watch,
        trigger,
        getValues,
        formState: {errors},
    } = useForm<TBoardingForm>({
        resolver: zodResolver(boardingFormSchema),
        defaultValues:
            actionType === "edit"
                ? {
                    petId: selectedBoarding?.petId,
                    checkInDateTime: selectedBoarding?.checkInDateTime ? new Date(selectedBoarding.checkInDateTime) : undefined,
                    checkOutDateTime: selectedBoarding?.checkOutDateTime ? new Date(selectedBoarding.checkOutDateTime) : undefined,
                    status: selectedBoarding?.status
                } as TBoardingForm
                : {
                    checkInDateTime: new Date(),
                    checkOutDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
                },
    });

    // Watch the date values for display in the UI
    const checkInDateTime = watch("checkInDateTime");
    const checkOutDateTime = watch("checkOutDateTime");

    return (
        <form action={
            async () => {
                const result = await trigger();
                if (!result) return;

                onFormSubmission()

                const boardingData = getValues()

                if (actionType === "add") {
                    await handleAddBoarding(boardingData);
                } else if (actionType === "edit") {
                    await handleEditBoarding(selectedBoarding!.id, boardingData);
                }
            }
        } className="flex flex-col gap-5">
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
                <Label htmlFor="checkOutDateTime">Check Out Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkOutDateTime && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {checkOutDateTime ? format(checkOutDateTime, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={checkOutDateTime}
                            onSelect={(date) => date && setValue("checkOutDateTime", date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.checkOutDateTime &&
                    <p className="text-red-500 text-xs">{errors.checkOutDateTime.message}</p>}
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

            {/* Submit Button */}
            <Button className="mt-1">
                {(actionType === "add") ? "Add Boarding" : "Update Boarding"}
            </Button>
        </form>
    )
}

