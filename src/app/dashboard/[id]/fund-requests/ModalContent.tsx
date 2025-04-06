import React from 'react'

interface DetailContentProps {
  tanggal: string
  alasan: string
  jumlah: string
  status: string
  username: string
  resolveMsg: string
}

export default function ModalContent({ tanggal, alasan, jumlah, status, username, resolveMsg }: DetailContentProps) {
  let statusColor = ""
  if (status === "approved") {
    statusColor = "bg-success"
  } else if (status === "rejected") {
    statusColor = "bg-alert"
  } else if (status === "pending") {
    statusColor = "bg-yellow-400"
  }

  return (
    <div className="flex flex-col gap-8 m-5">
      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Tanggal Pengajuan:</span>
        <span>{new Date(tanggal).toLocaleDateString('id-ID')}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Alasan Pengajuan:</span>
        <span className="text-right">{alasan}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Jumlah Dana Diminta:</span>
        <span className="text-right">
          Rp {parseFloat(jumlah).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600">Status:</span>
        <div className={`inline-block px-3 py-1 ${statusColor} text-white text-sm text-center font-medium rounded-xl`}>
          {status}
        </div>
      </div>

      {status != "pending" && (
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Kata kata dari kak gem:</span>
          <span className="text-right">
            {resolveMsg}
          </span>
        </div>
      )}

      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Diajukan oleh:</span>
        <span className="text-right">{username}</span>
      </div>
    </div>
  )
}
