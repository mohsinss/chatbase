import ChatbotAction, { IChatbotAction } from '@/models/ChatbotAction';
import { Order } from '@/models/Order';
import GoogleIntegration from '@/models/GoogleIntegration';
import { google } from 'googleapis';
import { currencySymbols } from '@/types';

// Helper function to get translated category name by id and language
function getTranslatedCategoryName(action: any, categoryId: string, language: string): string {
  if (action.metadata.translations &&
    action.metadata.translations[language] &&
    action.metadata.translations[language].categories &&
    action.metadata.translations[language].categories[categoryId]) {
    return action.metadata.translations[language].categories[categoryId];
  }
  // fallback to category name in metadata
  const category = action.metadata.categories.find((cat: any) => cat.id === categoryId);
  return category ? category.name : categoryId;
}

// Helper function to get translated menu item name and description by id and language
function getTranslatedMenuItem(action: any, itemId: string, language: string): { name: string; description: string } {
  if (action.metadata.translations &&
    action.metadata.translations[language] &&
    action.metadata.translations[language].menuItems &&
    action.metadata.translations[language].menuItems[itemId]) {
    const translation = action.metadata.translations[language].menuItems[itemId];
    return {
      name: translation.name || '',
      description: translation.description || ''
    };
  }
  // fallback to menu item in metadata
  const menuItem = action.metadata.menuItems.find((item: any) => item.id === itemId);
  return menuItem ? { name: menuItem.name, description: menuItem.description || '' } : { name: '', description: '' };
}

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
  orderId: string;
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

export async function getMenuPrompt(chatbotId: string, language?: string): Promise<string> {
  try {
    const action = await getOrderManagementAction(chatbotId);

    // Use language from action.metadata.language if not provided
    const lang = language || (action && action.metadata && action.metadata.language) || 'en';

    if (!action || !action.metadata || !action.metadata.menuItems || !action.metadata.categories) {
      return "No menu available.";
    }

    // Build a map of categoryId -> categoryName for easy lookup
    const categoryMap: Record<string, string> = {};
    action.metadata.categories.forEach((cat: any) => {
      categoryMap[cat.id] = cat.name;
    });

    // Group menu items by category
    const itemsByCategory: Record<string, any[]> = {};
    action.metadata.menuItems.forEach((item: any) => {
      if (!item.available) return;
      if (!itemsByCategory[item.category]) {
        itemsByCategory[item.category] = [];
      }
      itemsByCategory[item.category].push(item);
    });

    // Build the prompt string
    let prompt = "Here is the menu:\n";
    const currencyCode = action.metadata.currency || 'USD';
    const currencySymbol = currencySymbols[currencyCode] || currencyCode;
    for (const [categoryId, items] of Object.entries(itemsByCategory)) {
      prompt += `\n${getTranslatedCategoryName(action, categoryId, language)}:\n`;
      items.forEach((item: any) => {
        const translatedItem = getTranslatedMenuItem(action, item.id, language);
        prompt += `- ${item.id} - ${translatedItem.name}: ${currencySymbol}${item.price.toFixed(2)}${translatedItem.description ? ` - ${translatedItem.description}` : ""}\n`;
      });
    }

    return prompt.trim();
  } catch (error) {
    console.error('Error generating menu prompt:', error);
    return "Failed to generate menu prompt.";
  }
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
export async function getCategories(chatbotId: string, isWhatsApp: boolean = false, language?: string) {
  try {
    const action = await getOrderManagementAction(chatbotId);

    // Use language from parameter or action.metadata.language if not provided
    const lang = language || (action && action.metadata && action.metadata.language) || 'en';

    const menuCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.menuCategories || "Menu Categories";

    if (!action || !action.metadata || !action.metadata.categories) {
      const noCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.noitems || "No categories found";
      return isWhatsApp
        ? { error: noCategoriesMsg }
        : `<div class="error-message"><h3>${menuCategoriesMsg}</h3><p>${noCategoriesMsg}</p></div>`;
    }

    // Create buttons for each category
    const categoryButtons = action.metadata.categories.map((category: any) => ({
      id: category.id,
      text: getTranslatedCategoryName(action, category.id, lang),
      value: category.id,
      action: "get_menu",
      params: { category: category.id }
    }));

    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      const menuCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.menuCategories || "Menu Categories";
      const chooseCategoryBodyMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.chooseMenuCategoryBody || "Please choose a menu category:";
      const selectCategoryFooterMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.selectCategoryFooter || "Select a category to continue.";
      const selectCategoryButtonMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.selectCategoryButton || "Select Category";
      return {
        type: "list",
        title: menuCategoriesMsg,
        body: chooseCategoryBodyMsg,
        footer: selectCategoryFooterMsg,
        button: selectCategoryButtonMsg,
        sections: [
          {
            title: menuCategoriesMsg,
            rows: action.metadata.categories.map((category: any) => ({
              id: `om-category-{tableName}-{actionId}-${category.id}`,
              title: getTranslatedCategoryName(action, category.id, lang).slice(0, 24),
              description: ""
            }))
          }
        ]
      };
    } else {
      // Generate HTML content with buttons for web interface
      const menuCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.menuCategories || "Menu Categories";
      const htmlContent = `<div class="order-categories"><h3>${menuCategoriesMsg}</h3><div class="category-buttons">${action.metadata.categories.map((category: any) => `<button class="category-btn chat-option-btn" data-action="get_menus" data-category="${category.id}" data-index="0">${getTranslatedCategoryName(action, category.id, lang)}</button>`).join('')}</div></div>`;
      return htmlContent;
    }
  } catch (error) {
    console.error('Error getting categories:', error);
    const lang = language || 'en';
    const failedCategoriesMsg = `Failed to retrieve categories`;
    return isWhatsApp
      ? { error: failedCategoriesMsg }
      : `<div class="error-message"><p>${failedCategoriesMsg}</p></div>`;
  }
}

