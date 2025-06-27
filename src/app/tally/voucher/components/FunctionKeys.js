// components/FunctionKeys.js
import React from "react";

const FunctionKeys = ({ functionKeys }) => {
  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#e6f0ff",
        borderLeft: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: "relative",
          height: "60px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        <img
          src="https://via.placeholder.com/60x60"
          alt="Function key icon"
          style={{ width: "60px", height: "60px" }}
        />
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {functionKeys.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
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
