"use client"

import React, {useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {FilePenLine, Trash2, Calendar} from "lucide-react";
import {flushSync} from "react-dom";
import BoardingForm from "@/components/boarding-form";

type BoardingButtonProps = {
    actionType: "add" | "edit" | "delete";
    children: React.ReactNode;
    onClick?: () => void;
}

export default function BoardingButton({actionType, children, onClick}: BoardingButtonProps) {
    const [isBoardingFormOpen, setIsBoardingFormOpen] = useState(false);

    if (actionType === "delete") {
        return (
            <Button onClick={onClick} variant="link" size="icon" className="size-5 cursor-pointer" asChild><Trash2
                className="text-rose-600 hover:text-rose-700"/></Button>
        )
    }

    return (
        <Dialog open={isBoardingFormOpen} onOpenChange={setIsBoardingFormOpen}>
            <DialogTrigger asChild>
                {
                    (actionType === "add") ? (
                        <Button className="cursor-pointer"><Calendar/> {children}</Button>
                    ) : (
                        <Button onClick={onClick} variant="link" size="icon" className="size-5 cursor-pointer"
                                asChild><FilePenLine/></Button>
                    )
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar/> {actionType === "add" ? "Add New Boarding" : "Edit Boarding"}
                    </DialogTitle>
                </DialogHeader>
                <BoardingForm
                    actionType={actionType}
                    onFormSubmission={() => {
                        flushSync(() => {
                            setIsBoardingFormOpen(false);
                        });
                    }}/>
            </DialogContent>
        </Dialog>
    )
}
