"use client"

import React, {useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {FilePenLine, PawPrint, Trash2} from "lucide-react";
import {flushSync} from "react-dom";
import PetForm from "@/components/pet-form";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type PetButtonProps = {
    actionType: "add" | "edit" | "delete";
    children: React.ReactNode;
    onClick?: () => void;
}

export default function PetButton({actionType, children, onClick}: PetButtonProps) {
    const [isPetFormOpen, setIsPetFormOpen] = useState(false);

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
        <Dialog open={isPetFormOpen} onOpenChange={setIsPetFormOpen}>
            <DialogTrigger asChild>
                {
                    (actionType === "add") ? (
                        <Button className="cursor-pointer"><PawPrint/> {children}</Button>
                    ) : (
                        <Button onClick={onClick} variant="link" size="icon" className="size-5 cursor-pointer"
                                asChild><FilePenLine/></Button>
                    )
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PawPrint/> {actionType === "add" ? "Add New Pet" : "Edit Pet"}
                    </DialogTitle>
                </DialogHeader>
                <PetForm
                    actionType={actionType}
                    onFormSubmission={() => {
                        flushSync(() => {
                            setIsPetFormOpen(false);
                        });
                    }}/>
            </DialogContent>
        </Dialog>
    )
}
