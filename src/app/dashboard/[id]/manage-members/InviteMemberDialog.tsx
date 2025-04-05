/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    Dialog, 
    DialogContent, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus2 } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { IoAlertCircleSharp } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
const InviteMemberDialog = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleError = (error: any) => {
        if (error.response) {
            if (error.response.status === 404) {
                setModalMessage("Member dengan email tersebut belum terdaftar");
            } else if (error.response.status === 400) {
                const errorMessage = error.response.data.error;
                if (errorMessage === "You Cannot Invite Yourself") {
                    setModalMessage("Anda tidak bisa mengundang diri sendiri");
                } else if (errorMessage === "User Already in Project") {
                    setModalMessage("Member tersebut sudah bergabung ke proyek");
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

    const handleInviteMember = async () => {
        if (!email) {
            setModalMessage("Email tidak boleh kosong");
            setIsSuccess(false);
            setIsModalOpen(true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setModalMessage("Email tidak valid");
            setIsSuccess(false);
            setIsModalOpen(true);
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(`/api/project/invite-member`,
                {
                    "email": email,
                    "project_id": id,
                }
            );

            if (response.status === 200) {
                setModalMessage("Undangan berhasil dikirim.");
                setIsSuccess(true);
                setIsModalOpen(true);
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }

    const handleCloseNotificationModal = () => {
        setOpen(false);
        setIsModalOpen(false);
        setEmail("");
    }

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isSuccess ? "Sukses" : "Gagal"} Mengundang Anggota ke Proyek!</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        {isSuccess ? 
                          <FaCheckCircle className="text-success" size={85} data-testid="success-icon" />
                          : <IoAlertCircleSharp className="text-alert" size={85} data-testid="error-icon" /> 
                        }
                        
                        <h1 className="text-xl text-center">{modalMessage}</h1>
                    </div>
                    <DialogFooter>
                        <Button 
                            className="text-white"
                            onClick={handleCloseNotificationModal}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <UserPlus2 />Undang Anggota Baru
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Undang Anggota ke Proyek</DialogTitle>
                    </DialogHeader>
                    <Input 
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <DialogFooter>
                        <Button className="w-1/5" disabled={loading} onClick={handleInviteMember}>
                            Undang
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
        </>
    )
}

export default InviteMemberDialog;