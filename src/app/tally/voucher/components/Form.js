// components/Form.js
import React, { useEffect, useState } from "react";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";

const Form = ({
  selectedAccount,
  handlePartyAccountChange,
  openPartyLedgerSidebar,
  salesLedger,
  handleSalesLedgerChange,
  openSalesLedgerSidebar,
  voucherNumber,
  setVoucherNumber,
  voucherDate,
  setVoucherDate,
  voucherType,
  contactDetails,
  onSave,
  onCancel,
  isStatus,
  setInvoiceNo,
  invoiceNo,
  fetchVoucherNumber,
  dueDate,
  setDueDate,backgroundColor,
}) => {
  console.log("[Form] Received voucherType prop:", voucherType);
  console.log("[Form] Received isStatus prop:", isStatus);
  console.log("[Form] Received voucherNumber prop:", voucherNumber);

  const [partyBalance, setPartyBalance] = useState("-");
  const [salesBalance, setSalesBalance] = useState("-");
  const [organizationId, setOrganizationId] = useState("");

  // Format date from DD-MM-YYYY to DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.replace(/-/g, "/");
  };

  // Get day name from date string (DD-MM-YYYY format)
  const getDayName = (dateStr) => {
    if (!dateStr) return "";

    // Parse the date string (assuming DD-MM-YYYY format)
    const [day, month, year] = dateStr
      .split("-")
      .map((num) => parseInt(num, 10));

    // Create a Date object (month is 0-indexed in JavaScript)
    const date = new Date(year, month - 1, day);

    // Get day name
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  // Update balances when contact details change
  useEffect(() => {
    if (contactDetails) {
      setPartyBalance(contactDetails.opening_balance_amount || "-");
      setSalesBalance("-"); // This would be updated if we had sales ledger details
    }
  }, [contactDetails]);

  // Fetch existing voucher data when voucher number changes
  useEffect(() => {
    console.log(
      "[Form] useEffect triggered with voucherNumber:",
      voucherNumber
    );
    console.log("[Form] Current isStatus:", isStatus);

    if (voucherNumber) {
      console.log("[Form] Calling fetchVoucherNumber");
      fetchVoucherNumber();
    }
  }, [voucherNumber, isStatus, fetchVoucherNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get all data from GET APIs
      const contactDetails = await fetchContactDetails(contactId);
      const itemDetails = await Promise.all(
        items.map(async (item) => {
          const details = await fetchItemDetails(item.item_id);
          return { ...item, ...details };
        })
      );

      // Format the date for the API
      const formattedDate = formatDate(voucherDate);

      // Prepare data for POST API
      const formData = {
        voucher_type: voucherType,
        voucher_number: voucherNumber,
        date: voucherDate,
        date_formatted: formattedDate,
        reference: reference,
        contact_id: contactId,
        contact_name: contactName,
        billing_address: billingAddress,
        shipping_address: shippingAddress,
        terms: terms,
        items: itemDetails,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        grand_total: grandTotal,
        notes: notes,
        organization_id: organizationId,
      };

      // Save data to localStorage for sharing
      localStorage.setItem("sharedFormData", JSON.stringify(formData));
      localStorage.setItem("fromTally", "true");

      // Call the onSave callback with the form data
      onSave(formData);
    } catch (error) {
      console.error("Error saving form data:", error);
      // Handle error appropriately
    }
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Sales header */}
      <div
        style={{ display: "flex", backgroundColor: "#4a7ebb", color: "white" }}
      >
        <div
          style={{
            width: "130px",
            padding: "2px 4px",
            borderRight: "1px solid #6690c0",
          }}
        >
          {console.log("[Form] Rendering with voucherType:", voucherType)}
          {voucherType}
        </div>
        <div style={{ width: "64px", padding: "2px 4px" }}>No.</div>
        <div style={{ width: "120px", padding: "2px 4px" }}>
          <input
            type="text"
            value={voucherNumber}
            onChange={(e) => {
              console.log(
                "[Form] Voucher number input changed:",
                e.target.value
              );
              setVoucherNumber(e.target.value);
            }}
            style={{
              width: "120px",
              backgroundColor: "transparent",
              border: "none",
              color: "white",
            }}
          />
        </div>
        <div style={{ flex: 1 }}></div>
        <div
          style={{
            padding: "2px 4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <input
            type="text"
            value={voucherDate}
            onChange={(e) => setVoucherDate(e.target.value)}
            style={{
              width: "80px",
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              textAlign: "right",
            }}
          />
          <div style={{ fontSize: "12px", color: "white", marginTop: "-2px" }}>
            {getDayName(voucherDate)}
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div
        style={{
          padding: "8px",
          backgroundColor: backgroundColor,
          borderBottom: "1px solid #ccc",
          marginBottom: 0,
        }}
      >
        {/* Only show Supplier Invoice No. and Date for PurchaseOrder */}
        {(isStatus === "PurchaseOrder"|| isStatus === "Bill") && (
          <div
            style={{
              display: "flex",
              marginBottom: "8px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "130px",
                textAlign: "right",
                paddingRight: "8px",
              }}
            >
              Supplier Invoice No. :
            </div>
            <input
              type="text"
              style={{
                border: "1px solid #999",
                backgroundColor: "white",
                padding: "2px",
                width: "200px",
                height: "20px",
              }}
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Enter invoice number"
            />

            <div
              style={{
                width: "128px",
                textAlign: "right",
                paddingRight: "8px",
              }}
            >
              Date :
            </div>
            <input
              type="text"
              style={{
                border: "1px solid #999",
                backgroundColor: "white",
                padding: "2px",
                width: "100px",
                height: "20px",
              }}
              value={dueDate}
              onChange={handleDueDateChange}
            />
          </div>
        )}
        <div
          style={{ display: "flex", marginBottom: "8px", alignItems: "center" }}
        >
          <div
            style={{ width: "128px", textAlign: "right", paddingRight: "8px" }}
          >
            Party A/c name :
          </div>
          <input
            type="text"
            style={{
              border: "1px solid #999",
              backgroundColor: "white",
              padding: "2px",
              width: "200px",
              height: "20px",
            }}
            value={selectedAccount}
            onChange={handlePartyAccountChange}
            onFocus={openPartyLedgerSidebar}
            onClick={openPartyLedgerSidebar}
          />
        </div>
        <div
          style={{ display: "flex", marginBottom: "8px", alignItems: "center" }}
        >
          <div
            style={{
              width: "128px",
              textAlign: "right",
              paddingRight: "8px",
              color: "#777",
              fontStyle: "italic",
            }}
          >
            Current balance :
          </div>
          <div style={{ padding: "2px" }}>{partyBalance}</div>
        </div>
        <div
          style={{ display: "flex", marginBottom: "8px", alignItems: "center" }}
        >
          <div
            style={{ width: "128px", textAlign: "right", paddingRight: "8px" }}
          >
            Sales ledger :
          </div>
          <input
            type="text"
            style={{
              border: "1px solid #999",
              backgroundColor: "white",
              padding: "2px",
              width: "200px",
              height: "20px",
            }}
            value={salesLedger}
            onChange={handleSalesLedgerChange}
            onFocus={openSalesLedgerSidebar}
            onClick={openSalesLedgerSidebar}
          />
        </div>
        <div
          style={{ display: "flex", marginBottom: "8px", alignItems: "center" }}
        >
          <div
            style={{
              width: "128px",
              textAlign: "right",
              paddingRight: "8px",
              color: "#777",
              fontStyle: "italic",
            }}
          >
            Current balance :
          </div>
          <div style={{ padding: "2px" }}>{salesBalance}</div>
        </div>
      </div>
    </div>
  );
};

export default Form;
