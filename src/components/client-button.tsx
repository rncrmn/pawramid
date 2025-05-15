"use client"

import React, {useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {FilePenLine, Trash2, User} from "lucide-react";
import ClientForm from "@/components/client-form";
import {flushSync} from "react-dom";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type ClientButtonProps = {
    actionType: "add" | "edit" | "delete";
    children: React.ReactNode;
    onClick?: () => void;
}

export default function ClientButton({actionType, children, onClick}: ClientButtonProps) {
    const [isClientFormOpen, setIsClientFormOpen] = useState(false);

    if (actionType === "delete") {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="link" size="icon" className="size-5 cursor-pointer" asChild><Trash2
                        className="text-rose-600 hover:text-rose-700"/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="cursor-pointer" onClick={onClick}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
