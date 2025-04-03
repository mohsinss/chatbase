// lib/calcom.ts

const CALCOM_API_BASE = 'https://api.cal.com';
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
const CALCOM_API_VERSION = '2024-06-14';

interface BookingPayload {
    eventTypeId: number;
    start: string;
    end?: string;
    responses: {
        name: string;
        email: string;
        smsReminderNumber?: string | null;
        location: { value: string; optionValue: string };
    };
    timeZone: string;
    language: string;
    title: string;
    description?: string | null;
    status: string;
    metadata?: Record<string, any>;
}

export const combineDateAndTime = (date: Date, timeSlot: string): Date => {
    const [time, modifier] = timeSlot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);

    return combinedDate;
};

export async function getAvailableSlots(
    username: string,
    eventTypeSlug: string,
    fromDate: string,
    toDate: string
) {
    const apiUrl = `${CALCOM_API_BASE}/v1/slots?usernameList=${username}&eventTypeSlug=${eventTypeSlug}&startTime=${fromDate}&endTime=${toDate}&apiKey=${CALCOM_API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, ${data.message}`);
        }

        return data.slots;
    } catch (error) {
        console.error('Error fetching available slots:', error);
        return [];
    }
}

export async function getEventTypeId(username: string, eventSlug: string) {
    const apiUrl = `${CALCOM_API_BASE}/v2/event-types?username=${username}&eventSlug=${eventSlug}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cal-api-version': CALCOM_API_VERSION,
            },
        });

        const data = await response.json();

        if (!response.ok || data.status !== 'success') {
            throw new Error(`HTTP error! Status: ${response.status}, ${data?.error}`);
        }

        return data.data[0].id;
    } catch (error) {
        console.error('Error fetching event type ID:', error.message);
        return null;
    }
}

export async function bookMeeting(payload: BookingPayload) {
    try {
      const response = await fetch('/api/chatbot/action/book-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`Booking failed: ${data.error || 'Unknown error'}`);
      }
  
      return data;
    } catch (error) {
      console.error('Error booking meeting:', error);
      throw error;
    }
  }