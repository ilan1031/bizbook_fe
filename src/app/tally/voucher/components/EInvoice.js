// components/EInvoice.js
import React from 'react';
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
const EInvoice = ({isStatus, provideEInvoice, handleEInvoiceChange }) => {
  const backgroundColor = getBackgroundColor(isStatus);
  return (
    <div style={{
      display: 'flex',
      padding: '8px',
      backgroundColor: backgroundColor,
      marginTop:'-8px',
      // borderTop: '1px solid #ddd'
    }}>
      <div style={{ width: '128px', textAlign: 'right', paddingRight: '8px' }}>Provide e-invoice details :</div>
      <select
        value={provideEInvoice}
        onChange={handleEInvoiceChange}
        style={{
          padding: '2px',
          border: '1px solid #ccc',
          marginRight: '16px'
        }}
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  );
};

export default EInvoice;