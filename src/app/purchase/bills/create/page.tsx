// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Box, Snackbar, Alert } from "@mui/material";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import apiService from "../../../../services/axiosService";
// import { useSnackbar } from "../../../../components/SnackbarProvider";
// import { useRouter, useSearchParams } from "next/navigation";
// import BillHeader from "./BillTop";
// import BillDetails from "./BillBottom";
// import config from "../../../../services/config";

// const NewBillForm = (_props?: any) => {
//   const { showMessage } = useSnackbar();
//   const [files, setFiles] = useState<any>([]);
//   const router = useRouter();
//   const searchParams = useSearchParams()!;
//   const billId = searchParams.get("bill_id");
//   const cloneId = searchParams.get("clone_id");

//   const recurringBillId = searchParams.get("recurring_bill_id");
//   const purchaseID = searchParams.get("purchase_id");
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const today = new Date().toISOString().split("T")[0];
// const [isLoading, setIsLoading] = useState(
//   billId || purchaseID || recurringBillId || cloneId ? true : false
// );

//   const [recurringBillData, setRecurringBillData] = useState<any>(null);
//   const [notification, setNotification] = useState<any>({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [billUniqueId, setBillUniqueId] = useState<any>(null);

//   const formikRef = useRef<any>(null);
//   // Validation schema using Yup
//   const validationSchema = Yup.object().shape({
//     vendorName: Yup.string().required("Vendor name is required"),
//     bill_number: Yup.string().required("Bill number is required"),
//     billDate: Yup.date().required("Bill date is required"),
//     items: Yup.array().min(1, "At least one item is required"),
//   });

//   const organization_id =
//     typeof window !== "undefined"
//       ? localStorage.getItem("organization_id")
//       : "";

//   // Initialize formik with default values
//   const formik = useFormik<any>({
//     initialValues: {
//       vendorName: "",
//       billNumber: "",
//       orderNumber: "",
//       bill_number: billUniqueId,
//       billDate: today,
//       due_date: "",
//       paymentTerms: "Net 15",
//       subject: "",
//       items: [
//         {
//           // id: Date.now(),
//           details: "",
//           quantity: 1.0,
//           rate: 0.0,
//           tax: "",
//           amount: 0.0,
//           sku: "",
//           item_name: "",
//           account_id:"",
//           account_name:""
//         },
//       ],
//       discount: 0,
//       tdsOrTcs: "TDS",
//       commission: 2,
//       taxCategory: "Commission or Brokerage",
//       adjustment: 0,
//       notes: "",
//       subtotal: 0,
//       taxAmount: 0,
//       tax_percentage: 0,
//       total: 0,
//       status: 0,
//       billing_address: {
//         attention: "",
//       },
//       documents: null,
//     },
//     recurring_bill_id: "",
//     validationSchema,
//     validateOnChange: false, // Only validate on submit
//     validateOnBlur: false, // Don't validate on blur
//     onSubmit: async (values) => {
//       try {

//         // Ensure items are unique by their content
//         const uniqueItems = removeDuplicateItems(values.items);

//         // Format the data for API submission
//         const formattedData = {
//           ...values,
//           items: uniqueItems,
//           organization_id: organization_id,
//           status: values.status || 0, // Default to 'draft' if status is not set
//         };

//         // Call the API to create or update the bill
//         let endpoint = "";
//         let method = "";
//         if (purchaseID == null) {
//           method = isEditMode ? "PUT" : "POST";
//           endpoint = isEditMode
//             ? `/api/v1/bills/update-individual-bill?org_id=${organization_id}&bill_id=${billId}`
//             : `/api/v1/bills/create-bills?org_id=${organization_id}`;
//         } else {
//           method = "POST";
//           endpoint = `/api/v1/purchase-orders/update-purchase-to-bill?org_id=${organization_id}&po_id=${purchaseID}`;
//         }
//         const response = await apiService({
//           method: method,
//           url: endpoint,
//           customBaseUrl: config.PO_Base_url,
//           data: formattedData,
//           file: true,
//         });
//         if (response?.statusCode === 200 || response?.statusCode === 201) {
//           isEditMode
//             ? router.push(`/purchase/bills/${billId}`)
//             : router.push(`/purchase/bills/${response.data.data.bill_number}`);
//           showMessage(
//             `Bill ${isEditMode ? "updated" : "created"} successfully!`,
//             "success"
//           );
//           formik.resetForm();
//         } else {
//           throw new Error(`Failed to ${isEditMode ? "update" : "create"} bill`);
//         }
//       } catch (error) {
//         console.error(
//           `Error ${isEditMode ? "updating" : "creating"} bill:`,
//           error
//         );
//         showMessage(
//           `Failed to ${
//             isEditMode ? "update" : "create"
//           } bill. Please try again.`,
//           "error"
//         );
//       }
//     },
//   });

