/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ProjectInvitation } from "@/lib/api/types"
import { ColumnDef } from "@tanstack/react-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { IoAlertCircleSharp } from "react-icons/io5"
import { FaCheckCircle } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

export const InvitationColumns: ColumnDef<ProjectInvitation>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span>{index}</span>
    }
  },
  {
    accessorKey: "project_name",
    header: "Nama Proyek",
  },
  {
    accessorKey: "project_manager_username",
    header: "Nama Manager Proyek",
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Diundang",
    cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
  },
  {
    accessorKey: "expires_at",
    header: "Tanggal Kadaluarsa",
    cell: ({ row }) => {
        const date = new Date(row.getValue("expires_at"));
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const invitation = row.original
      const [open, setOpen] = useState(false)
      const [loading, setLoading] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [isSuccess, setIsSuccess] = useState(false);
      const onRefreshNeeded = (table.options.meta as any)?.onRefreshNeeded;

      const handleJoinProject = async () => {
            try {
                setLoading(true);
                const response = await api.post(`/api/project/add-member/${invitation.id}`);

                if (response.status === 200) {
                    setModalMessage(`Selamat! Anda berhasil bergabung ke proyek ${invitation.project_name}.`);
                    setIsSuccess(true);
                    setIsModalOpen(true);
                }
            } catch (error: any) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        }

        const handleError = (error: any) => {
            if (error.response) {
                if (error.response.status === 400) {
                    const errorMessage = error.response.data.error;
                    if (errorMessage === "Invitation Expired") {
                        setModalMessage("Undangan sudah expired!");
                    } else if (errorMessage === "Invitation Already Used") {
                        setModalMessage("Undangan sudah dipakai!");
                    } else if (errorMessage === "User Already in Project") {
                        setModalMessage("Anda sudah bergabung ke proyek ini!");
                    } else {
                        setModalMessage("Terjadi error. Silakan coba lagi");
                    }
                } else {
                    setModalMessage("Terjadi error. Silakan coba lagi");
                }
            } else {
                setModalMessage("Terjadi error. Silakan coba lagi");
            }
            setIsSuccess(false);
            setIsModalOpen(true);
        };

      const handleCloseNotificationModal = () => {
        setOpen(false);
        setIsModalOpen(false);
        if (isSuccess && onRefreshNeeded) {
            onRefreshNeeded();
        }
      }
 
      return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger className="p-2 bg-primary text-white hover:bg-primary/80 rounded-md">
                    Gabung
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin bergabung ke proyek {invitation.project_name}?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        onClick={handleJoinProject}
                    >
                        Gabung
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{isSuccess ? "Sukses" : "Gagal"} Bergabung ke Proyek {invitation.project_name}!</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        {isSuccess ? 
                          <FaCheckCircle className="text-success" size={85} data-testid="success-icon" />
                          : <IoAlertCircleSharp className="text-alert" size={85} data-testid="error-icon" /> 
                        }
                        
                        <h1 className="text-xl text-center">{modalMessage}</h1>
                    </div>
                    <AlertDialogFooter>
                        <Button 
                            className="text-white"
                            onClick={handleCloseNotificationModal}
                        >
                            Tutup
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
      )
    },
  },
]
