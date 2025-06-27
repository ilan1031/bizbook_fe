// context/ImportContext.js
import { createContext, useState, useContext, useCallback } from "react";

const ImportContext = createContext();

export const ImportProvider = ({ children }) => {
  // Step tracking
  const [activeStep, setActiveStep] = useState(0);

  // Entity selection
  const [entityType, setEntityType] = useState("expense"); // Default to expense

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);

  // Configuration options
  const [encoding, setEncoding] = useState("UTF-8 (Unicode)");
  const [autoGenerateNumbers, setAutoGenerateNumbers] = useState(false);
  const [linkRelatedEntities, setLinkRelatedEntities] = useState(false);
  const [mapAddresses, setMapAddresses] = useState(false);

  // Field mapping
  const [availableFields, setAvailableFields] = useState([]);
  const [mappedFields, setMappedFields] = useState({});
  const [unmappedFields, setUnmappedFields] = useState([]);
  const [dateFormat, setDateFormat] = useState("YYYY-MM-dd");
  const [saveMapping, setSaveMapping] = useState(false);

  // Preview data
  const [previewData, setPreviewData] = useState(null);
  const [validRecords, setValidRecords] = useState([]);
  const [invalidRecords, setInvalidRecords] = useState([]);
  const [duplicateRecords, setDuplicateRecords] = useState([]);
  const [importId, setImportId] = useState(null);

  // API endpoints based on entity type
  const getImportEndpoint = useCallback(() => {
    switch (entityType.toLowerCase()) {
      case "expense":
        return "/api/v1/export";
      case "purchaseorder":
        return "/api/v1/purchaseorders/createpurchaseorder";
      case "bill":
        return "/api/v1/bills";
      default:
        return "/api/v1/export";
    }
  }, [entityType]);

  // Reset all state - using useCallback to prevent infinite loops
  const resetState = useCallback(() => {
    setActiveStep(0);
    setUploadedFile(null);
    setFileName("");
    setFileSize(0);
    setMappedFields({});
    setUnmappedFields([]);
    setPreviewData(null);
    setValidRecords([]);
    setInvalidRecords([]);
    setDuplicateRecords([]);
    setImportId(null);
  }, []);

  const value = {
    // Step tracking
    activeStep,
    setActiveStep,

    // Entity selection
    entityType,
    setEntityType,

    // File upload state
    uploadedFile,
    setUploadedFile,
    fileName,
    setFileName,
    fileSize,
    setFileSize,

    // Configuration options
    encoding,
    setEncoding,
    autoGenerateNumbers,
    setAutoGenerateNumbers,
    linkRelatedEntities,
    setLinkRelatedEntities,
    mapAddresses,
    setMapAddresses,

    // Field mapping
    availableFields,
    setAvailableFields,
    mappedFields,
    setMappedFields,
    unmappedFields,
    setUnmappedFields,
    dateFormat,
    setDateFormat,
    saveMapping,
    setSaveMapping,

    // Preview data
    previewData,
    setPreviewData,
    validRecords,
    setValidRecords,
    invalidRecords,
    setInvalidRecords,
    duplicateRecords,
    setDuplicateRecords,
    importId,
    setImportId,

    // Utility functions
    getImportEndpoint,
    resetState,
  };

  return (
    <ImportContext.Provider value={value}>{children}</ImportContext.Provider>
  );
};

export const useImport = () => {
  const context = useContext(ImportContext);
  if (context === undefined) {
    throw new Error("useImport must be used within an ImportProvider");
  }
  return context;
};
