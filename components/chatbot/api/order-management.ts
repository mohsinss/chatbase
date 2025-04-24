import ChatbotAction, { IChatbotAction } from '@/models/ChatbotAction';

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
  subtotal: number;
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
export async function getCategories(chatbotId: string) {
  try {
    const action = await getOrderManagementAction(chatbotId);
    
    if (!action || !action.metadata || !action.metadata.categories) {
      return `<div class="error-message"><p>No categories found</p></div>`;
    }
    
    // Create buttons for each category
    const categoryButtons = action.metadata.categories.map((category: any) => ({
      id: category.id,
      text: category.name,
      value: category.name,
      action: "get_menu",
      params: { category: category.name }
    }));
    
    // Generate HTML content with buttons (compact, no newlines)
    const htmlContent = `<div class="order-categories"><h3>Menu Categories</h3><div class="category-buttons">${action.metadata.categories.map((category: any) => `<button class="category-btn chat-option-btn" data-action="get_menu" data-category="${category.name}" data-index="0">${category.name}</button>`).join('')}</div></div>`;
    return htmlContent;
  } catch (error) {
    console.error('Error getting categories:', error);
    return `<div class="error-message"><p>Failed to retrieve categories</p></div>`;
  }
}

/**
 * Returns menu items for a specific category
 */
export async function getMenu(chatbotId: string, category: string) {
  try {
    console.log(category, 'category');
    const action = await getOrderManagementAction(chatbotId);
    
    if (!action || !action.metadata || !action.metadata.menuItems) {
      return `<div class="error-message"><p>No menu items found</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
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
    
    // Find the category with improved matching logic
    let categoryObj = null;
    
    // First try exact match
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
    
    if (!categoryObj) {
      return `<div>Category "${category}" not found</div><div><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // Filter menu items by category
    const items = action.metadata.menuItems
      .filter((item: any) => item.category === categoryObj.name && item.available)
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.images && item.images.length > 0 ? item.images[0] : null
      }));
    
    // Create buttons for adding items to cart
    const itemButtons = items.map((item: any) => ({
      id: item.id,
      text: `Add ${item.name} - $${item.price.toFixed(2)}`,
      value: item.id,
      action: "add_to_cart",
      params: { item_id: item.id, quantity: 1 }
    }));
    
    // Add a button to view all categories
    const backButton = {
      id: "back_to_categories",
      text: "Back to Categories",
      value: "categories",
      action: "get_categories",
      params: {}
    };
    
    // Generate HTML content with menu items and buttons (compact, no newlines)
    return `<div class="menu-items"><h3>${categoryObj.name} Menu</h3><div class="items-container">${items.map((item: any) => `<div class="menu-item">${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image" />` : ''}<div class="item-details"><h4>${item.name} - $${item.price.toFixed(2)}</h4><p>${item.description}</p><button class="add-to-cart-btn chat-option-btn" data-action="add_to_cart" data-item-id="${item.id}" data-index="0">Add to Cart</button></div></div>`).join('')}</div><div class="navigation"><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div></div>`;
  } catch (error) {
    console.error('Error getting menu items:', error);
    return `<div class="error-message"><p>Failed to retrieve menu items</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
  }
}

/**
 * Adds an item to the cart
 * Note: This is a simulated function as we don't have actual cart storage
 * In a real implementation, this would store the cart in a database or session
 */
export async function addToCart(chatbotId: string, item_id: string, quantity: number) {
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
    // Create buttons for next actions
    const continueButtons = [
      {
        id: "view_category",
        text: `View More ${menuItem.category} Items`,
        value: menuItem.category,
        action: "get_menu",
        params: { category: menuItem.category }
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
        params: { order: { items: [] as OrderItem[], subtotal: 0 } } // This would be populated with actual cart items in a real implementation
      }
    ];
    
    // Generate HTML content with confirmation and buttons (compact, no newlines)
    return `<div class="cart-confirmation"><div class="cart-message"><h4>Added to Cart</h4><p>${quantity} x ${menuItem.name} - $${menuItem.price.toFixed(2)}</p></div><div class="action-buttons"><button class="continue-btn chat-option-btn" data-action="get_menu" data-category="${menuItem.category}" data-index="0" >View More ${menuItem.category} Items</button><button class="browse-btn chat-option-btn" data-action="get_categories" data-index="0" >Browse All Categories</button><button class="checkout-btn chat-option-btn" data-action="submit_order" data-index="0">Proceed to Checkout</button></div></div>`;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return `<div class="error-message"><p>Failed to add item to cart</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
  }
}

/**
 * Submits an order
 * In a real implementation, this would save the order to a database
 * and potentially integrate with a POS system or Google Sheets
 */
export async function submitOrder(chatbotId: string, order: Order) {
  try {
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
    
    // Calculate total to verify
    const calculatedTotal = order.items.reduce(
      (sum, item) => sum + (item.price * item.qty), 
      0
    );
    
    // Check if the provided subtotal matches our calculation (with small tolerance for floating point)
    if (Math.abs(calculatedTotal - order.subtotal) > 0.01) {
      return `<div class="error-message"><p>Order subtotal does not match item prices</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
    }
    
    // If Google Sheets integration is enabled, we would save the order there
    const hasGoogleSheets = action.metadata.googleSheetConfig && 
                           action.metadata.googleSheetConfig.connected &&
                           action.metadata.googleSheetConfig.sheetId;
    
    // In a real implementation, we would save the order to a database
    // and potentially send it to a POS system or Google Sheets
    // For now, we'll just return success with the order details
    
    const orderId = `ORD-${Date.now()}`;
    
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
    
    // Generate HTML content with order confirmation and buttons (compact, no newlines)
    return `<div class="order-confirmation"><div class="order-success"><h3>Order Confirmed!</h3><p>Your order #${orderId} has been received and is being processed.</p>${order.table ? `<p>Table: ${order.table}</p>` : ''}<div class="order-details"><h4>Order Summary</h4><ul class="order-items">${order.items.map((item: OrderItem) => `<li>${item.qty} x ${item.name} - $${(item.price * item.qty).toFixed(2)}</li>`).join('')}</ul><p class="order-total">Total: $${order.subtotal.toFixed(2)}</p></div>${hasGoogleSheets ? '<p>Your order has been recorded in our system.</p>' : ''}</div><div class="after-order-actions"><button class="new-order-btn chat-option-btn" data-action="get_categories" data-index="0" >Place Another Order</button><button class="track-order-btn chat-option-btn" data-action="track_order" data-order-id="${orderId}" data-index="0">Track Order Status</button></div></div>`;
  } catch (error) {
    console.error('Error submitting order:', error);
    return `<div class="error-message"><p>Failed to submit order</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
  }
}