/**
 * Returns a list of menu items for a specific category
 */
export async function getMenus(chatbotId: string, category: string, isWhatsApp: boolean = false, language?: string) {
  const action = await getOrderManagementAction(chatbotId);

  // Use language from parameter or action.metadata.language if not provided
  const lang = language || (action && action.metadata && action.metadata.language) || 'en';
  const currencyCode = action.metadata.currency || 'USD';
  const currencySymbol = currencySymbols[currencyCode] || currencyCode;
  try {

    if (!action || !action.metadata || !action.metadata.categories) {
      const noCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.noitems || "No categories found";
      return isWhatsApp
        ? { error: noCategoriesMsg }
        : `<div class="error-message"><p>${noCategoriesMsg}</p></div>`;
    }

    if (!action || !action.metadata || !action.metadata.menuItems) {
      const noMenuItemsMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.menuNotFound || "No menu items found";
      const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
      return `<div class="error-message"><p>${noMenuItemsMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
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
      const categoryNotFoundMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.itemNotFoundOrUnavailable || `Category "${category}" not found`;
      return isWhatsApp
        ? { error: categoryNotFoundMsg }
        : `<div>${categoryNotFoundMsg}</div><div><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories"}</button></div>`;
    }

    // Filter menu items by category
    const items = action.metadata.menuItems
      .filter((item: any) => item.category === categoryObj.id && item.available)
      .map((item: any) => {
        const translatedItem = getTranslatedMenuItem(action, item.id, lang);
        return {
          id: item.id,
          name: translatedItem.name,
          price: item.price
        };
      });

    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      return {
        type: "list",
        title: `${getTranslatedCategoryName(action, categoryObj.id, lang)}`,
        body: `${getTranslatedCategoryName(action, categoryObj.id, lang)}:`,
        footer: action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories",
        button: action?.metadata?.translations?.[lang]?.systemMsgs?.viewMenuItems || "View Menu Items",
        sections: [
          {
            title: getTranslatedCategoryName(action, categoryObj.id, lang),
            rows: [
              // Add back option as the first item
              {
                id: `om-back-{tableName}-{actionId}`,
                title: action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories",
                description: action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Return to menu categories"
              },
              // Add menu items
              ...items.map((item: any) => ({
                id: `om-menu-{tableName}-{actionId}-${item.id}`,
                title: item.name.slice(0, 24),
                description: `${currencySymbol}${item.price.toFixed(2)} - ${item.name}`
              }))
            ]
          }
        ],
        categoryId: categoryObj.id // Include category ID for reference
      };
    } else {
      // Generate HTML content with menu items list for web interface
      return `<div class="menu-items">
        <h3>${getTranslatedCategoryName(action, categoryObj.id, lang)}</h3>
        <div class="items-list">
          ${items.map((item: any) => `
            <button class="menu-item-btn chat-option-btn"
              data-action="get_menu" 
              data-category="${categoryObj.id}" 
              data-item-id="${item.id}"
              data-index="0">
                ${item.name} - ${currencySymbol}${item.price.toFixed(2)}
            </button>`).join('')}
        </div>
        <div class="navigation">
          <button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">
            ${action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories"}
          </button>
        </div>
      </div>`;
    }
  } catch (error) {
    console.error('Error getting menu items:', error);
    const failedMenuItemsMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.failedToRetrieveMenuItemDetails || "Failed to retrieve menu items";
    const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
    return `<div class="error-message"><p>${failedMenuItemsMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }
}

/**
 * Returns detailed information about a specific menu item
 */
export async function getMenu(chatbotId: string, item_id: string, category: string, isWhatsApp: boolean = false, language?: string) {
  const action = await getOrderManagementAction(chatbotId);

  if (!action || !action.metadata || !action.metadata.menuItems) {
    const lang = language || (action && action.metadata && action.metadata.language) || 'en';
    const noItemsMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.menuNotFound || "No menu items found";
    const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
    return isWhatsApp
      ? { error: noItemsMsg }
      : `<div class="error-message"><p>${noItemsMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }

  // Use language from parameter or action.metadata.language if not provided
  const lang = language || (action && action.metadata && action.metadata.language) || 'en';
  const currencyCode = action.metadata.currency || 'USD';
  const currencySymbol = currencySymbols[currencyCode] || currencyCode;
  try {
    // Find the category by ID
    const categoryObj = action.metadata.categories.find(
      (cat: any) => cat.id === category
    );

    if (!categoryObj) {
      const categoryNotFoundMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.itemNotFoundOrUnavailable || "Category not found";
      return isWhatsApp
        ? { error: categoryNotFoundMsg }
        : `<div class="error-message"><p>${categoryNotFoundMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories"}</button></div>`;
    }

    // Find the menu item
    const selectedItem = action.metadata.menuItems.find(
      (item: any) => item.id === item_id.split('-').pop() && item.available
    );

    if (!selectedItem) {
      const itemNotFoundMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.itemNotFoundOrUnavailable || "Item not found or not available";
      const backToMenuMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToMenu || "Back to Menu";
      return isWhatsApp
        ? { error: itemNotFoundMsg }
        : `<div class="error-message"><p>${itemNotFoundMsg}</p><button class="back-btn chat-option-btn" data-action="get_menus" data-category="${category}" data-index="0">${backToMenuMsg}</button></div>`;
    }

    // Get translated menu item details
    const translatedItem = getTranslatedMenuItem(action, selectedItem.id, lang);

    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      const lang = language || (action && action.metadata && action.metadata.language) || 'en';
      const add1ToCartMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.add1ToCart || "Add 1 to Cart";
      const add2ToCartMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.add2ToCart || "Add 2 to Cart";
      const add3ToCartMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.add3ToCart || "Add 3 to Cart";

      const response: any = {
        type: "item_detail",
        item: {
          id: selectedItem.id,
          name: translatedItem.name,
          price: selectedItem.price,
          description: translatedItem.description || "",
          categoryId: category
        },
        buttons: [
          {
            id: `om-add-to-cart-{tableName}-{actionId}-${selectedItem.id}-1`,
            title: add1ToCartMsg
          },
          {
            id: `om-add-to-cart-{tableName}-{actionId}-${selectedItem.id}-2`,
            title: add2ToCartMsg
          },
          {
            id: `om-category-{tableName}-{actionId}-${category}`,
            title: action?.metadata?.translations?.[lang]?.systemMsgs?.backToMenu || "Back to Menu"
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
      const lang = language || (action && action.metadata && action.metadata.language) || 'en';
      const add1ToCartMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.add1ToCart || "Add 1 to Cart";
      const add2ToCartMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.add2ToCart || "Add 2 to Cart";
      const add3ToCartMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.add3ToCart || "Add 3 to Cart";
      const backToMenuMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToMenu || "Back to Menu";

      return `<div class="item-detail">
        <h3>${translatedItem.name}</h3>
        ${selectedItem.images && selectedItem.images.length > 0 ?
          `<img src="${selectedItem.images[0]}" alt="${translatedItem.name}" class="item-detail-image" />` : ''}
        <div class="item-detail-info">
          <p class="item-price">${currencySymbol}${selectedItem.price.toFixed(2)}</p>
          <p class="item-description">${translatedItem.description}</p>
          <div class="quantity-selector">
            <button class="quantity-btn chat-option-btn" data-action="add_to_cart" data-item-id="${selectedItem.id}" data-quantity="1" data-index="0">${add1ToCartMsg}</button>
            <button class="quantity-btn chat-option-btn" data-action="add_to_cart" data-item-id="${selectedItem.id}" data-quantity="2" data-index="0">${add2ToCartMsg}</button>
            <button class="quantity-btn chat-option-btn" data-action="add_to_cart" data-item-id="${selectedItem.id}" data-quantity="3" data-index="0">${add3ToCartMsg}</button>
          </div>
        </div>
        <div class="navigation">
          <button class="back-btn chat-option-btn" data-action="get_menus" data-category="${category}" data-index="0">${backToMenuMsg}</button>
        </div>
      </div>`;
    }
  } catch (error) {
    console.error('Error getting menu item details:', error);
    const failedMenuItemDetailsMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.failedToRetrieveMenuItemDetails || "Failed to retrieve menu item details";
    const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
    return `<div class="error-message"><p>${failedMenuItemDetailsMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }
}

/**
 * Adds an item to the cart
 * Note: This is a simulated function as we don't have actual cart storage
 * In a real implementation, this would store the cart in a database or session
 */
export async function addToCart(chatbotId: string, item_id: string, quantity: number, cartItems: any[] = [], isWhatsApp: boolean = false, language?: string) {
  // Convert quantity to number if it's passed as a string from data-quantity attribute
  quantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
  const action = await getOrderManagementAction(chatbotId);

  if (!action || !action.metadata || !action.metadata.menuItems) {
    const menuNotFoundMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.menuNotFound || "Menu not found";
    const backToCategoriesMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories";
    return `<div class="error-message"><p>${menuNotFoundMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }

  // Use language from parameter or action.metadata.language if not provided
  const lang = language || (action && action.metadata && action.metadata.language) || 'en';

  try {
    // Find the menu item
    const menuItem = action.metadata.menuItems.find((item: any) => item.id === item_id.split('-').pop());

    if (!menuItem) {
      const itemNotFoundMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.itemNotFoundInMenu || "Item not found";
      const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
      return isWhatsApp
        ? { error: itemNotFoundMsg }
        : `<div class="error-message"><p>${itemNotFoundMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
    }

    if (!menuItem.available) {
      const itemNotAvailableMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.itemNotAvailable || "Item is not available";
      const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
      return isWhatsApp
        ? { error: itemNotAvailableMsg }
        : `<div class="error-message"><p>${itemNotAvailableMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
    }

    // Find the category ID for the menu item's category
    const categoryObj = action.metadata.categories.find(
      (cat: any) => cat.name === menuItem.category
    );

    const categoryId = categoryObj ? categoryObj.id : '';

    // Use the passed cartItems array, add or update the current item
    const cart: OrderItem[] = [...cartItems];

    const existingIndex = cart.findIndex(ci => ci.item_id === menuItem.id);
    if (existingIndex >= 0) {
      // Update quantity
      cart[existingIndex].qty += quantity;
    } else {
      // Add new item
      // Use translated name for the item
      const translatedItem = getTranslatedMenuItem(action, menuItem.id, lang);
      cart.push({
        item_id: menuItem.id,
        name: translatedItem.name || menuItem.name,
        qty: quantity,
        price: menuItem.price
      });
    }

    // Calculate the cart total
    const cartTotal = cart.reduce(
      (sum: number, item: OrderItem) => sum + (item.price * item.qty),
      0
    );
    const currency = action.metadata.currency || 'USD';
    const currencySymbol = currencySymbols[currency] || currency;
    const viewMoreItemsMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.viewMoreItems || "View More Items";
    const browseAllCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.browseAllCategories || "Browse All Categories";
    const proceedToCheckoutMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.proceedToCheckout || "Proceed to Checkout";
    const cartUpdatedMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.cartUpdated || "Cart Updated";
    const totalMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.total || "Total";
    const viewAllCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.viewAllCategories || "View All Categories";

    if (isWhatsApp) {
      return {
        type: "cart_confirmation",
        cart: {
          items: cart,
          total: cartTotal
        },
        categoryId: categoryId,
        categoryName: menuItem.category,
        messages: {
          cartUpdated: cartUpdatedMsg,
          total: action?.metadata?.translations?.[lang]?.systemMsgs?.total || "Total"
        },
        buttons: [
          {
            id: `om-category-{tableName}-{actionId}-${categoryId}`,
            title: viewMoreItemsMsg
          },
          {
            id: `om-back-{tableName}-{actionId}`,
            title: viewAllCategoriesMsg
          },
          {
            id: `om-confirm-{tableName}-{actionId}-${menuItem.id}`,
            title: proceedToCheckoutMsg
          }
        ]
      };
    } else {
      return `<div class="cart-confirmation">
        <div class="cart-message">
          <h4>${cartUpdatedMsg}</h4>
          <div class="cart-items">
            ${cart.map((item: OrderItem) => `<p>${item.qty} x ${item.name} - ${currencySymbol}${(
        item.price * item.qty
      ).toFixed(2)}</p>`).join('')}
          </div>
          <p class="cart-total"><strong>${totalMsg}: ${currencySymbol}${cartTotal.toFixed(2)}</strong></p>
        </div>
        <div class="action-buttons">
          <button class="continue-btn chat-option-btn" data-action="get_menus" data-category="${categoryId}" data-index="0">${viewMoreItemsMsg}</button>
          <button class="browse-btn chat-option-btn" data-action="get_categories" data-index="0">${browseAllCategoriesMsg}</button>
          <button class="checkout-btn chat-option-btn" data-action="submit_order" data-order='${JSON.stringify({ items: cart, subtotal: cartTotal })}' data-index="0">${proceedToCheckoutMsg}</button>
        </div>
      </div>`;
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    const failedAddToCartMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.failedToAddItemToCart || "Failed to add item to cart";
    const backToCategoriesMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories";
    return `<div class="error-message"><p>${failedAddToCartMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }
}

/**
 * Retrieves orders for a specific chatbot
 */
export async function getOrders(chatbotId: string, orderId?: string, isWhatsApp: boolean = false, language?: string) {
  const action = await getOrderManagementAction(chatbotId);

  if (!action || !action.metadata || !action.metadata.menuItems) {
    const menuNotFoundMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.menuNotFound || "Menu not found";
    const backToCategoriesMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories";
    return `<div class="error-message"><p>${menuNotFoundMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }

  // Use language from parameter or action.metadata.language if not provided
  const lang = language || (action && action.metadata && action.metadata.language) || 'en';
  try {
    // If orderId is provided, get a specific order
    if (orderId) {
      const order = await Order.findOne({ chatbotId, orderId });
      if (!order) {
        const orderNotFoundMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.orderNotFound || `Order #${orderId} not found`;
        return isWhatsApp
          ? { error: orderNotFoundMsg }
          : `<div class="error-message"><p>${orderNotFoundMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">Back to Categories</button></div>`;
      }

      if (isWhatsApp) {
        // Return JSON structure for WhatsApp
        return {
          type: "order_detail",
          order: {
            id: order.orderId,
            status: order.status,
            timestamp: new Date(order.timestamp).toLocaleString(),
            table: order.table || "",
            items: order.items.map((item: any) => ({
              name: item.name,
              quantity: item.qty,
              price: item.price,
              total: (item.price * item.qty).toFixed(2)
            })),
            total: order.subtotal.toFixed(2)
          },
          buttons: [
            {
              id: `om-back-{tableName}-{actionId}`,
              title: action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories"
            }
          ]
        };
      } else {
        // Generate HTML content with order details for web interface
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
            <button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories"}</button>
          </div>
        </div>`;
      }
    }

    // Get all orders for this chatbot
    const orders = await Order.find({ chatbotId }).sort({ timestamp: -1 }).limit(10);

    if (!orders || orders.length === 0) {
      const noOrdersMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.failedToRetrieveOrders || "No orders found";
      return isWhatsApp
        ? { error: noOrdersMsg }
        : `<div class="error-message"><p>${noOrdersMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories"}</button></div>`;
    }

    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      return {
        type: "orders_list",
        title: "Recent Orders",
        body: "Here are your recent orders:",
        footer: "Select an order to view details.",
        button: "View Orders",
        sections: [
          {
            title: "Recent Orders",
            rows: [
              // Add back option as the first item
              {
                id: `om-back-{tableName}-{actionId}`,
                title: action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories",
                description: action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Return to menu categories"
              },
              // Add orders
              ...orders.map((order: any) => ({
                id: `om-track-{tableName}-{actionId}-${order.orderId}`,
                title: `Order #${order.orderId} - ${order.status}`,
                description: `${new Date(order.timestamp).toLocaleString()} - $${order.subtotal.toFixed(2)}`
              }))
            ]
          }
        ]
      };
    } else {
      // Generate HTML content with order list for web interface
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
          <button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories"}</button>
        </div>
      </div>`;
    }
  } catch (error) {
    console.error('Error retrieving orders:', error);
    const failedOrdersMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.failedToRetrieveOrders || "Failed to retrieve orders";
    const backToCategoriesMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories";
    return `<div class="error-message"><p>${failedOrdersMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }
}

/**
 * Submits an order
 * In a real implementation, this would save the order to a database
 * and potentially integrate with a POS system or Google Sheets
 */
export async function submitOrder(chatbotId: string, order: Order, isWhatsApp: boolean = false, metadata?: Object, language?: string) {
  console.log('submitOrder', order);
  const action = await getOrderManagementAction(chatbotId);

  if (!action || !action.metadata) {
    const orderMgmtNotConfiguredMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.orderManagementNotConfigured || "Order management not configured";
    const backToCategoriesMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories";
    return `<div class="error-message"><p>${orderMgmtNotConfiguredMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }

  // Use language from parameter or action.metadata.language if not provided
  const lang = language || (action && action.metadata && action.metadata.language) || 'en';

  try {
    // Validate table exists
    if (order.table) {
      const tableExists = action.metadata.tables.some(
        (table: any) => table.id === order.table || table.tableNumber === order.table
      );

      if (!tableExists) {
        const invalidTableMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.invalidTableNumber || "Invalid table number";
        const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
        return `<div class="error-message"><p>${invalidTableMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
      }
    }

    // Validate items exist and are available
    for (const orderItem of order.items) {
      const menuItem = action.metadata.menuItems.find((item: any) => item.id == orderItem.item_id.split('-').pop());

      if (!menuItem) {
        const itemNotFoundMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.itemNotFoundInMenu || `Item "${orderItem.name}" not found in menu`;
        const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
        return `<div class="error-message"><p>${itemNotFoundMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
      }

      if (!menuItem.available) {
        const itemNotAvailableMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.itemNotAvailable || `Item "${orderItem.name}" is not available`;
        const backToCategoriesMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.backToCategories || "Back to Categories";
        return `<div class="error-message"><p>${itemNotAvailableMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
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
        portal: isWhatsApp ? "whatsapp" : 'web',
        metadata,
        timestamp: new Date()
      });

      await newOrder.save();
      console.log(`Order ${orderId} saved to database`);
    } catch (dbError) {
      console.error('Error saving order to database:', dbError);
      // Continue even if database save fails - we don't want to block the order confirmation
    }

    // Update Google Sheet if connected
    if (hasGoogleSheets) {
      try {
        await updateGoogleSheet(chatbotId, order);
      } catch (sheetError) {
        console.error('Error updating Google Sheet:', sheetError);
      }
    }

    // Translate order item names for response
    const translatedItems = order.items.map((orderItem: OrderItem) => {
      const menuItem = action.metadata.menuItems.find((item: any) => item.id === orderItem.item_id);
      if (!menuItem) return orderItem;
      const translated = getTranslatedMenuItem(action, menuItem.id, lang);
      return {
        ...orderItem,
        name: translated.name || orderItem.name
      };
    });
    const currencyCode = action.metadata.currency || 'USD';
    const currencySymbol = currencySymbols[currencyCode] || currencyCode;
    const orderConfirmedMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.orderConfirmed || "Order Confirmed!";
    const orderReceivedMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.orderReceived || "Your order has been received and is being processed.";
    const orderSummaryMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.orderSummary || "Order Summary";
    const totalMsg = action?.metadata?.translations?.[lang]?.systemMsgs?.total || "Total";

    if (isWhatsApp) {
      // Return JSON structure for WhatsApp
      return {
        type: "order_confirmation",
        order: {
          orderId: orderId,
          table: order.table,
          items: translatedItems,
          total: calculatedTotal,
          status: 'received',
          timestamp: new Date()
        },
        buttons: [
          {
            id: `om-back-{tableName}-{actionId}`,
            title: action?.metadata?.translations?.[lang]?.systemMsgs?.orderManagementNotConfigured || "Place Another Order"
          },
          {
            id: `om-track-{tableName}-{actionId}-${orderId}`,
            title: action?.metadata?.translations?.[lang]?.systemMsgs?.orderManagementNotConfigured || "Track Order Status",
            orderId: orderId
          }
        ]
      };
    } else {
      // Generate HTML content with order confirmation for web interface

      return `<div class="order-confirmation">
        <div class="order-success">
          <h3>${orderConfirmedMsg}</h3>
          <p>${orderReceivedMsg}</p>
          ${order.table ? `<p>Table: ${order.table}</p>` : ''}
          <div class="order-details">
            <h4>${orderSummaryMsg}</h4>
            <ul class="order-items">
              ${translatedItems.map((item: OrderItem) => `<li>${item.qty} x ${item.name} - ${currencySymbol}${(item.price * item.qty).toFixed(2)}</li>`).join('')}
            </ul>
            <p class="order-total">${totalMsg}: ${currencySymbol}${calculatedTotal.toFixed(2)}</p>
          </div>
        </div>
        <div class="after-order-actions"></div>
      </div>`;
    }
  } catch (error) {
    console.error('Error submitting order:', error);
    const failedSubmitOrderMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.failedToSubmitOrder || "Failed to submit order";
    const backToCategoriesMsg = action?.metadata?.translations?.[language || 'en']?.systemMsgs?.backToCategories || "Back to Categories";
    return `<div class="error-message"><p>${failedSubmitOrderMsg}</p><button class="back-btn chat-option-btn" data-action="get_categories" data-index="0">${backToCategoriesMsg}</button></div>`;
  }
}

/**
 * Updates the connected Google Sheet with the order data
 */
export async function updateGoogleSheet(chatbotId: string, order: Order) {
  try {
    // Fetch the chatbot action to get Google Sheet config
    const action = await getOrderManagementAction(chatbotId);
    if (!action || !action.metadata || !action.metadata.googleSheetConfig) {
      throw new Error('Google Sheet configuration not found');
    }

    const { sheetId, sheetName, connected } = action.metadata.googleSheetConfig;
    if (!connected || !sheetId || !sheetName) {
      throw new Error('Google Sheet is not properly configured or connected');
    }

    // Setup Google Sheets API client
    // Using OAuth2 client with client ID and secret from environment variables
    const googleIntegration = await GoogleIntegration.findOne({ chatbotId });

    const { OAuth2 } = google.auth;
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: googleIntegration.accessToken,
      refresh_token: googleIntegration.refreshToken,
      expiry_date: googleIntegration.expiryDate
    });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // Prepare data to append
    // Format: [orderId, table, item1 name, item1 qty, item1 price, ..., total, status, timestamp]
    const rowData: any[] = [
      (order as any).orderId || '',
      order.table || '',
      ...order.items.flatMap(item => [item.name, item.qty, item.price]),
      order.subtotal || 0,
      (order as any).status || '',
      (order as any).timestamp ? new Date((order as any).timestamp).toLocaleString() : new Date().toLocaleString()
    ];

    // Append the row to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    console.log(`Google Sheet updated for chatbot ${chatbotId} with order ${order.orderId}`);
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
}
