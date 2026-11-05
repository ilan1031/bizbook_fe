// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { useSearchParams } from "next/navigation";
// import { styled } from "@mui/system";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useRouter } from "next/navigation";
// import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import QuotationHeader from "../../tally/preview/components/header";
// import { NavigationBar } from "./components/footer";
// import apiService from "../../../../src/services/axiosService";
// import config from "../../../../src/services/config";

// // Styled components - Fixed ruler to not overlap footer
// const RulerVertical = styled(Box)({
//   position: "absolute" as const,
//   left: 0,
//   top: 0,
//   bottom: "80px",
//   width: "20px",
//   backgroundColor: "#FFFF00",
//   borderRight: "1px solid #000",
//   zIndex: 1,
// });

// const RulerHorizontal = styled(Box)({
//   position: "absolute" as const,
//   left: "20px",
//   right: 0,
//   top: 0,
//   height: "20px",
//   backgroundColor: "#FFFF00",
//   borderBottom: "1px solid #000",
//   zIndex: 1,
// });

// // Helper function to safely access localStorage
// const getLocalStorageItem = (key) => {
//   if (typeof window === "undefined") {
//     return null;
//   }
//   try {
//     return localStorage.getItem(key);
//   } catch (error) {
//     console.error(`Error accessing localStorage for key ${key}:`, error);
//     return null;
//   }
// };

// export default function Print(_props?: any) {
//   const paperRef = useRef<any>();
//   const contentRef = useRef<any>();
//   const router = useRouter();
//   const [isClient, setIsClient] = useState<boolean>(false);
//   const [html2canvas, setHtml2canvas] = useState<any>(null);
//   const [jsPDF, setJsPDF] = useState<any>(null);
//   const [invoiceData, setInvoiceData] = useState<any>(null);
//   const [quotesData, setQuotesData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [loadingView, setLoadingView] = useState<boolean>(false);
//   const [error, setError] = useState<any>(null);
//   const [isZoho, setIsZoho] = useState<boolean>(true);
//   const [loadingPDF, setLoadingPDF] = useState<boolean>(false);
//   const [organizationId, setOrganizationId] = useState<any>(null);
//   const [quoteId, setQuoteId] = useState<any>(null);
//   const [isStatus, setIsStatus] = React.useState<any>(null);
//   const searchParams = useSearchParams()!;

//   useEffect(() => {
//     const getSharedFormData = () => {
//       try {
//         // First check URL parameters
//         const urlIsStatus = searchParams.get("isStatus");
//         console.log("URL isStatus:", urlIsStatus); // Debugging line
//         if (urlIsStatus) {
//           setIsStatus(urlIsStatus);
//           return;
//         }

//         // If not in URL, check localStorage
//         const sharedData = localStorage.getItem("sharedFormData");
//         if (sharedData) {
//           const data = JSON.parse(sharedData);
//           setIsStatus(data.isStatus);
//         }
//       } catch (error) {
//         console.error("Error retrieving shared form data:", error);
//       }
//     };

//     getSharedFormData();
//   }, [searchParams]);
//   // Initialize client-side state and load libraries
//   useEffect(() => {
//     setIsClient(true);
// // Extract isStatus from URL parameters
// const urlIsStatus = searchParams.get("isStatus");
// if (urlIsStatus) {
//   setIsStatus(urlIsStatus);
// }
//     // Load data from localStorage using the safe helper function
//     const orgId = getLocalStorageItem("organization_id");
//     const qId =  urlIsStatus === "Quote"
//     ? getLocalStorageItem("quoteId")
//     : urlIsStatus === "Invoice"
//     ? getLocalStorageItem("invoiceId")
//     : urlIsStatus === "SalesOrder"
//     ? getLocalStorageItem("salesOrderId")
//     : null;
//     if (orgId) setOrganizationId(orgId);
//     if (qId) setQuoteId(qId);

//     const loadLibraries = async () => {
//       try {
//         const html2canvasModule = await import("html2canvas");
//         const jsPDFModule = await import("jspdf");
//         setHtml2canvas(() => html2canvasModule.default);
//         setJsPDF(() => jsPDFModule.default);
//       } catch (err) {
//         console.error("Failed to load PDF libraries:", err);
//         setError("Failed to load PDF generation libraries");
//       }
//     };
//     loadLibraries();
//   }, []);

//   // Function to fetch quotes data
//   const getQuotesData = async (id) => {
//     if (!organizationId) {
//       console.error("Organization ID not available");
//       return;
//     }

//     setLoadingView(true);
//     try {
//       const response = await apiService({
//         method: "GET",
//         customBaseUrl: config.SO_Base_url,
//         url: `/api/v1/estimates/${id}?organization_id=${organizationId}`,
//       });

//       console.log("Quotes data response:", response);
//       setQuotesData(response.data.estimate);
//       setLoadingView(false);
//     } catch (error) {
//       console.error("Error fetching quotes data:", error);
//       setError("Failed to fetch quotes data");
//       setLoadingView(false);
//     }
//   };

