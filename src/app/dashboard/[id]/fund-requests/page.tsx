"use client"

import Button from '@/components/buttons/Button'
import useUser from '@/hooks/useUser'
import api from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { GrAdd } from "react-icons/gr"
import { FaExpandAlt } from "react-icons/fa"
import { useParams, useRouter } from 'next/navigation';
import TemplateModal from '@/components/modals/TemplateModal'
import ModalContent from './ModalContent'
import Input from '@/components/inputs/Input'

export default function page() {
  const { userId, setUsername, username } = useUser();
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [budgetRequests, setBudgetRequests] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [isManager, setIsManager] = useState<boolean | null>(null);
  const [openActionModal, setOpenActionModal] = useState(false);
  const [status, setStatus] = useState<'approve' | 'reject' | null>(null);

  const [resolveMsg, setResolveMsg] = useState<string>("")
  
  useEffect(() => {
    const fetchProject = async () => {
      const response = await api.get(`api/project/${id}`);

      if (response.status === 200) {
        const data = response.data;
        if (data.manager === userId) {
          setIsManager(true);
        } else {
          setIsManager(false);
        }
      }
    };

    fetchProject();
  }, [userId]);

  useEffect(() => {
    const fetchFundRequests = async () => {
      const response = await api.get(`api/funds/budget-requests/${id}`);
      if (response.status === 200) {
        setBudgetRequests(response.data);
      }
    };
  
    const fetchAllFundRequests = async () => {
      const response = await api.get(`api/funds/budget-requests/project/${id}`);
      if (response.status === 200) {
        setBudgetRequests(response.data);
      }
    };
  
    if (isManager !== null) {
      if (isManager) {
        fetchAllFundRequests();
      } else {
        fetchFundRequests();
      }
    }
  }, [id, isManager]);

  if (isManager === null) {
    return null;
  }

  const handleActionClick = (item: any) => {
    if (item.status != "approved"){
      setSelectedItem(item);
      setOpenActionModal(true);
    }
  };

  const handleApprove = async (message: string) => {
    setStatus('approve');
    try {
      const response = await api.post(
        `api/funds/budget-requests/resolve/${selectedItem.id}`,
        {
          action: 'approve',
          resolve_note: message,
        }
      );
      if (response.status === 200) {
        setOpenActionModal(false);
        setBudgetRequests(budgetRequests.map(req =>
          req.id === selectedItem.id ? { ...req, status: 'approved' } : req
        ));
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };
  
  const handleReject = async (message: string) => {
    setStatus('reject');
    try {
      const response = await api.post(
        `api/funds/budget-requests/resolve/${selectedItem.id}`,
        {
          action: 'reject',
          resolve_note: message,
        }
      );
      if (response.status === 200) {
        setOpenActionModal(false);
        setBudgetRequests(budgetRequests.map(req =>
          req.id === selectedItem.id ? { ...req, status: 'rejected' } : req
        ));
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col items-start gap-[18px] p-[40px_36px] rounded-[20px] bg-gradient-to-r from-[#166088] to-[#2A7D8C] shadow-[0px_4px_12px_0px_rgba(168,213,226,0.80)]">
        <h1 className="self-stretch text-white text-[48px] font-semibold leading-normal">Fund Requests</h1>
        <p className="text-white text-[18px] font-normal leading-normal">
          Butuh dukungan dana tambahan? Sampaikan kebutuhan Anda secara transparan dan terperinci kepada manajer.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Daftar Permintaan Dana</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left border-b">Jumlah Dana Diminta</th>
                <th className="py-3 px-6 text-left border-b">Tanggal Pengajuan</th>
                <th className="py-3 px-6 text-left border-b">Status</th>
                <th className="py-3 px-6 text-center border-b w-12"></th>
                {isManager && (
                  <th className="py-3 px-6 text-center border-b w-12">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {budgetRequests.map((item: any) => {
                let statusColor = "";

                if (item.status === "approved") {
                  statusColor = "bg-success";
                } else if (item.status === "rejected") {
                  statusColor = "bg-alert";
                } else if (item.status === "pending") {
                  statusColor = "bg-[#FECE00]";
                }

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 border-b">
                      Rp {parseFloat(item.amount).toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-6 border-b">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-6 border-b capitalize font-semibold">
                      <div className={`inline-block px-3 py-1 ${statusColor} text-white text-sm text-center font-medium rounded-xl`}>
                        {item.status}
                      </div>
                    </td>
                    <td className="py-3 px-6 border-b text-center">
                      <FaExpandAlt onClick={() => {
                        setOpenBudgetModal(true);
                        setSelectedItem(item);
                      }} className="text-gray-600 cursor-pointer" />
                    </td>
                    {isManager && (
                      <td className="py-3 px-6 border-b text-center">
                        <button
                          onClick={() => handleActionClick(item)}
                          className="text-primary font-medium hover:text-primary-400"
                        >
                          Action
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {budgetRequests.length === 0 && (
                <tr>
                  <td colSpan={isManager ? 5 : 4} className="text-center py-6 text-gray-400">
                    Belum ada permintaan dana.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isManager && (
          <div className="flex justify-end mt-8">
            <Button onClick={() => { router.push(`/dashboard/${id}/fund-requests/create`); }} className="text-white font-medium rounded-[20px]">
              <GrAdd />
              Ajukan Permintaan
            </Button>
          </div>
        )}
      </div>

      <TemplateModal isOpen={openBudgetModal} onClose={() => { setOpenBudgetModal(false); }}>
        <h2 className="text-2xl font-bold mb-12 m-5">Detail Fund Request</h2>
        {selectedItem && <ModalContent tanggal={selectedItem.created_at} alasan={selectedItem.request_reason} jumlah={selectedItem.amount} status={selectedItem.status} username={username} resolveMsg={selectedItem.resolve_note} />}
        <button
          onClick={() => setOpenBudgetModal(false)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-400 transition-all cursor-pointer mt-18"
        >
          Tutup
        </button>
      </TemplateModal>

      {openActionModal && (
        <TemplateModal isOpen={openActionModal} onClose={() => setOpenActionModal(false)}>
          <div className="w-full max-w-md p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Approve or Reject Fund Request
            </h2>

            <Input 
              label='Kasih pesan dong kaa~'
              name='resolveMsg'
              value={resolveMsg}
              onChange={(e) => setResolveMsg(e.target.value)}
              className='m-4 mb-10'
            />

            <div className="flex flex-col gap-4 w-full">
              <Button 
                onClick={() => handleApprove(resolveMsg)} 
                className="text-white bg-success hover:bg-green-400 w-full"
              >
                Approve
              </Button>
              <Button 
                onClick={() => handleReject(resolveMsg)} 
                className="text-white bg-alert hover:bg-red-400 w-full"
              >
                Reject
              </Button>
              <Button 
                onClick={() => setOpenActionModal(false)} 
                className="text-white bg-primary hover:bg-primary-600 w-full"
              >
                Kembali
              </Button>
            </div>
          </div>
        </TemplateModal>
      )}
    </div>
  );
}
