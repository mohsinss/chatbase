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
      name: "get_menus",
      description: "Return a list of menu items (id, name, price) for a category",
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
      name: "get_menu",
      description: "Return detailed information about a specific food item",
      parameters: {
        type: "object",
        properties: {
          item_id: { type: "string", description: "The ID of the menu item to get details for" },
          category: { type: "string", description: "The category ID the item belongs to" }
        },
        required: ["item_id", "category"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "add_to_cart",
      description: "Add an item to the diner's cart, including current cart items",
      parameters: {
        type: "object",
        properties: {
          item_id: { type: "string" },
          quantity: { type: "integer", minimum: 1 },
          cartItems: {
            type: "array",
            description: "Current items in the cart",
            items: {
              type: "object",
              properties: {
                item_id: { type: "string" },
                quantity: { type: "integer", minimum: 1 }
              },
              required: ["item_id", "quantity"]
            }
          }
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
  },
  {
    type: "function" as const,
    function: {
      name: "track_order",
      description: "Track the status of a specific order or view recent orders",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "Optional order ID to track a specific order" }
        }
      }
    }
  }
]

// System prompt for order management
export const orderManagementSystemPrompt = `
You are a restaurant ordering assistant. You have seven functions available:
1) get_categories(): returns all menu categories.
2) get_menus(category): returns a list of items in a specific category with name and price only.
3) get_menu(item_id, category): returns detailed information about a specific menu item.
4) add_to_cart(item_id, quantity, cartItems): adds an item to the diner's cart, including current cart items.
5) submit_order(order): places the final order.
6) track_order(order_id): tracks the status of an order.

When the user asks to browse or order food, you MUST call the appropriate function.
Make sure that you call add_to_cart() when user sending a message like "add 2 to the cart".
For anything else, just reply normally.
`;