//   // Helper function to remove duplicate items based on item_name
//   const removeDuplicateItems = (items) => {
//     // Create a map to track seen items by name
//     const seenItems = new Map();

//     return items.filter((item) => {
//       // Skip empty items
//       if (!item.item_name) return true;

//       // Check if we've seen this item name before
//       if (seenItems.has(item.item_name)) {
//         return false; // This is a duplicate, filter it out
//       } else {
//         seenItems.set(item.item_name, true); // Mark this item as seen
//         return true; // Keep this item
//       }
//     });
//   };

//   useEffect(() => {
//     if (recurringBillId != null) {
//       setIsLoading(true);
//       fetchRecurringBillData();
//     }
//   }, [recurringBillId]);

//   useEffect(()=>{
//    getUniqueId();
//   },[])

//   const getUniqueId = async () => {
//     try {
//       const params = {
//         url: "api/v1/common/get-unique-id",
//         method: "POST",
//         data: { module: "bill" },
//         customBaseUrl: config.apiBaseUrl,
//       };
//       const response = await apiService(params);
//       if (response.statusCode == 200) {
//         if(!billId){
//           setBillUniqueId(response.data.data);
//           formik.setFieldValue("bill_number",response.data.data);
//         } 
//       }
//     } catch (error) {
//       console.error("Error fetching organization data:", error);
//       showMessage(
//         "Error fetching organization data. Please try again.",
//         "error"
//       );
//     } finally {
//     }
//   };

//   const fetchRecurringBillData = async () => {
//     try {
//       const response = await apiService({
//         method: "GET",
//         url: `/api/v1/recurring-bill/${recurringBillId}?org_id=${organization_id}`,
//         customBaseUrl: config.PO_Base_url,
//       });
//       if (response.statusCode === 200 && response.data && response.data.data) {
//         const recurringBillData = response.data.data;
//         setRecurringBillData(recurringBillData);
//       } else {
//         throw new Error("Failed to fetch recurring bill data");
//       }
//     } catch (error) {
//       console.error("Error fetching recurring bill data:", error);
//       showMessage(
//         "Failed to load recurring bill data. Please try again.",
//         "error"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (recurringBillData) {
//       let rawItems = Array.isArray(recurringBillData.line_items)
//         ? recurringBillData.line_items
//         : recurringBillData.items || [];

//       // Process and deduplicate items
//       let itemMap = new Map();

//       // First convert all items to a standardized format
//       const processedItems = rawItems.map((item) => ({
//         // _id: item.item_id,
//         details: item.name || item.item_name || item.details || "",
//         quantity: parseFloat(item.quantity) || 1.0,
//         rate: parseFloat(item.rate) || 0.0,
//         tax: item.tax || "",
//         amount: parseFloat(item.amount) || 0.0,
//         sku: item.sku || "",
//         item_name: item.name || item.item_name || item.details || "",
//       }));

//       // Then deduplicate by item_name
//       const uniqueItems = processedItems.filter((item) => {
//         // Skip items with no name
//         if (!item.item_name) return true;

//         // Check if we've seen this item name
//         if (itemMap.has(item.item_name)) {
//           return false; // Skip duplicate
//         } else {
//           itemMap.set(item.item_name, true);
//           return true; // Keep this unique item
//         }
//       });
//       // Add a default item if no items
//       if (uniqueItems.length === 0) {
//         uniqueItems.push({
//           // id: Date.now(),
//           details: "",
//           quantity: 1.0,
//           rate: 0.0,
//           tax: "",
//           amount: 0.0,
//           sku: "",
//           item_name: "",
//         });
//       }
//       formik.setValues({
//         vendorName: recurringBillData.vendor_data?.contact_name || "",
//         vendor_id: recurringBillData.vendor_data?._id || "",
//         recurring_bill_id: recurringBillId,
//         billing_address: recurringBillData?.vendor_data.billing_address || {},
//         billDate: new Date().toISOString().split("T")[0] || "",
//         dueDate:
//           (recurringBillData?.end_date !== "" && recurringBillData?.end_date) ||
//           "",
//         paymentTerms: recurringBillData.payment_terms_label || "Net 30",
//         subject: recurringBillData.subject || "",
//         items: uniqueItems,
//         discount: recurringBillData.discount_amount || 0,
//         discount_percent: recurringBillData.discount_percent || 0,
//         tax_type: recurringBillData.tax_type || "TDS",
//         commission: recurringBillData.commission || 2,
//         taxCategory:
//           recurringBillData.tax_category || "Commission or Brokerage",
//         tds_option: recurringBillData.tax_category || "Commission or Brokerage",
//         adjustment: recurringBillData.adjustment || 0,
//         notes: recurringBillData.notes || "",
//         subtotal: recurringBillData.sub_total || 0,
//         taxAmount: recurringBillData.tax_amount || recurringBillData.taxAmount,
//         tax_total_formatted: recurringBillData.tax_total_formatted,
//         total: recurringBillData.total || 0,
//         status: recurringBillData.status || 0,
//         tax_percentage: recurringBillData.tax_percentage || 0,
//       });
//     }
//   }, [recurringBillData]);

