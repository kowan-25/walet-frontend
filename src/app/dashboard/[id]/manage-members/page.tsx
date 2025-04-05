/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import api from "@/lib/api";
import { ProjectMember } from "@/lib/api/types";
import { Loader2 } from "lucide-react";
import { forbidden, notFound, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import { columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import InviteMemberDialog from "./InviteMemberDialog";

const ManageMembersPage: React.FC = () => {
    const { id } = useParams();
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
    const fetchData = useCallback(async () => {
        try {
            setIsLoadingPage(true);
            const response = await api.get(`/api/project/${id}/members`);

            if (response.status === 404) {
                notFound();
            }

            if (response.status === 403) {
                forbidden();
            }

            if (response.status === 200) {
                setProjectMembers(response.data);
                setIsLoadingPage(false);
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoadingPage(false);
        }
    }, []); 
    
    useEffect(() => {
        fetchData();
    }, [fetchData, id])

    if (isLoadingPage) {
        return (
            <section className="flex items-center justify-center w-full">
                <Loader2 className="animate-spin text-primary-600" size={100}/>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <Header />
            <div className="flex justify-end">
                <InviteMemberDialog />
            </div>
            <DataTable 
                columns={columns} 
                data={projectMembers} 
                emptyMessage="Belum ada anggota proyek."
                onRefreshNeeded={fetchData}
            />
        </section>
    )
}

export default ManageMembersPage;