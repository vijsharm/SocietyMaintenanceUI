import { useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./utils";

interface MonthYearPickerProps {
  value: string; // Format: YYYY-MM
  onChange: (value: string) => void;
  minDate?: string; // Format: YYYY-MM
  maxDate?: string; // Format: YYYY-MM
  className?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function MonthYearPicker({ value, onChange, minDate, maxDate, className }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const [year] = value.split("-");
    return parseInt(year);
  });

  const selectedDate = new Date(value + "-01");
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const handleMonthSelect = (monthIndex: number) => {
    const newValue = `${viewYear}-${String(monthIndex + 1).padStart(2, "0")}`;
    onChange(newValue);
    setOpen(false);
  };

  const isMonthDisabled = (monthIndex: number) => {
    const checkDate = `${viewYear}-${String(monthIndex + 1).padStart(2, "0")}`;
    
    if (minDate && checkDate < minDate) return true;
    if (maxDate && checkDate > maxDate) return true;
    
    return false;
  };

  const handlePrevYear = () => {
    setViewYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setViewYear(prev => prev + 1);
  };

  const displayText = selectedDate.toLocaleDateString("en-IN", { 
    month: "long", 
    year: "numeric" 
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
          <span className="text-slate-700">{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 shadow-2xl border-emerald-200" align="start">
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-t-lg p-4 border-b border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevYear}
              className="h-8 w-8 p-0 hover:bg-emerald-100"
            >
              <ChevronLeft className="h-4 w-4 text-emerald-700" />
            </Button>
            <div className="text-lg font-semibold text-emerald-800">
              {viewYear}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextYear}
              className="h-8 w-8 p-0 hover:bg-emerald-100"
            >
              <ChevronRight className="h-4 w-4 text-emerald-700" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 bg-white">
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => {
              const isSelected = index === selectedMonth && viewYear === selectedYear;
              const isDisabled = isMonthDisabled(index);
              
              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => !isDisabled && handleMonthSelect(index)}
                  disabled={isDisabled}
                  className={cn(
                    "h-12 text-sm font-medium transition-all",
                    isSelected 
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-700 hover:to-teal-700" 
                      : "border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700",
                    isDisabled && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {month.slice(0, 3)}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
