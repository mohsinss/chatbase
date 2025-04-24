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

export const orderTools = [
  {
    type: "function" as const,
    function: {
      name: "get_categories",
      description: "Return available menu categories",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_menu",
      description: "Return menu items (id, name, price, dietary tags) for a category",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["starters", "mains", "desserts", "vegan_appetizers"] }
        },
        required: ["category"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "add_to_cart",
      description: "Add an item to the diner's cart",
      parameters: {
        type: "object",
        properties: {
          item_id: { type: "string" },
          quantity: { type: "integer", minimum: 1 }
        },
        required: ["item_id", "quantity"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "submit_order",
      description: "Finalize an order after user confirmation",
      parameters: {
        type: "object",
        properties: {
          order: {
            type: "object",
            properties: {
              table: { type: "string" },
              items: {
                type: "array", 
                items: {
                  type: "object", 
                  properties: {
                    item_id: { type: "string" },
                    name: { type: "string" },
                    qty: { type: "integer" },
                    price: { type: "number" }
                  }
                }
              },
              subtotal: { type: "number" }
            },
            required: ["items", "subtotal"]
          }
        },
        required: ["order"]
      }
    }
  }
]
