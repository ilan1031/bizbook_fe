import React from "react";

const AcceptDialog = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        right: "130px",
        backgroundColor: "white",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        border: "1px solid #ccc",
        zIndex: 1000,
        width: "120px",
        height: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "15px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        Accept ?
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
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
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default AcceptDialog;