//   // Fetch invoice data when organizationId is available
//   useEffect(() => {
//     const fetchInvoice = async () => {
//       if (!organizationId || !quoteId) {
//         console.log("Waiting for organizationId and quoteId...");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         await getQuotesData(quoteId);
//         setLoading(false);
//       } catch (err) {
//         console.error("API Error:", err);
//         setError(err.message || "Failed to fetch invoice data");
//         setLoading(false);
//       }
//     };

//     fetchInvoice();
//   }, [organizationId, quoteId]);

//   // Update invoiceData when quotesData changes
//   useEffect(() => {
//     if (quotesData) {
//       setInvoiceData(quotesData);
//     }
//   }, [quotesData]);

//     const getHeadingText = () => {
//     if (isStatus === "Quote") {
//       return "QUOTES";
//     } else if (isStatus === "Invoice") {
//       return "INVOICE";
//     } else if (isStatus === "SalesOrder") {
//       return "SALES ORDER";
//     }
//     return ""; // Default fallback
//   };
//   const getLableText = () => {
//     if (isStatus === "Quote") {
//       return "Quotation No.";
//     } else if (isStatus === "Invoice") {
//       return "Invoice No.";
//     } else if (isStatus === "SalesOrder") {
//       return "Sales Order No.";
//     }
//     return ""; // Default fallback
//   };
//   const handleDownloadPDF = async () => {
//     if (!isClient || !html2canvas || !jsPDF || !invoiceData) {
//       console.error("PDF generation requirements not met:", {
//         isClient,
//         html2canvas: !!html2canvas,
//         jsPDF: !!jsPDF,
//         invoiceData: !!invoiceData,
//       });
//       return;
//     }

//     try {
//       setLoadingPDF(true);
//       const input = contentRef.current;
//       const canvas = await html2canvas(input, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`invoice-${invoiceData?.invoice_number || "document"}.pdf`);
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       setError("Failed to generate PDF");
//     } finally {
//       setLoadingPDF(false);
//     }
//   };

//   const handleBack = () => {
//     router.push("/tally/creation");
//   };

//   const toggleMode = () => {
//     setIsZoho((prev) => !prev);
//     if (quoteId) {
//       router.push(`/sales/quotes/${quoteId}`);
//     } else {
//       console.error("No quote ID available for navigation");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         position: "relative" as const,
//         width: "100%",
//         minHeight: "100vh",
//         backgroundColor: "#FFFFC0",
//         p: 2,
//         display: "flex" as const,
//         flexDirection: "column" as const,
//         alignItems: "center" as const,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex" as const,
//           justifyContent: "space-between" as const,
//           mb: 2,
//           width: "100%",
//         }}
//       >
//         <IconButton color="secondary" onClick={handleBack} sx={{ mb: 2 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: "10px" }}>
//           <Box
//             sx={{
//               display: "flex" as const,
//               alignItems: "center" as const,
//               cursor: "pointer" as const,
//             }}
//             onClick={toggleMode}
//           >
//             <Typography variant="body1" sx={{ fontWeight: 600, ml: 1 }}>
//               Tally
//             </Typography>
//             {isZoho ? (
//               <ToggleOffIcon sx={{ color: "grey.500", fontSize: 32 }} />
//             ) : (
//               <ToggleOnIcon sx={{ color: "primary.main", fontSize: 32 }} />
//             )}
//           </Box>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleDownloadPDF}
//             disabled={!html2canvas || !jsPDF || loadingPDF}
//             sx={{ mb: 2 }}
//           >
//             {loadingPDF ? "Generating PDF..." : "Download as PDF"}
//             {loadingPDF && <CircularProgress size={20} sx={{ ml: 1 }} />}
//           </Button>
//         </Box>
//       </Box>
//       <Box sx={{ pb: 10 }}>
//         {loading || loadingView ? (
//           <Box sx={{ display: "flex" as const, justifyContent: "center" as const, py: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : error ? (
//           <Typography color="error" sx={{ py: 4 }}>
//             Error: {error}
//           </Typography>
//         ) : (
//           <Paper
//             ref={paperRef}
//             elevation={3}
//             sx={{
//               position: "relative" as const,
//               width: "800px",
//               backgroundColor: "#fff",
//               p: 0,
//               display: "flex" as const,
//               flexDirection: "column" as const,
//             }}
//           >
//             {/* Rulers for screen display */}
//             <RulerVertical>
//               {[...Array(32)].map((_, i) => (
//                 <Typography
//                   key={i}
//                   variant="caption"
//                   sx={{ position: "absolute" as const, left: "2px", top: `${i * 31}px` }}
//                 >
//                   {i + 1}
//                 </Typography>
//               ))}
//             </RulerVertical>
//             <RulerHorizontal>
//               {[...Array(21)].map((_, i) => (
//                 <Typography
//                   key={i}
//                   variant="caption"
//                   sx={{
//                     position: "absolute" as const,
//                     left: `${i * 37}px`,
//                     bottom: "2px",
//                   }}
//                 >
//                   {i + 1}
//                 </Typography>
//               ))}
//             </RulerHorizontal>

//             {/* Content for PDF export */}
//             <Box ref={contentRef} sx={{ pl: "75px", pt: "75px", pr: "75px" }}>
//               <QuotationHeader data={quotesData} callViewAPI={getQuotesData} heading={getHeadingText()} lable={getLableText()} />
//               <Typography
//                 variant="caption"
//                 sx={{
//                   display: "block" as const,
//                   width: "100%",
//                   textAlign: "center" as const,
//                   mt: 3,
//                   mb: 3,
//                 }}
//               >
//                 This is a Computer Generated Invoice
//               </Typography>
//             </Box>

