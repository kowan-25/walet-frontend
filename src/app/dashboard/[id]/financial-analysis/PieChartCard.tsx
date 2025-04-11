import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, LabelList, Pie, PieChart } from "recharts";
import { MONTHS } from "./constant";
import { FinancialCardProps } from "./interface";

const PieChartCard: React.FC<FinancialCardProps> = ({
    month,
    year,
    data,
}) => {
    const generateFinancialChartData = () => {
        if (!data) return [];
        
        return [
            { name: "Pemasukan", value: data.total_earnings ?? 0, fill: "#4ade80" },
            { name: "Pengeluaran", value: data.total_spendings ?? 0, fill: "#f87171" },
        ];
    };

    const financialChartConfig = {
        value: {
            label: "Jumlah",
        },
        Income: {
            label: "Pemasukan",
            color: "#4ade80",
        },
        Expense: {
            label: "Pengeluaran",
            color: "#f87171",
        },
    } satisfies ChartConfig;

    return (
        <Card className="w-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
                <CardDescription>{MONTHS[month]} {year}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {data ? (
                    <ChartContainer
                        config={financialChartConfig}
                        className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-foreground"
                    >
                        <PieChart>
                            <ChartTooltip
                                content={<ChartTooltipContent nameKey="value" />}
                            />
                            <Pie 
                                data={generateFinancialChartData()} 
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                labelLine={false}
                            >
                                {generateFinancialChartData().map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                                <LabelList 
                                    dataKey="value" 
                                    position="inside"
                                    style={{ fill: '#fff', fontSize: 12 }} 
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                ) : (
                    <div className="flex items-center justify-center h-[250px]">
                        <p className="text-muted-foreground">No data available</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="justify-center gap-4 pt-0">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#4ade80] mr-2 rounded-sm"></div>
                    <span>Pemasukan: Rp{data?.total_earnings?.toLocaleString() ?? '0'}</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#f87171] mr-2 rounded-sm"></div>
                    <span>Pengeluaran: Rp{data?.total_spendings?.toLocaleString() ?? '0'}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PieChartCard;