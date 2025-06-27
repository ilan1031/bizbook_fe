"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Form from "./components/Form";
import ItemList from "./components/ItemList";
import Sidebar from "./components/Sidebar";
import FunctionKeys from "./components/FunctionKeys";
import EInvoice from "./components/EInvoice";
import Narration from "./components/Narration";
import SalesSidebar from "./components/SalesSidebar";
import DispatchDetails from "./components/DispatchDetails";
import PartyDetails from "./components/PartyDetails";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import OrderDetails from "./components/OrderDetails";
import { useLocalStorage } from "./useLocalStorage";

const getBackgroundColor = (isStatus) => {
  // Define a mapping of statuses to background colors
  const statusColors = {
    Bill: "#f4f1e8",
    Invoice: "#e8f2f4",
    SalesOrder: "#f4e9e8",
    Quote: "#e8f4ef",
  };

  // Return the corresponding color or default color if status is not found
  return statusColors[isStatus] || "#e8f4e8";
};
const AccountingVoucherCreation = ({ isStatus }) => {
  console.log("[AccountingVoucherCreation] Received isStatus prop:", isStatus);
  // Dynamically set the background color based on isStatus
  const backgroundColor = getBackgroundColor(isStatus);
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState("");
  const [voucherType, setVoucherType] = useState("");
  const [showLedgerAccounts, setShowLedgerAccounts] = useState(false);
  const [showSalesLedgerAccounts, setShowSalesLedgerAccounts] = useState(false);
  const [showStockItems, setShowStockItems] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [salesLedger, setSalesLedger] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("1");
  const [voucherDate, setVoucherDate] = useState(getCurrentDate());
  const [items, setItems] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    quantity: "",
    unit: "Nos",
    rate: "",
    amount: 0,
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(7500.0);
  const [narration, setNarration] = useState("");
  const [provideEInvoice, setProvideEInvoice] = useState("No");
  const [filteredLedgerAccounts, setFilteredLedgerAccounts] = useState([]);
  const [filteredStockItems, setFilteredStockItems] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState("");
  const [filteredSalesLedgerAccounts, setFilteredSalesLedgerAccounts] =
    useState([]);
  const [ledgerAccounts, setLedgerAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [showDispatchPopup, setShowDispatchPopup] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("Accounting Voucher Creation");
  const [showPartyDetails, setShowPartyDetails] = useState(false);
  const [contactDetails, setContactDetails] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isZoho, setIsZoho] = useState(false);
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [gstTreatment, setGstTreatment] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [tdsId, setTdsId] = useState("");
  const [tcsId, setTcsId] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [adjustment, setAdjustment] = useState(0);
  const [terms, setTerms] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderNo: "",
    orderDate: "",
    salesOrderNo: "",
    salesOrderDate: "",
    purchaseOrderNo: "",
    purchaseOrderDate: "",
    deliveryNote: "",
    deliveryDate: "",
    vehicleNumber: "",
    ewayBillNo: "",
    transportName: "",
    transportDate: "",
  });

  // Add dispatch details state
  const [dispatchDetails, setDispatchDetails] = useState({
    deliveryNotes: "",
    deliveryDate: "",
    dispatchDoc: "",
    dispatchedThrough: "",
    destination: "",
    carrierName: "",
    billNumber: "",
    billDate: "",
    vehicleNumber: "",
  });

  function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  }

  // Calculate expiry date based on current date
  const calculateExpiryDate = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5); // Add 5 days
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  };

  // Format date from DD/MM/YYYY to YYYY-MM-DD for API
  const formatDateForAPI = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format for API
  };

  // Convert date from YYYY-MM-DD to DD/MM/YYYY
  const convertDateToDisplayFormat = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  };

  useEffect(() => {
    // Get organization_id from localStorage after component mounts
    const organizationId = localStorage.getItem("organization_id");
    setOrganizationId(organizationId);

    // Set voucher type based on isStatus
    console.log(
      "[AccountingVoucherCreation] Setting voucherType based on isStatus:",
      isStatus
    );
    const newVoucherType =
      isStatus === "Quote"
        ? "Quote"
        : isStatus === "Invoice"
        ? "Invoice"
        : isStatus === "PurchaseOrder"
        ? "Purchase"
        : isStatus === "Bill"
        ? "Bill"
        : "Sales";
    console.log(
      "[AccountingVoucherCreation] New voucherType value:",
      newVoucherType
    );
    setVoucherType(newVoucherType);

    // Set initial expiry date to 5 days from the current date
    const initialExpiryDate = calculateExpiryDate();
    setExpiryDate(initialExpiryDate);
  }, [isStatus]);

  // Move all localStorage access inside useEffect
  useEffect(() => {
    // Get organization_id from localStorage after component mounts
    const organizationId = localStorage.getItem("organization_id");
    setOrganizationId(organizationId);
  }, []);

  // Check for showPartyDetails flag in localStorage
  useEffect(() => {
    const shouldShowPartyDetails =
      localStorage.getItem("showPartyDetails") === "true";
    if (shouldShowPartyDetails) {
      setShowPartyDetails(true);
      setHeaderTitle("Party Details");
      setShowDispatchPopup(false);

      // Fetch contact details
      fetchContactDetails();

      // Clear the flag
      localStorage.removeItem("showPartyDetails");
    }
  }, []);

  // Fetch contact details from API
  const fetchContactDetails = async (contactId) => {
    if (!contactId) return;

    setContactLoading(true);
    try {
      // Ensure we have an organization ID
      const orgId = organizationId || localStorage.getItem("organization_id");

      if (!orgId) {
        console.error("Organization ID not available for contact fetch");
        setContactLoading(false);
        return;
      }

      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${contactId}`,
        params: {
          organization_id: orgId,
        },
        file: false,
      });

      const { data } = response.data;
      console.log("Contact details:", data);

      // Update state with contact details
      setContactDetails({
        contact_id: data.contact_id,
        contact_name: data.contact_name,
        company_name: data.company_name || "",
        billing_address: data.billing_address || null,
        shipping_address: data.shipping_address || null,
        place_of_contact: data.place_of_contact || "",
        gst_no: data.gst_no || "",
        contact_type: data.contact_type || "",
        opening_balance_amount: data.opening_balance_amount || 0,
      });

      // Set the selected account name
      setSelectedAccount(data.contact_name);

      // Set GST treatment and place of supply
      setGstTreatment(data.gst_treatment || "");
      setPlaceOfSupply(data.place_of_contact || "");

      setContactLoading(false);
    } catch (error) {
      console.error("Failed to fetch contact details:", error);
      setContactLoading(false);
    }
  };

  // Function to close party details popup
  const handleClosePartyDetails = () => {
    setShowPartyDetails(false);
    setHeaderTitle("Accounting Voucher Creation");
  };

  // Update fetchCustomers to use organizationId from state
  const fetchCustomers = async () => {
    if (!organizationId) return; // Don't fetch if no organizationId

    setLoading(true);
    try {
      // Determine the URL based on the value of isStatus
      const apiUrl =
        isStatus === "PurchaseOrder" || isStatus === "Bill"
          ? "/api/v1/vendors"
          : "/api/v1/customers";
      const response = await apiService({
        method: "GET",
        url: apiUrl,
        params: {
          filter_by: "Status.Active",
          page: 1,
          per_page: 50,
          sort_column: "contact_name",
          sort_order: "A",
          organization_id: organizationId,
        },
        file: false,
      });
      const { data } = response.data;
      setLedgerAccounts(data);
      setFilteredLedgerAccounts(data);

      if (data.length > 0) {
        setSelectedVendorId(data[0]._id);
        console.log("Selected Vendor ID:", data[0]._id); // Debugging log
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
      setLoading(false);
    }
  };

  // Update fetchStockItems to use organizationId from state
  const fetchStockItems = async () => {
    if (!organizationId) return; // Don't fetch if no organizationId

    setItemLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/item/item/details`,
        params: {
          organization_id: organizationId,
        },
        file: false,
      });

      console.log("Stock items API response:", response.data);
      const items = response.data.message || [];
      console.log("Transformed items:", items);

      setStockItems(items);
      setFilteredStockItems(items);
      setItemLoading(false);
    } catch (error) {
      console.error("Failed to fetch stock items:", error);
      setItemLoading(false);
      setStockItems([]);
      setFilteredStockItems([]);
    }
  };

  // Update useEffect dependencies to include organizationId
  useEffect(() => {
    if (organizationId) {
      fetchCustomers();
      fetchStockItems();
    }
  }, [organizationId]);

  // Update total amount whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
  }, [items]);

  const salesLedgerAccounts = [
    "SALES NON-GST",
    "SALES TAXABLE",
    "SALES COMMON",
    "SALES EXPORT",
    "SERVICE SALES",
    "OTHER SALES",
    "DISCOUNT RECEIVED",
  ];

  // Initialize filtered sales accounts
  useEffect(() => {
    setFilteredSalesLedgerAccounts(salesLedgerAccounts);
  }, []);

  const functionKeys = [
    { key: "F2", label: "List" },
    { key: "F3", label: "Company" },
    { key: "F4", label: "Contra" },
    { key: "F5", label: "Payment" },
    { key: "F6", label: "Receipt" },
    { key: "F7", label: "Journal" },
    { key: "F8", label: "Sales" },
    { key: "F9", label: "Purchase" },
    { key: "F10", label: "Other Vouchers" },
    { key: "E", label: "Autofill" },
    { key: "H", label: "Change Mode" },
    { key: "I", label: "More Details" },
    { key: "O", label: "Related Reports" },
    { key: "L", label: "Optional" },
    { key: "T", label: "Post-Dated" },
  ];

  // Function to handle selecting a ledger account
  const handleSelectAccount = (account) => {
    setSelectedAccount(account.contact_name);
    setShowLedgerAccounts(false);
    setShowOrderDetails(true);
    setHeaderTitle("Order Details");

    // Store the selected contact ID in localStorage
    localStorage.setItem("selectedContactId", account.contact_id);

    // Fetch contact details for the selected customer
    fetchContactDetails(account.contact_id);
  };

  // Function to handle selecting a sales ledger account
  const handleSelectSalesLedger = (account) => {
    setSalesLedger(account);
    setShowSalesLedgerAccounts(false); // Close sales ledger accounts popup
  };

  // Function to open party ledger accounts sidebar
  const openPartyLedgerSidebar = () => {
    setShowLedgerAccounts(true);
    setActiveSidebar("party");
    setShowSalesLedgerAccounts(false);
  };

  // Function to open sales ledger accounts sidebar
  const openSalesLedgerSidebar = () => {
    setShowSalesLedgerAccounts(true);
    setShowLedgerAccounts(false); // Ensure general ledger popup is closed
  };

  // Function to handle party account name input change
  const handlePartyAccountChange = (e) => {
    const value = e.target.value;
    setSelectedAccount(value);

    // Show the sidebar if it's not already shown
    if (!showLedgerAccounts) {
      setShowLedgerAccounts(true);
      setActiveSidebar("party");
    }

    // Filter the ledger accounts based on input
    const filtered = ledgerAccounts.filter((account) =>
      account.contact_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLedgerAccounts(filtered);
  };

  // Function to handle sales ledger input change
  const handleSalesLedgerChange = (e) => {
    const value = e.target.value;
    setSalesLedger(value);

    // Show sales ledger accounts popup if not already shown
    if (!showSalesLedgerAccounts) {
      setShowSalesLedgerAccounts(true);
    }

    // Filter sales ledger accounts based on input
    const filtered = salesLedgerAccounts.filter((account) =>
      account.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSalesLedgerAccounts(filtered);
  };

  // Handle input change for current item
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  // Add a new item to the list
  const addItem = () => {
    if (currentItem.name && currentItem.quantity && currentItem.rate) {
      const amount = calculateAmount(
        Number(currentItem.quantity),
        Number(currentItem.rate)
      );
      const newItem = {
        id:
          items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1,
        name: currentItem.name,
        quantity: Number(currentItem.quantity),
        unit: currentItem.unit,
        rate: Number(currentItem.rate),
        amount,
      };

      setItems([...items, newItem]);
      setCurrentItem({
        name: "",
        quantity: "",
        unit: "Nos",
        rate: "",
        amount: 0,
      });
    }
  };

  // Function to calculate amount based on quantity and rate
  const calculateAmount = (quantity, rate) => {
    return quantity * rate;
  };

  // Update an existing item
  const updateItem = (updatedItem) => {
    // Find the index of the item to update
    const index = items.findIndex((item) => item.id === updatedItem.id);

    if (index !== -1) {
      // Create a new array with the updated item
      const updatedItems = [...items];
      updatedItems[index] = updatedItem;

      // Update the items state
      setItems(updatedItems);

      // Recalculate total amount
      const newTotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      setTotalAmount(newTotal);
    }
  };

  // Edit an existing item
  const editItem = (item) => {
    setCurrentItem({ ...item });
    setEditingItemId(item.id);
  };

  // Delete an item
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    if (editingItemId === id) {
      setCurrentItem({
        name: "",
        quantity: "",
        unit: "Nos",
        rate: "",
        amount: 0,
      });
      setEditingItemId(null);
    }
  };

  // Handle e-invoice change
  const handleEInvoiceChange = (e) => {
    const value = e.target.value;
    setProvideEInvoice(value);
    if (value === "Yes") {
      setShowDispatchPopup(true); // Show dispatch details popup instead of redirecting
    }
  };

  // Handlers for dispatch details
  const handleDispatchDetailsChange = (field, value) => {
    setDispatchDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Function to close dispatch popup
  const handleCloseDispatchPopup = () => {
    setShowDispatchPopup(false);
    setHeaderTitle("Accounting Voucher Creation");
  };

  // Function to handle Enter key press in Vehicle No. field
  const handleVehicleNumberEnter = (vehicleNumber) => {
    // Store the vehicle number in localStorage
    localStorage.setItem("vehicleNumber", vehicleNumber);

    // Close the order details popup
    setShowOrderDetails(false);

    // Open the party details popup
    setShowPartyDetails(true);
    setHeaderTitle("Party Details");

    // Fetch contact details
    fetchContactDetails();
  };

  // Function to handle item name input change
  const handleItemNameChange = (e) => {
    const value = e.target.value;
    setCurrentItem({ ...currentItem, name: value });

    // Show the stock items sidebar if it's not already shown
    if (!showStockItems) {
      setShowStockItems(true);
      setActiveSidebar("stock");
    }

    console.log("Stock items before filtering:", stockItems);
    // Filter the stock items based on input
    const filtered = stockItems.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    console.log("Filtered stock items:", filtered);
    setFilteredStockItems(filtered);
  };

  // Function to handle selecting a stock item
  const handleSelectStockItem = (item) => {
    console.log("Selected stock item:", item);
    if (item.name === "End of List") {
      // If "End of List" is selected, just update the current item name
      setCurrentItem((prev) => ({
        ...prev,
        name: "End of List",
      }));
      setShowStockItems(false);
      return;
    }

    const newItem = {
      id: Date.now(),
      name: item.name,
      quantity: 1, // Default quantity
      unit: "Nos",
      rate: item.rate,
      amount: item.rate * 1, // Calculate amount based on default quantity
    };

    setItems([...items, newItem]);
    setCurrentItem({
      name: "",
      quantity: "",
      unit: "Nos",
      rate: "",
      amount: 0,
    });
    setShowStockItems(false);
  };

  // Function to open stock items sidebar
  const openStockItemsSidebar = () => {
    // Add "End of List" to the beginning of the filtered items
    const itemsWithEndOfList = [
      { id: "end-of-list", name: "End of List", rate: 0 },
      ...stockItems,
    ];
    setFilteredStockItems(itemsWithEndOfList);
    setShowStockItems(true);
    setActiveSidebar("stock");
    setShowLedgerAccounts(false);
    setShowSalesLedgerAccounts(false);
  };

  // Function to close stock items sidebar
  const closeStockItemsSidebar = () => {
    setShowStockItems(false);
    setActiveSidebar("");
  };

  // Function to handle order details changes
  const handleOrderDetailsChange = (field, value) => {
    setOrderDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Function to close order details popup
  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setHeaderTitle("Accounting Voucher Creation");
  };

  // Update handleAcceptClick to call appropriate save function based on isStatus
  const handleAccept = () => {
    console.log(
      "[AccountingVoucherCreation] handleAccept called with isStatus:",
      isStatus
    );
    if (isStatus === "Quote") {
      console.log("[AccountingVoucherCreation] Calling saveEstimate");
      saveEstimate();
    } else if (isStatus === "Invoice") {
      console.log("[AccountingVoucherCreation] Calling saveInvoice");
      saveInvoice();
    } else if (isStatus === "PurchaseOrder") {
      console.log("[AccountingVoucherCreation] Calling savePurchaseOrder");
      savePurchaseOrder();
    } else if (isStatus === "Bill") {
      console.log("[AccountingVoucherCreation] Calling saveBill");
      saveBill();
    } else {
      console.log("[AccountingVoucherCreation] Calling saveSalesOrder");
      saveSalesOrder();
    }
  };

  // Update toggleMode to handle different routes based on isStatus
  const toggleMode = () => {
    console.log(
      "[AccountingVoucherCreation] toggleMode called with isStatus:",
      isStatus
    );
    const formData = {
      // Customer data
      customer_id: contactDetails?.contact_id,
      customer_name: contactDetails?.contact_name,
      billing_address: contactDetails?.billing_address,
      shipping_address: contactDetails?.shipping_address,
      gst_treatment: gstTreatment,
      place_of_supply: placeOfSupply,
      gst_no: contactDetails?.gst_no,

      // Line items - Only save if there are items
      line_items:
        items.length > 0
          ? items.map((item) => ({
              ...item,
              amount: parseFloat(item.amount),
              rate: parseFloat(item.rate),
              quantity: parseFloat(item.quantity),
            }))
          : [],

      // Dates
      // date: voucherDate,

      // Tax and payment info
      tds_id: tdsId,
      tcs_id: tcsId,
      payment_terms: paymentTerms,
      discount_percent: discountPercent,
      discount_amount: discountAmount,

      // Totals
      sub_total: subTotal,
      tax_total: taxTotal,
      total: total,
      adjustment: adjustment,

      // Additional fields
      notes: narration,
      terms: terms,

      // Add organization_id to shared data
      organization_id: organizationId,
      isStatus: isStatus, // Add isStatus to shared data
    };

    // Only save to localStorage if there are items or customer data
    if (items.length > 0 || contactDetails?.contact_id) {
      localStorage.setItem("sharedFormData", JSON.stringify(formData));
      localStorage.setItem("fromTally", "true");
    }

    setIsZoho(!isZoho);

    // Route based on isStatus
    if (isStatus === "Quote") {
      router.push("/sales/quotes/new");
    } else if (isStatus === "Invoice") {
      router.push("/sales/invoices/new");
    } else if (isStatus === "PurchaseOrder") {
      router.push("/purchase/purchaseorder/create");
    } else if (isStatus === "SalesOrder") {
      router.push("/sales/salesOrder/new");
    } else if (isStatus === "Bill") {
      router.push("/purchase/bills/create");
    } else {
      router.push("/sales/salesOrder/new");
    }
  };

  // Update saveEstimate to use organizationId from state
  const saveEstimate = async () => {
    if (!organizationId) {
      console.error("Organization ID not found");
      return;
    }

    try {
      console.log("[AccountingVoucherCreation] saveEstimate called");
      // First fetch contact details if we have a contact_id
      let contactData = {};
      if (contactDetails?.contact_id) {
        const contactResponse = await apiService({
          method: "GET",
          url: `/api/v1/contact/${contactDetails.contact_id}`,
          params: {
            organization_id: organizationId,
          },
          file: false,
        });
        contactData = contactResponse.data.data;

        // Remove _id from contactData
        const { _id, ...restOfContactData } = contactData; // Destructure to exclude _id
        contactData = restOfContactData;
      }

      // Prepare the line items from the items state
      const lineItems = items.map((item) => ({
        item_id: item.id,
        details: item.name,
        sku: item.sku,
        name: item.name,
        quantity: parseFloat(item.quantity) || 0,
        rate: parseFloat(item.rate) || 0,
        unit: item.unit,
        amount: parseFloat(item.amount) || 0,
        item_total: parseFloat(item.amount) || 0,
        item_total_formatted: `₹${(parseFloat(item.amount) || 0).toFixed(2)}`,
        discount: 0,
      }));
      const expiryDateFormatted = formatDateForAPI(expiryDate);
      // Format the date for the API
      const formattedDate = convertDateToDisplayFormat(voucherDate);

      // Prepare request data with all contact and customer details
      const requestData = {
        customer_id: contactDetails?.contact_id || "",
        customer_name: contactDetails?.contact_name || "",
        company_name: contactDetails?.company_name || "",
        billing_address: contactDetails?.billing_address || "",
        shipping_address: contactDetails?.shipping_address || "",
        place_of_contact: contactDetails?.place_of_contact || "",
        gst_no: contactDetails?.gst_no || "",
        contact_type: contactDetails?.contact_type || "",
        opening_balance_amount: contactDetails?.opening_balance_amount || 0,
        estimate_number: voucherNumber,
        date: voucherDate,
        date_formatted: formattedDate,
        expiry_date: expiryDateFormatted,
        expiry_date_formatted: expiryDate,
        line_items: lineItems,
        tax_type: "",
        tax_percentage: 0,
        sub_total: totalAmount,
        sub_total_formatted: `₹${totalAmount.toFixed(2)}`,
        total: totalAmount,
        total_formatted: `₹${totalAmount.toFixed(2)}`,

        notes: narration,
        gst_treatment: gstTreatment,
        place_of_supply: placeOfSupply,
        payment_terms: paymentTerms,
        tds_id: tdsId,
        tcs_id: tcsId,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        terms: terms,
        adjustment: adjustment,
        tax_total: taxTotal,
        // Include all contact data from the API response
        ...contactData,
        status: "draft",
        status_formatted: "Draft",
      };

      console.log(
        "[AccountingVoucherCreation] Sending estimate data:",
        requestData
      );

      // Make API call to save estimate
      const response = await apiService({
        method: "POST",
        url: `/api/v1/estimates?organization_id=${organizationId}`,
        data: requestData,
        customBaseUrl: config.SO_Base_url,
      });

      console.log(
        "[AccountingVoucherCreation] Estimate API response:",
        response.data
      );

      if (response.data.status) {
        router.push("/tally/creation");
      } else {
        console.error("Failed to save estimate:", response.data);
      }
    } catch (error) {
      console.error("Error saving estimate:", error);
    }
  };

  const saveInvoice = async () => {
    if (!organizationId) {
      console.error("Organization ID not found");
      return;
    }

    try {
      console.log("[AccountingVoucherCreation] saveInvoice called");
      // First fetch contact details if we have a contact_id
      let contactData = {};
      if (contactDetails?.contact_id) {
        const contactResponse = await apiService({
          method: "GET",
          url: `/api/v1/contact/${contactDetails.contact_id}`,
          params: {
            organization_id: organizationId,
          },
          file: false,
        });
        contactData = contactResponse.data.data;

        // Remove _id from contactData
        const { _id, ...restOfContactData } = contactData; // Destructure to exclude _id
        contactData = restOfContactData;
      }

      // Prepare the line items from the items state
      const lineItems = items.map((item) => ({
        item_id: item.id,
        name: item.name,
        quantity: parseFloat(item.quantity) || 0,
        rate: parseFloat(item.rate) || 0,
        unit: item.unit,
        amount: parseFloat(item.amount) || 0,
        item_total: parseFloat(item.amount) || 0,
        item_total_formatted: `₹${(parseFloat(item.amount) || 0).toFixed(2)}`,
        discount: 0,
      }));
      const expiryDateFormatted = formatDateForAPI(expiryDate);
      // Format the date for the API
      const formattedDate = convertDateToDisplayFormat(voucherDate);

      // Prepare request data with all contact and customer details
      const requestData = {
        customer_id: contactDetails?.contact_id || "",
        customer_name: contactDetails?.contact_name || "",
        company_name: contactDetails?.company_name || "",
        billing_address: contactDetails?.billing_address || "",
        shipping_address: contactDetails?.shipping_address || "",
        place_of_contact: contactDetails?.place_of_contact || "",
        gst_no: contactDetails?.gst_no || "",
        contact_type: contactDetails?.contact_type || "",
        opening_balance_amount: contactDetails?.opening_balance_amount || 0,
        invoice_number: voucherNumber,
        date: voucherDate,
        date_formatted: formattedDate,
        expiry_date: expiryDateFormatted,
        expiry_date_formatted: expiryDate,
        line_items: lineItems,
        tax_type: "",
        tax_percentage: 0,
        sub_total: totalAmount,
        sub_total_formatted: `₹${totalAmount.toFixed(2)}`,
        total: totalAmount,
        total_formatted: `₹${totalAmount.toFixed(2)}`,

        notes: narration,
        gst_treatment: gstTreatment,
        place_of_supply: placeOfSupply,
        payment_terms: paymentTerms,
        tds_id: tdsId,
        tcs_id: tcsId,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        terms: terms,
        adjustment: adjustment,
        tax_total: taxTotal,
        // Include all contact data from the API response
        ...contactData,
        status: "draft",
        status_formatted: "Draft",
      };

      console.log(
        "[AccountingVoucherCreation] Sending invoice data:",
        requestData
      );

      // Make API call to save invoice
      const response = await apiService({
        method: "POST",
        url: `/api/v1/invoices?organization_id=${organizationId}`,
        data: requestData,
        customBaseUrl: config.SO_Base_url,
      });

      console.log(
        "[AccountingVoucherCreation] Invoice API response:",
        response.data
      );

      if (response.data.status) {
        router.push("/tally/creation");
      } else {
        console.error("Failed to save invoice:", response.data);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };
  const savePurchaseOrder = async () => {
    if (!organizationId) {
      console.error("Organization ID not found");
      return;
    }

    try {
      console.log("[AccountingVoucherCreation] savePurchaseOrder called");

      // First fetch contact details if we have a contact_id
      let contactData = {};
      if (contactDetails?.contact_id) {
        const contactResponse = await apiService({
          method: "GET",
          url: `/api/v1/contact/${contactDetails.contact_id}`,
          params: {
            organization_id: organizationId,
          },
          file: false,
        });
        contactData = contactResponse.data.data;
      }

      // Utility function to get the current time in "HH:mm:ss.SSS" format
      const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
      };

      // Function to convert DD/MM/YYYY to ISO 8601 format with optional time override
      const convertToISOFormat = (dateStr, useCurrentTime = false) => {
        if (!dateStr) return null;

        try {
          // Split the input date string into day, month, and year
          const [day, month, year] = dateStr
            .split("/")
            .map((num) => parseInt(num, 10));

          // Validate the date components
          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            console.error("Invalid date components:", { day, month, year });
            return null;
          }

          // Create a date string in YYYY-MM-DD format
          const dateString = `${year}-${String(month).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          // Use the current time if requested, otherwise use default time
          const time = useCurrentTime ? getCurrentTime() : "00:00:00.000";

          // Create a Date object with the parsed components and time
          const dateObj = new Date(`${dateString}T${time}`);

          // Validate the date object
          if (isNaN(dateObj.getTime())) {
            console.error("Invalid date object created:", dateObj);
            return null;
          }

          // Convert the Date object to ISO 8601 format
          return dateObj.toISOString();
        } catch (error) {
          console.error("Error converting date:", error);
          return null;
        }
      };

      // Convert dates with error handling
      const formattedDueDate =
        convertToISOFormat(expiryDate) || new Date().toISOString();
      const formattedVoucherDate =
        convertToISOFormat(voucherDate, true) || new Date().toISOString();
      const createdAt = new Date().toISOString();

      // Prepare the line items from the items state
      const lineItems = items.map((item) => ({
        item_id: item.id,
        details: item.name || "",
        name: item.name,
        suk: item.sku,
        quantity: parseFloat(item.quantity) || 0,
        rate: parseFloat(item.rate) || 0,
        unit: item.unit,
        amount: parseFloat(item.amount) || 0,
        item_total: parseFloat(item.amount) || 0,
        item_total_formatted: `₹${(parseFloat(item.amount) || 0).toFixed(2)}`,
        discount: 0,
      }));

      // Format the date for the API
      const formattedDate = convertDateToDisplayFormat(voucherDate);

      // Destructure contactData to exclude _id before spreading into requestData
      const { _id, ...restOfContactData } = contactData;

      // Prepare request data with all contact and customer details
      const requestData = {
        vendor_id: contactData?._id || "",
        purchase_order_number: voucherNumber,
        date: formattedVoucherDate,
        customer_name: contactDetails?.contact_name || "",
        company_name: contactDetails?.company_name || "",
        billing_address: contactDetails?.billing_address || "",
        shipping_address: contactDetails?.shipping_address || "",
        place_of_contact: contactDetails?.place_of_contact || "",
        gst_no: contactDetails?.gst_no || "",
        contact_type: contactDetails?.contact_type || "",
        opening_balance_amount: contactDetails?.opening_balance_amount || 0,
        date_formatted: formattedDate,
        due_date: formattedDueDate,
        expiry_date_formatted: expiryDate,
        items: lineItems,
        tax_type: "",
        tax_percentage: 0,
        subtotal: totalAmount,
        sub_total_formatted: `₹${totalAmount.toFixed(2)}`,
        total: totalAmount,
        total_formatted: `₹${totalAmount.toFixed(2)}`,
        notes: narration,
        gst_treatment: gstTreatment,
        place_of_supply: placeOfSupply,
        payment_terms: paymentTerms,
        tds_id: tdsId,
        tcs_id: tcsId,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        terms: terms,
        adjustment: adjustment,
        tax_total: taxTotal,
        ...restOfContactData,
        status: 0,
        createdAt: createdAt,
        created_time: createdAt,
        updatedAt: createdAt,
      };

      console.log(
        "[AccountingVoucherCreation] Sending purchaseOrder data:",
        requestData
      );

      // Make API call to save purchaseOrder
      const response = await apiService({
        method: "POST",
        url: `/api/v1/purchaseorders/createpurchaseorder?org_id=${organizationId}`,
        data: requestData,
        customBaseUrl: config.PO_Base_url,
      });

      console.log(
        "[AccountingVoucherCreation] Purchase Orders API response:",
        response.data
      );

      if (response.data.success) {
        router.push("/tally/creation");
      } else {
        console.error("Failed to save purchase orders:", response.data);
      }
    } catch (error) {
      console.error("Error saving purchase orders:", error);
    }
  };
  const saveBill = async () => {
    if (!organizationId) {
      console.error("Organization ID not found");
      return;
    }

    try {
      console.log("[AccountingVoucherCreation] saveBill called");

      // First fetch contact details if we have a contact_id
      let contactData = {};
      if (contactDetails?.contact_id) {
        const contactResponse = await apiService({
          method: "GET",
          url: `/api/v1/contact/${contactDetails.contact_id}`,
          params: {
            organization_id: organizationId,
          },
          file: false,
        });
        contactData = contactResponse.data.data;
      }

      // Utility function to get the current time in "HH:mm:ss.SSS" format
      const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
      };

      // Function to convert DD/MM/YYYY to ISO 8601 format with optional time override
      const convertToISOFormat = (dateStr, useCurrentTime = false) => {
        if (!dateStr) return null;

        try {
          // Split the input date string into day, month, and year
          const [day, month, year] = dateStr
            .split("/")
            .map((num) => parseInt(num, 10));

          // Validate the date components
          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            console.error("Invalid date components:", { day, month, year });
            return null;
          }

          // Create a date string in YYYY-MM-DD format
          const dateString = `${year}-${String(month).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          // Use the current time if requested, otherwise use default time
          const time = useCurrentTime ? getCurrentTime() : "00:00:00.000";

          // Create a Date object with the parsed components and time
          const dateObj = new Date(`${dateString}T${time}`);

          // Validate the date object
          if (isNaN(dateObj.getTime())) {
            console.error("Invalid date object created:", dateObj);
            return null;
          }

          // Convert the Date object to ISO 8601 format
          return dateObj.toISOString();
        } catch (error) {
          console.error("Error converting date:", error);
          return null;
        }
      };

      // Convert dates with error handling
      const formattedDueDate =
        convertToISOFormat(expiryDate) || new Date().toISOString();
      const formattedVoucherDate =
        convertToISOFormat(voucherDate, true) || new Date().toISOString();
      const createdAt = new Date().toISOString();

      // Prepare the line items from the items state
      const lineItems = items.map((item) => ({
        item_id: item.id,
        details: item.name || "",
        name: item.name,
        suk: item.sku,
        quantity: parseFloat(item.quantity) || 0,
        rate: parseFloat(item.rate) || 0,
        unit: item.unit,
        amount: parseFloat(item.amount) || 0,
        item_total: parseFloat(item.amount) || 0,
        item_total_formatted: `₹${(parseFloat(item.amount) || 0).toFixed(2)}`,
        discount: 0,
      }));

      // Format the date for the API
      const formattedDate = convertDateToDisplayFormat(voucherDate);

      // Destructure contactData to exclude _id before spreading into requestData
      const { _id, ...restOfContactData } = contactData;

      // Prepare request data with all contact and customer details
      const requestData = {
        vendor_id: contactData?._id || "",
        billNumber: voucherNumber,
        date: formattedVoucherDate,
        customer_name: contactDetails?.contact_name || "",
        company_name: contactDetails?.company_name || "",
        billing_address: contactDetails?.billing_address || "",
        shipping_address: contactDetails?.shipping_address || "",
        place_of_contact: contactDetails?.place_of_contact || "",
        gst_no: contactDetails?.gst_no || "",
        contact_type: contactDetails?.contact_type || "",
        opening_balance_amount: contactDetails?.opening_balance_amount || 0,
        date_formatted: formattedDate,
        billDate: formattedVoucherDate,
        expiry_date_formatted: expiryDate,
        items: lineItems,
        tax_type: "",
        tax_percentage: 0,
        subtotal: totalAmount,
        sub_total_formatted: `₹${totalAmount.toFixed(2)}`,
        total: totalAmount,
        total_formatted: `₹${totalAmount.toFixed(2)}`,
        notes: narration,
        due_date: formattedDueDate,
        dueDate: formattedDueDate,
        orderNumber: invoiceNo,
        gst_treatment: gstTreatment,
        place_of_supply: placeOfSupply,
        payment_terms: paymentTerms,
        tds_id: tdsId,
        tcs_id: tcsId,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        terms: terms,
        adjustment: adjustment,
        tax_total: taxTotal,
        ...restOfContactData,
        status: 0,
        createdAt: createdAt,
        created_time: createdAt,
        updatedAt: createdAt,
      };

      console.log(
        "[AccountingVoucherCreation] Sending bill data:",
        requestData
      );

      // Make API call to save Bill
      const response = await apiService({
        method: "POST",
        url: `/api/v1/bills/create-bills?org_id=${organizationId}`,
        data: requestData,
        customBaseUrl: config.PO_Base_url,
      });

      console.log(
        "[AccountingVoucherCreation] Bill API response:",
        response.data
      );

      if (response.data.success) {
        router.push("/tally/creation");
      } else {
        console.error("Failed to save Bills:", response.data);
      }
    } catch (error) {
      console.error("Error saving bills:", error);
    }
  };
  // Add new function to save sales order
  const saveSalesOrder = async () => {
    if (!organizationId) {
      console.error("Organization ID not found");
      return;
    }

    try {
      console.log("[AccountingVoucherCreation] saveSalesOrder called");
      // First fetch contact details if we have a contact_id
      let contactData = {};
      if (contactDetails?.contact_id) {
        const contactResponse = await apiService({
          method: "GET",
          url: `/api/v1/contact/${contactDetails.contact_id}`,
          params: {
            organization_id: organizationId,
          },
          file: false,
        });
        contactData = contactResponse.data.data;

        // Remove _id from contactData
        const { _id, ...restOfContactData } = contactData; // Destructure to exclude _id
        contactData = restOfContactData;
      }

      // Prepare the line items from the items state
      const lineItems = items.map((item) => ({
        item_id: item.id,
        name: item.name,
        quantity: parseFloat(item.quantity) || 0,
        rate: parseFloat(item.rate) || 0,
        unit: item.unit,
        amount: parseFloat(item.amount) || 0,
        item_total: parseFloat(item.amount) || 0,
        item_total_formatted: `₹${(parseFloat(item.amount) || 0).toFixed(2)}`,
        discount: 0,
      }));

      const expiryDateFormatted = formatDateForAPI(expiryDate);
      // Format the date for the API
      const formattedDate = convertDateToDisplayFormat(voucherDate);

      // Prepare request data with all contact and customer details
      const requestData = {
        customer_id: contactDetails?.contact_id || "",
        customer_name: contactDetails?.contact_name || "",
        company_name: contactDetails?.company_name || "",
        billing_address: contactDetails?.billing_address || "",
        shipping_address: contactDetails?.shipping_address || "",
        place_of_contact: contactDetails?.place_of_contact || "",
        contact_type: contactDetails?.contact_type || "",
        opening_balance_amount: contactDetails?.opening_balance_amount || 0,
        salesorder_number: voucherNumber,
        date: voucherDate,
        date_formatted: formattedDate,
        expiry_date: expiryDateFormatted,
        expiry_date_formatted: expiryDate,
        line_items: lineItems,
        tax_type: "",
        tax_percentage: 0,
        sub_total: totalAmount,
        sub_total_formatted: `₹${totalAmount.toFixed(2)}`,
        total: totalAmount,
        total_formatted: `₹${totalAmount.toFixed(2)}`,
        notes: narration,
        gst_treatment: gstTreatment,
        place_of_supply: placeOfSupply,
        payment_terms: paymentTerms,
        tds_id: tdsId,
        tcs_id: tcsId,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        terms: terms,
        adjustment: adjustment,
        tax_total: taxTotal,
        // Include all contact data from the API response
        ...contactData,
        status: "draft",
        status_formatted: "Draft",
        order_status: "draft",
        order_status_formatted: "Draft",
        current_sub_status: "draft",
        current_sub_status_formatted: "Draft",
      };

      console.log(
        "[AccountingVoucherCreation] Sending sales order data:",
        requestData
      );

      // Make API call to save sales order
      const response = await apiService({
        method: "POST",
        url: `/api/v1/salesorders?organization_id=${organizationId}`,
        data: requestData,
        customBaseUrl: config.SO_Base_url,
      });

      console.log(
        "[AccountingVoucherCreation] Sales order API response:",
        response.data
      );

      if (response.data.status) {
        router.push("/tally/creation");
      } else {
        console.error("Failed to save sales order:", response.data);
      }
    } catch (error) {
      console.error("Error saving sales order:", error);
    }
  };

  useEffect(() => {
    const loadSharedData = () => {
      try {
        const sharedData = localStorage.getItem("sharedFormData");
        if (sharedData) {
          const data = JSON.parse(sharedData);

          // Update contact details and trigger API call if customer_id exists
          if (data.customer_id) {
            setContactDetails({
              contact_id: data.customer_id,
              contact_name: data.customer_name,
              billing_address: data.billing_address,
              shipping_address: data.shipping_address,
            });

            // Trigger customer API call with organization_id from shared data
            if (data.organization_id) {
              // Temporarily set organizationId for the API call
              const tempOrgId = organizationId;
              setOrganizationId(data.organization_id);

              // Use setTimeout to ensure state is updated before API call
              setTimeout(() => {
                fetchContactDetails(data.customer_id);
                // Restore original organizationId
                setOrganizationId(tempOrgId);
              }, 0);
            } else {
              // Fallback to current organizationId
              fetchContactDetails(data.customer_id);
            }
          }

          // Update line items with proper ID handling
          if (data.line_items && data.line_items.length > 0) {
            const itemsWithIds = data.line_items.map((item, index) => ({
              ...item,
              id: item.id || index + 1, // Preserve existing ID or generate new one
              amount: parseFloat(item.amount),
              rate: parseFloat(item.rate),
              quantity: parseFloat(item.quantity),
            }));
            setItems(itemsWithIds);
          }

          // Update other form fields
          setVoucherDate(data.date || "");
          setPlaceOfSupply(data.place_of_supply || "");
          setGstTreatment(data.gst_treatment || "");
          setPaymentTerms(data.payment_terms || "");
          setTdsId(data.tds_id || "");
          setTcsId(data.tcs_id || "");
          setDiscountPercent(data.discount_percent || 0);
          setDiscountAmount(data.discount_amount || 0);
          setSubTotal(data.sub_total || 0);
          setTaxTotal(data.tax_total || 0);
          setTotal(data.total || 0);
          setAdjustment(data.adjustment || 0);
          setNarration(data.notes || "");
          setTerms(data.terms || "");

          // Clear the shared data after loading
          localStorage.removeItem("sharedFormData");
        }
      } catch (error) {
        console.error("Error loading shared form data:", error);
      }
    };

    loadSharedData();
  }, []);

  // Fetch voucher number from API
  const fetchVoucherNumber = async () => {
    try {
      // Get organization_id from localStorage
      const orgId = localStorage.getItem("organization_id");
      setOrganizationId(orgId);

      console.log(
        "[AccountingVoucherCreation] Fetching voucher number with isStatus:",
        isStatus
      );

      // Different API endpoints based on isStatus
      let endpoint;
      let params = {
        organization_id: orgId,
      };

      if (isStatus === "Quote") {
        // For Quote, use estimate-id endpoint
        endpoint = `/api/v1/estimate-id`;
        console.log(
          "[AccountingVoucherCreation] Using estimate-id endpoint for Quote"
        );
      } else if (isStatus === "Invoice") {
        // For Invoice, use invoice-id endpoint
        endpoint = `/api/v1/invoice-id`;
        console.log(
          "[AccountingVoucherCreation] Using invoice-id endpoint for Invoice"
        );
      } 
      else if (isStatus === "PurchaseOrder" ) {
        // For PurchaseOrder, use PurchaseOrder-id endpoint
        endpoint = `/api/v1/purchase-orders/unique-id`;
        console.log(
          "[AccountingVoucherCreation] Using PurchaseOrder-id endpoint for PurchaseOrder"
        );
      } 
      else if (isStatus === "Bill" ) {
        // For Bill, use Bill-id endpoint
        endpoint = `/api/v1/purchase-orders/unique-id`;
        console.log(
          "[AccountingVoucherCreation] Using Bill-id endpoint for Bill"
        );
      } 
      else if (isStatus === "SalesOrder" && isStatus !== "PurchaseOrder" || "Quote" || "Invoice" || "Bill") {
        // For Sales Order, use sales-order-id endpoint
        endpoint = `/api/v1/sales/unique-id`;
        console.log(
          "[AccountingVoucherCreation] Using sales/unique-id endpoint for non-Quote type"
        );
      } else if (isStatus !== "PurchaseOrder" || "Quote" || "Invoice" || "Bill") {
        // For Sales Order, use sales-order-id endpoint
        endpoint = `/api/v1/sales/unique-id`;
        console.log(
          "[AccountingVoucherCreation] Using sales/unique-id endpoint for non-Quote type"
        );
      }
      const response = await apiService({
        method: "GET",
        url: endpoint,
        customBaseUrl:
          isStatus === "PurchaseOrder" || isStatus === "Bill"
            ? config.PO_Base_url
            : config.SO_Base_url,
        params: params,
        file: false,
      });

      if (response.data && response.data.data) {
        const { data } = response.data;
        setVoucherNumber(data);
        console.log(
          "[AccountingVoucherCreation] Fetched voucher number:",
          data
        );
      } else {
        console.error(
          "[AccountingVoucherCreation] Invalid response format:",
          response.data
        );
      }
    } catch (error) {
      console.error(
        "[AccountingVoucherCreation] Failed to fetch voucher number:",
        error
      );
    }
  };

  // Fetch voucher number when component mounts
  useEffect(() => {
    fetchVoucherNumber();
  }, [isStatus]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: backgroundColor,
        }}
      >
        <Header
          title={headerTitle}
          onClose={
            showPartyDetails
              ? handleClosePartyDetails
              : showOrderDetails
              ? handleCloseOrderDetails
              : showDispatchPopup
              ? handleCloseDispatchPopup
              : handleCloseDispatchPopup
          }
          formData={{
            contactDetails,
            items,
            voucherDate,
            placeOfSupply,
            gstTreatment,
            paymentTerms,
            tdsId,
            tcsId,
            discountPercent,
            discountAmount,
            subTotal,
            taxTotal,
            total,
            adjustment,
            narration,
            terms,
          }}
          isStatus={isStatus}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Top section - Form and ItemList */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: 0,
                padding: 0,
              }}
            >
              <Form
                selectedAccount={selectedAccount}
                voucherType={voucherType}
                handlePartyAccountChange={handlePartyAccountChange}
                openPartyLedgerSidebar={openPartyLedgerSidebar}
                salesLedger={salesLedger}
                handleSalesLedgerChange={handleSalesLedgerChange}
                openSalesLedgerSidebar={openSalesLedgerSidebar}
                voucherNumber={voucherNumber}
                setVoucherNumber={setVoucherNumber}
                voucherDate={voucherDate}
                setVoucherDate={setVoucherDate}
                contactDetails={contactDetails}
                isStatus={isStatus}
                fetchVoucherNumber={fetchVoucherNumber}
                dueDate={expiryDate}
                setDueDate={setExpiryDate}
                invoiceNo={invoiceNo}
                backgroundColor={backgroundColor}
                setInvoiceNo={setInvoiceNo}
              />
              <ItemList
                items={items}
                editItem={editItem}
                currentItem={currentItem}
                handleItemChange={handleItemChange}
                handleItemNameChange={handleItemNameChange}
                openStockItemsSidebar={openStockItemsSidebar}
                totalAmount={totalAmount}
                addItem={addItem}
                updateItem={updateItem}
                deleteItem={deleteItem}
                backgroundColor={backgroundColor}
                editingItemId={editingItemId}
              />
            </div>
          </div>

          {/* Bottom section - EInvoice and Narration */}
          <div style={{ marginTop: "auto" }}>
            <EInvoice
              provideEInvoice={provideEInvoice}
              backgroundColor={backgroundColor}
              isStatus={isStatus}
              handleEInvoiceChange={handleEInvoiceChange}
            />
            <Narration
              narration={narration}
              setNarration={setNarration}
              totalAmount={totalAmount}
              isStatus={isStatus}
              backgroundColor={backgroundColor}
              onAccept={handleAccept}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
            backgroundColor: backgroundColor,
            borderTop: "1px solid #ccc",
          }}
        >
          {/* Remove the Accept button */}
        </div>
      </div>

      {/* Right function keys sidebar - always visible */}
      <FunctionKeys functionKeys={functionKeys} />

      {/* Stock Items sidebar */}
      {showStockItems && (
        <Sidebar
          showLedgerAccounts={showStockItems}
          filteredLedgerAccounts={filteredStockItems}
          handleSelectAccount={handleSelectStockItem}
          setShowLedgerAccounts={setShowStockItems}
          setActiveSidebar={setActiveSidebar}
          loading={itemLoading}
          title="Stock Items"
        />
      )}

      {/* Ledger Accounts sidebar */}
      {showLedgerAccounts && (
        <Sidebar
          showLedgerAccounts={showLedgerAccounts}
          filteredLedgerAccounts={filteredLedgerAccounts}
          handleSelectAccount={handleSelectAccount}
          setShowLedgerAccounts={setShowLedgerAccounts}
          setActiveSidebar={setActiveSidebar}
          loading={loading}
          backgroundColor={backgroundColor}
        />
      )}

      {/* Sales Ledger Accounts Popup */}
      {showSalesLedgerAccounts && (
        <SalesSidebar
          showSalesLedgerAccounts={showSalesLedgerAccounts}
          filteredSalesLedgerAccounts={filteredSalesLedgerAccounts}
          handleSelectSalesLedger={handleSelectSalesLedger}
          backgroundColor={backgroundColor}
          onClose={() => setShowSalesLedgerAccounts(false)}
        />
      )}

      {/* DispatchDetails Popup */}
      {showDispatchPopup && (
        <DispatchDetails
          deliveryNotes={dispatchDetails.deliveryNotes}
          dispatchDoc={dispatchDetails.dispatchDoc}
          dispatchedThrough={dispatchDetails.dispatchedThrough}
          destination={dispatchDetails.destination}
          carrierName={dispatchDetails.carrierName}
          billNumber={dispatchDetails.billNumber}
          billDate={dispatchDetails.billDate}
          backgroundColor={backgroundColor}
          vehicleNumber={dispatchDetails.vehicleNumber}
          onDeliveryNotesChange={(value) =>
            handleDispatchDetailsChange("deliveryNotes", value)
          }
          onDispatchDocChange={(value) =>
            handleDispatchDetailsChange("dispatchDoc", value)
          }
          onDispatchedThroughChange={(value) =>
            handleDispatchDetailsChange("dispatchedThrough", value)
          }
          onDestinationChange={(value) =>
            handleDispatchDetailsChange("destination", value)
          }
          onCarrierNameChange={(value) =>
            handleDispatchDetailsChange("carrierName", value)
          }
          onBillNumberChange={(value) =>
            handleDispatchDetailsChange("billNumber", value)
          }
          onBillDateChange={(value) =>
            handleDispatchDetailsChange("billDate", value)
          }
          onVehicleNumberChange={(value) =>
            handleDispatchDetailsChange("vehicleNumber", value)
          }
          onVehicleNumberEnter={handleVehicleNumberEnter}
          onClose={handleCloseDispatchPopup}
        />
      )}

      {/* PartyDetails Popup */}
      {showPartyDetails && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "0",
            right: "240px",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <PartyDetails
            contactDetails={contactDetails}
            loading={contactLoading}
            onClose={handleClosePartyDetails}
            selectedAccount={selectedAccount}
          />
        </div>
      )}

      {/* OrderDetails Popup */}
      {showOrderDetails && (
        <OrderDetails
          orderDetails={orderDetails}
          onOrderDetailsChange={handleOrderDetailsChange}
          onClose={handleCloseOrderDetails}
          onVehicleNumberEnter={handleVehicleNumberEnter}
        />
      )}
    </div>
  );
};

export default AccountingVoucherCreation;
