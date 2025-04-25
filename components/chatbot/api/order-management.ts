import ChatbotAction, { IChatbotAction } from '@/models/ChatbotAction';
import Order from '@/models/Order';

// Type definitions for order management
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  images: string[];
}

interface Category {
  id: string;
  name: string;
}

interface Table {
  id: string;
  tableNumber: string;
  qrCodeUrl: string;
}

interface OrderItem {
  item_id: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  table: string;
  items: OrderItem[];
  subtotal?: number;
}

interface OrderManagementMetadata {
  menuItems: MenuItem[];
  categories: Category[];
  tables: Table[];
  googleSheetConfig: {
    sheetId: string;
    sheetName: string;
    connected: boolean;
  };
}

/**
 * Retrieves the order management action for a specific chatbot
 */
export async function getOrderManagementAction(chatbotId: string) {
  try {
    const action = await ChatbotAction.findOne({
      chatbotId,
      type: 'ordermanagement',
      enabled: true
    });
    
    return action;
  } catch (error) {
    console.error('Error fetching order management action:', error);
    return null;
  }
}

/**
 * Returns available menu categories
 */
export async function getCategories(chatbotId: string, isWhatsApp: boolean = false) {
  try {
    const action = await getOrderManagementAction(chatbotId);
    
    if (!action || !action.metadata || !action.metadata.categories) {
      return isWhatsApp 
        ? { error: "No categories found" }
        : `<div class="error-message"><p>No categories found</p></div>`;
    }
    
    // Create buttons for each category
    const categoryButtons = action.metadata.categories.map((category: any) => ({
      id: category.id,
      text: category.name,
      value: category.id,
      action: "get_menu",
      params: { category: category.id }
    }));
    
    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      return {
        type: "list",
        title: "Menu Categories",
        body: "Please choose a menu category:",
        footer: "Select a category to continue.",
        button: "Select Category",
        sections: [
          {
            title: "Menu Categories",
            rows: action.metadata.categories.map((category: any) => ({
              id: category.id,
              title: category.name,
              description: ""
            }))
          }
        ]
      };
    } else {
      // Generate HTML content with buttons for web interface
      const htmlContent = `<div class="order-categories"><h3>Menu Categories</h3><div class="category-buttons">${action.metadata.categories.map((category: any) => `<button class="category-btn chat-option-btn" data-action="get_menus" data-category="${category.id}" data-index="0">${category.name}</button>`).join('')}</div></div>`;
      return htmlContent;
    }
  } catch (error) {
    console.error('Error getting categories:', error);
    return isWhatsApp 
      ? { error: "Failed to retrieve categories" }
      : `<div class="error-message"><p>Failed to retrieve categories</p></div>`;
  }
}

/**
 * Returns a list of menu items for a specific category
 */
