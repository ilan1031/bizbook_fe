// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   MenuItem,
//   FormHelperText,
//   Paper,
//   Popper,
//   ClickAwayListener,
//   Button,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import EditIcon from "@mui/icons-material/Edit";
// import CancelIcon from "@mui/icons-material/Cancel";
// import AddIcon from "@mui/icons-material/Add";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { styled } from "@mui/material";
// import { InputBase } from "@mui/material";
// import apiService from "../../../../services/axiosService";
// import config from "../../../../services/config";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

// // Define COLORS object for consistent coloring
// const COLORS = {
//   primary: "#408dfb",
//   error: "#F44336",
//   textPrimary: "#333333",
//   textSecondary: "#66686b",
//   borderColor: "#c4c4c4",
//   hoverBg: "#f0f7ff",
//   bgLight: "#f8f8f8",
// };

// // Common Interaction Styles
// const commonInteractionStyles = {
//   "&:hover .MuiOutlinedInput-notchedOutline": {
//     borderColor: COLORS.primary,
//     boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
//   },
//   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//     borderColor: COLORS.primary,
//     border: ".1px solid #408dfb",
//     boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
//   },
// };

// // Common Input Style
// const commonInputStyle = {
//   height: "35px",
//   backgroundColor: "#fff",
//   "& .MuiInputBase-input": {
//     fontSize: "14px", // Updated to 14px
//     padding: "6px 12px",
//   },
//   "& .MuiOutlinedInput-root": {
//     height: "35px",
//     borderRadius: "7px",
//     ...commonInteractionStyles,
//   },
// };

// // Helper Text Style
// const helperTextStyle = {
//   color: "text.secondary",
//   fontSize: "14px", // Updated to 14px
//   mt: 0.5,
//   ml: 1,
// };

// // Form Label Style
// const formLabelStyle = {
//   fontSize: "14px", // Updated to 14px
//   minWidth: "120px",
//   whiteSpace: "nowrap",
//   color: COLORS.error, // Red color for required fields
// };

// // Form Label Black Style
// const formLabelBlackStyle = {
//   ...formLabelStyle,
//   color: COLORS.textPrimary,
// };

// // Common Button Style
// const commonButtonStyle = {
//   fontSize: "14px", // Updated to 14px
//   fontFamily: "inherit",
//   textTransform: "none",
//   padding: "6px 10px",
//   lineHeight: 1.5,
//   borderRadius: "7px",
//   bgcolor: "rgba(71, 71, 71, 0.07)",
//   borderColor: "rgba(78, 78, 78, 0.15)",
//   "&:hover": {
//     bgcolor: "rgba(71, 71, 71, 0.1)",
//     borderColor: "rgba(24, 13, 13, 0.2)",
//   },
//   minWidth: "auto",
// };

// // Search Button Style
// const searchButtonStyle = {
//   height: "35px",
//   width: "40px",
//   borderRadius: "0 7px 7px 0",
//   backgroundColor: COLORS.primary,
//   color: "white",
//   border: "1px solid",
//   borderColor: COLORS.primary,
//   borderLeft: "none",
//   "&:hover": {
//     backgroundColor: "#3a7fe1",
//     borderColor: "#3a7fe1",
//   },
// };

// // Common Icon Style
// const commonIconStyle = {
//   fontSize: "1.2rem",
//   color: COLORS.textSecondary,
// };

// // Menu Item Style
// const menuItemStyle = {
//   fontSize: "14px", // Updated to 14px
//   color: COLORS.textSecondary,
//   fontStyle: "normal",
//   padding: "10px 16px",
//   borderBottom: "1px solid #eee",
//   "&:hover": { bgcolor: COLORS.hoverBg },
// };

// // Styled components
// const SearchInput = styled(InputBase)({
//   width: "100%",
//   padding: "8px 12px",
//   fontSize: "13px",
//   "& input": {
//     padding: "0",
//   },
// });

// const VendorDetailButton = styled(Button)({
//   ...commonButtonStyle,
//   height: "35px",
//   backgroundColor: "#000",
//   color: "#fff",
//   display: "flex",
//   alignItems: "center",
//   "& .MuiButton-endIcon": {
//     marginLeft: "8px",
//     "& svg": {
//       fontSize: "14px",
//     },
//   },
// });

