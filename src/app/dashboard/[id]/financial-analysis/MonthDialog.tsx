import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MonthDialogProps } from "./interface";
import React from "react";
import { Button } from "@/components/ui/button";
import { MAX_YEAR, MIN_YEAR, MONTHS } from "./constant";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const MonthDialog: React.FC<MonthDialogProps> = ({
    open,
    onOpenChange,
    tempMonth,
    setTempMonth,
    yearError,
    setYearError,
    tempYear,
    setTempYear,
    setMonth,
    setYear,
    setDialogOpen,
}) => {
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setTempYear(value);
        validateYear(value);
    };

    const validateYear = (year: number): boolean => {
        if (isNaN(year) || year < MIN_YEAR) {
            setYearError(`Year must be at least ${MIN_YEAR}`);
            return false;
        }
        if (year > MAX_YEAR) {
            setYearError(`Year cannot be greater than ${MAX_YEAR}`);
            return false;
        }
        setYearError("");
        return true;
    };

    const handleSaveChanges = () => {
        if (validateYear(tempYear)) {
            setMonth(tempMonth);
            setYear(tempYear);
            setDialogOpen(false);
        } else {
            toast.error("Invalid Year", {
                description: yearError,
            });
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-white">Edit Tanggal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit tanggal</DialogTitle>
                    <DialogDescription>
                        Pilih bulan dan tahun
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="w-full flex justify-between h-[58px] rounded-2xl p-4"
                                >
                                    {MONTHS[tempMonth]}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-[200px]">
                                <DropdownMenuLabel>Pilih Bulan</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {Object.entries(MONTHS).map(([monthNumber, monthName]) => (
                                    <DropdownMenuItem 
                                        key={monthNumber}
                                        onClick={() => setTempMonth(parseInt(monthNumber))}
                                        className={tempMonth === parseInt(monthNumber) ? "bg-accent-white-rock" : ""}
                                        >
                                        {monthName}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="w-full">
                        <Input 
                            className={`rounded-2xl p-4 h-[58px] ${yearError ? "border-red-500" : ""}`}
                            placeholder="YYYY" 
                            value={tempYear || ""}
                            onChange={handleYearChange}
                        />
                        {yearError && (
                            <p className="text-red-500 text-sm mt-1">{yearError}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button 
                        className="text-white"
                        onClick={handleSaveChanges}
                        disabled={!!yearError}
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MonthDialog;