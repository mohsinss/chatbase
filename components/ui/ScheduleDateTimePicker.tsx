"use client";

import { useState, useEffect } from "react";

interface ScheduleDateTimePickerProps {
  scheduleDate: string;
  setScheduleDate: (value: string) => void;
}

const ScheduleDateTimePicker = ({ scheduleDate, setScheduleDate }: ScheduleDateTimePickerProps) => {
  // Local state for date and hour
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("00");

  // Initialize local state from scheduleDate prop
  useEffect(() => {
      if (scheduleDate) {
        const dt = new Date(scheduleDate);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        const hr = String(dt.getHours()).padStart(2, "0");
        setDate(`${year}-${month}-${day}`);
        setHour(hr);
      } else {
        setDate("");
        setHour("00");
      }
  }, [scheduleDate]);

  // Update scheduleDate when date or hour changes
  useEffect(() => {
    if (date) {
      const formatted = `${date}T${hour}:00`;
      setScheduleDate(formatted);
    } else {
      setScheduleDate("");
    }
  }, [date, hour, setScheduleDate]);

  // Generate hour options 00 to 23
  const hourOptions = [];
  for (let i = 0; i < 24; i++) {
    const hr = String(i).padStart(2, "0");
    hourOptions.push(hr);
  }

  return (
    <div>
      <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">
        Schedule Date
      </label>
      <input
        id="schedule-date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
      />
      <label htmlFor="schedule-hour" className="block text-sm font-medium text-gray-700 mb-1">
        Schedule Hour
      </label>
      <select
        id="schedule-hour"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {hourOptions.map((hr) => (
          <option key={hr} value={hr}>
            {hr}:00
          </option>
        ))}
      </select>
    </div>
  );
};

export default ScheduleDateTimePicker;
