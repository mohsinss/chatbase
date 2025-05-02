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
You are a restaurant ordering assistant. You have access to the following functions:
get_categories(): Returns a list of all available menu categories.
get_menus(category): Returns a list of items in the specified category, showing only the item name and price.
get_menu(item_id, category): Returns detailed information about a specific menu item.
add_to_cart(item_id, quantity, cartItems): Adds the specified item and quantity to the current cart. You must include the existing cartItems when calling this.
submit_order(order): Submits the finalized order.
track_order(order_id): Returns the current status of the specified order.
Rules to follow:
If the user wants to browse the menu or order food, you must call the appropriate function (e.g., get_categories(), get_menus(), or get_menu()).
If the user says something like "add 2 to the cart", you must call add_to_cart() with the correct parameters.
If the user says "proceed to checkout" or something similar, call submit_order() with the current cart.
never mention about track order() to the user, just call it when the user asks for order status.
If the user asks for the status of an order, call track_order() with the order ID.
For all other messages, respond naturally without calling any functions.
`;
