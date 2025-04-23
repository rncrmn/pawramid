"use client"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import ClientButton from "@/components/client-button";
import {useClientContext} from "@/hooks/use-client-context";
import {startTransition} from "react";
import {CircleUserRound, Mail, MapPin, Phone} from "lucide-react";

export default function ClientsTable() {
    const {clients, handleChangeSelectedClientId, handleDeleteClient} = useClientContext();

    if (!clients) {
        return EmptyView()
    }

    return (

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    clients.map((client, index) => {
                        return (
                            <TableRow key={client.id}>
                                <TableCell className="h-15">
                                    {String(1001 + index).padStart(4, '0')}
                                </TableCell>
                                <TableCell className="h-15"><span
                                    className="font-semibold flex items-center gap-1"><CircleUserRound
                                    className="w-4"/>{client.name}</span>
                                </TableCell>
                                <TableCell className="h-15">
                                    <span className="flex items-center gap-1"><MapPin
                                        className="w-4"/>{client.address}</span>
                                </TableCell>
                                <TableCell className="h-15"><a
                                    href={`tel:${client.phone}`}
                                    className="text-indigo-700 dark:text-indigo-500 font-medium flex items-center gap-1"><Phone
                                    className="w-4"/> {client.phone}
                                </a></TableCell>
                                <TableCell className="h-15"><a
                                    href={`mailto:${client.email}`}
                                    className="text-teal-700 dark:text-teal-500 font-medium flex items-center gap-1"><Mail
                                    className="w-4"/>{client.email}
                                </a></TableCell>
                                <TableCell className="h-15">
                                    <div className="flex space-x-3">
                                        <ClientButton actionType="edit"
                                                      onClick={() => {
                                                          handleChangeSelectedClientId(client.id)
                                                      }}>edit</ClientButton>
                                        <ClientButton actionType="delete"
                                                      onClick={() => {
                                                          startTransition(async () => {
                                                              await handleDeleteClient(client.id)
                                                          })
                                                      }}>delete</ClientButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })
                }

            </TableBody>
        </Table>

    )
}

function EmptyView() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="text-center" colSpan={6}>No data available yet</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}