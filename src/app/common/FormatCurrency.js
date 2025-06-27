const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0.00"; // Handle null/undefined cases
  return `${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
export default formatCurrency;