export async function getMenus(chatbotId: string, category: string, isWhatsApp: boolean = false) {
  try {
    console.log('getMenus', category, 'category');
    const action = await getOrderManagementAction(chatbotId);
    
    if (!action || !action.metadata || !action.metadata.menuItems) {
      return `<div class="error-message"><p>No menu items found</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    let categoryObj = null;
    
    // First try to find category by ID
    categoryObj = action.metadata.categories.find(
      (cat: any) => cat.id === category
    );
    
    // If not found by ID, try to find by name with improved matching
    if (!categoryObj) {
      // Normalize the requested category for better matching
      const normalizedRequestedCategory = category.toLowerCase().trim();
      
      // Generate dynamic category mappings based on available categories
      const categoryMappings: Record<string, string[]> = {};
      
      // Common variations to try for each category
      const generateVariations = (name: string): string[] => {
        const variations = [];
        
        // Singular/plural variations
        if (name.endsWith('s')) {
          variations.push(name.slice(0, -1)); // Remove 's' at the end
        } else {
          variations.push(name + 's'); // Add 's' at the end
        }
        
        // Common category name variations
        const commonMappings: Record<string, string[]> = {
          'appetizer': ['starter', 'starters', 'appetizers', 'entree', 'entrees'],
          'starter': ['appetizer', 'appetizers', 'entree', 'entrees'],
          'main': ['mains', 'entree', 'entrees', 'main course', 'main courses'],
          'dessert': ['desserts', 'sweet', 'sweets'],
          'beverage': ['beverages', 'drink', 'drinks'],
          'special': ['specials', 'specialty', 'specialties', 'chef special', 'chef specials']
        };
        
        // Add common variations if they exist
        for (const [key, values] of Object.entries(commonMappings)) {
          if (name === key || values.includes(name)) {
            variations.push(...values.filter(v => v !== name));
            variations.push(key);
          }
        }
        
        return Array.from(new Set(variations)); // Remove duplicates
      };
      
      // Build dynamic mappings for each category
      action.metadata.categories.forEach((cat: any) => {
        const catName = cat.name.toLowerCase();
        categoryMappings[catName] = generateVariations(catName);
      });
      
      // First try exact match by name
      categoryObj = action.metadata.categories.find(
        (cat: any) => cat.name.toLowerCase() === normalizedRequestedCategory
      );
      
      // If no exact match, try common variations
      if (!categoryObj) {
        // Handle singular/plural variations (e.g., "main" vs "mains")
        if (normalizedRequestedCategory.endsWith('s')) {
          // Try without the 's' at the end
          const singularForm = normalizedRequestedCategory.slice(0, -1);
          categoryObj = action.metadata.categories.find(
            (cat: any) => cat.name.toLowerCase() === singularForm
          );
        } else {
          // Try with an 's' at the end
          const pluralForm = normalizedRequestedCategory + 's';
          categoryObj = action.metadata.categories.find(
            (cat: any) => cat.name.toLowerCase() === pluralForm
          );
        }
      }
      
      // If still no match, try common category mappings
      if (!categoryObj) {
        // Check if the requested category has known alternatives
        for (const [baseCategory, alternatives] of Object.entries(categoryMappings)) {
          if (normalizedRequestedCategory === baseCategory || alternatives.includes(normalizedRequestedCategory)) {
            // Look for categories that match either the base category or any of its alternatives
            categoryObj = action.metadata.categories.find(
              (cat: any) => cat.name.toLowerCase() === baseCategory || 
                            alternatives.includes(cat.name.toLowerCase()) ||
                            baseCategory === cat.name.toLowerCase() ||
                            alternatives.some(alt => alt === cat.name.toLowerCase())
            );
            if (categoryObj) break;
          }
        }
      }
      
      // If still no match, try partial match (contains)
      if (!categoryObj) {
        categoryObj = action.metadata.categories.find(
          (cat: any) => cat.name.toLowerCase().includes(normalizedRequestedCategory) || 
                        normalizedRequestedCategory.includes(cat.name.toLowerCase())
        );
      }
    }
    
    if (!categoryObj) {
      return isWhatsApp
        ? { error: `Category "${category}" not found` }
        : `<div>Category "${category}" not found</div><div><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // Filter menu items by category
    const items = action.metadata.menuItems
      .filter((item: any) => item.category === categoryObj.id && item.available)
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price
      }));
    
    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      return {
        type: "list",
        title: `${categoryObj.name} Menu`,
        body: `Menu items in ${categoryObj.name}:`,
        footer: "Select an item to view details or order.",
        button: "View Menu Items",
        sections: [
          {
            title: categoryObj.name,
            rows: [
              // Add back option as the first item
              {
                id: `om-back-{tableName}-{actionId}`,
                title: "Back to Categories",
                description: "Return to menu categories"
              },
              // Add menu items
              ...items.map((item: any) => ({
                id: `om-menu-{tableName}-{actionId}-${item.id}`,
                title: item.name,
                description: `$${item.price.toFixed(2)}`
              }))
            ]
          }
        ],
        categoryId: categoryObj.id // Include category ID for reference
      };
    } else {
      // Generate HTML content with menu items list for web interface
      return `<div class="menu-items">
        <h3>${categoryObj.name} Menu</h3>
        <div class="items-list">
          ${items.map((item: any) => `
            <button class="menu-item-btn chat-option-btn" 
              data-action="get_menu" 
              data-category="${categoryObj.id}" 
              data-item-id="${item.id}" 
              data-index="0">
                ${item.name} - $${item.price.toFixed(2)}
            </button>`).join('')}
        </div>
        <div class="navigation">
          <button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">
            Back to Categories
          </button>
        </div>
      </div>`;
    }
  } catch (error) {
    console.error('Error getting menu items:', error);
    return `<div class="error-message"><p>Failed to retrieve menu items</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
  }
}

/**
 * Returns detailed information about a specific menu item
 */
export async function getMenu(chatbotId: string, item_id: string, category: string, isWhatsApp: boolean = false) {
  try {
    const action = await getOrderManagementAction(chatbotId);
    
    if (!action || !action.metadata || !action.metadata.menuItems) {
      return `<div class="error-message"><p>No menu items found</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // Find the category by ID
    const categoryObj = action.metadata.categories.find(
      (cat: any) => cat.id === category
    );
    
    if (!categoryObj) {
      return `<div class="error-message"><p>Category not found</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // Find the menu item
    const selectedItem = action.metadata.menuItems.find(
      (item: any) => item.id === item_id && item.available
    );
    
    if (!selectedItem) {
      return isWhatsApp
        ? { error: "Item not found or not available" }
        : `<div class="error-message"><p>Item not found or not available</p><button class="back-btn chat-option-btn" data-action="get_menus" data-category="${category}" data-index="0">Back to Menu</button></div>`;
    }
    
    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      const response: any = {
        type: "item_detail",
        item: {
          id: selectedItem.id,
          name: selectedItem.name,
          price: selectedItem.price,
          description: selectedItem.description || "",
          categoryId: category
        },
        buttons: [
          {
            id: `om-confirm-{tableName}-{actionId}-${selectedItem.id}`,
            title: "Order Now"
          },
          {
            id: `om-category-{tableName}-{actionId}-${category}`,
            title: "Back to Menu"
          }
        ]
      };
      
      // Add image if available
      if (selectedItem.images && selectedItem.images.length > 0) {
        response.item.image = selectedItem.images[0];
      }
      
      return response;
    } else {
      // Generate HTML content with detailed item view for web interface
      return `<div class="item-detail">
        <h3>${selectedItem.name}</h3>
        ${selectedItem.images && selectedItem.images.length > 0 ? 
          `<img src="${selectedItem.images[0]}" alt="${selectedItem.name}" class="item-detail-image" />` : ''}
        <div class="item-detail-info">
          <p class="item-price">$${selectedItem.price.toFixed(2)}</p>
          <p class="item-description">${selectedItem.description}</p>
          <div class="quantity-selector">
            <button class="quantity-btn chat-option-btn" data-action="add_to_cart" data-item-id="${selectedItem.id}" data-quantity="1" data-index="0">Add 1 to Cart</button>
            <button class="quantity-btn chat-option-btn" data-action="add_to_cart" data-item-id="${selectedItem.id}" data-quantity="2" data-index="0">Add 2 to Cart</button>
            <button class="quantity-btn chat-option-btn" data-action="add_to_cart" data-item-id="${selectedItem.id}" data-quantity="3" data-index="0">Add 3 to Cart</button>
          </div>
        </div>
        <div class="navigation">
          <button class="back-btn chat-option-btn" data-action="get_menus" data-category="${category}" data-index="0">Back to Menu</button>
        </div>
      </div>`;
    }
  } catch (error) {
    console.error('Error getting menu item details:', error);
    return `<div class="error-message"><p>Failed to retrieve menu item details</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
  }
}

