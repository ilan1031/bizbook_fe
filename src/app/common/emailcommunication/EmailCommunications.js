// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Checkbox,
//   Grid,
//   TextField,
//   IconButton,
//   Dialog,
//   Select,
//   MenuItem,
//   FormControl,
//   InputAdornment,
//   FormHelperText,
// } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import CloseIcon from "@mui/icons-material/Close";
// import Avatar from "@mui/material/Avatar";
// import SkypeIcon from "@mui/icons-material/PermPhoneMsg";
// import * as Yup from "yup";
// import ContactPersonPopup from "../ContactPersonPopup"; // Import the ContactPersonPopup component
// import axios from "../../../services/axiosService";

// export default function EmailCommunications({ formik, contactId }) {
//   // Existing state variables
//   const [formData, setFormData] = useState({
//     salutation: "salut",
//     firstName: "",
//     lastName: "",
//     email: "",
//     workPhone: "",
//     mobile: "",
//     skype: "",
//     designation: "",
//     department: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [emailList, setEmailList] = useState([
//     {
//       id: 1,
//       name: "bharathi.g",
//       email: "bharathi.gihub@snsgroups.com",
//       initial: "B",
//       selected: true,
//     },
//   ]);
//   const [openAddContact, setOpenAddContact] = useState(false);

//   // New state for managing the ContactPersonPopup
//   const [openPopup, setOpenPopup] = useState(false);
//   const [selectedContactId, setSelectedContactId] = useState(null); // To store contact_id

//   // Validation schema
//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email("Invalid email format")
//       .required("Email is required")
//       .test("unique-email", "Email address already exists", function (value) {
//         return !emailList.some(
//           (contact) => contact.email.toLowerCase() === value.toLowerCase()
//         );
//       }),
//   });
//   const handleSelectionToggle = () => {
//     if (hasSelectedEmails) {
//       // Clear all selections
//       setEmailList(emailList.map((email) => ({ ...email, selected: false })));
//     } else {
//       // Select all
//       setEmailList(emailList.map((email) => ({ ...email, selected: true })));
//     }
//   };
//   const handleEmailSelection = (emailId, isChecked) => {
//     setEmailList((prevEmailList) =>
//       prevEmailList.map((email) =>
//         email.id === emailId ? { ...email, selected: isChecked } : email
//       )
//     );
//   };
//   // Load contacts from localStorage on component mount
//   useEffect(() => {
//     const savedContacts = localStorage.getItem("emailContacts");
//     if (savedContacts) {
//       try {
//         const parsedContacts = JSON.parse(savedContacts);
//         setEmailList(parsedContacts);
//       } catch (error) {
//         console.error("Error parsing contacts from localStorage:", error);
//       }
//     }
//     console.log(contactId, "contactIdcontactId");
//   }, []);

//   // Save contacts to localStorage whenever emailList changes
//   useEffect(() => {
//     localStorage.setItem("emailContacts", JSON.stringify(emailList));
//   }, [emailList]);

//   // Check if any emails are selected
//   const hasSelectedEmails = emailList.some((email) => email.selected);

//   // Handle "Add New" button click
//   const handleAddNew = () => {
//     setOpenPopup(true); // Open the ContactPersonPopup
//   };

//   // Close the ContactPersonPopup
//   const handleClosePopup = () => {
//     setOpenPopup(false); // Close the popup
//     setSelectedContactId(null); // Reset the selected contact ID
//   };

//   // Save contact data from the popup
//   const handleSaveContactFromPopup = (newContact) => {
//     try {
//       // Validate the new contact data
//       validationSchema.validateSync(newContact, { abortEarly: false });

//       // Add the new contact to the email list
//       const updatedContact = {
//         id: Date.now(),
//         name: `${newContact.firstName} ${newContact.lastName}`,
//         email: newContact.email,
//         initial: newContact.firstName.charAt(0).toUpperCase() || "N",
//         selected: false,
//         details: {
//           salutation: newContact.salutation,
//           workPhone: newContact.workPhone,
//           mobile: newContact.mobile,
//           skype: newContact.skype,
//           designation: newContact.designation,
//           department: newContact.department,
//         },
//       };

//       setEmailList([...emailList, updatedContact]);
//       handleClosePopup(); // Close the popup after saving
//     } catch (validationError) {
//       console.error("Validation error:", validationError);
//       alert("Please fix the validation errors before saving.");
//     }
//   };

//   return (
//     <Grid container>
//       <Box
//         sx={{
//           width: "100%",
//           padding: "0 8px",
//           backgroundColor: "#fff",
//         }}
//       >
//         {/* Header Section */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "12px 0",
//             borderBottom: "1px solid #f0f0f0",
//           }}
//         >
//           <Typography
//             variant="subtitle1"
//             sx={{
//               fontWeight: "150",
//               fontSize: "16px",
//               color: "#000",
//               p: "5px",
//             }}
//           >
//             Email Communications |
//             <Button
//               startIcon={
//                 hasSelectedEmails ? (
//                   <CloseIcon sx={{ fontSize: "14px", color: "#ff3b30" }} />
//                 ) : null
//               }
//               sx={{
//                 justifyContent: "center",
//                 textTransform: "none",
//                 color: hasSelectedEmails ? "#ff3b30" : "#2196f3",
//                 fontSize: "14px",
//                 pr: "5px",
//                 p: 0,
//                 minWidth: "auto",
//                 "&:hover": {
//                   backgroundColor: "transparent",
//                 },
//               }}
//               onClick={handleSelectionToggle}
//             >
//               {hasSelectedEmails ? "Clear Selection" : "Select All"}
//             </Button>
//           </Typography>
//         </Box>

//         {/* Row with Add New button and email contacts */}
//         <Box sx={{ padding: "12px 0" }}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               flexWrap: "wrap",
//               alignItems: "flex-start",
//               gap: 2,
//               mb: 2,
//             }}
//           >
//             {/* Add New button */}
//             <Box
//               sx={{
//                 border: "1px dashed #ccc",
//                 borderRadius: "8px",
//                 padding: "3px",
//                 height: "40px",
//                 display: "flex",
//                 alignItems: "center",
//                 width: "110px",
//               }}
//             >
//               <Button
//                 startIcon={
//                   <AddCircleIcon sx={{ color: "#2196f3", fontSize: "20px" }} />
//                 }
//                 sx={{
//                   textTransform: "none",
//                   color: "#2196f3",
//                   fontWeight: "normal",
//                   fontSize: "14px",
//                   p: 1,
//                   minWidth: "auto",
//                   ml: 0.2,
//                   "&:hover": {
//                     backgroundColor: "transparent",
//                   },
//                 }}
//                 onClick={handleAddNew} // Open the popup
//               >
//                 Add New
//               </Button>
//             </Box>

//             {/* Email contacts */}
//             {emailList.map((email) => (
//               <Box
//                 key={email.id}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   border: "1px solid #e0e0e0",
//                   borderRadius: "4px",
//                   padding: "8px 12px",
//                   backgroundColor: "#f5f5f5",
//                   width: "auto",
//                   minWidth: "240px",
//                   height: "auto",
//                   maxHeight: "60px",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <Checkbox
//                   checked={email.selected}
//                   onChange={(e) =>
//                     handleEmailSelection(email.id, e.target.checked)
//                   }
//                   sx={{
//                     padding: "4px",
//                     marginRight: "8px",
//                     color: "#2196f3",
//                     "&.Mui-checked": {
//                       color: "#2196f3",
//                     },
//                     "& .MuiSvgIcon-root": {
//                       fontSize: "20px",
//                     },
//                   }}
//                 />
//                 <Avatar
//                   sx={{
//                     width: 28,
//                     height: 28,
//                     backgroundColor: "#e0e0e0",
//                     fontSize: "14px",
//                     color: "#616161",
//                     marginRight: "10px",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {email.initial}
//                 </Avatar>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <Typography
//                     variant="body2"
//                     component="span"
//                     sx={{
//                       fontWeight: "normal",
//                       fontSize: "14px",
//                       marginRight: "4px",
//                     }}
//                   >
//                     {email.name}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     component="span"
//                     sx={{
//                       color: "#757575",
//                       fontSize: "14px",
//                       wordBreak: "break-all",
//                     }}
//                   >
//                     {email.email}
//                   </Typography>
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         {/* Conditionally render the ContactPersonPopup */}
//         {openPopup && (
//           <ContactPersonPopup
//             open={openPopup}
//             initialData={null}
//             onClose={handleClosePopup}
//             contact_id={contactId || null}
//             isPrimary={false}
//           />
//         )}
//       </Box>
//     </Grid>
//   );
// }

//---------------------------------------------------------------------------------------------------------

"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Grid,
  Avatar,
  CircularProgress,
  Alert
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import ContactPersonPopup from "../ContactPersonPopup";
import axios from "axios";

export default function EmailCommunications({ formik, contactId }) {
  const [emailList, setEmailList] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Get API base URL from environment or use a fallback
  // Make sure this matches your actual API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";



  const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    // other configuration values
  };
  // Validation schema
  const validationSchema = {
    validateSync: (data) => {
      if (!data.email) {
        throw new Error("Email is required");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error("Invalid email format");
      }
      if (emailList.some(contact => contact.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error("Email address already exists");
      }
      return true;
    }
  };

  const handleSelectionToggle = () => {
    if (hasSelectedEmails) {
      setEmailList(emailList.map((email) => ({ ...email, selected: false })));
    } else {
      setEmailList(emailList.map((email) => ({ ...email, selected: true })));
    }
  };
  
  const handleEmailSelection = (emailId, isChecked) => {
    setEmailList((prevEmailList) =>
      prevEmailList.map((email) =>
        email.id === emailId ? { ...email, selected: isChecked } : email
      )
    );
  };

  // Fetch contact details from backend
  useEffect(() => {
    const fetchContactDetails = async () => {
      if (!contactId) {
        console.log("No contactId provided, skipping fetch");
        return;
      }

      try {
        setLoading(true);
        setApiError(null);
        
        // Get necessary credentials
        const organization_id = localStorage.getItem("organization_id");
        const token = localStorage.getItem("token");
        
        if (!organization_id || !token) {
          throw new Error("Missing authentication credentials");
        }
        // Use axios directly with full configuration
        const response = await axios({
          method: 'GET',
          url: `${API_BASE_URL}/api/v1/contact/${contactId}`,
            customBaseUrl: config.SO_Base_url,
          params: { organization_id },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          // Add timeout to avoid hanging requests
          timeout: 30000,
          // Add additional options for CORS if needed
          withCredentials: false
        });

        console.log("API Response:", response);
        
        const data = response.data;

        if (data && data.status === true && data.data?.contact_persons) {
          const contactPersons = data.data.contact_persons;
          
          if (contactPersons.length > 0) {
            const formattedContacts = contactPersons.map((person) => ({
              id: person.contact_person_id,
              name: `${person.first_name || ''} ${person.last_name || ''}`.trim(),
              email: person.email || '',
              initial: (person.first_name || '').charAt(0).toUpperCase() || 'N',
              selected: false,
              details: {
                salutation: person.salutation || '',
                workPhone: person.phone || '',
                mobile: person.mobile || '',
                skype: person.skype || '',
                designation: person.designation || '',
                department: person.department || ''
              }
            }));
            
            setEmailList(formattedContacts);
            console.log("Email list updated with contacts:", formattedContacts);
          } else {
            setEmailList([]);
          }
        } else {
          setEmailList([]);
          if (data && !data.status) {
            setApiError(data.message || "Failed to retrieve contact data");
          }
        }
      } catch (error) {
        console.error("Error fetching contact details:", error);
        
        if (error.response) {
          setApiError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setApiError("Network error: No response received from server. Please check your connection.");
        } else {
          console.error("Error setting up request:", error.message);
          setApiError(`Error: ${error.message}`);
        }
        
        setEmailList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, [contactId, API_BASE_URL]);

  // Check if any emails are selected
  const hasSelectedEmails = emailList.some((email) => email.selected);

  // Handle "Add New" button click
  const handleAddNew = () => {
    setOpenPopup(true);
  };

  // Close the ContactPersonPopup
  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedContactId(null);
  };

  // Save contact data from the popup
  const handleSaveContactFromPopup = async (newContact) => {
    try {
      // Validate the new contact data
      validationSchema.validateSync(newContact);

      // Get necessary credentials
      const organization_id = localStorage.getItem("organization_id");
      const token = localStorage.getItem("token");
      
      if (!organization_id || !token) {
        throw new Error("Missing authentication credentials");
      }

      // First, save the contact person to the backend
      const contactPersonData = {
        organization_id,
        contact_id: contactId,
        salutation: newContact.salutation || "",
        first_name: newContact.firstName || "",
        last_name: newContact.lastName || "",
        email: newContact.email || "",
        phone: newContact.workPhone || "",
        mobile: newContact.mobile || "",
        skype: newContact.skype || "",
        designation: newContact.designation || "",
        department: newContact.department || "",
        is_primary: false
      };

      setLoading(true);
      
      // Use axios directly for saving the contact person
      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/api/v1/contact-person`,
        data: contactPersonData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data && response.data.status === true) {
        // Add the new contact to the email list with the ID from the API
        const newContactPerson = response.data.data?.contact_person;
        
        const updatedContact = {
          id: newContactPerson?.contact_person_id || Date.now(),
          name: `${newContact.firstName} ${newContact.lastName}`,
          email: newContact.email,
          initial: newContact.firstName.charAt(0).toUpperCase() || "N",
          selected: false,
          details: {
            salutation: newContact.salutation,
            workPhone: newContact.workPhone,
            mobile: newContact.mobile,
            skype: newContact.skype,
            designation: newContact.designation,
            department: newContact.department,
          },
        };

        setEmailList(prevList => [...prevList, updatedContact]);
        handleClosePopup();
      } else {
        throw new Error(response.data?.message || "Failed to save contact person");
      }
    } catch (error) {
      console.error("Error saving contact person:", error);
      let errorMessage = "Failed to save contact person";
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error: Could not connect to server";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container>
      <Box
        sx={{
          width: "100%",
          padding: "0 8px",
          backgroundColor: "#fff",
         position: 'flex', 

        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "600",
              fontSize: "13px",
              color: "#000",
              p: "5px",
            }}
          >
            Email Communications |
            <Button
              startIcon={
                hasSelectedEmails ? (
                  <CloseIcon sx={{ fontSize: "14px", color: "#ff3b30" }} />
                ) : null
              }
              sx={{
                justifyContent: "center",
                textTransform: "none",
                color: hasSelectedEmails ? "#ff3b30" : "#2196f3",
                fontSize: "13px",
                pr: "5px",
                ml:"5px",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={handleSelectionToggle}
            >
              {hasSelectedEmails ? "Clear Selection" : "Select All"}
            </Button>
          </Typography>
        </Box>

        {/* Error message with more details */}
        {apiError && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {apiError}
          </Alert>
        )}

        {/* Loading indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          /* Row with Add New button and email contacts */
          <Box sx={{ padding: "12px 0" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start",
                gap: 1,
                mb: 2,
              }}
            >
              {/* Add New button */}
              <Box
                sx={{
                  border: "1px dashed #ccc",
                  borderRadius: "4px",
                  padding: "3px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  width: "110px",
                }}
              >
                <Button
                  startIcon={
                    <AddCircleIcon sx={{ color: "#2196f3", fontSize: "15px" }} />
                  }
                  sx={{
                    textTransform: "none",
                    // color: "#2196f3",
                    fontWeight: "normal",
                    fontSize: "13px",
                    p: 1,
                    minWidth: "auto",
                    // ml: 0.2,
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={handleAddNew}
                >
                  Add New
                </Button>
              </Box>

              {/* Email contacts */}
              {emailList.length > 0 ? (
                emailList.map((email) => (
                  <Box
                    key={email.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      backgroundColor: "#f5f5f5",
                      width: "auto",
                      minWidth: "240px",
                      height: "auto",
                      maxHeight: "60px",
                      // marginBottom: "10px",
                      margin:"5px 10px 5px 0px"
                    }}
                  >
                    <Checkbox
                      checked={email.selected}
                      onChange={(e) =>
                        handleEmailSelection(email.id, e.target.checked)
                      }
                      sx={{
                        padding: "2px",
                        marginRight: "6px",
                        // color: "#2196f3",
                        "&.Mui-checked": {
                          color: "#2196f3",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: "20px",
                        },
                      }}
                    />
                    <Avatar
                      sx={{
                        width: 25,
                        height: 25,
                        backgroundColor: "#e0e0e0",
                        fontSize: "13px",
                        color: "#616161",
                        marginRight: "10px",
                        flexShrink: 0,
                      }}
                    >
                      {email.initial}
                    </Avatar>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          fontWeight: "normal",
                          fontSize: "13px",
                          marginRight: "4px",
                        }}
                      >
                        {email.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          color: "#757575",
                          fontSize: "14px",
                          wordBreak: "break-all",
                        }}
                      >
                        {email.email}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#757575', ml: 1,my:1.5 }}>
                  No contact persons found. Click `Add New` to add contacts.
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Conditionally render the ContactPersonPopup */}
        {openPopup && (
          <ContactPersonPopup
            open={openPopup}
            initialData={null}
            onClose={handleClosePopup}
            onSave={handleSaveContactFromPopup}
            contact_id={contactId || null}
            isPrimary={false}
          />
        )}
      </Box>
    </Grid>
  );
}

//---------------------------------------------------------------------------------------------------------
