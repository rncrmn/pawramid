"use client"

import React, {useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {FilePenLine, Trash2, User} from "lucide-react";
import ClientForm from "@/components/client-form";
import {flushSync} from "react-dom";

type ClientButtonProps = {
    actionType: "add" | "edit" | "delete";
    children: React.ReactNode;
    onClick?: () => void;
}

export default function ClientButton({actionType, children, onClick}: ClientButtonProps) {
    const [isClientFormOpen, setIsClientFormOpen] = useState(false);

    if (actionType === "delete") {
        return (
            <Button onClick={onClick} variant="link" size="icon" className="size-5 cursor-pointer" asChild><Trash2
                className="text-rose-600 hover:text-rose-700"/></Button>
        )
    }

    return (
        <Dialog open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
            <DialogTrigger asChild>
                {
                    (actionType === "add") ? (
                        <Button className="cursor-pointer"><User/> {children}</Button>
                    ) : (
                        <Button onClick={onClick} variant="link" size="icon" className="size-5 cursor-pointer"
                                asChild><FilePenLine/></Button>
                    )
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    {
                        (actionType === "add") ? (
                            <DialogTitle>Add New Client</DialogTitle>
                        ) : (
                            <DialogTitle>Edit Client</DialogTitle>
                        )
                    }
                </DialogHeader>
                <ClientForm
                    actionType={actionType}
                    onFormSubmission={() => {
                        flushSync(() => {
                            setIsClientFormOpen(false);
                        });
                    }}/>
            </DialogContent>
        </Dialog>
    )
}
