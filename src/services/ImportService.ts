// services/ImportService.js
import axios from 'axios';

class ImportService {
  /**
   * Upload a file and get field mapping preview
   * @param {File} file - The file to upload
   * @param {string} entityType - The type of entity (expense, purchaseorder, bill)
   * @param {string} organizationId - The organization ID
   * @param {Object} mapping - Optional field mapping if provided
   * @returns {Promise} - The API response
   */
  static async uploadAndPreview(file, entityType, organizationId, mapping = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity', entityType);
    formData.append('organization_id', organizationId);
    
    if (mapping) {
      formData.append('mapping', JSON.stringify(mapping));
    }
    
    try {
      const response = await axios.post('/api/v1/import/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  
  /**
   * Process the import using the ID from preview step
   * @param {string} importId - The import ID received from preview step
   * @returns {Promise} - The API response
   */
  static async processImport(importId) {
    try {
      const response = await axios.post('/api/v1/import/process', { importId });
      return response.data;
    } catch (error) {
      console.error('Error processing import:', error);
      throw error;
    }
  }
  
  /**
   * Import the data directly to the specific entity endpoint
   * @param {string} endpoint - The API endpoint
   * @param {Array} data - The data to import
   * @returns {Promise} - The API response
   */
  static async importToEntity(endpoint, data) {
    try {
      const response = await axios.post(endpoint, { data });
      return response.data;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

export default ImportService;