import apiService from "../services/axiosService";
import config from "../services/config";

// Item-related API utilities
export const fetchItemTransactions = async (itemId, organizationId, filterBy = "All Documents", status = "All") => {
  const allTransactions = [];
  
  // Define document types to fetch from
  const documentTypes = getDocumentTypesByFilter(filterBy);
  
  for (const docType of documentTypes) {
    try {
      const response = await apiService({
        method: "GET",
        url: docType.endpoint,
        params: {
          organization_id: organizationId,
          page: 1,
          limit: 100,
          filter: status === "All" ? undefined : status.toLowerCase(),
          ...docType.params
        },
        customBaseUrl: docType.baseUrl,
      });
      
      if (response && response.data) {
        const documents = response.data[docType.dataKey] || response.data.data || [];
        
        // Filter documents that contain the specific item
        const itemTransactions = documents.filter(doc => {
          const lineItems = doc.line_items || doc.items || [];
          return lineItems.some(item => {
            const itemIdMatch = 
              item.item_id === itemId || 
              item._id === itemId || 
              item.id === itemId;
            
            const nameMatch = item.name?.toLowerCase().includes(itemId.toLowerCase()) ||
                             item.item_name?.toLowerCase().includes(itemId.toLowerCase());
            
            return itemIdMatch || nameMatch;
          });
        }).map(doc => ({
          ...doc,
          document_type: docType.name
        }));
        
        allTransactions.push(...itemTransactions);
      }
    } catch (err) {
      console.log(`Failed to fetch ${docType.name}:`, err);
    }
  }
  
  return allTransactions;
};

export const fetchItemHistory = async (itemId, organizationId) => {
  const allHistory = [];
  
  console.log("fetchItemHistory - itemId:", itemId, "organizationId:", organizationId);
  
  // Try multiple API endpoints for item history
  const historyEndpoints = [
    {
      name: "Item History",
      url: `/api/v1/item/${itemId}/history`,
      params: { organization_id: organizationId },
      baseUrl: config.SO_Base_url
    },
    {
      name: "Item Activities",
      url: `/api/v1/item/activities`,
      params: { 
        organization_id: organizationId,
        item_id: itemId 
      },
      baseUrl: config.SO_Base_url
    },
    {
      name: "Item Audit Log",
      url: `/api/v1/item/audit-log`,
      params: { 
        organization_id: organizationId,
        item_id: itemId 
      },
      baseUrl: config.SO_Base_url
    }
  ];
  
  for (const endpoint of historyEndpoints) {
    try {
      console.log(`fetchItemHistory - Trying ${endpoint.name}:`, endpoint.url);
      const response = await apiService({
        method: "GET",
        url: endpoint.url,
        params: endpoint.params,
        customBaseUrl: endpoint.baseUrl,
      });
      
      console.log(`fetchItemHistory - ${endpoint.name} response:`, response);
      
      if (response && response.data) {
        const historyData = response.data.history || response.data.activities || 
                           response.data.audit_log || response.data.data || [];
        
        if (Array.isArray(historyData) && historyData.length > 0) {
          const transformedHistory = historyData.map(item => ({
            timestamp: item.timestamp || item.created_at || item.date || item.created_date,
            action: item.action || item.activity || item.event || item.type || "Activity",
            user: item.user || item.created_by || item.user_name || item.actor || "System",
            details: item.details || item.description || item.message || item.comment || "No details available"
          }));
          allHistory.push(...transformedHistory);
          console.log(`fetchItemHistory - Added ${transformedHistory.length} items from ${endpoint.name}`);
        }
      }
    } catch (err) {
      console.log(`fetchItemHistory - Failed to fetch ${endpoint.name}:`, err);
      // Don't throw error, continue with other endpoints
    }
  }
  
  // Also fetch document-related history
  try {
  const documentHistory = await fetchDocumentHistory(itemId, organizationId);
  allHistory.push(...documentHistory);
    console.log("fetchItemHistory - Added document history:", documentHistory.length);
  } catch (err) {
    console.log("fetchItemHistory - Failed to fetch document history:", err);
  }
  
  console.log("fetchItemHistory - Total history items:", allHistory.length);
  return allHistory;
};

const fetchDocumentHistory = async (itemId, organizationId) => {
  const documentHistory = [];
  
  const documentTypes = [
    { name: "Quotes", endpoint: "/api/v1/estimates", dataKey: "estimates" },
    { name: "Sales Orders", endpoint: "/api/v1/salesorders", dataKey: "salesorders" },
    { name: "Invoices", endpoint: "/api/v1/invoices", dataKey: "invoices" },
    { name: "Bills", endpoint: "/api/v1/bills", dataKey: "bills" }
  ];
  
  for (const docType of documentTypes) {
    try {
      const response = await apiService({
        method: "GET",
        url: docType.endpoint,
        params: {
          organization_id: organizationId,
          page: 1,
          limit: 50
        },
        customBaseUrl: config.SO_Base_url,
      });
      
      if (response && response.data) {
        const documents = response.data[docType.dataKey] || [];
        
        const relevantDocs = documents.filter(doc => {
          const lineItems = doc.line_items || doc.items || [];
          return lineItems.some(item => 
            item.item_id === itemId || 
            item._id === itemId || 
            item.id === itemId
          );
        });
        
        relevantDocs.forEach(doc => {
          if (doc.created_date) {
            documentHistory.push({
              timestamp: doc.created_date,
              action: `Created ${docType.name}`,
              user: doc.created_by || "System",
              details: `${docType.name} ${doc.quote_number || doc.invoice_number || doc.bill_number || doc.number} was created`
            });
          }
          
          if (doc.updated_date && doc.updated_date !== doc.created_date) {
            documentHistory.push({
              timestamp: doc.updated_date,
              action: `Updated ${docType.name}`,
              user: doc.updated_by || "System",
              details: `${docType.name} ${doc.quote_number || doc.invoice_number || doc.bill_number || doc.number} was updated`
            });
          }
        });
      }
    } catch (err) {
      console.log(`Failed to fetch ${docType.name} history:`, err);
    }
  }
  
  return documentHistory;
};

