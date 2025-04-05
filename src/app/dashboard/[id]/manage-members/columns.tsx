/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ProjectMember } from "@/lib/api/types"
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import RemoveMemberAlertDialog from "./RemoveMemberAlertDialog"
import { useState } from "react"

export const columns: ColumnDef<ProjectMember>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span>{index}</span>
    }
  },
  {
    accessorKey: "member_name",
    header: "Username",
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const budget: number = row.getValue("budget");
      return budget.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
  },
  {
    accessorKey: "created_at",
    header: "Tanggal bergabung",
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
    id: "actions",
    cell: ({ row, table }) => {
      const member = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [open, setOpen] = useState(false)
      const onRefreshNeeded = (table.options.meta as any)?.onRefreshNeeded;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.member_name)}
            >
              Copy username member
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpen(true)}
            >
              Keluarkan member
            </DropdownMenuItem>
          </DropdownMenuContent>
          <RemoveMemberAlertDialog 
            member={member} 
            open={open} 
            setOpen={setOpen} 
            onRefresh={onRefreshNeeded}
          />
        </DropdownMenu>
      )
    },
  },
]
