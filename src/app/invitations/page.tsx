/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import api from "@/lib/api";
import { ProjectInvitation } from "@/lib/api/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "./Header";
import { InvitationColumns } from "./columns";
import { DataTable } from "@/components/table/data-table";

const InvitationsPage: React.FC = () => {
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [invitations, setInvitations] = useState<ProjectInvitation[]>([]); 
    const fetchData = async () => {
        try {
            setIsLoadingPage(true);
            const response = await api.get(`/api/project/invitations`);

            if (response.status === 200) {
                setInvitations(response.data);
                setIsLoadingPage(false);
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoadingPage(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    if (isLoadingPage) {
        return (
            <section className="flex items-center justify-center w-full">
                <Loader2 className="animate-spin text-primary-600" size={100}/>
            </section>
        );
    }

    return (
        <section className="pt-[128px] px-8 pb-[18px] space-y-8">
            <Header />
            <DataTable 
                columns={InvitationColumns} 
                data={invitations} 
                emptyMessage="Belum ada undangan ke proyek."
                onRefreshNeeded={fetchData}
            />
        </section>
    )
}

export default InvitationsPage;