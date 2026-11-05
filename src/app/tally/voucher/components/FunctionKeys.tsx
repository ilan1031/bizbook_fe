// components/FunctionKeys.js
import React from "react";

const FunctionKeys = ({ functionKeys }: any) => {
  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#e6f0ff",
        borderLeft: "1px solid #ccc",
        display: "flex" as const,
        flexDirection: "column" as const,
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: "relative" as const,
          height: "60px",
          display: "flex" as const,
          justifyContent: "flex-end" as const,
          alignItems: "flex-start" as const,
        }}
      >
        <img
          src="/books-logo.jpg"
          alt="Bizbooks"
          style={{ width: "60px", height: "60px", objectFit: "contain" as const }}
        />
      </div>
      <div style={{ overflowY: "auto" as const, flex: 1 }}>
        {functionKeys.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex" as const,
              padding: "4px",
              borderBottom: "1px solid #ddd",
              backgroundColor: item.key === "F8" ? "#f0f0f0" : "transparent",
            }}
          >
            <div
              style={{
                width: "32px",
                color: "#336699",
                fontWeight: item.key === "F8" ? "bold" : "normal",
              }}
            >
              {item.key}:
            </div>
            <div style={{ fontWeight: item.key === "F8" ? "bold" : "normal" }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunctionKeys;
