"use client"

import React, {useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {FilePenLine, Trash2, Calendar} from "lucide-react";
import {flushSync} from "react-dom";
import DaycareForm from "@/components/daycare-form";

type DaycareButtonProps = {
    actionType: "add" | "edit" | "delete";
    children: React.ReactNode;
    onClick?: () => void;
}

export default function DaycareButton({actionType, children, onClick}: DaycareButtonProps) {
    const [isDaycareFormOpen, setIsDaycareFormOpen] = useState(false);

    if (actionType === "delete") {
        return (
            <Button onClick={onClick} variant="link" size="icon" className="size-5 cursor-pointer" asChild><Trash2
                className="text-rose-600 hover:text-rose-700"/></Button>
        )
    }

    return (
        <Dialog open={isDaycareFormOpen} onOpenChange={setIsDaycareFormOpen}>
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
                        <Calendar/> {actionType === "add" ? "Add New Daycare" : "Edit Daycare"}
                    </DialogTitle>
                </DialogHeader>
                <DaycareForm
                    actionType={actionType}
                    onFormSubmission={() => {
                        flushSync(() => {
                            setIsDaycareFormOpen(false);
                        });
                    }}/>
            </DialogContent>
        </Dialog>
    )
}
