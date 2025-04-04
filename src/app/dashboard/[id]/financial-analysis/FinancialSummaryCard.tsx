import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { MONTHS } from "./constant";
import { FinancialCardProps } from "./interface";

const FinancialSummaryCard: React.FC<FinancialCardProps> = ({
    month,
    year,
    data,
}) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>{MONTHS[month]} {year}</CardDescription>
            </CardHeader>
            <CardContent>
            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="text-left pb-2">Tipe Transaksi</th>
                    <th className="text-right pb-2">Jumlah</th>
                    <th className="text-right pb-2">Persentase</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b border-dashed">
                    <td className="py-3">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#4ade80] mr-2 rounded-sm"></div>
                        <span>Pemasukan</span>
                    </div>
                    </td>
                    <td className="text-right text-green-500 font-medium">
                    Rp{data?.total_earnings?.toLocaleString() ?? '0'}
                    </td>
                    <td className="text-right">
                    {data ? (
                        ((data.total_earnings / (data.total_earnings + data.total_spendings)) * 100).toFixed(1)
                    ) : '0'}%
                    </td>
                </tr>
                <tr className="border-b">
                    <td className="py-3">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#f87171] mr-2 rounded-sm"></div>
                        <span>Pengeluaran</span>
                    </div>
                    </td>
                    <td className="text-right text-red-500 font-medium">
                    Rp{data?.total_spendings?.toLocaleString() ?? '0'}
                    </td>
                    <td className="text-right">
                    {data ? (
                        ((data.total_spendings / (data.total_earnings + data.total_spendings)) * 100).toFixed(1)
                    ) : '0'}%
                    </td>
                </tr>
                <tr>
                    <td className="pt-3 font-semibold">Balance</td>
                    <td className={`text-right pt-3 font-semibold ${
                    (data?.total_earnings ?? 0) - (data?.total_spendings ?? 0) >= 0 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                    Rp{((data?.total_earnings ?? 0) - (data?.total_spendings ?? 0)).toLocaleString()}
                    </td>
                    <td></td>
                </tr>
                </tbody>
            </table>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div>Statistik bulanan</div>
            <div>{(() => {
                if (!data) return '';
                
                const isIncomeLarger = (data.total_earnings ?? 0) > (data.total_spendings ?? 0);
                if (isIncomeLarger) {
                    return `Surplus: ${((data.total_earnings / data.total_spendings) * 100 - 100).toFixed(1)}% di atas pengeluarab`;
                } else {
                    return `Deficit: ${((data.total_spendings / data.total_earnings) * 100 - 100).toFixed(1)}% di bawah pemasukan`;
                }
            })()}</div>
            </CardFooter>
        </Card>
    )
}

export default FinancialSummaryCard;