/**
 * Adds an item to the cart
 * Note: This is a simulated function as we don't have actual cart storage
 * In a real implementation, this would store the cart in a database or session
 */
export async function addToCart(chatbotId: string, item_id: string, quantity: number, isWhatsApp: boolean = false) {
  // Convert quantity to number if it's passed as a string from data-quantity attribute
  quantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
  try {
    const action = await getOrderManagementAction(chatbotId);
    
    if (!action || !action.metadata || !action.metadata.menuItems) {
      return `<div class="error-message"><p>Menu not found</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // Find the menu item
    const menuItem = action.metadata.menuItems.find((item: any) => item.id === item_id);
    
    if (!menuItem) {
      return `<div class="error-message"><p>Item not found</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    if (!menuItem.available) {
      return `<div class="error-message"><p>Item is not available</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // In a real implementation, we would store this in a database or session
    // For now, we'll just return success with the item details
    // Find the category ID for the menu item's category
    const categoryObj = action.metadata.categories.find(
      (cat: any) => cat.name === menuItem.category
    );
    
    const categoryId = categoryObj ? categoryObj.id : '';
    
    // In a real implementation, we would retrieve the full cart from a database or session
    // For this simulation, we'll create a cart with just the current item
    const cart: OrderItem[] = [
      {
        item_id: menuItem.id,
        name: menuItem.name,
        qty: quantity,
        price: menuItem.price
      }
    ];
    
    // Calculate the cart total
    const cartTotal = cart.reduce(
      (sum: number, item: OrderItem) => sum + (item.price * item.qty),
      0
    );
    
    // Create buttons for next actions
    const continueButtons = [
      {
        id: "view_category",
        text: `View More ${menuItem.category} Items`,
        value: categoryId,
        action: "get_menu",
        params: { category: categoryId }
      },
      {
        id: "view_categories",
        text: "Browse All Categories",
        value: "categories",
        action: "get_categories",
        params: {}
      },
      {
        id: "checkout",
        text: "Proceed to Checkout",
        value: "checkout",
        action: "submit_order",
        params: { order: { items: cart, subtotal: cartTotal } } // Pass the cart with subtotal to the checkout
      }
    ];
    
    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      return {
        type: "cart_confirmation",
        cart: {
          items: cart,
          total: cartTotal
        },
        categoryId: categoryId,
        categoryName: menuItem.category,
        buttons: [
          {
            id: `om-category-{tableName}-{actionId}-${categoryId}`,
            title: `View More ${menuItem.category} Items`
          },
          {
            id: `om-back-{tableName}-{actionId}`,
            title: "Browse All Categories"
          },
          {
            id: `om-confirm-{tableName}-{actionId}-${menuItem.id}`,
            title: "Proceed to Checkout"
          }
        ]
      };
    } else {
      // Generate HTML content with cart and buttons for web interface
      return `<div class="cart-confirmation">
        <div class="cart-message">
          <h4>Cart Updated</h4>
          <div class="cart-items">
            ${cart.map((item: OrderItem) => `<p>${item.qty} x ${item.name} - $${(item.price * item.qty).toFixed(2)}</p>`).join('')}
          </div>
          <p class="cart-total"><strong>Total: $${cartTotal.toFixed(2)}</strong></p>
        </div>
        <div class="action-buttons">
          <button class="continue-btn chat-option-btn" data-action="get_menus" data-category="${categoryId}" data-index="0">View More ${menuItem.category} Items</button>
          <button class="browse-btn chat-option-btn" data-action="get_categories" data-index="0">Browse All Categories</button>
          <button class="checkout-btn chat-option-btn" data-action="submit_order" data-order='${JSON.stringify({items: cart, subtotal: cartTotal})}' data-index="0">Proceed to Checkout</button>
        </div>
      </div>`;
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return `<div class="error-message"><p>Failed to add item to cart</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
  }
}

/**
 * Retrieves orders for a specific chatbot
 */
export async function getOrders(chatbotId: string, orderId?: string) {
  try {
    // If orderId is provided, get a specific order
    if (orderId) {
      const order = await Order.findOne({ chatbotId, orderId });
      if (!order) {
        return `<div class="error-message"><p>Order #${orderId} not found</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
      }
      
      // Generate HTML content with order details
      return `<div class="order-details-container">
        <h3>Order #${order.orderId}</h3>
        <p>Status: <span class="order-status status-${order.status}">${order.status}</span></p>
        <p>Date: ${new Date(order.timestamp).toLocaleString()}</p>
        ${order.table ? `<p>Table: ${order.table}</p>` : ''}
        <div class="order-items-list">
          <h4>Items</h4>
          <ul>
            ${order.items.map((item: any) => `<li>${item.qty} x ${item.name} - $${(item.price * item.qty).toFixed(2)}</li>`).join('')}
          </ul>
          <p class="order-total">Total: $${order.subtotal.toFixed(2)}</p>
        </div>
        <div class="order-actions">
          <button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button>
        </div>
      </div>`;
    }
    
    // Get all orders for this chatbot
    const orders = await Order.find({ chatbotId }).sort({ timestamp: -1 }).limit(10);
    
    if (!orders || orders.length === 0) {
      return `<div class="error-message"><p>No orders found</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // Generate HTML content with order list
    return `<div class="orders-list-container">
      <h3>Recent Orders</h3>
      <div class="orders-list">
        ${orders.map((order: any) => `
          <div class="order-item">
            <div class="order-header">
              <h4>Order #${order.orderId}</h4>
              <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <p>Date: ${new Date(order.timestamp).toLocaleString()}</p>
            <p>Items: ${order.items.length}</p>
            <p>Total: $${order.subtotal.toFixed(2)}</p>
            <button class="view-order-btn chat-option-btn" data-action="track_order" data-order-id="${order.orderId}" data-index="0">View Details</button>
          </div>
        `).join('')}
      </div>
      <div class="order-actions">
        <button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button>
      </div>
    </div>`;
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return `<div class="error-message"><p>Failed to retrieve orders</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
  }
}

/**
 * Submits an order
 * In a real implementation, this would save the order to a database
 * and potentially integrate with a POS system or Google Sheets
 */
export async function submitOrder(chatbotId: string, order: Order, isWhatsApp: boolean = false) {
  try {
    console.log('submitOrder', order);
    const action = await getOrderManagementAction(chatbotId);
    
    if (!action || !action.metadata) {
      return `<div class="error-message"><p>Order management not configured</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // Validate table exists
    if (order.table) {
      const tableExists = action.metadata.tables.some(
        (table: any) => table.id === order.table || table.tableNumber === order.table
      );
      
      if (!tableExists) {
        return `<div class="error-message"><p>Invalid table number</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
      }
    }
    
    // Validate items exist and are available
    for (const orderItem of order.items) {
      const menuItem = action.metadata.menuItems.find((item: any) => item.id === orderItem.item_id);
      
      if (!menuItem) {
        return `<div class="error-message"><p>Item "${orderItem.name}" not found in menu</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
      }
      
      if (!menuItem.available) {
        return `<div class="error-message"><p>Item "${orderItem.name}" is not available</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
      }
    }
    
    // Calculate total from items
    const calculatedTotal = order.items.reduce(
      (sum: number, item: OrderItem) => sum + (item.price * item.qty), 
      0
    );
    
    // If Google Sheets integration is enabled, we would save the order there
    const hasGoogleSheets = action.metadata.googleSheetConfig && 
                           action.metadata.googleSheetConfig.connected &&
                           action.metadata.googleSheetConfig.sheetId;
    
    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}`;
    
    // Save the order to the database
    try {
      const newOrder = new Order({
        chatbotId,
        orderId,
        table: order.table,
        items: order.items,
        subtotal: calculatedTotal, // Set the subtotal from the calculated total
        status: 'received',
        timestamp: new Date()
      });
      
      await newOrder.save();
      console.log(`Order ${orderId} saved to database`);
    } catch (dbError) {
      console.error('Error saving order to database:', dbError);
      // Continue even if database save fails - we don't want to block the order confirmation
    }
    
    // Create buttons for after order submission
    const afterOrderButtons = [
      {
        id: "new_order",
        text: "Place Another Order",
        value: "categories",
        action: "get_categories",
        params: {}
      },
      {
        id: "track_order",
        text: "Track Order Status",
        value: orderId,
        action: "track_order", // This would be implemented in a real system
        params: { orderId }
      }
    ];
    
    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      return {
        type: "order_confirmation",
        order: {
          id: orderId,
          table: order.table,
          items: order.items,
          total: calculatedTotal,
          status: 'received',
          timestamp: new Date()
        },
        buttons: [
          {
            id: `om-back-{tableName}-{actionId}`,
            title: "Place Another Order"
          },
          {
            id: `om-track-{tableName}-{actionId}-${orderId}`,
            title: "Track Order Status",
            orderId: orderId
          }
        ]
      };
    } else {
      // Generate HTML content with order confirmation for web interface
      return `<div class="order-confirmation"><div class="order-success"><h3>Order Confirmed!</h3><p>Your order #${orderId} has been received and is being processed.</p>${order.table ? `<p>Table: ${order.table}</p>` : ''}<div class="order-details"><h4>Order Summary</h4><ul class="order-items">${order.items.map((item: OrderItem) => `<li>${item.qty} x ${item.name} - $${(item.price * item.qty).toFixed(2)}</li>`).join('')}</ul><p class="order-total">Total: $${calculatedTotal.toFixed(2)}</p></div>${hasGoogleSheets ? '<p>Your order has been recorded in our system.</p>' : ''}</div><div class="after-order-actions"><button class="new-order-btn chat-option-btn" data-action="get_categories" data-index="0" >Place Another Order</button><button class="track-order-btn chat-option-btn" data-action="track_order" data-order-id="${orderId}" data-index="0">Track Order Status</button></div></div>`;
    }
  } catch (error) {
    console.error('Error submitting order:', error);
    return `<div class="error-message"><p>Failed to submit order</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
  }
}
