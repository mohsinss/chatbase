// Define tools for function calling
export const tools = [
  {
    type: "function" as const,
    function: {
      name: "getAvailableSlots",
      description: "Get available slots from a Cal.com URL.",
      parameters: {
        type: "object",
        properties: {
          calUrl: {
            type: "string",
            description: "The Cal.com URL to fetch available slots from"
          },
          dateFrom: {
            type: "string",
            description: "Start date/time in ISO 8601 format"
          },
          dateTo: {
            type: "string",
            description: "End date/time in ISO 8601 format"
          },
        },
        required: ["calUrl", "dateFrom", "dateTo"],
      },
    },
  },
];
