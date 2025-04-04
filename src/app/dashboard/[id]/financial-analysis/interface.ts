import { Dispatch, SetStateAction } from "react";

export interface ProjectAnalysisResponse {
    month: number;
    year: number;
    total_earnings: number;
    total_spendings: number;
    top_categories: TopCategory[];
    top_members: TopMember[];
}

export interface TopCategory {
    name: string;
    total_spendings: number;
    percentage: number;
}

export interface TopMember {
    username: string;
    user_id: string;
    transaction_amount: number;
    total_amount: number;
    percentage: number;
}

export interface MonthDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tempMonth: number
    setTempMonth: Dispatch<SetStateAction<number>>
    yearError: string
    setYearError: Dispatch<SetStateAction<string>>
    tempYear: number
    setTempYear: Dispatch<SetStateAction<number>>
    setMonth: Dispatch<SetStateAction<number>>
    setYear: Dispatch<SetStateAction<number>>
    setDialogOpen: Dispatch<SetStateAction<boolean>>
}

export interface FinancialCardProps {
    data?: ProjectAnalysisResponse
    month: number
    year: number
}