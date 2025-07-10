import { Input } from "@/components/ui/input";
import { format, isAfter, isBefore, isSameDay, setDate } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import React, {useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const DateFilter = ({ date, setDate }: { date: Date; setDate: Function}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [displayMonth, setDisplayMonth] = useState<Date>(date);

    const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
    if (openState) {
      setDisplayMonth(date); // show selected date's month when opening
    }
  };

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setOpen(false);
    }
  };
  return (
    <div className="">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Input
            readOnly
            value={format(date, "yyyy-MM-dd")}
            onClick={() => setOpen(true)} className="bg-accent"
          />
        </PopoverTrigger>
        <PopoverContent  side="bottom" align="center" className="w-auto bg-differ">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            month={displayMonth} // only set month initially
            onMonthChange={setDisplayMonth} // keep internal month in sync
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilter;
