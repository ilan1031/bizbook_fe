// components/SalesSidebar.js
import React from "react";

const SalesSidebar = ({
  showSalesLedgerAccounts,
  filteredSalesLedgerAccounts = [],
  handleSelectSalesLedger,
  onClose,
}) => {
  if (!showSalesLedgerAccounts) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: "240px", // Position next to the function keys sidebar
        width: "200px",
        bottom: 0,
        backgroundColor: "white",
        borderLeft: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        zIndex: 15,
      }}
    >
      <div
        style={{
          backgroundColor: "#336699",
          color: "white",
          padding: "4px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>List of Sales Accounts</span>
        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div
        style={{
          padding: "4px",
          textAlign: "right",
          borderBottom: "1px solid #eee",
        }}
      >
        <button
          style={{
            backgroundColor: "#4a7ebb",
            color: "white",
            padding: "2px 8px",
            border: "none",
            borderRadius: "2px",
            fontSize: "11px",
          }}
        >
          Create
        </button>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {filteredSalesLedgerAccounts &&
        filteredSalesLedgerAccounts.length > 0 ? (
          filteredSalesLedgerAccounts.map((account, index) => (
            <div
              key={index}
              style={{
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "11px",
                backgroundColor:
                  account === "SALES TAXABLE"
                    ? "#ffeb99"
                    : index % 2 === 0
                    ? "#f9f9f9"
                    : "white",
                borderBottom: "1px solid #f0f0f0",
              }}
              onClick={() => handleSelectSalesLedger(account)}
            >
              {account}
            </div>
          ))
        ) : (
          <div style={{ padding: "8px", textAlign: "center", color: "#666" }}>
            No matching accounts found
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesSidebar;
