"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  theme?: 'light' | 'dark';
  availableSlots: Object;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  theme = 'light',
  availableSlots,
  ...props
}: CalendarProps) {

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3",
        theme === 'dark' ? "bg-gray-800 text-white" : "bg-white text-gray-900",
        className
      )}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex justify-between z-10",
        chevron: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          theme === 'dark' ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"
        ),
        button_previous: "absolute left-4 cursor-pointer",
        button_next: "absolute right-4 cursor-pointer",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: cn(
          "rounded-md w-9 font-normal text-[0.8rem]",
          theme === 'dark' ? "text-gray-400" : "text-muted-foreground"
        ),
        row: "flex w-full mt-2",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          theme === 'dark' ? "hover:bg-gray-700" : "hover:bg-gray-100"
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          theme === 'dark' ? "text-gray-200" : "text-gray-900"
        ),
        selected: cn(
          "hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          theme === 'dark' ? "bg-blue-600 text-white" : "bg-primary text-primary-foreground"
        ),
        today: cn(
          theme === 'dark' ? "bg-gray-700 text-white" : "bg-accent text-accent-foreground"
        ),
        // outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      //   components={{
      //     IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
      //     IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      //   }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }