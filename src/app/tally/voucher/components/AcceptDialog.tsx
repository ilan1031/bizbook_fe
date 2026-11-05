import React from "react";

const AcceptDialog = ({ isOpen, onClose, onAccept }: any) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute" as const,
        bottom: "10px",
        right: "130px",
        backgroundColor: "white",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        border: "1px solid #ccc",
        zIndex: 1000,
        width: "120px",
        height: "120px",
        display: "flex" as const,
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        padding: "10px",
      }}
    >
      <div
        style={{
          textAlign: "center" as const,
          marginBottom: "15px",
          fontSize: "14px",
          fontWeight: "bold" as const,
        }}
      >
        Accept ?
      </div>
      <div
        style={{
          display: "flex" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
          gap: "8px",
          fontSize: "14px",
        }}
      >
        <button
          onClick={onAccept}
          style={{
            backgroundColor: "transparent",
            color: "#4a7ebb",
            border: "none",
            padding: "4px 8px",
            cursor: "pointer" as const,
            fontSize: "14px",
            fontWeight: "bold" as const,
          }}
        >
          Yes
        </button>
        <span style={{ color: "#666" }}>or</span>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            color: "#4a7ebb",
            border: "none",
            padding: "4px 8px",
            cursor: "pointer" as const,
            fontSize: "14px",
            fontWeight: "bold" as const,
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default AcceptDialog;
