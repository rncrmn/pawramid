"use client"

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {clientFormSchema, TClientForm} from "@/lib/validations";
import {useClientContext} from "@/hooks/use-client-context";

type ClientFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

export default function ClientForm({actionType, onFormSubmission}: ClientFormProps) {
    const {selectedClient, handleAddClient, handleEditClient} = useClientContext();

    const {
        register,
        trigger,
        getValues,
        formState: {errors},
    } = useForm<TClientForm>({
        resolver: zodResolver(clientFormSchema),
        defaultValues:
            actionType === "edit"
                ? {
                    name: selectedClient?.name,
                    address: selectedClient?.address,
                    phone: selectedClient?.phone,
                    email: selectedClient?.email,
                }
                : undefined,
    });

    return (
        <form
            action={async () => {
                const result = await trigger();
                if (!result) return;

                onFormSubmission();

                const clientData = getValues();

                if (actionType === "add") {
                    await handleAddClient(clientData);
                } else if (actionType === "edit") {
                    await handleEditClient(selectedClient!.id, clientData);
                }
            }}
            className="flex flex-col gap-5"
        >
            <div className="flex flex-col gap-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
                {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <Button className="mt-1">
                {actionType === "add" ? "Add Client" : "Update Client"}
            </Button>
        </form>
    )
}
