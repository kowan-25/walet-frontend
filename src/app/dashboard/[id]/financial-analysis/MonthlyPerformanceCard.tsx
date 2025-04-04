import { 
    Card, 
    CardContent,
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { FinancialCardProps } from "./interface";

const MonthlyPerformanceCard: React.FC<FinancialCardProps> = ({
    data,
}) => {
    return (
        <Card className="w-full mt-5">
            <CardHeader>
            <CardTitle>Performa Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                <div>
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Utilisasi Budget</span>
                    <span className="text-sm font-medium">
                    {data ? ((data.total_spendings / (data.total_earnings || 1)) * 100).toFixed(1) : 0}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                    className={`h-2 rounded-full ${
                        (data?.total_spendings ?? 0) > (data?.total_earnings ?? 0) 
                        ? 'bg-red-500' 
                        : 'bg-green-500'
                    }`} 
                    style={{ 
                        width: `${Math.min(
                        ((data?.total_spendings ?? 0) / (data?.total_earnings ?? 1)) * 100, 
                        100
                        )}%` 
                    }}
                    ></div>
                </div>
                </div>
                
                <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                    <span>Net savings:</span>
                    {(() => {
                        const isPositiveBalance = (data?.total_earnings ?? 0) > (data?.total_spendings ?? 0);
                        const netSavingsAmount = isPositiveBalance ? 
                            ((data?.total_earnings ?? 0) - (data?.total_spendings ?? 0)) : 
                            ((data?.total_spendings ?? 0) - (data?.total_earnings ?? 0));
                        const netSavingsText = isPositiveBalance ? 
                            `+Rp${netSavingsAmount.toLocaleString()}` : 
                            `-Rp${netSavingsAmount.toLocaleString()}`;
                        
                        return (
                            <span className={isPositiveBalance ? 'text-green-500' : 'text-red-500'}>
                                {netSavingsText}
                            </span>
                        );
                    })()}
                </div>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}

export default MonthlyPerformanceCard;