//   // Fetch bill data if in edit mode
//   useEffect(() => {
//     const fetchBillData = async () => {
//       if (billId != null || purchaseID != null) {
//         setIsEditMode(true);
//         setIsLoading(true);
//         try {
//           const response = await apiService({
//             method: "GET",
//             url:
//               billId != null
//                 ? `/api/v1/bills/get-individual-bill?org_id=${organization_id}&bill_id=${billId}`
//                 : `api/v1/purchase-orders/get-individual-purchase-order?org_id=${organization_id}&po_id=${purchaseID}`,
//             customBaseUrl: config.PO_Base_url,
//           });
//           if (
//             response.statusCode === 200 &&
//             response.data &&
//             response.data.data
//           ) {
//             const billData = response.data.data;
//             // Make sure we properly handle items array
//             let rawItems = Array.isArray(billData.items) ? billData.items : [];

//             // Process and deduplicate items
//             let itemMap = new Map();

//             // First convert all items to a standardized format
//             const processedItems = rawItems.map((item) => ({
//               // id: item.id || Date.now(),
//               details: item.details || "",
//               quantity: parseFloat(item.quantity) || 1.0,
//               rate: parseFloat(item.rate) || 0.0,
//               tax: item.tax || "",
//               amount: parseFloat(item.amount) || 0.0,
//               sku: item.sku || "",
//               item_name: item.item_name || item.itemName || "",
//             }));

//             // Then deduplicate by item_name
//             const uniqueItems = processedItems.filter((item) => {
//               // Skip items with no name
//               if (!item.item_name) return true;

//               // Check if we've seen this item name
//               if (itemMap.has(item.item_name)) {
//                 return false; // Skip duplicate
//               } else {
//                 itemMap.set(item.item_name, true);
//                 return true; // Keep this unique item
//               }
//             });

//             // Add a default item if no items
//             if (uniqueItems.length === 0) {
//               uniqueItems.push({
//                 // id: Date.now(),
//                 details: "",
//                 quantity: 1.0,
//                 rate: 0.0,
//                 tax: "",
//                 amount: 0.0,
//                 sku: "",
//                 item_name: "",
                
//               });
//             }

//             console.log("Unique items:", uniqueItems);
//             if(billId){
//               setBillUniqueId(billData?.bill_number);
//               formik.setFieldValue("bill_number",billData?.bill_number);
//             }
//             // Update formik values with the fetched data
//             formik.setValues({
//               vendorName: billData.vendor_id?.contact_name || "",
//               vendor_id: billData.vendor_id?._id || "",
//               orderNumber: billData.orderNumber || "",
//               billDate: billData.billDate?.split("T")[0] || "",
//               due_date: billData.due_date || "",
//               paymentTerms: billData.paymentTerms || "Net 15",
//               subject: billData.subject || "",
//               items: uniqueItems,
//               discount: parseFloat(billData.discount) || 0,
//               tdsOrTcs: billData.tdsOrTcs || "TDS",
//               commission: parseFloat(billData.commission) || 2,
//               taxCategory: billData.taxCategory || "Commission or Brokerage",
//               adjustment: parseFloat(billData.adjustment) || 0,
//               notes: billData.notes || "",
//               subtotal: parseFloat(billData.subtotal) || 0,
//               taxAmount: parseFloat(billData.taxAmount) || 0,
//               total: parseFloat(billData.total) || 0,
//               status: billData.status || 0,
//               billing_address: billData.vendor_id?.billing_address || {},
//             });
//           } else {
//             throw new Error("Failed to fetch bill data");
//           }
//         } catch (error) {
//           console.error("Error fetching bill data:", error);
//           showMessage("Failed to load bill data. Please try again.", "error");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     if (organization_id) {
//       fetchBillData();
//     }
//   }, [purchaseID, billId, organization_id]);