//             {/* Footer Navigation */}
//             <Box
//               className="no-print"
//               sx={{
//                 width: "100%",
//                 mt: "auto",
//                 bgcolor: "#FFFF00",
//                 borderTop: "1px solid #000",
//                 position: "relative" as const,
//                 zIndex: 2,
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex" as const,
//                   justifyContent: "flex-start" as const,
//                   width: "100%",
//                   p: 0.5,
//                   borderBottom: "1px solid #ccc",
//                 }}
//               >
//                 <Button
//                   sx={{
//                     minWidth: "auto",
//                     px: 1,
//                     py: 0.25,
//                     fontSize: "0.75rem",
//                     color: "#000",
//                     fontWeight: "bold" as const,
//                   }}
//                 >
//                   PgUp
//                 </Button>
//                 <Button
//                   sx={{
//                     minWidth: "auto",
//                     px: 1,
//                     py: 0.25,
//                     fontSize: "0.75rem",
//                     color: "#000",
//                     fontWeight: "bold" as const,
//                   }}
//                 >
//                   PgDn
//                 </Button>
//                 <Button
//                   sx={{
//                     minWidth: "auto",
//                     px: 1,
//                     py: 0.25,
//                     fontSize: "0.75rem",
//                     color: "#000",
//                     fontWeight: "bold" as const,
//                   }}
//                 >
//                   PgRight »
//                 </Button>
//                 <Button
//                   sx={{
//                     minWidth: "auto",
//                     px: 1,
//                     py: 0.25,
//                     fontSize: "0.75rem",
//                     color: "#000",
//                     fontWeight: "bold" as const,
//                   }}
//                 >
//                   PgLeft «
//                 </Button>
//                 <Button
//                   sx={{
//                     minWidth: "auto",
//                     px: 1,
//                     py: 0.25,
//                     fontSize: "0.75rem",
//                     color: "#000",
//                     fontWeight: "bold" as const,
//                   }}
//                 >
//                   Home
//                 </Button>
//                 <Button
//                   sx={{
//                     minWidth: "auto",
//                     px: 1,
//                     py: 0.25,
//                     fontSize: "0.75rem",
//                     color: "#000",
//                     fontWeight: "bold" as const,
//                   }}
//                 >
//                   End
//                 </Button>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex" as const,
//                   justifyContent: "space-between" as const,
//                   alignItems: "center" as const,
//                   p: 0.5,
//                 }}
//               >
//                 <Typography variant="body2" sx={{ fontSize: "0.75rem", ml: 1 }}>
//                   Page: 1 of 1
//                 </Typography>
//                 <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 2 }}>
//                   <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
//                     In Inches
//                   </Typography>
//                   <Button
//                     sx={{
//                       minWidth: "auto",
//                       px: 1,
//                       py: 0.25,
//                       fontSize: "0.75rem",
//                       color: "#000",
//                       fontWeight: "bold" as const,
//                     }}
//                   >
//                     Mail
//                   </Button>
//                   <Button
//                     sx={{
//                       minWidth: "auto",
//                       px: 1,
//                       py: 0.25,
//                       fontSize: "0.75rem",
//                       color: "#000",
//                       fontWeight: "bold" as const,
//                     }}
//                   >
//                     Print
//                   </Button>
//                   <Button
//                     sx={{
//                       minWidth: "auto",
//                       px: 1,
//                       py: 0.25,
//                       fontSize: "0.75rem",
//                       color: "#000",
//                       fontWeight: "bold" as const,
//                     }}
//                   >
//                     Zoom
//                   </Button>
//                   <Button
//                     sx={{
//                       minWidth: "auto",
//                       px: 1,
//                       py: 0.25,
//                       fontSize: "0.75rem",
//                       color: "#000",
//                       fontWeight: "bold" as const,
//                     }}
//                     onClick={handleBack}
//                   >
//                     Esc
//                   </Button>
//                 </Box>
//               </Box>
//             </Box>
//           </Paper>
//         )}
//       </Box>
//     </Box>
//   );
// }


"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { styled } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import QuotationHeader from "../../tally/preview/components/header";
import { NavigationBar } from "./components/footer";
import apiService from "../../../../src/services/axiosService";
import config from "../../../../src/services/config";

// Styled components - Fixed ruler to not overlap footer
const RulerVertical = styled(Box)({
  position: "absolute" as const,
  left: 0,
  top: 0,
  bottom: "80px",
  width: "20px",
  backgroundColor: "#FFFF00",
  borderRight: "1px solid #000",
  zIndex: 1,
});

const RulerHorizontal = styled(Box)({
  position: "absolute" as const,
  left: "20px",
  right: 0,
  top: 0,
  height: "20px",
  backgroundColor: "#FFFF00",
  borderBottom: "1px solid #000",
  zIndex: 1,
});

