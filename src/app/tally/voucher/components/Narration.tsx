// components/Narration.js
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AcceptDialog from "./AcceptDialog";
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
const Narration = ({ isStatus,narration, setNarration, totalAmount, onAccept }: any) => {
  const router = useRouter();
  const [showAcceptDialog, setShowAcceptDialog] = useState<boolean>(false);
  const backgroundColor = getBackgroundColor(isStatus);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default enter behavior
      setShowAcceptDialog(true);
    }
  };

  const handleAccept = async () => {
    await onAccept(); // Call the saveEstimate function
    setShowAcceptDialog(false);
  };

  return (
    <div
      style={{
        padding: "8px",
       marginBottom: "80px", 
        display: "flex" as const,
        backgroundColor: backgroundColor,
        position: "relative" as const,
      }}
    >
      <div style={{ width: "80px", paddingTop: "4px" }}>Narration:</div>
      <textarea
        style={{
          flex: 1,
          height: "40px",
          padding: "4px",
          border: "1px solid #ccc",
        }}
        value={narration}
        onChange={(e) => setNarration((e.target as any).value)}
        onKeyDown={handleKeyDown}
      />
      <div style={{ width: "120px", marginLeft: "8px", marginTop: "4px" }}>
        <div style={{ textAlign: "right" as const, fontWeight: "bold" as const }}>
          {totalAmount.toFixed(2)}
        </div>
      </div>

      <AcceptDialog
        isOpen={showAcceptDialog}
        onClose={() => setShowAcceptDialog(false)}
        onAccept={handleAccept}
      />
    </div>
  );
};

export default Narration;
