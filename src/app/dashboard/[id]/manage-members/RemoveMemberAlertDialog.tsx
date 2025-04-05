/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { ProjectMember } from "@/lib/api/types";
import { Dispatch, SetStateAction, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoAlertCircleSharp } from "react-icons/io5";
  
  const RemoveMemberAlertDialog = (
    {
        member, 
        open, 
        setOpen,
        onRefresh
    }: {
        member: ProjectMember,
        open: boolean,
        setOpen: Dispatch<SetStateAction<boolean>>
        onRefresh: () => void,
    }
  ) => {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRemoveMember = async () => {
        try {
            setLoading(true);
            const response = await api.delete(`/api/project/${member.project}/members/${member.member}/remove`);
            if (response.status === 204) {
                setModalMessage("Berhasil mengeluarkan anggota proyek");
                setIsSuccess(true);
                setIsModalOpen(true);
                setLoading(false);
                setOpen(true);
            }
        } catch (error: any) {
            if (error.response) {
                setModalMessage("Terjadi kesalahan. Silakan coba lagi");
                setIsSuccess(false);
                setIsModalOpen(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNotificationModal = () => {
        setOpen(false);
        setIsModalOpen(false);

        if (isSuccess && onRefresh) {
            onRefresh();
        }
    }
    
    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin mengeluarkan member {member.member_name}?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                        className="bg-alert hover:bg-alert/80"
                        disabled={loading}
                        onClick={handleRemoveMember}
                    >
                        Keluarkan
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{isSuccess ? "Sukses" : "Gagal"} Mengeluarkan Anggota dari Proyek!</AlertDialogTitle>
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
    );
}

export default RemoveMemberAlertDialog;