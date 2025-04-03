"use client";

import CalendarSelector from "./CalendarSelector";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { ArrowLeft, Loader2 } from "lucide-react";

interface CalComBookerProps {
    onSubmit: (date: Date, timeSlot: string, formData: { name: string; email: string; notes?: string; guests?: string; rescheduleReason?: string }) => Promise<boolean>;
    availableSlots: Record<string, { time: string }[]>;
    theme?: "light" | "dark";
}

export default function CalComBooker({
    onSubmit,
    availableSlots,
    theme = "light",
}: CalComBookerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        notes: "",
        guests: "",
        rescheduleReason: "",
    });
    const [isBooking, setIsBooking] = useState(false);
    const [isBookSuccess, setIsBookSuccess] = useState(false);

    const handleTimeSlotSelect = (date: Date, timeSlot: string) => {
        setSelectedDate(date);
        setSelectedTimeSlot(timeSlot);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert("Please fill in required fields (Name and Email).");
            return;
        }
        if (selectedDate && selectedTimeSlot) {
            setIsBooking(true);
            const result = await onSubmit(selectedDate, selectedTimeSlot, formData);
            // setIsBookSuccess(result);
            setIsBooking(false);
        }
    };

    if (!selectedDate || !selectedTimeSlot) {
        return (
            <CalendarSelector
                onTimeSlotSelect={handleTimeSlotSelect}
                availableSlots={availableSlots}
                theme={theme}
            />
        );
    }

    return (
        <div
            className={cn(
                "p-3 rounded-lg",
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            )}
        >
            <Button variant="ghost" size="icon" onClick={() => setSelectedTimeSlot(undefined)}>
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <p className="font-medium">
                    You are booking a slot at {selectedTimeSlot} on{" "}
                    {selectedDate.toDateString()}
                </p>

                <div className="flex flex-col gap-1">
                    <label htmlFor="name">Name *</label>
                    <input
                        id="name"
                        className={cn(
                            "input",
                            theme === "dark"
                                ? "bg-gray-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-gray-900 placeholder-gray-500"
                        )}
                        placeholder="John Doe"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email *</label>
                    <input
                        id="email"
                        className={cn(
                            "input",
                            theme === "dark"
                                ? "bg-gray-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-gray-900 placeholder-gray-500"
                        )}
                        placeholder="john@example.com"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                        id="notes"
                        className={cn(
                            "textarea",
                            theme === "dark"
                                ? "bg-gray-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-gray-900 placeholder-gray-500"
                        )}
                        placeholder="Additional Notes"
                        value={formData.notes}
                        onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                        }
                    />
                </div>

                <div className="flex flex-col gap-1 hidden">
                    <label htmlFor="guests">Guests (comma-separated emails)</label>
                    <input
                        id="guests"
                        className={cn(
                            "input",
                            theme === "dark"
                                ? "bg-gray-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-gray-900 placeholder-gray-500"
                        )}
                        placeholder="guest1@example.com, guest2@example.com"
                        value={formData.guests}
                        onChange={(e) =>
                            setFormData({ ...formData, guests: e.target.value })
                        }
                    />
                </div>

                <div className="flex flex-col gap-1 hidden">
                    <label htmlFor="rescheduleReason">Reschedule Reason</label>
                    <textarea
                        id="rescheduleReason"
                        className={cn(
                            "textarea",
                            theme === "dark"
                                ? "bg-gray-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-gray-900 placeholder-gray-500"
                        )}
                        placeholder="Reason for rescheduling"
                        value={formData.rescheduleReason}
                        onChange={(e) =>
                            setFormData({ ...formData, rescheduleReason: e.target.value })
                        }
                    />
                </div>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        // variant="outline"
                        onClick={() => {
                            setSelectedDate(null);
                            setSelectedTimeSlot(null);
                        }}
                        disabled={isBooking}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isBooking}
                        className="min-w-[90px]"
                    >
                        {isBooking ? <Loader2 className="animate-spin" /> : 'Confirm'}
                    </Button>
                </div>
            </form>
        </div>
    );
}