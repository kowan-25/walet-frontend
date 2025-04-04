import { 
    Card, 
    CardContent, 
    CardDescription,
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { MONTHS } from "./constant";
import { FinancialCardProps } from "./interface";

const TopCategoriesCard: React.FC<FinancialCardProps> = ({
    month,
    year,
    data,
}) => {
    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle>Top Kategori</CardTitle>
                <CardDescription>{MONTHS[month]} {year}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {data?.top_categories && data.top_categories.length > 0 ? (
                <div className="space-y-3">
                    {data.top_categories.map((category) => {
                    const percentage = data.total_spendings > 0 
                        ? ((category.total_spendings / data.total_spendings) * 100).toFixed(1) 
                        : 0;
                        
                    return (
                        <div key={category.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">{category.name}</span>
                            <span className="font-medium">Rp{category.total_spendings.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{percentage}% dari total pengeluaran</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                            className="bg-accent-dirty-blue h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        </div>
                    );
                    })}
                </div>
                ) : (
                <div className="py-4 text-center text-muted-foreground">
                    Belum ada data
                </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TopCategoriesCard;