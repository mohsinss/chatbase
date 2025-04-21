"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarSelectorProps {
    onTimeSlotSelect: (date: Date, timeSlot: string) => void;
    availableSlots: Record<string, { time: string }[]>;
    theme?: 'light' | 'dark';
}
export default function CalendarSelector({
    onTimeSlotSelect,
    availableSlots,
    theme = 'light'
}: CalendarSelectorProps) {
    const [date, setDate] = useState<Date | undefined>(undefined)

    const getSlotsForDate = (selectedDate: Date): string[] => {
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        return availableSlots[dateKey]?.map(slot => format(new Date(slot.time), 'hh:mm a')) || [];
    };

    // Helper function to check if a date is available
    const isDateUnAvailable = (date: Date) => {
      const dateKey = date.toLocaleDateString("en-CA").replace(/-/g, "-"); // format YYYY-MM-DD
      return !availableSlots.hasOwnProperty(dateKey);
    };
    

    const [slots, setSlots] = useState<string[]>(date ? getSlotsForDate(date) : []);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setSlots(getSlotsForDate(selectedDate));
        } else {
            setSlots([]);
        }
    };

    return (
        <div
            className={cn(
                "space-y-4 rounded-lg",
                theme === 'dark' ? "bg-gray-800 text-white" : "bg-white text-gray-900",
            )}
        >
            {!date && <Calendar
                mode="single"
                selected={date}
                availableSlots={availableSlots}
                onSelect={handleDateSelect}
                disabled={isDateUnAvailable}
                className="rounded-md border"
                theme={theme}
            />}

            {date && (
                <div
                    className={cn(
                        "rounded-md p-4",
                        theme === 'dark' ? "bg-gray-800 text-white" : "bg-white text-gray-900",
                    )}
                >
                    <Button variant="ghost" size="icon" onClick={() => setDate(undefined)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4">
                        {slots.length > 0 ? (
                            slots.map((slot) => (
                                <Button
                                    key={slot}
                                    variant="outline"
                                    className={cn(
                                        "text-sm",
                                        theme === 'dark'
                                            ? "text-gray-800 hover:bg-gray-700 hover:text-white"
                                            : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                    )}
                                    onClick={() => onTimeSlotSelect(date!, slot)}
                                >
                                    {slot}
                                </Button>
                            ))
                        ) : (
                            <p className="text-muted-foreground col-span-full">No available slots for this date.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