// Helper function to safely access localStorage
const getLocalStorageItem = (key) => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error accessing localStorage for key ${key}:`, error);
    return null;
  }
};

export default function Print(_props?: any) {
  const paperRef = useRef<any>();
  const contentRef = useRef<any>();
  const router = useRouter();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [html2canvas, setHtml2canvas] = useState<any>(null);
  const [jsPDF, setJsPDF] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [quotesData, setQuotesData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingView, setLoadingView] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [isZoho, setIsZoho] = useState<boolean>(true);
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false);
  const [organizationId, setOrganizationId] = useState<any>(null);
  const [documentId, setDocumentId] = useState<any>(null);
  const [isStatus, setIsStatus] = useState<any>(null);
  const searchParams = useSearchParams()!;

  // First useEffect to get document type from URL or localStorage
  useEffect(() => {
    const getDocumentType = () => {
      try {
        // First check URL parameters
        const urlIsStatus = searchParams.get("isStatus");
        console.log("URL isStatus:", urlIsStatus); // Debugging line
        if (urlIsStatus) {
          setIsStatus(urlIsStatus);
          return;
        }

        // If not in URL, check localStorage
        const sharedData = localStorage.getItem("sharedFormData");
        if (sharedData) {
          const data = JSON.parse(sharedData);
          setIsStatus(data.isStatus);
        }
      } catch (error) {
        console.error("Error retrieving document type:", error);
      }
    };

    getDocumentType();
  }, [searchParams]);
  
  // Second useEffect to initialize client state and fetch document ID
  useEffect(() => {
    setIsClient(true);
    
    // Load data from localStorage using the safe helper function
    const orgId = getLocalStorageItem("organization_id");
    if (orgId) setOrganizationId(orgId);
    
    // Get the appropriate document ID based on the status
    const getDocumentId = () => {
      // Ensure we have a document type
      if (!isStatus) return;
      
      let docId: any = null;
      
      // Get the correct ID based on document type
      if (isStatus === "Quote") {
        docId = getLocalStorageItem("quoteId");
        console.log("Found Quote ID:", docId);
      } else if (isStatus === "Invoice") {
        docId = getLocalStorageItem("invoiceId");
        console.log("Found Invoice ID:", docId);
      } else if (isStatus === "SalesOrder") {
        docId = getLocalStorageItem("salesOrderId");
        console.log("Found SalesOrder ID:", docId);
      }else if (isStatus === "PurchaseOrder") {
        docId = getLocalStorageItem("purchaseId");
        console.log("Found PurchaseOrder ID:", docId);
      }else if (isStatus === "Bill") {
        docId = getLocalStorageItem("billId");
        console.log("Found Bill ID:", docId);
      }
      
      if (docId) setDocumentId(docId);
    };
    
    getDocumentId();

    const loadLibraries = async () => {
      try {
        const html2canvasModule = await import("html2canvas");
        const jsPDFModule = await import("jspdf");
        setHtml2canvas(() => html2canvasModule.default);
        setJsPDF(() => jsPDFModule.default);
      } catch (err) {
        console.error("Failed to load PDF libraries:", err);
        setError("Failed to load PDF generation libraries");
      }
    };
    loadLibraries();
  }, [isStatus]);

  // Function to fetch document data
  const getDocumentData = async (id) => {
    if (!organizationId || !isStatus) {
      console.error("Organization ID or document type not available");
      return;
    }

    setLoadingView(true);
    try {
      let endpoint = "";
      let dataField = "";
      
      // Determine the endpoint and response data field based on document type
      if (isStatus === "Quote") {
        endpoint = `/api/v1/estimates/${id}`;
        dataField = "estimate";
      } else if (isStatus === "Invoice") {
        endpoint = `/api/v1/invoices/${id}`;
        dataField = "invoice";
      } else if (isStatus === "SalesOrder") {
        // Fixed endpoint for SalesOrder based on the provided API route
        endpoint = `/api/v1/sales-order/${id}`;
        dataField = "salesOrder"; // Adjusted data field based on likely API response
      }else if (isStatus === "PurchaseOrder") {
        endpoint = `api/v1/purchase-orders/get-individual-purchase-order?org_id=${organizationId}&po_id=${id}`;
        dataField = "data";
      } else if (isStatus === "Bill") {
        endpoint = `api/v1/bills/get-individual-bill?org_id=${organizationId}&bill_id=${id}`;
        dataField = "data";
      } 
      else {
        throw new Error(`Unknown document type: ${isStatus}`);
      }

      console.log(`Fetching ${isStatus} data from endpoint: ${endpoint}`);
      
      const response = await apiService({
        method: "GET",
        customBaseUrl: (isStatus === "PurchaseOrder"|| isStatus === "Bill") ? config.PO_Base_url : config.SO_Base_url,
        url: (isStatus === "PurchaseOrder"|| isStatus === "Bill") ? `${endpoint}` :`${endpoint}?organization_id=${organizationId}`,
      });

      console.log(`${isStatus} data response:`, response);
      
      // Extract data using the appropriate field name or handle different response structures
      if (response.data) {
        if (isStatus === "SalesOrder") {
          // The data is directly in response.data instead of response.data.salesOrder
  if (response.data && response.data.data) {
    // Access the data object directly
    setQuotesData(response.data.data);
  } else {
    console.error("Could not find SalesOrder data in response", response.data);
    setError("Invalid SalesOrder data format in response");
  }
}
         else if (response.data[dataField]) {
          // For Quote and Invoice, use the standard pattern
          setQuotesData(response.data[dataField]);
        } else {
          console.error(`Response data does not contain expected field '${dataField}'`, response.data);
          setError(`Invalid response format for ${isStatus}`);
        }
      } else {
        console.error("Empty response data", response);
        setError(`No data received for ${isStatus}`);
      }
      
      setLoadingView(false);
    } catch (error) {
      console.error(`Error fetching ${isStatus} data:`, error);
      setError(`Failed to fetch ${isStatus} data: ${error.message}`);
      setLoadingView(false);
    }
  };

  // Third useEffect to fetch document data when organizationId and documentId are available
  useEffect(() => {
    const fetchDocument = async () => {
      if (!organizationId || !documentId || !isStatus) {
        console.log("Waiting for organizationId, documentId, and isStatus...");
        return;
      }

      console.log(`Fetching ${isStatus} document with ID: ${documentId}`);
      setLoading(true);
      setError(null);

      try {
        await getDocumentData(documentId);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || `Failed to fetch ${isStatus} data`);
        setLoading(false);
      }
    };

    fetchDocument();
  }, [organizationId, documentId, isStatus]);

  // Update invoiceData when quotesData changes
  useEffect(() => {
    if (quotesData) {
      setInvoiceData(quotesData);
    }
  }, [quotesData]);

  const getHeadingText = () => {
    if (isStatus === "Quote") {
      return "QUOTES";
    } else if (isStatus === "Invoice") {
      return "INVOICE";
    } else if (isStatus === "SalesOrder") {
      return "SALES ORDER";
    }else if (isStatus === "PurchaseOrder") {
      return "PURCHASE ORDER";
    }else if (isStatus === "Bill") {
      return "BILL";
    }
    return "DOCUMENT"; // Default fallback
  };
  
  const getLableText = () => {
    if (isStatus === "Quote") {
      return "Quotation No.";
    } else if (isStatus === "Invoice") {
      return "Invoice No.";
    } else if (isStatus === "SalesOrder") {
      return "Sales Order No.";
    }else if (isStatus === "PurchaseOrder") {
      return "Purchase Order No.";
    }else if (isStatus === "Bill") {
      return "Bill No.";
    }
    return "Document No."; // Default fallback
  };
  
  const handleDownloadPDF = async () => {
    if (!isClient || !html2canvas || !jsPDF || !invoiceData) {
      // The button is disabled in this state; nothing to generate.
      return;
    }

    try {
      setLoadingPDF(true);
      const input = contentRef.current;
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      // Use appropriate document number based on document type
      let documentName = "document";
      if (isStatus === "Quote") {
        documentName = invoiceData?.estimate_number || documentId || "quote";
      } else if (isStatus === "Invoice") {
        documentName = invoiceData?.invoice_number || documentId || "invoice";
      } else if (isStatus === "SalesOrder") {
        // Check different possible field names for sales order number
        documentName = 
          invoiceData?.salesorder_number || 
          invoiceData?.sales_order_number || 
          invoiceData?.so_number || 
          documentId || 
          "salesorder";
      }else if (isStatus === "PurchaseOrder") {
        documentName = invoiceData?.purchase_number || documentId || "PurchaseOrder";
      }else if (isStatus === "Bill") {
        documentName = invoiceData?.bill_number || documentId || "Bill";
      }
      
      pdf.save(`${isStatus ? isStatus.toLowerCase() : "document"}-${documentName}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF");
    } finally {
      setLoadingPDF(false);
    }
  };

  const handleBack = () => {
    router.push("/tally/creation");
  };

  const toggleMode = () => {
    setIsZoho((prev) => !prev);
    
    // Navigate to the appropriate route based on document type
    if (!documentId || !isStatus) {
      console.error("Document ID or document type not available for navigation");
      return;
    }
    
    let route = "/creation"; // Default fallback route
    
    // Determine the correct route based on document type
    if (isStatus === "Quote") {
      route = `/sales/quotes/${documentId}`;
    } else if (isStatus === "Invoice") {
      route = `/sales/invoices/${documentId}`;  // Using 'invoices' (plural)
    } else if (isStatus === "SalesOrder") {
      route = `/sales/salesOrder/${documentId}`; // Using 'salesOrder' as specified
    }else if (isStatus === "PurchaseOrder") {
      route = `/purchase/purchaseorder/${documentId}`; // Using 'salesOrder' as specified
    }else if (isStatus === "Bill") {
      route = `/purchase/bills/${documentId}`; // Using 'salesOrder' as specified
    }
    
    console.log(`Navigating to: ${route}`);
    router.push(route);
  };

  return (
    <Box
      sx={{
        position: "relative" as const,
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#FFFFC0",
        p: 2,
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "center" as const,
      }}
    >
      <Box
        sx={{
          display: "flex" as const,
          justifyContent: "space-between" as const,
          mb: 2,
          width: "100%",
        }}
      >
        <IconButton color="secondary" onClick={handleBack} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: "10px" }}>
          <Box
            sx={{
              display: "flex" as const,
              alignItems: "center" as const,
              cursor: "pointer" as const,
            }}
            onClick={toggleMode}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, ml: 1 }}>
              Classic
            </Typography>
            {isZoho ? (
              <ToggleOffIcon sx={{ color: "grey.500", fontSize: 32 }} />
            ) : (
              <ToggleOnIcon sx={{ color: "primary.main", fontSize: 32 }} />
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
            disabled={!html2canvas || !jsPDF || loadingPDF || !invoiceData}
            title={!invoiceData ? "Open a document first: there's nothing to download yet." : undefined}
            sx={{ mb: 2 }}
          >
            {loadingPDF ? "Generating PDF..." : invoiceData ? "Download as PDF" : "Nothing to download"}
            {loadingPDF && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </Button>
        </Box>
      </Box>
      <Box sx={{ pb: 10 }}>
        {loading || loadingView ? (
          <Box sx={{ display: "flex" as const, justifyContent: "center" as const, py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ py: 4 }}>
            Error: {error}
          </Typography>
        ) : (
          <Paper
            ref={paperRef}
            elevation={3}
            sx={{
              position: "relative" as const,
              width: "800px",
              backgroundColor: "#fff",
              p: 0,
              display: "flex" as const,
              flexDirection: "column" as const,
            }}
          >
            {/* Rulers for screen display */}
            <RulerVertical>
              {[...Array(32)].map((_, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  sx={{ position: "absolute" as const, left: "2px", top: `${i * 31}px` }}
                >
                  {i + 1}
                </Typography>
              ))}
            </RulerVertical>
            <RulerHorizontal>
              {[...Array(21)].map((_, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  sx={{
                    position: "absolute" as const,
                    left: `${i * 37}px`,
                    bottom: "2px",
                  }}
                >
                  {i + 1}
                </Typography>
              ))}
            </RulerHorizontal>

            {/* Debug information - remove in production */}
            <Box sx={{ position: "absolute" as const, top: 5, right: 5, fontSize: "10px", color: "#999", zIndex: 10 }}>
              Type: {isStatus || "Unknown"}, ID: {documentId || "None"}
            </Box>

            {/* Content for PDF export */}
            <Box ref={contentRef} sx={{ pl: "75px", pt: "75px", pr: "75px" }}>
              <QuotationHeader 
              isStatus={isStatus}
                data={quotesData} 
                callViewAPI={getDocumentData} 
                heading={getHeadingText()} 
                lable={getLableText()} 
              />
              <Typography
                variant="caption"
                sx={{
                  display: "block" as const,
                  width: "100%",
                  textAlign: "center" as const,
                  mt: 3,
                  mb: 3,
                }}
              >
                This is a Computer Generated {isStatus || "Document"}
              </Typography>
            </Box>

            {/* Footer Navigation */}
            <Box
              className="no-print"
              sx={{
                width: "100%",
                mt: "auto",
                bgcolor: "#FFFF00",
                borderTop: "1px solid #000",
                position: "relative" as const,
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex" as const,
                  justifyContent: "flex-start" as const,
                  width: "100%",
                  p: 0.5,
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Button onClick={() => window.scrollBy({ top: -window.innerHeight * 0.9, behavior: "smooth" })}
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.25,
                    fontSize: "0.75rem",
                    color: "#000",
                    fontWeight: "bold" as const,
                  }}
                >
                  PgUp
                </Button>
                <Button onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" })}
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.25,
                    fontSize: "0.75rem",
                    color: "#000",
                    fontWeight: "bold" as const,
                  }}
                >
                  PgDn
                </Button>
                <Button onClick={() => window.scrollBy({ left: window.innerWidth * 0.9, behavior: "smooth" })}
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.25,
                    fontSize: "0.75rem",
                    color: "#000",
                    fontWeight: "bold" as const,
                  }}
                >
                  PgRight »
                </Button>
                <Button onClick={() => window.scrollBy({ left: -window.innerWidth * 0.9, behavior: "smooth" })}
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.25,
                    fontSize: "0.75rem",
                    color: "#000",
                    fontWeight: "bold" as const,
                  }}
                >
                  PgLeft «
                </Button>
                <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.25,
                    fontSize: "0.75rem",
                    color: "#000",
                    fontWeight: "bold" as const,
                  }}
                >
                  Home
                </Button>
                <Button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.25,
                    fontSize: "0.75rem",
                    color: "#000",
                    fontWeight: "bold" as const,
                  }}
                >
                  End
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex" as const,
                  justifyContent: "space-between" as const,
                  alignItems: "center" as const,
                  p: 0.5,
                }}
              >
                <Typography variant="body2" sx={{ fontSize: "0.75rem", ml: 1 }}>
                  Page: 1 of 1
                </Typography>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    In Inches
                  </Typography>
                  
                  <Button onClick={() => window.print()}
                    sx={{
                      minWidth: "auto",
                      px: 1,
                      py: 0.25,
                      fontSize: "0.75rem",
                      color: "#000",
                      fontWeight: "bold" as const,
                    }}
                  >
                    Print
                  </Button>
                  <Button onClick={() => { document.body.style.zoom = document.body.style.zoom === "1.25" ? "1" : "1.25"; }}
                    sx={{
                      minWidth: "auto",
                      px: 1,
                      py: 0.25,
                      fontSize: "0.75rem",
                      color: "#000",
                      fontWeight: "bold" as const,
                    }}
                  >
                    Zoom
                  </Button>
                  <Button
                    sx={{
                      minWidth: "auto",
                      px: 1,
                      py: 0.25,
                      fontSize: "0.75rem",
                      color: "#000",
                      fontWeight: "bold" as const,
                    }}
                    onClick={handleBack}
                  >
                    Esc
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useRouter, useSearchParams } from "next/navigation";
// import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import QuotationHeader from "../../tally/preview/components/header";
// import { NavigationBar } from "./components/footer";
// import apiService from "../../../../src/services/axiosService";
// import config from "../../../../src/services/config";

