// utils/formatters.js

/**
 * Format an address object into a multi-line string
 * @param {Object} address - Address object
 * @returns {string} - Formatted address string
 */
export const formatAddress = (address) => {
    const addressParts = []
    if (address.attention) addressParts.push(address.attention)
    if (address.address_line1) addressParts.push(address.address_line1)
    if (address.address_line2) addressParts.push(address.address_line2)
    
    const cityStateZip = []
    if (address.city) cityStateZip.push(address.city)
    if (address.state) cityStateZip.push(address.state)
    if (address.zip) cityStateZip.push(address.zip)
    if (cityStateZip.length > 0) addressParts.push(cityStateZip.join(", "))
    
    if (address.country) addressParts.push(address.country)
    
    return addressParts.join("\n")
  }
  
  /**
   * Format currency in Indian Rupees format
   * @param {number|string} amount - Amount to format
   * @returns {string} - Formatted currency string
   */
  export const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }
  
  /**
   * Format date string to DD/MM/YYYY format
   * @param {string} dateString - Date string in any format
   * @returns {string} - Formatted date string
   */
  export const formatDate = (dateString) => {
    if (!dateString) return ""
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/-/g, '/')
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString // Return original if parsing fails
    }
  }