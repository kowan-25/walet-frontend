'use client'

import { forbidden, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProjectAnalysisResponse } from "./interface";
import api from "@/lib/api";
import { MONTHS } from "./constant";
import MonthDialog from "./MonthDialog";
import { Loader2 } from "lucide-react";
import PieChartCard from "./PieChartCard";
import TopCategoriesCard from "./TopCategoriesCard";
import FinancialSummaryCard from "./FinancialSummaryCard";
import MonthlyPerformanceCard from "./MonthlyPerformanceCard";
import TopMembersCard from "./TopMembersCard";

export default function FinancialAnalysisPage() {
    const { id } = useParams();
    const [data, setData] = useState<ProjectAnalysisResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [tempMonth, setTempMonth] = useState<number>(month);
    const [tempYear, setTempYear] = useState<number>(year);
    const [yearError, setYearError] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = (open: boolean) => {
        if (open) {
            setTempMonth(month);
            setTempYear(year);
            setYearError("");
        }
        setDialogOpen(open);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/project/analytics/${id}?month=${month}&year=${year}`);
                if (response.status === 403) {
                    forbidden();
                }
                if (response.status !== 200) {
                    throw new Error('Error fetching analytics data');
                }
                setData(response.data);
                setYear(response.data.year);
                setMonth(response.data.month);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, month, year]);

    if (isLoading) {
        return <Loader2 className="animate-spin w-6 h-6 mr-2" />;
    }

    return (
        <section className="bg-accent-white-rock rounded-2xl p-5">
            <div className="flex flex-row justify-between items-center mb-5">
                <h1 className="text-3xl font-semibold">Financial Analytics</h1>
                <div className="flex flex-row items-center justify-center gap-4">
                    <h3 className="text-xl">Date: {MONTHS[month]} {year}</h3>
                    <MonthDialog
                        open={dialogOpen}
                        onOpenChange={handleDialogOpen}
                        tempMonth={tempMonth}
                        setTempMonth={setTempMonth}
                        yearError={yearError}
                        setYearError={setYearError}
                        tempYear={tempYear}
                        setTempYear={setTempYear}
                        setMonth={setMonth}
                        setYear={setYear}
                        setDialogOpen={setDialogOpen}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-10">
                <div className="space-y-5">
                    <PieChartCard 
                        data={data}
                        month={month}
                        year={year}
                    />
                    <TopCategoriesCard 
                        month={month}
                        year={year}
                        data={data}
                    />
                </div>
                <div>
                    <div>
                    <FinancialSummaryCard 
                        month={month}
                        year={year}
                        data={data}
                    />
                    <MonthlyPerformanceCard
                        month={month}
                        year={year}
                        data={data}
                    />
                    </div>
                    <TopMembersCard 
                        month={month}
                        year={year}
                        data={data}
                    />
                </div>
            </div>
        </section>
    )
}