// const VendorSelection = ({
//   formik,
//   onVendorSelect,
//   selectedVendor,
//   onClearVendor,
// }) => {
//   const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [responseData, setResponseData] = useState([]);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const [vendorDetails, setVendorDetails] = useState({});

//   // Load vendors data on component mount
//   useEffect(() => {
//     if (!isDataLoaded) {
//       apiCall();
//     }
//   }, [isDataLoaded]);

//   // Filter vendors based on search term
//   const filteredVendors = responseData.filter(
//     (vendor) =>
//       vendor.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle vendor selection
//   const handleVendorSelect = (vendor) => {
//     onVendorSelect(vendor);
//     setVendorDropdownOpen(false);
//   };


//   const apiCall = async () => {
//     try {
//       const organization_id = localStorage.getItem("organization_id");
//       let params = {
//         method: "GET",
//         url: `api/v1/vendors?filter_by=Status.All&page=1&per_page=50&sort_column=contact_name&sort_order=A&organization_id=${organization_id}`,
//       };
//       let response = await apiService(params);

//       if (response && response.data && response.data.data) {
//         setResponseData(response.data.data);
//         setIsDataLoaded(true);
//       }
//     } catch (error) {
//       console.error("Error fetching vendors:", error);
//     }
//   };

//   // Handle vendor dropdown toggle
//   const handleVendorDropdownToggle = (event) => {
//     if (!isDataLoaded) {
//       apiCall();
//     }
//     setAnchorEl(event.currentTarget);
//     setVendorDropdownOpen(!vendorDropdownOpen);
//   };