const getDocumentTypesByFilter = (filter) => {
  switch (filter) {
    case "Quotes":
      return [{
        name: "Quotes",
        endpoint: "/api/v1/estimates",
        dataKey: "estimates",
        baseUrl: config.SO_Base_url,
        params: {}
      }];
    case "Sales Orders":
      return [{
        name: "Sales Orders",
        endpoint: "/api/v1/salesorders",
        dataKey: "salesorders",
        baseUrl: config.SO_Base_url,
        params: {}
      }];
    case "Invoices":
      return [{
        name: "Invoices",
        endpoint: "/api/v1/invoices",
        dataKey: "invoices",
        baseUrl: config.SO_Base_url,
        params: {}
      }];
    case "Delivery Challans":
      return [{
        name: "Delivery Challans",
        endpoint: "/api/v1/deliverychallans",
        dataKey: "deliverychallans",
        baseUrl: config.SO_Base_url,
        params: {}
      }];
    case "Credit Notes":
      return [{
        name: "Credit Notes",
        endpoint: "/api/v1/credit-notes",
        dataKey: "creditnotes",
        baseUrl: config.SO_Base_url,
        params: {}
      }];
    case "Recurring Invoices":
      return [{
        name: "Recurring Invoices",
        endpoint: "/api/v1/recurring-invoices",
        dataKey: "recurringinvoices",
        baseUrl: config.SO_Base_url,
        params: {}
      }];
    case "Bills":
      return [{
        name: "Bills",
        endpoint: "/api/v1/bills",
        dataKey: "bills",
        baseUrl: config.PO_Base_url,
        params: {}
      }];
    case "Purchase Orders":
      return [{
        name: "Purchase Orders",
        endpoint: "/api/v1/purchase-orders",
        dataKey: "purchaseorders",
        baseUrl: config.PO_Base_url,
        params: {}
      }];
    case "All Documents":
      return [
        {
          name: "Quotes",
          endpoint: "/api/v1/estimates",
          dataKey: "estimates",
          baseUrl: config.SO_Base_url,
          params: {}
        },
        {
          name: "Sales Orders",
          endpoint: "/api/v1/salesorders",
          dataKey: "salesorders",
          baseUrl: config.SO_Base_url,
          params: {}
        },
        {
          name: "Invoices",
          endpoint: "/api/v1/invoices",
          dataKey: "invoices",
          baseUrl: config.SO_Base_url,
          params: {}
        },
        {
          name: "Bills",
          endpoint: "/api/v1/bills",
          dataKey: "bills",
          baseUrl: config.PO_Base_url,
          params: {}
        }
      ];
    default:
      return [{
        name: "Quotes",
        endpoint: "/api/v1/estimates",
        dataKey: "estimates",
        baseUrl: config.SO_Base_url,
        params: {}
      }];
  }
};

// Utility functions for data transformation
export const transformTransactionData = (transactions, itemId, filterType) => {
  return transactions.map(tx => {
    // Find the specific item in line items
    const lineItems = tx.line_items || tx.items || [];
    const itemLine = lineItems.find(item => 
      item.item_id === itemId || 
      item._id === itemId || 
      item.id === itemId ||
      item.item_id === itemId
    ) || lineItems[0] || {};

    return {
      date: formatDate(tx.date || tx.created_date || tx.transaction_date || tx.estimate_date),
      document_number: tx.quote_number || tx.estimate_number || tx.invoice_number || 
                      tx.bill_number || tx.purchase_number || tx.document_number || tx.number || "N/A",
      customer_name: tx.customer_name || tx.customer?.name || tx.contact_name || tx.vendor_name || "N/A",
      quantity_sold: itemLine.quantity || itemLine.qty || 1,
      price: itemLine.rate || itemLine.price || itemLine.unit_price || 0,
      total: itemLine.amount || itemLine.total || (itemLine.quantity * itemLine.rate) || 0,
      status: tx.status || tx.document_status || tx.status_formatted || "Draft",
      document_type: tx.document_type || filterType
    };
  });
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatCurrency = (value) =>
  value != null ? `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-";

export const getStatusColor = (status) => {
  if (!status) return "inherit";
  const s = status.toLowerCase();
  if (s === "accepted" || s === "paid") return "#22b378";
  if (s === "sent") return "#408dfb";
  if (s === "invoiced") return "#f76831";
  if (s === "draft") return "#888";
  if (s === "pending" || s === "partially_paid") return "#f39c12";
  if (s === "approved") return "#27ae60";
  if (s === "rejected" || s === "unpaid") return "#e74c3c";
  if (s === "overdue") return "#f76831";
  return "#888";
};

