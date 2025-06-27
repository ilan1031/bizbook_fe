// utils/csvParser.js
/**
 * Parses a CSV file and returns the data
 * @param {File} file - The CSV file to parse
 * @param {string} encoding - The character encoding to use
 * @returns {Promise<{headers: Array, data: Array}>} - The parsed headers and data
 */
export const parseCSV = (file, encoding = 'UTF-8 (Unicode)') => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const contents = e.target.result;
          const lines = contents.split('\n'); // Fixed newline character
          if (lines.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }
  
          // Parse headers (first line)
          const headers = lines[0].split(',').map(header => header.trim().replace(/["']/g, ''));
  
          // Parse data (remaining lines)
          const data = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines
  
            // This is a simple parser and doesn't handle quoted fields with commas correctly
            // In a production app, use a robust CSV parser library
            const values = line.split(',');
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] ? values[index].trim().replace(/["']/g, '') : '';
            });
            data.push(row);
          }
          resolve({ headers, data });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read the file'));
      };
  
      // Use the specified encoding
      const encodingMap = {
        'UTF-8 (Unicode)': 'UTF-8',
        'ISO-8859-1': 'ISO-8859-1',
        'ASCII': 'ASCII',
      };
      reader.readAsText(file, encodingMap[encoding] || 'UTF-8');
    });
  };
  
  /**
   * Validates if a field is required in the purchase order schema
   * @param {string} fieldName - The field name to check
   * @returns {boolean} - Whether the field is required
   */
  export const isRequiredField = (fieldName) => {
    const requiredFields = [
      'Purchase Order Date',
      'Purchase Order Number', // Fixed missing comma
      'Reference#',
      'Delivery Date',
      // Add more required fields based on your schema
    ];
    return requiredFields.includes(fieldName);
  };