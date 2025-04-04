import { 
    Card, 
    CardContent,
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { FinancialCardProps } from "./interface";

const TopMembersCard: React.FC<FinancialCardProps> = ({
    data,
}) => {
    const getMemberBarColor = (index: number): string => {
        if (index === 0) return 'bg-yellow-500';
        if (index === 1) return 'bg-gray-400';
        if (index === 2) return 'bg-amber-700';
        return 'bg-gray-300';
    };

    return (
        <Card className="w-full mt-5">
            <CardHeader>
                <CardTitle>Top Members</CardTitle>
            </CardHeader>
            <CardContent>
                {data?.top_members && data.top_members.length > 0 ? (
                    <div className="space-y-4">
                        {data.top_members.map((member, index) => (
                            <div key={member.user_id} className="flex items-center">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-white font-medium ${getMemberBarColor(index)}`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{member.username}</span>
                                        <span className="font-medium">Rp{member.total_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>{member.transaction_amount} transaksi</span>
                                        <span>{member.percentage.toFixed(1)}% dari total</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div 
                                            className={`h-2 rounded-full ${getMemberBarColor(index)}`}
                                            style={{ width: `${member.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-4 text-center text-muted-foreground">
                        Belum ada data
                    </div>
                )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground border-t pt-4">
                {data?.top_members && data.top_members.length > 0 && (
                    <div>
                        Top {data.top_members.length} akun member untuk {
                            data.top_members.reduce((sum, member) => sum + member.percentage, 0).toFixed(1)
                        }% dari semua pengeluaran
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

export default TopMembersCard;