//    const [isZoho, setIsZoho] = useState<boolean>(true);
  
//       // Add useEffect to initialize the mode state
//       useEffect(() => {
//         // Initialize fromTally flag if it doesn't exist
//         if (!localStorage.getItem("fromTally")) {
//           localStorage.setItem("fromTally", "false");
//         }
//       }, []);
    
//       const toggleMode = () => {
//         console.log("[toggleMode] Current isZoho:", isZoho);
//         const newIsZoho = !isZoho;
//         console.log("[toggleMode] Switching to:", newIsZoho ? "Zoho" : "Tally");
//         setIsZoho(newIsZoho);
//         localStorage.setItem("fromTally", (!newIsZoho).toString());
    
//         // Access formik instance via ref
//         if (formikRef.current) {
//           const formik = formikRef.current;
//           const formData = {
//             // Customer data
//             customer_id: formik.values.customer_id,
//             customer_name: formik.values.customer_name,
//             billing_address: formik.values.billing_address,
//             shipping_address: formik.values.shipping_address,
//             gst_treatment: formik.values.gst_treatment,
//             place_of_supply: formik.values.place_of_supply,
//             place_of_supply_formatted: formik.values.place_of_supply_formatted,
//             gst_no: formik.values.gst_no,
//             isStatus: "Bill",
//             // Line items
//             line_items: formik.values.line_items,
//             // Dates
//             date: formik.values.date,
//             date_formatted: formik.values.date_formatted,
//             expiry_date: formik.values.expiry_date,
//             expiry_date_formatted: formik.values.expiry_date_formatted,
//             // Tax and payment info
//             tax_type: formik.values.tax_type,
//             tax_percentage: formik.values.tax_percentage,
//             discount_percent: formik.values.discount_percent,
//             discount_amount: formik.values.discount_amount,
//             tds_id: formik.values.tds_id,
//             tcs_id: formik.values.tcs_id,
//             payment_terms: formik.values.payment_terms,
//             payment_terms_label: formik.values.payment_terms_label,
//             // Totals
//             sub_total: formik.values.sub_total,
//             tax_total: formik.values.tax_total,
//             total: formik.values.total,
//             adjustment: formik.values.adjustment,
//             // Additional info
//             notes: formik.values.notes,
//             terms: formik.values.terms,
//             reference_number: formik.values.reference_number,
//             bill_number: formik.values.bill_number,
//             // Project and salesperson
//             project: selectedProject,
//             salesperson: selectedSalesperson,
//           };
//           localStorage.setItem("sharedFormData", JSON.stringify(formData));
//         }
    
//         // Navigate to the appropriate page
//         if (newIsZoho) {
//           router.push("/purchase/bills/create");
//         } else {
//           router.push("/tally/voucher?isStatus=Bill");
//         }
//       };
//   // Handle notification close
//   const handleNotificationClose = () => {
//     setNotification({ ...notification, open: false });
//   };

//   if (isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex" as const,
//           justifyContent: "center" as const,
//           alignItems: "center" as const,
//           height: "100vh",
//         }}
//       >
//         Loading bill data...
//       </Box>
//     );
//   }

//   return (
//     <>
//       {/* Header Section */}
//       <BillHeader formik={formik} isEditMode={isEditMode} billUniqueId={billUniqueId} toggleMode={toggleMode} isZoho={isZoho} />

//       {/* Details Section with Invoice Component */}
//       <BillDetails
//         formik={formik}
//         files={files}
//         setFiles={setFiles}
//         isEditMode={isEditMode}
//       />

//       {/* Notification Snackbar */}
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={handleNotificationClose}
//       >
//         <Alert
//           onClose={handleNotificationClose}
//           severity={notification.severity}
//           sx={{ width: "100%" }}
//         >
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default NewBillForm;



"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiService from "../../../../services/axiosService";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { useRouter, useSearchParams } from "next/navigation";
import BillHeader from "./BillTop";
import BillDetails from "./BillBottom";
import config from "../../../../services/config";

