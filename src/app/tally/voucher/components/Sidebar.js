// /voucher/components/Sidebar.js
import React from "react";

const Sidebar = ({
  showLedgerAccounts,
  filteredLedgerAccounts = [],
  handleSelectAccount,
  setShowLedgerAccounts,
  setActiveSidebar,
  loading,
  title = "List of Ledger Accounts",
}) => {
  console.log("Sidebar props:", {
    title,
    loading,
    filteredLedgerAccounts,
    showLedgerAccounts,
  });

  return (
    showLedgerAccounts && (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "240px",
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
          <span>{title}</span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={() => {
              setShowLedgerAccounts(false);
              setActiveSidebar("");
            }}
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
          {loading ? (
            <div style={{ padding: "8px", textAlign: "center", color: "#666" }}>
              Loading...
            </div>
          ) : filteredLedgerAccounts && filteredLedgerAccounts.length > 0 ? (
            filteredLedgerAccounts.map((account, index) => {
              console.log("Rendering item:", account);
              return (
                <div
                  key={account._id || index}
                  style={{
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "11px",
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  onClick={() => handleSelectAccount(account)}
                >
                  {title === "Stock Items" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ flex: 1 }}>{account.name}</span>
                      <span style={{ marginLeft: "8px", color: "#666" }}>
                        {account.rate
                          ? account.rate.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })
                          : ""}
                      </span>
                    </div>
                  ) : (
                    account.contact_name
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ padding: "8px", textAlign: "center", color: "#666" }}>
              No matching {title === "Stock Items" ? "items" : "accounts"} found
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Sidebar;
