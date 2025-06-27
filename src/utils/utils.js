// utils.js - Utility functions for PO import process

/**
 * Maps CSV data to the Purchase Order schema format
 * @param {Object} record - CSV data record
 * @param {Object} mappings - Field mappings between CSV headers and schema fields
 * @returns {Object} - Formatted purchase order object
 */
export const mapRecordToPurchaseOrder = (record, mappings) => {
    // Initialize purchase order object with required arrays/objects based on schema
    const purchaseOrder = {
      items: [],
      billing_address: [],
      shipping_address: {},
      delivery_address: {},
      taxes: [],
      status: 0, // Default to OPEN
    };
  
    // Process each mapping and add to appropriate field in purchase order
    Object.entries(mappings).forEach(([schemaField, csvHeader]) => {
      if (!csvHeader) return; // Skip if no mapping exists
      
      const value = record[csvHeader];
      if (value === undefined || value === null || value === '') return; // Skip empty values
      
      // Handle nested fields
      if (schemaField.startsWith('item.')) {
        // Item fields (e.g., item.name, item.rate)
        const itemField = schemaField.replace('item.', '');
        if (!purchaseOrder.items[0]) {
          purchaseOrder.items[0] = {};
        }
        
        // Convert appropriate fields to numbers
        if (['quantity', 'rate', 'discount', 'item_total'].includes(itemField)) {
          purchaseOrder.items[0][itemField] = parseFloat(value) || 0;
        } else {
          purchaseOrder.items[0][itemField] = value;
        }
      } else if (schemaField.startsWith('billing_address.')) {
        // Billing address fields
        const addressField = schemaField.replace('billing_address.', '');
        if (!purchaseOrder.billing_address[0]) {
          purchaseOrder.billing_address[0] = {};
        }
        purchaseOrder.billing_address[0][addressField] = value;
      } else if (schemaField.startsWith('shipping_address.')) {
        // Shipping address fields
        const addressField = schemaField.replace('shipping_address.', '');
        purchaseOrder.shipping_address[addressField] = value;
      } else {
        // Handle top-level fields with appropriate type conversion
        if (['total', 'subtotal', 'taxAmount', 'adjustment', 'payment_made', 'balance'].includes(schemaField)) {
          purchaseOrder[schemaField] = parseFloat(value) || 0;
        } else if (schemaField === 'status') {
          // Convert status string to number (0: OPEN, 1: DRAFT, 2: VOID, 3: PAID)
          const statusMap = {
            'OPEN': 0,
            'DRAFT': 1,
            'VOID': 2,
            'PAID': 3
          };
          purchaseOrder[schemaField] = statusMap[value] !== undefined ? statusMap[value] : 0;
        } else if (schemaField === 'date' || schemaField === 'due_date') {
          // Convert date strings to Date objects
          purchaseOrder[schemaField] = new Date(value);
        } else {
          // Default: string value
          purchaseOrder[schemaField] = value;
        }
      }
    });
  
    return purchaseOrder;
  };
  
  /**
   * Validates a single purchase order record
   * @param {Object} record - CSV data record
   * @param {Object} mappings - Field mappings
   * @param {Array} requiredFields - List of required fields
   * @returns {Object} - { isValid: boolean, errors: string[] }
   */
  export const validatePurchaseOrderRecord = (record, mappings, requiredFields) => {
    const errors = [];
    
    // Check required fields
    requiredFields.forEach(field => {
      const csvHeader = mappings[field.key];
      
      if (csvHeader) {
        const value = record[csvHeader];
        
        // Check if value exists for required fields
        if (!value && field.required) {
          errors.push(`Missing required field: ${field.name}`);
        }
        
        // Validate number fields
        if (field.type === 'number' && value && isNaN(parseFloat(value))) {
          errors.push(`Invalid number format for ${field.name}: ${value}`);
        }
        
        // Validate date fields
        if (field.type === 'date' && value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push(`Invalid date format for ${field.name}: ${value}`);
          }
        }
      } else if (field.required) {
        // Required field has no mapping
        errors.push(`Required field not mapped: ${field.name}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Gets the expected field definitions for purchase orders
   * @returns {Array} - Array of field definition objects
   */
  export const getPurchaseOrderFields = () => {
    return [
      { name: 'Purchase Order Date', key: 'date', type: 'date', required: true },
      { name: 'Purchase Order Number', key: 'purchase_order_number', type: 'text', required: true },
      { name: 'Reference#', key: 'reference_number', type: 'text', required: false },
      { name: 'Vendor Name', key: 'vendor_id', type: 'text', required: true },
      { name: 'Organization', key: 'organization_name', type: 'text', required: false },
      { name: 'Due Date', key: 'due_date', type: 'date', required: false },
      { name: 'Item Name', key: 'item.itemName', type: 'text', required: true },
      { name: 'Item Description', key: 'item.details', type: 'text', required: false },
      { name: 'Quantity', key: 'item.quantity', type: 'number', required: true },
      { name: 'Rate', key: 'item.rate', type: 'number', required: true },
      { name: 'Amount', key: 'item.item_total', type: 'number', required: true },
      { name: 'Discount', key: 'item.discount', type: 'number', required: false },
      { name: 'Tax', key: 'item.tax', type: 'text', required: false },
      { name: 'Billing Address', key: 'billing_address.address', type: 'text', required: false },
      { name: 'Shipping Address', key: 'shipping_address.address', type: 'text', required: false },
      { name: 'Status', key: 'status', type: 'text', required: false },
      { name: 'Currency', key: 'currency_id', type: 'text', required: false },
      { name: 'Payment Terms', key: 'payment_terms', type: 'text', required: false },
      { name: 'Notes', key: 'notes', type: 'text', required: false },
    ];
  };