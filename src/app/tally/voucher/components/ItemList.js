import React, { useState } from "react";

const ItemList = ({
  initialItems = [],
  initialEditItem = null,
  style = {},
  handleItemNameChange,
  openStockItemsSidebar,
  currentItem,
  handleItemChange,
  items,
  editItem,
  addItem,
  updateItem,
  deleteItem,backgroundColor,
  editingItemId,
}) => {
  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  // Handle item name input change and open stock items sidebar
  const handleNameChange = (e) => {
    if (handleItemNameChange) {
      handleItemNameChange(e);
    }
  };

  // Handle key press in item name input
  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") {
      if (openStockItemsSidebar) {
        openStockItemsSidebar();
      }
    }
  };

  // Handle click on item name input
  const handleNameClick = () => {
    if (openStockItemsSidebar) {
      openStockItemsSidebar();
    }
  };

  // Function to check if a row should be editable
  const isRowEditable = (item) => {
    return item.name !== "End of List";
  };

  // Function to handle item changes in the same row
  const handleItemChangeInRow = (e, item) => {
    const { name, value } = e.target;
    const updatedItem = { ...item, [name]: value };

    // Calculate amount if quantity or rate changes
    if (name === "quantity" || name === "rate") {
      updatedItem.amount =
        parseFloat(updatedItem.quantity || 0) *
        parseFloat(updatedItem.rate || 0);
    }

    // Call updateItem with the updated item
    if (updateItem) {
      updateItem(updatedItem);
    }
  };

  const tdStyles = {
    padding: "2px",
    borderBottom: "1px solid #eee",
  };

  const inputStyles = {
    width: "100%",
    maxWidth: "300px",
    padding: "0px",
    border: "none",
    boxSizing: "border-box",
    backgroundColor: "transparent",
  };

  const numberInputStyles = {
    ...inputStyles,
    maxWidth: "80px",
    textAlign: "right",
  };

  const selectStyles = {
    ...inputStyles,
    maxWidth: "80px",
    textAlign: "center",
    backgroundColor: "#fff",
  };

  const columnStyles = {
    name: { width: "40%", textAlign: "left" },
    quantity: { width: "15%", textAlign: "right" },
    rate: { width: "15%", textAlign: "right" },
    unit: { width: "10%", textAlign: "center" },
    amount: { width: "15%", textAlign: "right" },
    actions: { textAlign: "center" },
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: backgroundColor,
        border: "1px solid #ddd",
        borderRadius: "4px",
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          backgroundColor: backgroundColor,
        }}
      >
        <thead style={{ backgroundColor: backgroundColor }}>
          <tr style={{ backgroundColor: backgroundColor }}>
            <th
              style={{
                backgroundColor: backgroundColor,
                padding: "2px",
                borderBottom: "1px solid #ddd",
                ...columnStyles.name,
              }}
            >
              Name
            </th>
            <th
              style={{
                backgroundColor: backgroundColor,
                padding: "2px",
                borderBottom: "1px solid #ddd",
                ...columnStyles.quantity,
              }}
            >
              Quantity
            </th>
            <th
              style={{
                backgroundColor: backgroundColor,
                padding: "2px",
                borderBottom: "1px solid #ddd",
                ...columnStyles.rate,
              }}
            >
              Rate
            </th>
            <th
              style={{
                backgroundColor: backgroundColor,
                padding: "2px",
                borderBottom: "1px solid #ddd",
                ...columnStyles.unit,
              }}
            >
              per
            </th>
            <th
              style={{
                backgroundColor: backgroundColor,
                padding: "2px",
                borderBottom: "1px solid #ddd",
                ...columnStyles.amount,
              }}
            >
              Amount
            </th>
            <th
              style={{
                backgroundColor: backgroundColor,
                padding: "2px",
                borderBottom: "1px solid #ddd",
                ...columnStyles.actions,
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ ...tdStyles, ...columnStyles.name }}>
                {isRowEditable(item) ? (
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChangeInRow(e, item)}
                    onKeyDown={handleNameKeyDown}
                    onClick={handleNameClick}
                    style={inputStyles}
                  />
                ) : (
                  <div style={inputStyles}>{item.name}</div>
                )}
              </td>
              <td style={{ ...tdStyles, ...columnStyles.quantity }}>
                {isRowEditable(item) ? (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChangeInRow(e, item)}
                      style={numberInputStyles}
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: "right" }}></div>
                )}
              </td>
              <td style={{ ...tdStyles, ...columnStyles.rate }}>
                {isRowEditable(item) ? (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <input
                      type="number"
                      name="rate"
                      value={item.rate}
                      onChange={(e) => handleItemChangeInRow(e, item)}
                      style={numberInputStyles}
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: "right" }}></div>
                )}
              </td>
              <td style={{ ...tdStyles, ...columnStyles.unit }}>
                {isRowEditable(item) ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <select
                      name="unit"
                      value={item.unit}
                      onChange={(e) => handleItemChangeInRow(e, item)}
                      style={selectStyles}
                    >
                      <option value="Nos">Nos</option>
                      <option value="Kg">Kg</option>
                      <option value="Ltr">Ltr</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}></div>
                )}
              </td>
              <td style={{ ...tdStyles, ...columnStyles.amount }}>
                {isRowEditable(item) ? item.amount.toFixed(2) : ""}
              </td>
              <td style={{ ...tdStyles, ...columnStyles.actions }}>
                {isRowEditable(item) && (
                  <button
                    onClick={() => deleteItem(item.id)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}

          {/* New item row */}
          <tr>
            <td style={{ ...tdStyles, ...columnStyles.name }}>
              <input
                type="text"
                name="name"
                value={currentItem.name}
                onChange={handleNameChange}
                onKeyDown={handleNameKeyDown}
                onClick={handleNameClick}
                style={inputStyles}
                placeholder="Enter item name"
              />
            </td>
            <td style={{ ...tdStyles, ...columnStyles.quantity }}>
              {currentItem.name !== "End of List" && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <input
                    type="number"
                    name="quantity"
                    value={currentItem.quantity}
                    onChange={handleItemChange}
                    style={numberInputStyles}
                    placeholder="Qty"
                  />
                </div>
              )}
            </td>
            <td style={{ ...tdStyles, ...columnStyles.rate }}>
              {currentItem.name !== "End of List" && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <input
                    type="number"
                    name="rate"
                    value={currentItem.rate}
                    onChange={handleItemChange}
                    style={numberInputStyles}
                    placeholder="Rate"
                  />
                </div>
              )}
            </td>
            <td style={{ ...tdStyles, ...columnStyles.unit }}>
              {currentItem.name !== "End of List" && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <select
                    name="unit"
                    value={currentItem.unit}
                    onChange={handleItemChange}
                    style={selectStyles}
                  >
                    <option value="Nos">Nos</option>
                    <option value="Kg">Kg</option>
                    <option value="Ltr">Ltr</option>
                  </select>
                </div>
              )}
            </td>
            <td style={{ ...tdStyles, ...columnStyles.amount }}>
              {currentItem.name !== "End of List" &&
                (
                  parseFloat(currentItem.quantity || 0) *
                  parseFloat(currentItem.rate || 0)
                ).toFixed(2)}
            </td>
            <td style={{ ...tdStyles, ...columnStyles.actions }}>
              {currentItem.name !== "End of List" && (
                <button
                  onClick={addItem}
                  style={{
                    backgroundColor: "#4a7ebb",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td
              colSpan="4"
              style={{ ...tdStyles, textAlign: "right", fontWeight: "bold" }}
            >
              Total:
            </td>
            <td
              style={{
                ...tdStyles,
                ...columnStyles.amount,
                fontWeight: "bold",
              }}
            >
              {totalAmount.toFixed(2)}
            </td>
            <td style={tdStyles}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;