// // Styled components
// const RulerVertical = styled(Box)({
//   position: "absolute" as const,
//   left: 0,
//   top: 0,
//   bottom: "80px",
//   width: "20px",
//   backgroundColor: "#FFFF00",
//   borderRight: "1px solid #000",
//   zIndex: 1,
// });

// const RulerHorizontal = styled(Box)({
//   position: "absolute" as const,
//   left: "20px",
//   right: 0,
//   top: 0,
//   height: "20px",
//   backgroundColor: "#FFFF00",
//   borderBottom: "1px solid #000",
//   zIndex: 1,
// });

// const getLocalStorageItem = (key) => {
//   if (typeof window === "undefined") {
//     return null;
//   }
//   try {
//     return localStorage.getItem(key);
//   } catch (error) {
//     console.error(`Error accessing localStorage for key ${key}:`, error);
//     return null;
//   }
// };

// export default function Print({ isStatus: isStatusProp }: any) {
//   const paperRef = useRef<any>();
//   const contentRef = useRef<any>();
//   const router = useRouter();
//   const searchParams = useSearchParams()!;
//   const [isClient, setIsClient] = useState<boolean>(false);
//   const [html2canvas, setHtml2canvas] = useState<any>(null);
//   const [jsPDF, setJsPDF] = useState<any>(null);
//   const [invoiceData, setInvoiceData] = useState<any>(null);
//   const [quotesData, setQuotesData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [loadingView, setLoadingView] = useState<boolean>(false);
//   const [error, setError] = useState<any>(null);
//   const [isZoho, setIsZoho] = useState<boolean>(true);
//   const [loadingPDF, setLoadingPDF] = useState<boolean>(false);
//   const [organizationId, setOrganizationId] = useState<any>(null);
//   const [quoteId, setQuoteId] = useState<any>(null);
//   const [isStatus, setIsStatus] = useState<any>(null);