const NewBillForm = (_props?: any) => {
  const { showMessage } = useSnackbar();
  const [files, setFiles] = useState<any>([]);
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const billId = searchParams.get("bill_id");
  const cloneId = searchParams.get("clone_id");

  const recurringBillId = searchParams.get("recurring_bill_id");
  const purchaseID = searchParams.get("purchase_id");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const today = new Date().toISOString().split("T")[0];
  const [isLoading, setIsLoading] = useState(
    billId || purchaseID || recurringBillId || cloneId ? true : false
  );

  const [recurringBillData, setRecurringBillData] = useState<any>(null);
  const [notification, setNotification] = useState<any>({
    open: false,
    message: "",
    severity: "success",
  });
  const [billUniqueId, setBillUniqueId] = useState<any>(null);

  const formikRef = useRef<any>(null);
  
  // Validation schema using Yup
  // The bill number is the server's; the vendor's own invoice number goes
  // in "Vendor Bill#" (billNumber).
  const validationSchema = Yup.object().shape({
    vendorName: Yup.string().required("Vendor name is required"),
    billDate: Yup.date().typeError("Bill date is required").required("Bill date is required"),
    dueDate: Yup.date()
      .nullable()
      .transform((v, raw) => (raw === "" || raw == null ? null : v))
      .min(Yup.ref("billDate"), "Due date can't be before the bill date"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          quantity: Yup.number().typeError("Enter a quantity").min(0, "Quantity can't be negative"),
          rate: Yup.number().typeError("Enter a rate").min(0, "Rate can't be negative"),
        })
      )
      .min(1, "At least one item is required")
      .test("has-amount", "Add at least one line with an amount", (items) =>
        ((items || []) as any[]).some((i: any) => Number(i.amount) > 0)
      ),
  });

  const organization_id =
    typeof window !== "undefined"
      ? localStorage.getItem("organization_id")
      : "";

  // Initialize formik with default values
  const formik = useFormik<any>({
    initialValues: {
      vendorName: "",
      vendor_id: "",
      billNumber: "",
      orderNumber: "",
      bill_number: billUniqueId,
      billDate: today,
      due_date: "",
      dueDate: "", // Add both due_date and dueDate for consistency
      paymentTerms: "Net 15",
      subject: "",
      items: [
        {
          details: "",
          quantity: 1.0,
          rate: 0.0,
          tax: "",
          gst_rate: 0,
          amount: 0.0,
          sku: "",
          item_name: "",
          account_id: "",
          account_name: ""
        },
      ],
      discount: 0,
      discount_amount: 0, // Add discount_amount field
      discount_percent: "", // the discount box: a % or a ₹ amount
      discount_type: "%",
      gst_total: 0,
      tds_option: "",
      tdsOrTcs: "TDS",
      tax_type: "TDS", // Add tax_type field for backend consistency
      commission: 2,
      tax_percentage: 0, // Add tax_percentage field
      taxCategory: "",
      adjustment: 0,
      notes: "",
      subtotal: 0,
      sub_total: 0, // Add sub_total field for backend consistency
      taxAmount: 0,
      tax_amount: 0, // Add tax_amount field for backend consistency
      total: 0,
      status: 0,
      billing_address: {
        attention: "",
      },
      documents: null,
      recurring_bill_id: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        console.log("Form submission started:", { isEditMode, billId, values });

        // Every line is kept, even two lines of the same item. The server
        // works out the totals again from the lines.
        const formattedData = {
          ...values,
          items: values.items,
          organization_id: organization_id,
          status: values.status || 0,
          // Ensure consistent field naming for backend
          sub_total: values.sub_total || values.subtotal || 0,
          subtotal: values.sub_total || values.subtotal || 0,
          discount_amount: values.discount_amount || 0,
          tax_amount: values.taxAmount || values.tax_amount || 0,
          tax_type: values.tax_type || "TDS",
          tax_percentage: values.tax_percentage || 0,
          taxCategory: values.tds_option || "",
          // Map dueDate to both fields for compatibility
          dueDate: values.due_date || values.dueDate,
          due_date: values.due_date || values.dueDate,
          vendorName: values.vendorName,
        };

        console.log("Formatted data for API:", formattedData);

        // Call the API to create or update the bill
        let endpoint = "";
        let method = "";
        
        // Editing updates the bill; everything else (new, clone, from a
        // recurring profile, from a purchase order) creates one.
        method = billId ? "PUT" : "POST";
        endpoint = billId
          ? `/api/v1/bills/update-individual-bill?org_id=${organization_id}&bill_id=${billId}`
          : `/api/v1/bills/create-bills?org_id=${organization_id}`;

        console.log("API call details:", { method, endpoint, isEditMode });

        const response = await apiService({
          method: method,
          url: endpoint,
          customBaseUrl: config.PO_Base_url,
          data: formattedData,
          file: true,
        });

        console.log("API response:", response);

        if (response?.statusCode === 200 || response?.statusCode === 201) {
          const redirectBillId = billId || response.data?.data?.bill_number;
          
          console.log("Success! Redirecting to:", redirectBillId);
          
          showMessage(
            `Bill ${billId ? "updated" : "created"} successfully!`,
            "success"
          );
          
          // Navigate to the bill detail page
          router.push(`/purchase/bills/${redirectBillId}`);
          
          if (!billId) {
            formik.resetForm();
          }
        } else {
          throw new Error(`Failed to ${isEditMode ? "update" : "create"} bill: ${response?.message || 'Unknown error'}`);
        }
      } catch (error) {

        
        // Show more detailed error message
        const errorMessage = error.response?.data?.message || error.message || `Failed to ${billId ? "update" : "create"} bill`;
        
        showMessage(
          errorMessage,
          "error"
        );
      }
    },
  });

  useEffect(() => {
    if (recurringBillId != null) {
      setIsLoading(true);
      fetchRecurringBillData();
    }
  }, [recurringBillId]);

  useEffect(() => {
    getUniqueId();
  }, []);

  const getUniqueId = async () => {
    try {
      const params = {
        url: "api/v1/common/get-unique-id",
        method: "POST",
        data: { module: "bill" },
        customBaseUrl: config.apiBaseUrl,
      };
      const response = await apiService(params);
      if (response.statusCode == 200) {
        if (!billId) {
          setBillUniqueId(response.data.data);
          formik.setFieldValue("bill_number", response.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
      showMessage(
        "Error fetching organization data. Please try again.",
        "error"
      );
    }
  };

  const fetchRecurringBillData = async () => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/recurring-bill/${recurringBillId}?org_id=${organization_id}`,
        customBaseUrl: config.PO_Base_url,
      });
      if (response.statusCode === 200 && response.data && response.data.data) {
        const recurringBillData = response.data.data;
        setRecurringBillData(recurringBillData);
      } else {
        throw new Error("Failed to fetch recurring bill data");
      }
    } catch (error) {
      console.error("Error fetching recurring bill data:", error);
      showMessage(
        "Failed to load recurring bill data. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (recurringBillData) {
      let rawItems = Array.isArray(recurringBillData.line_items)
        ? recurringBillData.line_items
        : recurringBillData.items || [];

      const uniqueItems = rawItems.map((item) => ({
        item_id: item.item_id || "",
        details: item.name || item.item_name || item.details || "",
        quantity: parseFloat(item.quantity) || 1.0,
        rate: parseFloat(item.rate) || 0.0,
        tax: item.tax || "",
        gst_rate: Number(item.gst_rate) || 0,
        amount: parseFloat(item.amount) || 0.0,
        sku: item.sku || "",
        item_name: item.name || item.item_name || item.details || "",
        account_id: item.account_id || "",
        account_name: item.account_name || item.account || "",
      }));

      if (uniqueItems.length === 0) {
        uniqueItems.push({
          details: "",
          quantity: 1.0,
          rate: 0.0,
          tax: "",
          amount: 0.0,
          sku: "",
          item_name: "",
          account_id: "",
          account_name: "",
        });
      }

      // Merge into the current values so the bill number etc. are kept.
      formik.setValues((current) => ({
        ...current,
        vendorName: recurringBillData.vendor_data?.contact_name || "",
        vendor_id: recurringBillData.vendor_data?._id || "",
        recurring_bill_id: recurringBillId,
        billing_address: recurringBillData?.vendor_data.billing_address || {},
        billDate: new Date().toISOString().split("T")[0] || "",
        dueDate: (recurringBillData?.end_date !== "" && recurringBillData?.end_date) || "",
        due_date: (recurringBillData?.end_date !== "" && recurringBillData?.end_date) || "",
        paymentTerms: recurringBillData.payment_terms_label || "Net 30",
        subject: recurringBillData.subject || "",
        items: uniqueItems,
        discount: recurringBillData.discount_amount || 0,
        discount_amount: recurringBillData.discount_amount || 0,
        discount_percent: recurringBillData.discount_percent || 0,
        tax_type: recurringBillData.tax_type || "TDS",
        tdsOrTcs: recurringBillData.tax_type || "TDS",
        commission: recurringBillData.commission || 2,
        taxCategory: recurringBillData.tax_category || "Commission or Brokerage",
        tds_option: recurringBillData.tax_category || "Commission or Brokerage",
        adjustment: recurringBillData.adjustment || 0,
        notes: recurringBillData.notes || "",
        subtotal: recurringBillData.sub_total || 0,
        sub_total: recurringBillData.sub_total || 0,
        taxAmount: recurringBillData.tax_amount || recurringBillData.taxAmount || 0,
        tax_amount: recurringBillData.tax_amount || recurringBillData.taxAmount || 0,
        tax_total_formatted: recurringBillData.tax_total_formatted,
        total: recurringBillData.total || 0,
        status: 0,
        tax_percentage: recurringBillData.tax_percentage || 0,
      }));
    }
  }, [recurringBillData]);

  // Fetch bill data if in edit mode
  useEffect(() => {
    const fetchBillData = async () => {
      const sourceBillId = billId || cloneId;
      if (sourceBillId != null || purchaseID != null) {
        // Edit (bill_id) loads the bill itself; clone (clone_id) and
        // convert (purchase_id) prefill a new bill from it.
        setIsEditMode(Boolean(billId));
        setIsLoading(true);
        
        try {
          const response = await apiService({
            method: "GET",
            url: sourceBillId != null
              ? `/api/v1/bills/get-individual-bill?org_id=${organization_id}&bill_id=${sourceBillId}`
              : `api/v1/purchase-orders/get-individual-purchase-order?org_id=${organization_id}&po_id=${purchaseID}`,
            customBaseUrl: config.PO_Base_url,
          });

          console.log("Fetch bill data response:", response);

          if (response.statusCode === 200 && response.data && response.data.data) {
            const billData = response.data.data;
            console.log("Bill data received:", billData);

            let rawItems = Array.isArray(billData.items) ? billData.items : [];

            const uniqueItems = rawItems.map((item) => ({
              item_id: item.item_id || "",
              details: item.details || item.item_name || item.itemName || "",
              quantity: parseFloat(item.quantity) || 1.0,
              rate: parseFloat(item.rate) || 0.0,
              tax: item.tax || "",
              gst_rate: Number(item.gst_rate) || 0,
              hsn_or_sac: item.hsn_or_sac || "",
              amount: parseFloat(item.amount) || 0.0,
              sku: item.sku || "",
              item_name: item.item_name || item.itemName || item.details || "",
              account_id: item.account_id || "",
              account_name: item.account_name || "",
            }));

            if (uniqueItems.length === 0) {
              uniqueItems.push({
                details: "",
                quantity: 1.0,
                rate: 0.0,
                tax: "",
                amount: 0.0,
                sku: "",
                item_name: "",
                account_id: "",
                account_name: "",
              });
            }

            if (billId) {
              setBillUniqueId(billData?.bill_number);
              formik.setFieldValue("bill_number", billData?.bill_number);
            }

            // Set formik values with proper field mapping
            const isPO = purchaseID != null && sourceBillId == null;
            const isCopy = !billId; // clone or convert: a new bill
            const vendor = billData.vendor_id && typeof billData.vendor_id === "object" ? billData.vendor_id : null;
            const dateOnly = (d) => (d ? String(d).split("T")[0] : "");
            const formValues = {
              vendorName: vendor?.contact_name || billData.vendorName || billData.vendor_name || billData.contact_name || "",
              vendor_id: vendor?._id || billData.vendor_id || "",
              billNumber: isCopy ? "" : billData.billNumber || "",
              orderNumber: isPO ? billData.purchase_number || "" : billData.orderNumber || "",
              billDate: isCopy ? today : dateOnly(billData.billDate || billData.date),
              due_date: isCopy ? "" : dateOnly(billData.due_date || billData.dueDate),
              dueDate: isCopy ? "" : dateOnly(billData.due_date || billData.dueDate),
              purchase_orders: isPO && billData._id ? [{ po_ref_id: billData._id }] : [],
              paymentTerms: billData.paymentTerms || "Net 15",
              subject: billData.subject || "",
              items: uniqueItems,
              discount: parseFloat(billData.discount) || parseFloat(billData.discount_amount) || 0,
              discount_amount: parseFloat(billData.discount_amount) || parseFloat(billData.discount) || 0,
              ...(() => {
                const pct = parseFloat(billData.discount_percent) || 0;
                const amt = parseFloat(billData.discount_amount) || 0;
                const type = billData.discount_type === "amount" || (!pct && amt > 0) ? "amount" : "%";
                return { discount_type: type, discount_percent: type === "amount" ? amt || "" : pct || "" };
              })(),
              tds_option: billData.tds_option || (parseFloat(billData.tax_percentage) > 0 ? billData.taxCategory || "" : ""),
              tdsOrTcs: billData.tax_type || billData.tdsOrTcs || "TDS",
              tax_type: billData.tax_type || billData.tdsOrTcs || "TDS",
              commission: parseFloat(billData.commission) || 2,
              tax_percentage: parseFloat(billData.tax_percentage) || 0,
              taxCategory: billData.taxCategory || "Commission or Brokerage",
              adjustment: parseFloat(billData.adjustment) || 0,
              notes: billData.notes || "",
              subtotal: parseFloat(billData.subtotal) || parseFloat(billData.sub_total) || 0,
              sub_total: parseFloat(billData.sub_total) || parseFloat(billData.subtotal) || 0,
              taxAmount: parseFloat(billData.taxAmount) || parseFloat(billData.tax_amount) || 0,
              tax_amount: parseFloat(billData.tax_amount) || parseFloat(billData.taxAmount) || 0,
              total: parseFloat(billData.total) || 0,
              status: isCopy ? 0 : billData.status || 0,
              billing_address: vendor?.billing_address || billData.billing_address || {},
            };

            // Merge into the current values: the form's other fields (the
            // bill number among them) must survive.
            formik.setValues((current) => ({ ...current, ...formValues }));
          } else {
            throw new Error("Failed to fetch bill data");
          }
        } catch (error) {
          console.error("Error fetching bill data:", error);
          showMessage("Failed to load bill data. Please try again.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (organization_id) {
      fetchBillData();
    }
  }, [purchaseID, billId, cloneId, organization_id]);

  const [isZoho, setIsZoho] = useState<boolean>(true);

  useEffect(() => {
    if (!localStorage.getItem("fromTally")) {
      localStorage.setItem("fromTally", "false");
    }
  }, []);

  const toggleMode = () => {
    console.log("[toggleMode] Current isZoho:", isZoho);
    const newIsZoho = !isZoho;
    console.log("[toggleMode] Switching to:", newIsZoho ? "Zoho" : "Tally");
    setIsZoho(newIsZoho);
    localStorage.setItem("fromTally", (!newIsZoho).toString());

    if (formikRef.current) {
      const formik = formikRef.current;
      const formData = {
        customer_id: formik.values.customer_id,
        customer_name: formik.values.customer_name,
        billing_address: formik.values.billing_address,
        shipping_address: formik.values.shipping_address,
        gst_treatment: formik.values.gst_treatment,
        place_of_supply: formik.values.place_of_supply,
        place_of_supply_formatted: formik.values.place_of_supply_formatted,
        gst_no: formik.values.gst_no,
        isStatus: "Bill",
        line_items: formik.values.line_items,
        date: formik.values.date,
        date_formatted: formik.values.date_formatted,
        expiry_date: formik.values.expiry_date,
        expiry_date_formatted: formik.values.expiry_date_formatted,
        tax_type: formik.values.tax_type,
        tax_percentage: formik.values.tax_percentage,
        discount_percent: formik.values.discount_percent,
        discount_amount: formik.values.discount_amount,
        tds_id: formik.values.tds_id,
        tcs_id: formik.values.tcs_id,
        payment_terms: formik.values.payment_terms,
        payment_terms_label: formik.values.payment_terms_label,
        sub_total: formik.values.sub_total,
        tax_total: formik.values.tax_total,
        total: formik.values.total,
        adjustment: formik.values.adjustment,
        notes: formik.values.notes,
        terms: formik.values.terms,
        reference_number: formik.values.reference_number,
        bill_number: formik.values.bill_number,
      };
      localStorage.setItem("sharedFormData", JSON.stringify(formData));
    }

    if (newIsZoho) {
      router.push("/purchase/bills/create");
    } else {
      router.push("/tally/voucher?isStatus=Bill");
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
          height: "100vh",
        }}
      >
        Loading bill data...
      </Box>
    );
  }

  return (
    <>
      <BillHeader 
        formik={formik} 
        isEditMode={isEditMode} 
        billUniqueId={billUniqueId} 
        toggleMode={toggleMode} 
        isZoho={isZoho} 
      />

      <BillDetails
        formik={formik}
        files={files}
        setFiles={setFiles}
        isEditMode={isEditMode}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewBillForm;