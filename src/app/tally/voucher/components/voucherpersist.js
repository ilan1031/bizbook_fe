// components/VoucherContainer.js
import React, { useState, useEffect } from "react";
import Form from "./Form";
import ItemList from "../components/ItemList"; // Assuming you're using the improved ItemList from earlier

const VoucherContainer = () => {
  // Initialize state with default values
  const [selectedAccount, setSelectedAccount] = useState("");
  const [salesLedger, setSalesLedger] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("1");
  const [voucherDate, setVoucherDate] = useState(() => {
    // Set default date to today's date in DD/MM/YYYY format
    const today = new Date();
    return `${today.getDate().toString().padStart(2, "0")}/${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${today.getFullYear()}`;
  });
  const [items, setItems] = useState([]);
  const [showPartyLedgerSidebar, setShowPartyLedgerSidebar] = useState(false);
  const [showSalesLedgerSidebar, setShowSalesLedgerSidebar] = useState(false);
  const [narration, setNarration] = useState("");

  // Load saved data from localStorage on component mount
  useEffect(() => {
    try {
      // Load form data
      const savedFormData = localStorage.getItem("voucherFormData");
      if (savedFormData) {
        const { selectedAccount, salesLedger, voucherDate } =
          JSON.parse(savedFormData);
        setSelectedAccount(selectedAccount || "");
        setSalesLedger(salesLedger || "");
        // Don't override the API-generated voucher number
        // setVoucherNumber(voucherNumber || "1");
        setVoucherDate(voucherDate || getCurrentDate());
      }

      // Load items
      const savedItems = localStorage.getItem("voucherItems");
      if (savedItems) {
        setItems(JSON.parse(savedItems) || []);
      }

      // Load narration
      const savedNarration = localStorage.getItem("voucherNarration");
      if (savedNarration) {
        setNarration(savedNarration);
      }
    } catch (error) {
      console.error("Error loading saved voucher data:", error);
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("voucherItems", JSON.stringify(items));
  }, [items]);

  // Save narration to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("voucherNarration", narration);
  }, [narration]);

  // Helper function to get current date
  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, "0")}/${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${today.getFullYear()}`;
  };

  // Event handlers
  const handlePartyAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  const handleSalesLedgerChange = (e) => {
    setSalesLedger(e.target.value);
  };

  const openPartyLedgerSidebar = () => {
    setShowPartyLedgerSidebar(true);
    setShowSalesLedgerSidebar(false);
  };

  const openSalesLedgerSidebar = () => {
    setShowSalesLedgerSidebar(true);
    setShowPartyLedgerSidebar(false);
  };

  // Handle item operations
  const handleItemAction = (action, item) => {
    if (action === "add") {
      setItems([...items, item]);
    } else if (action === "update") {
      setItems(items.map((i) => (i.id === item.id ? item : i)));
    } else if (action === "delete") {
      setItems(items.filter((i) => i.id !== item.id));
    }
  };

  // Clear all voucher data
  const clearVoucher = () => {
    if (window.confirm("Are you sure you want to clear all voucher data?")) {
      setSelectedAccount("");
      setSalesLedger("");
      // Reset voucher number to '1' - the Form component will fetch a new one
      setVoucherNumber("1");
      setVoucherDate(getCurrentDate());
      setItems([]);
      setNarration("");

      // Clear localStorage
      localStorage.removeItem("voucherFormData");
      localStorage.removeItem("voucherItems");
      localStorage.removeItem("voucherNarration");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#4a7ebb",
          color: "white",
          padding: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Accounting Voucher Creation</div>
        <div>
          <button
            onClick={clearVoucher}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              padding: "4px 8px",
              marginRight: "8px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          <button
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Form */}
          <Form
            selectedAccount={selectedAccount}
            handlePartyAccountChange={handlePartyAccountChange}
            openPartyLedgerSidebar={openPartyLedgerSidebar}
            salesLedger={salesLedger}
            handleSalesLedgerChange={handleSalesLedgerChange}
            openSalesLedgerSidebar={openSalesLedgerSidebar}
            voucherNumber={voucherNumber}
            setVoucherNumber={setVoucherNumber}
            voucherDate={voucherDate}
            setVoucherDate={setVoucherDate}
          />

          {/* Item List */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              padding: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <ItemList items={items} onItemAction={handleItemAction} />
          </div>

          {/* Narration */}
          <div
            style={{
              padding: "8px",
              display: "flex",
              backgroundColor: backgroundColor,
              borderTop: "1px solid #ccc",
            }}
          >
            <div style={{ width: "100px" }}>Narration:</div>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              style={{
                flex: 1,
                border: "1px solid #999",
                padding: "4px",
              }}
            />
          </div>
        </div>

        {/* Sidebar for account selection */}
        {(showPartyLedgerSidebar || showSalesLedgerSidebar) && (
          <div
            style={{
              width: "250px",
              backgroundColor: "#dbe8fa",
              borderLeft: "1px solid #ccc",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                backgroundColor: "#4a7ebb",
                color: "white",
                padding: "8px",
              }}
            >
              List of Ledger Accounts
            </div>
            <div style={{ flex: 1, overflow: "auto" }}>
              {/* Sample accounts list */}
              {["Cash", "Bank", "Amir", "Sales", "Purchase", "Expenses"].map(
                (account, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      backgroundColor: index === 2 ? "#ffcc66" : "transparent",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                    onClick={() => {
                      if (showPartyLedgerSidebar) {
                        setSelectedAccount(account);
                      } else {
                        setSalesLedger(account);
                      }
                      setShowPartyLedgerSidebar(false);
                      setShowSalesLedgerSidebar(false);
                    }}
                  >
                    {account}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherContainer;