//   // Determine isStatus from searchParams or prop
  
//   // Update URL query parameter if needed
//   useEffect(() => {
//     if (isClient && isStatus && searchParams.get("isStatus") !== isStatus) {
//       const newSearchParams = new URLSearchParams(searchParams);
//       newSearchParams.set("isStatus", isStatus);
//       router.replace(`/tally/preview?${newSearchParams.toString()}`, { scroll: false });
//     }
//   }, [isClient, searchParams, router, isStatus]);

//   // Initial setup: client detection, localStorage, and library loading
//   useEffect(() => {
//     setIsClient(true);

//     const orgId = getLocalStorageItem("organization_id");
//     const qId = getLocalStorageItem("quoteId");

//     if (orgId) setOrganizationId(orgId);
//     if (qId) setQuoteId(qId);

//     const loadLibraries = async () => {
//       try {
//         const html2canvasModule = await import("html2canvas");
//         const jsPDFModule = await import("jspdf");
//         setHtml2canvas(() => html2canvasModule.default);
//         setJsPDF(() => jsPDFModule.default);
//       } catch (err) {
//         console.error("Failed to load PDF libraries:", err);
//         setError("Failed to load PDF generation libraries");
//       }
//     };
//     loadLibraries();
//   }, []);

//   const getHeadingText = () => {
//     if (isStatus === "Quotes") {
//       return "QUOTES";
//     } else if (isStatus === "Invoice") {
//       return "INVOICE";
//     } else if (isStatus === "SalesOrder") {
//       return "SALES ORDER";
//     }
//     return ""; // Default fallback
//   };

//   const getQuotesData = async (id) => {
//     if (!organizationId) {
//       console.error("Organization ID not available");
//       return;
//     }

//     setLoadingView(true);
//     try {
//       const response = await apiService({
//         method: "GET",
//         customBaseUrl: config.SO_Base_url,
//         url: `/api/v1/estimates/${id}?organization_id=${organizationId}${
//           isStatus ? `&status=${isStatus}` : ""
//         }`,
//       });

//       setQuotesData(response.data.estimate);
//       setLoadingView(false);
//     } catch (error) {
//       console.error("Error fetching quotes data:", error);
//       setError("Failed to fetch quotes data");
//       setLoadingView(false);
//     }
//   };

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       if (!organizationId || !quoteId) return;

//       setLoading(true);
//       setError(null);

//       try {
//         await getQuotesData(quoteId);
//         setLoading(false);
//       } catch (err) {
//         console.error("API Error:", err);
//         setError(err.message || "Failed to fetch invoice data");
//         setLoading(false);
//       }
//     };

//     fetchInvoice();
//   }, [organizationId, quoteId]);
//  useEffect(() => {
//     const getSharedFormData = () => {
//       try {
//         // First check URL parameters
//         const urlIsStatus = searchParams.get("isStatus");
//         if (urlIsStatus) {
//           setIsStatus(urlIsStatus);
//           return;
//         }

//         // If not in URL, check localStorage
//         const sharedData = localStorage.getItem("sharedFormData");
//         if (sharedData) {
//           const data = JSON.parse(sharedData);
//           setIsStatus(data.isStatus);
//         }
//       } catch (error) {
//         console.error("Error retrieving shared form data:", error);
//       }
//     };

//     getSharedFormData();
//   }, [searchParams]);
//   useEffect(() => {
//     if (quotesData) {
//       setInvoiceData(quotesData);
//     }
//   }, [quotesData]);

//   const handleDownloadPDF = async () => {
//     if (!isClient || !html2canvas || !jsPDF || !invoiceData) return;

//     try {
//       setLoadingPDF(true);
//       const input = contentRef.current;
//       const canvas = await html2canvas(input, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`invoice-${invoiceData?.invoice_number || "document"}.pdf`);
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       setError("Failed to generate PDF");
//     } finally {
//       setLoadingPDF(false);
//     }
//   };

//   const handleBack = () => {
//     router.push(`/creation${isStatus ? `?isStatus=${isStatus}` : ""}`);
//   };

//   const toggleMode = () => {
//     setIsZoho((prev) => !prev);
//     if (quoteId) {
//       router.push(`/sales/quotes/${quoteId}${isStatus ? `?isStatus=${isStatus}` : ""}`);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         position: "relative" as const,
//         width: "100%",
//         minHeight: "100vh",
//         backgroundColor: "#FFFFC0",
//         p: 2,
//         display: "flex" as const,
//         flexDirection: "column" as const,
//         alignItems: "center" as const,
//       }}
//     >
//       {/* Header controls */}
//       <Box sx={{ display: "flex" as const, justifyContent: "space-between" as const, mb: 2, width: "100%" }}>
//         <IconButton color="secondary" onClick={handleBack} sx={{ mb: 2 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: "10px" }}>
//           <Box sx={{ display: "flex" as const, alignItems: "center" as const, cursor: "pointer" as const }} onClick={toggleMode}>
//             <Typography variant="body1" sx={{ fontWeight: 600, ml: 1 }}>
//               Tally
//             </Typography>
//             {isZoho ? (
//               <ToggleOffIcon sx={{ color: "grey.500", fontSize: 32 }} />
//             ) : (
//               <ToggleOnIcon sx={{ color: "primary.main", fontSize: 32 }} />
//             )}
//           </Box>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleDownloadPDF}
//             disabled={!html2canvas || !jsPDF || loadingPDF}
//             sx={{ mb: 2 }}
//           >
//             {loadingPDF ? "Generating PDF..." : "Download as PDF"}
//             {loadingPDF && <CircularProgress size={20} sx={{ ml: 1 }} />}
//           </Button>
//         </Box>
//       </Box>

//       {/* Main content */}
//       <Box sx={{ pb: 10 }}>
//         {loading || loadingView ? (
//           <Box sx={{ display: "flex" as const, justifyContent: "center" as const, py: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : error ? (
//           <Typography color="error" sx={{ py: 4 }}>
//             Error: {error}
//           </Typography>
//         ) : (
//           <Paper
//             ref={paperRef}
//             elevation={3}
//             sx={{
//               position: "relative" as const,
//               width: "800px",
//               backgroundColor: "#fff",
//               p: 0,
//               display: "flex" as const,
//               flexDirection: "column" as const,
//             }}
//           >
//             {/* Rulers */}
//             <RulerVertical>
//               {[...Array(32)].map((_, i) => (
//                 <Typography
//                   key={i}
//                   variant="caption"
//                   sx={{ position: "absolute" as const, left: "2px", top: `${i * 31}px` }}
//                 >
//                   {i + 1}
//                 </Typography>
//               ))}
//             </RulerVertical>
//             <RulerHorizontal>
//               {[...Array(21)].map((_, i) => (
//                 <Typography
//                   key={i}
//                   variant="caption"
//                   sx={{ position: "absolute" as const, left: `${i * 37}px`, bottom: "2px" }}
//                 >
//                   {i + 1}
//                 </Typography>
//               ))}
//             </RulerHorizontal>

//             {/* Content for PDF export */}
//             <Box ref={contentRef} sx={{ pl: "75px", pt: "75px", pr: "75px" }}>
             
//               <QuotationHeader 
//                 data={quotesData} 
//                 callViewAPI={getQuotesData} 
//                 heading={getHeadingText()}
//               />
//               <Typography
//                 variant="caption"
//                 sx={{
//                   display: "block" as const,
//                   width: "100%",
//                   textAlign: "center" as const,
//                   mt: 3,
//                   mb: 3,
//                 }}
//               >
//                 This is a Computer Generated Invoice
//               </Typography>
//             </Box>

//             {/* Footer Navigation */}
//             <NavigationBar handleBack={handleBack} />
//           </Paper>
//         )}
//       </Box>
//     </Box>
//   );
// }