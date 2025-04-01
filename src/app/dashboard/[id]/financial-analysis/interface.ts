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

export const MONTHS: Record<number, string> = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};