//   // Handle search input change
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const getInitial = (name) => {
//     if (!name) return "?";
//     return name.charAt(0).toUpperCase();
//   };
//   // Handle clear selected vendor
//   const handleClearVendor = (e) => {
//     e.stopPropagation();
//     onClearVendor();
//   };

//   // Get the currently selected vendor object
//   const currentVendor = selectedVendor;

//   return (
//     <Box
//       sx={{
//         backgroundColor: COLORS.bgLight,
//         padding: 3,
//         py: 3.5,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           paddingBottom: 1,
//         }}
//       >
//         <Typography
//           sx={{
//             ...formLabelStyle,
//             minWidth: "160px",
//           }}
//         >
//           Vendor Name*
//         </Typography>

//         <Box sx={{ position: "relative", width: "530px" }}>
//           {/* Custom Vendor Dropdown */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               border: `1px solid ${COLORS.borderColor}`,
//               borderRadius: "7px",
//               height: "35px",
//               position: "relative",
//               backgroundColor: "white",
//               cursor: "pointer",
//               maxWidth: "600px",
//               "&:hover": {
//                 borderColor: COLORS.primary,
//                 boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
//               },
//             }}
//             onClick={handleVendorDropdownToggle}
//           >
//             <Box sx={{ flex: 1, px: 2, display: "flex", alignItems: "center" }}>
//               {currentVendor ? (
//                 <Typography sx={{ fontSize: "14px" }}>
//                   {currentVendor.contact_name}
//                 </Typography>
//               ) : (
//                 <Typography
//                   sx={{ color: COLORS.textSecondary, fontSize: "14px" }}
//                 >
//                   Select a Vendor
//                 </Typography>
//               )}
//             </Box>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               {currentVendor && (
//                 <IconButton size="small" onClick={handleClearVendor}>
//                   <CancelIcon sx={{ fontSize: "1.1rem", color: "red" }} />
//                 </IconButton>
//               )}
//               <IconButton
//                 sx={{
//                   ...searchButtonStyle,
//                 }}
//               >
//                 <SearchIcon sx={{ fontSize: "1.1rem" }} />
//               </IconButton>
//             </Box>
//           </Box>

//           {/* Vendor Dropdown Menu */}
//           <Popper
//             open={vendorDropdownOpen}
//             anchorEl={anchorEl}
//             placement="bottom-start"
//             style={{ width: anchorEl?.offsetWidth, zIndex: 10 }}
//           >
//             <ClickAwayListener onClickAway={() => setVendorDropdownOpen(false)}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   width: "100%",
//                   maxHeight: "300px",
//                   overflowY: "auto",
//                   border: "1px solid #ddd",
//                 }}
//               >
//                 {/* Search Bar */}
//                 <Box sx={{ p: 1, borderBottom: "1px solid #eee" }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       px: 1,
//                       borderRadius: "7px",
//                     }}
//                   >
//                     <SearchIcon
//                       sx={{ ...commonIconStyle, fontSize: "1.1rem" }}
//                     />
//                     <SearchInput
//                       placeholder="Search"
//                       value={searchTerm}
//                       onChange={handleSearchChange}
//                     />
//                   </Box>
//                 </Box>

//                 {/* Vendor List */}
//                 <Box>
//                   {filteredVendors.map((vendor) => (
//                     <MenuItem
//                       key={vendor._id}
//                       onClick={() => handleVendorSelect(vendor)}
//                       sx={menuItemStyle}
//                       style={{fontSize:"13px",}}
                      
//                     >
//                       {/* Vendor Item with Avatar and Details */}
//                       <Box sx={{ display: "flex", width: "100%" ,  }}>
//                         <Box
//                           sx={{
//                             width: "40px",
//                             height: "40px",
//                             borderRadius: "50%",
//                             backgroundColor:"#eeeeee",
//                             color:  "#4d90fe",
//                             marginTop:"2px",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             mr: 1.5,
//                             fontSize: "14px",
//                           }}
//                         >
//                           {vendor.contact_name?.charAt(0) || "V"}
//                         </Box>
//                         <Box sx={{ flex: 1 }}>
//                           <Typography
//                             sx={{ fontWeight: "bold", fontSize: "13px" }}
//                           >
//                             {vendor.contact_name}
//                           </Typography>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               mt: 0.5,
//                             }}
//                           >
//                             <Typography
//                               variant="body2"
//                               sx={{
//                                 color: COLORS.textSecondary,
//                                 fontSize: "0.75rem",
//                                 display: "flex",
//                                 alignItems: "center",
//                               }}
//                             >
//                               <EmailOutlinedIcon
//                                 fontSize="small"
//                                 sx={{ mr: 0.5 }}
//                               />{" "}
//                               {vendor.email}
//                             </Typography>
//                             {vendor.company_name && (
//                               <>
//                                 <Box
//                                   component="span"
//                                   sx={{ mx: 0.5, color: COLORS.textSecondary }}
//                                 >
//                                   |
//                                 </Box>
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     color: COLORS.textSecondary,
//                                     fontSize: "0.75rem",
//                                   }}
//                                 >
//                                   {vendor.company_name}
//                                 </Typography>
//                               </>
//                             )}
//                           </Box>
//                         </Box>
//                       </Box>
//                     </MenuItem>
//                   ))}
//                   {/* New Vendor Option */}
//                   <MenuItem
//                     sx={{
//                       ...menuItemStyle,
//                       color: COLORS.primary,
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <AddIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
//                       <Typography sx={{ fontSize: "14px" }}>
//                         New Vendor
//                       </Typography>
//                     </Box>
//                   </MenuItem>
//                 </Box>
//               </Paper>
//             </ClickAwayListener>
//           </Popper>
//         </Box>
//       </Box>

//       {/* Error Message */}
//       {formik.touched.vendorName && formik.errors.vendorName && (
//         <FormHelperText error sx={{ ...helperTextStyle, ml: "160px" }}>
//           {formik.errors.vendorName}
//         </FormHelperText>
//       )}

//       {/* Selected Vendor Details */}
//       {currentVendor && currentVendor.billing_address && (
//         <Box sx={{ mt: 2 }}>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//             }}
//           >
//             {/* Billing Address */}
//             <Box sx={{ flex: 1, marginLeft: 20.5 }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <Typography
//                   variant="subtitle2"
//                   sx={{
//                     fontWeight: "bold",
//                     color: "#666",
//                     fontSize: "14px",
//                   }}
//                 >
//                   BILLING ADDRESS
//                 </Typography>
//                 <IconButton size="small">
//                   <EditIcon sx={{ fontSize: "1.1rem" }} />
//                 </IconButton>
//               </Box>
//               <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
//                 {currentVendor.billing_address.address || ""}
//               </Typography>
//               <Typography variant="body2" sx={{ fontSize: "14px" }}>
//                 {currentVendor.billing_address.city || ""}
//               </Typography>
//               <Typography variant="body2" sx={{ fontSize: "14px" }}>
//                 {currentVendor.billing_address.state || ""}
//               </Typography>
//               <Typography variant="body2" sx={{ fontSize: "14px" }}>
//                 {currentVendor.billing_address.country || ""}
//               </Typography>
//               <Typography variant="body2" sx={{ fontSize: "14px" }}>
//                 {currentVendor.billing_address.zip || ""}
//               </Typography>
//               <Typography variant="body2" sx={{ fontSize: "14px" }}>
//                 {currentVendor.billing_address.phone || ""}
//               </Typography>
//             </Box>

//             {/* Vendor Details Button */}
//             <Box>
//               <VendorDetailButton
//                 endIcon={<ArrowForwardIosIcon fontSize="small" />}
//               >
//                 {currentVendor.contact_name}&apos;s Details
//               </VendorDetailButton>
//             </Box>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default VendorSelection;
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  ClickAwayListener,
  Dialog,
  DialogContent,
  Popover,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import apiService from "../../../../services/axiosService";
import VendorForm from "../../vendor/createvendor/page";
import BillingAddress from "../../../common/BillingAddressForm";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const VendorSelector = ({
  details,
  callAPI,
  formik,
  initialValue,
  RB = false,
}) => {
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!initialValue);
  const searchInputRef = useRef(null);
  const [address, setAddress] = useState("");
  const [showAddresses, setShowAddresses] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);

  const router = useRouter();
  // Billing Address Popover state
  const [anchorElBA, setAnchorElBA] = useState(null);
  const openBA = Boolean(anchorElBA);
  const idBA = openBA ? "billing-address-popover" : undefined;

  // Shipping Address Popover state
  const [anchorElSA, setAnchorElSA] = useState(null);
  const openSA = Boolean(anchorElSA);
  const idSA = openSA ? "shipping-address-popover" : undefined;

  const organization_id = localStorage.getItem("organization_id");

  const filteredVendors = vendors.filter((vendor) =>
    vendor.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    if (details) {
      setSelectedVendor({
        id: details.contact_id,
        name: details.contact_name || details.vendor_name,
        email: details.contact_email || details.primary_email,
        billing_address: details.billing_address,
        shipping_address: details.shipping_address,
      });
      console.log("details----", selectedVendor);
      setVendorDetails(details);
      setShowAddresses(true);
    }
    if (initialValue && !details) {
      fetchInitialVendor(initialValue);
    }
  }, [details, initialValue]);

  // useEffect(() => {

  // }, [initialValue]);
  const fetchInitialVendor = async (InitialValue) => {
    if (InitialValue) {
      try {
        setInitialLoading(true);
        const response = await apiService({
          method: "GET",
          url: `/api/v1/contact/${InitialValue.contact_id}?organization_id=${organization_id}`,
        });
        if (response.statusCode == 200) {
          const vendor = response.data.data;
          setSelectedVendor({
            id: vendor._id || vendor.id,
            name: vendor.contact_name || vendor.vendor_name,
            email: vendor.contact_email || vendor.primary_email,
          });
          // console.log(first)
          console.log(response.data, "98------response.data");
          setVendorDetails(response.data);
          formik.setFieldValue("vendor_id", vendor._id || vendor.id);
          formik.setFieldValue("billing_address", vendor.billing_address);
          formik.setFieldValue("shipping_address", vendor.shipping_address);
          formik.setFieldValue("source_of_supply", vendor.place_of_contact);
          setShowAddresses(true);
          // await fetchVendorDetails(vendor._id || vendor.id);
        }
      } catch (error) {
        console.error("Error fetching initial vendor:", error);
      } finally {
        setInitialLoading(false);
      }
    }
  };

  // Set selected vendor if details are provided

  const handleClickBA = (event) => {
    // alert(1)
    if (selectedVendor) {
      setAnchorElBA(event.currentTarget);
      setAddress("add");
    }
  };

  const handleCloseBA = () => {
    setAnchorElBA(null);
    // After closing, refresh vendor details to get updated address
    if (selectedVendor?.id) {
      fetchVendorDetails(selectedVendor.id);
    }
  };

  const handleClickSA = (event) => {
    if (selectedVendor) {
      setAnchorElSA(event.currentTarget);
    }
  };

  const handleCloseSA = () => {
    setAnchorElSA(null);
    // After closing, refresh vendor details to get updated address
    if (selectedVendor?.id) {
      fetchVendorDetails(selectedVendor.id);
    }
  };

  // Fetch vendor details including addresses
  const fetchVendorDetails = async (vendorId) => {
    if (!vendorId) return;

    setAddressLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `api/v1/contact/${vendorId}?organization_id=${organization_id}`,
      });

      if (response.data) {
        console.log(response.data.data, "162------response.data");
        const vendor = response.data.data;
        setSelectedVendor({
          id: vendor.contact_id,
        name: vendor.contact_name || vendor.vendor_name,
        email: vendor.contact_email || vendor.primary_email,
        billing_address: vendor.billing_address,
        shipping_address: vendor.shipping_address,
        });
        setVendorDetails(vendor);
        setShowAddresses(true)
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    } finally {
      // Introduce a delay before setting loading to false
      setAddressLoading(false);
      setTimeout(() => {}, 100);
    }
  };

  // Fetch vendors from API
  useEffect(() => {
    if (vendorDropdownOpen) {
      fetchVendors();
    }
  }, [vendorDropdownOpen]);

  // Fetch vendors with search query
  useEffect(() => {
    if (vendorDropdownOpen && searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        fetchVendors();
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      let url = `api/v1/vendors?filter_by=Status.All&page=1&per_page=50&sort_column=contact_name&sort_order=A&organization_id=${organization_id}`;
      if (searchQuery.trim()) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }

      const response = await apiService({
        method: "GET",
        url: url,
      });

      if (response.data && Array.isArray(response.data.data)) {
        setVendors(response.data.data);
      } else {
        const vendorsData = Array.isArray(response.data) ? response.data : [];
        setVendors(vendorsData);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]); // Clear vendors on error
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleClickAway = () => {
    setVendorDropdownOpen(false);
  };

  const handleNewVendor = () => {
    setShowVendorForm(true);
    setVendorDropdownOpen(false);
  };

  const handleSelectVendor = (vendor) => {
    formik.setFieldValue("vendor_id", vendor._id);
    formik.setFieldValue("vendorName", vendor.contact_name);

    const vendorId = vendor.id || vendor.vendor_id || vendor.contact_id;
    setSelectedVendor({
      ...vendor,
      id: vendorId,
    });
    setVendorDropdownOpen(false);

    // Set address loading first
    setAddressLoading(true);
    setShowAddresses(true);

    // Fetch vendor details including addresses
    fetchVendorDetails(vendorId);

    // Call API with the new vendor ID
    if (callAPI && vendorId) {
      callAPI(vendorId);
    }
  };

  const handleBackFromVendorForm = () => {
    setShowVendorForm(false);
  };

  const handleVendorCreated = (newVendor) => {
    if (newVendor) {
      const vendorId =
        newVendor.id || newVendor.vendor_id || newVendor.contact_id;
      setSelectedVendor({
        ...newVendor,
        id: vendorId,
      });

      // Set address loading state
      setAddressLoading(true);
      setShowAddresses(true);

      // Fetch vendor details including addresses
      fetchVendorDetails(vendorId);

      if (callAPI && vendorId) {
        callAPI(vendorId);
      }
    }
    setShowVendorForm(false);
    fetchVendors();
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (vendorDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [vendorDropdownOpen]);

  // Set showAddresses state when vendor details are loaded
  // useEffect(() => {
  //   console.log(vendorDetails, "------vendorDetails");
  //   setShowAddresses(!vendorDetails);
  // }, [vendorDetails]);

  // Extract first letter for avatar display
  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Get display data with fallbacks for potentially missing properties
  const getDisplayData = (vendor) => {
    return {
      name:
        vendor.name ||
        vendor.contact_name ||
        vendor.vendor_name ||
        "Unnamed Vendor",
      email: vendor.email || vendor.contact_email || vendor.primary_email || "",
      id:
        vendor.id ||
        vendor.vendor_id ||
        vendor.contact_id ||
        `temp-${Math.random()}`,
    };
  };

  // Function to render address information in the required format
  const renderAddressDetails = (addressData) => {
    if (!addressData) return null;
    // Create an array of fields to display in the specified order
    const addressFields = [
      { label: "Attention", value: addressData.attention },
      { label: "Address", value: addressData.address },
      { label: "Street2", value: addressData.street2 },
      { label: "City", value: addressData.city },
      { label: "State", value: addressData.state },
      { label: "Zip", value: addressData.zip },
      { label: "Country", value: addressData.country },
      { label: "Phone", value: addressData.phone },
      { label: "Fax", value: addressData.fax },
    ];

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {addressFields
          .filter((field) => field.value)
          .map((field, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                fontSize: "13px",
                color: "#363636",
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: "500" }}>{field.label}:</span>{" "}
              {field.value}
            </Typography>
          ))}
      </Box>
    );
  };

   const hasAddressData = (addressData) => {
    if (!addressData) return false;
    const addressFields = [
      addressData.attention,
      addressData.address,
      addressData.street2,
      addressData.city,
      addressData.state,
      addressData.zip,
      addressData.country,
      addressData.phone,
      addressData.fax,
    ];
    return addressFields.some(field => field && field.trim() !== '');
  };

  // Skeleton loaders for address sections
  const renderAddressSkeleton = () => (
    <Box sx={{ width: "100%" }}>
      <Skeleton variant="text" width="90%" height={20} />
      <Skeleton variant="text" width="85%" height={20} />
      <Skeleton variant="text" width="70%" height={20} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="65%" height={20} />
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: 3,
        ml: 3,mt:3,
        // backgroundColor: "#f9f9fb",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "600px",
        }}
      >
        <Typography
          sx={{
            width: RB ? "160px" : "140px",
            fontSize: "13px",
            color: "#d6141d",
            mt: 1,
          }}
        >
          Vendor Name*
        </Typography>

        {initialLoading ? (
          <Skeleton
            variant="rectangular"
            width={400}
            height={40}
            sx={{ borderRadius: "4px" }}
          />
        ) : (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: "relative", width: "440px" }}>
              <Box
                onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "35px",
                  justifyContent: "space-between",
                  border: "1px solid #c4c4c4",
                  borderRadius: RB ? "7px" : "4px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  backgroundColor: "white",
                  "&:hover": {
                    borderColor: "#666",
                  },
                }}
              >
                <Typography sx={{ fontSize: "13px", color: "#666" }}>
                  {formik.values.vendorName
                    ? formik.values.vendorName
                    : "Select a Vendor"}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <KeyboardArrowDownIcon
                    sx={{
                      marginLeft: "5px",
                      marginRight: "5px",
                      fontSize: "22px",
                      color: "#666",
                      transform: vendorDropdownOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                  <Box>
                    <IconButton
                      size="small"
                      sx={{
                        height: "35px",
                        width: "40px",
                        marginRight: -2,
                        borderRadius: "0 7px 7px 0",
                        backgroundColor: " #408dfb",
                        color: "white",
                        border: "1px solid",
                        borderColor: " #408dfb",
                        borderLeft: "none",
                        "&:hover": {
                          backgroundColor: "#3a7fe1", // Slightly darker
                          borderColor: "#3a7fe1",
                        },
                      }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {vendorDropdownOpen && (
                <Paper
                  elevation={3}
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    borderRadius: "4px",
                    mt: 0.5,
                    zIndex: 1000,
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <TextField
                      inputRef={searchInputRef}
                      placeholder="Search"
                      size="small"
                      fullWidth
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                          borderRadius: "4px",
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                    {loading ? (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography sx={{ fontSize: "13px" }}>
                          Loading...
                        </Typography>
                      </Box>
                    ) : vendors.length > 0 ? (
                      filteredVendors.map((vendor, index) => {
                        // const displayData = getDisplayData(vendor);
                        return (
                          <Box
                            key={vendor._id}
                            onClick={() => handleSelectVendor(vendor)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "5px",
                              margin: "5px",
                              p: 1.2,
                              cursor: "pointer",
                              backgroundColor:
                                index === 0 ? "#4d90fe" : "transparent",
                              color: index === 0 ? "white" : "inherit",
                              "&:hover": {
                                backgroundColor:
                                  index === 0 ? "#4d90fe" : "#f5f5f5",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: index === 0 ? "#fff" : "#ddd",
                                color: index === 0 ? "#4d90fe" : "#666",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 1.5,
                                fontSize: "14px",
                              }}
                            >
                              {getInitial(vendor.contact_name)}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography
                                sx={{ fontSize: "13px", fontWeight: "medium" }}
                              >
                                {vendor.contact_name}
                              </Typography>
                              {vendor.email && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 0.5,
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      display: "inline-block",
                                      width: "16px",
                                      height: "16px",
                                      mr: 0.5,
                                      "& svg": {
                                        width: "16px",
                                        height: "16px",
                                        fill: index === 0 ? "white" : "#666",
                                      },
                                    }}
                                  >
                                    <svg
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      color: index === 0 ? "white" : "#666",
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      maxWidth: "250px",
                                    }}
                                  >
                                    {vendor.email}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        );
                      })
                    ) : (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography sx={{ fontSize: "13px" }}>
                          No vendors found
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box>
                    <Box
                      onClick={() =>
                        router.push("/purchase/vendor/createvendor")
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1.5,
                        borderTop: "1px solid #eee",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <AddIcon
                        sx={{ fontSize: "16px", color: "#4d90fe", mr: 1 }}
                      />
                      <Typography sx={{ fontSize: "13px", color: "#4d90fe" }}>
                        New Vendor
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {/* Full-page dialog for VendorForm */}
              {showVendorForm && (
                <Dialog
                  open={showVendorForm}
                  onClose={handleBackFromVendorForm}
                  fullScreen
                  sx={{
                    "& .MuiDialog-paper": {
                      margin: 0,
                      width: "100%",
                      maxWidth: "100%",
                      height: "100%",
                      maxHeight: "none",
                      overflow: "hidden",
                    },
                  }}
                >
                  <DialogContent sx={{ padding: 0 }}>
                    <VendorForm
                      onVendorCreated={handleVendorCreated}
                      onCancel={handleBackFromVendorForm}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </Box>
          </ClickAwayListener>
        )}
      </Box>

      {/* Address section - only shown when a vendor is selected */}
      {selectedVendor && (
        <Box sx={{ ml: 3, flexGrow: 1, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              ml: RB ? 18 : 15,
            }}
          >
            {/* Billing Address Section */}
            <Box sx={{ mb: 3, width: "200px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  Billing Address
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    p: 0.5,
                    height: "fit-content",
                    color: "#757575",
                    marginLeft: "50px",
                  }}
                  onClick={handleClickBA}
                  disabled={addressLoading}
                >
                  {/* <EditIcon sx={{ fontSize: "16px" }} /> */}
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                {addressLoading ? (
                  renderAddressSkeleton()
                ) : hasAddressData(selectedVendor?.billing_address) ? (
                  <Box sx={{ maxWidth: "90%" }}>
                    {renderAddressDetails(selectedVendor.billing_address)}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "13px",
                      color: "#363636",
                      lineHeight: 1.5,
                    }}
                  >
                    No Billing Address -{" "}
                    <span
                      style={{ color: "#408dfb", cursor: "pointer" }}
                      onClick={handleClickBA}
                    >
                      + New Address
                    </span>
                  </Typography>
                )}
                <Popover
                  id={idBA}
                  open={openBA}
                  anchorEl={anchorElBA}
                  onClose={handleCloseBA}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    sx: { width: "390px", overflow: "none" },
                  }}
                >
                  <BillingAddress
                    onClose={handleCloseBA}
                    open={openBA}
                    editData={vendorDetails?.billing_address}
                    address={address}
                    title="Billing Address"
                    contactId={selectedVendor?.id}
                  />
                </Popover>
              </Box>
            </Box>

            {/* Shipping Address Section */}
            {!RB && (
              <Box sx={{ width: "200px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                    }}
                  >
                    Shipping Address
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      p: 0.5,
                      height: "fit-content",
                      color: "#757575",
                      marginLeft: "60px",
                    }}
                    onClick={handleClickSA}
                    disabled={addressLoading}
                  >
                    {/* <EditIcon sx={{ fontSize: "16px" }} /> */}
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  {addressLoading ? (
                    renderAddressSkeleton()
                  ) : hasAddressData(selectedVendor?.shipping_address) ? (
                    <Box sx={{ maxWidth: "90%" }}>
                      {renderAddressDetails(selectedVendor.shipping_address)}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#363636",
                        lineHeight: 1.5,
                      }}
                    >
                      No Shipping Address -{" "}
                      <span
                        style={{ color: "#408dfb", cursor: "pointer" }}
                        onClick={handleClickSA}
                      >
                        + New Address
                      </span>
                    </Typography>
                  )}
                  <Popover
                    id={idSA}
                    open={openSA}
                    anchorEl={anchorElSA}
                    onClose={handleCloseSA}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      sx: { width: "390px", overflow: "none" },
                    }}
                  >
                    <BillingAddress
                      onClose={handleCloseSA}
                      open={openSA}
                      editData={vendorDetails?.shipping_address}
                      address={address}
                      title="Shipping Address"
                      contactId={selectedVendor?.id}
                    />
                  </Popover>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VendorSelector;
