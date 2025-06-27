// "use client";

// import React from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   IconButton,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Select,
//   MenuItem,
//   FormControl,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

// const ContactPersonTable = ({ formik }) => {
//   // Function to add a new contact person row
//   const addContact = () => {
//     const newContactPersons = [
//       ...formik.values.contact_persons,
//       {
//         contact_person_id: "",
//         salutation: "",
//         first_name: "",
//         last_name: "",
//         email: "",
//         phone: "",
//         phone_formatted: "",
//         mobile: "",
//         mobile_formatted: "",
//         mobile_country_code: "",
//         mobile_code_formatted: "",
//         department: "",
//         designation: "",
//         skype: "",
//         fax: "",
//         zcrm_contact_id: "",
//         is_from_crm: false,
//         is_portal_mfa_enabled: false,
//         is_added_in_portal: false,
//         can_invite: false,
//         is_primary_contact: false,
//         is_portal_invitation_accepted: false,
//         is_sms_enabled_for_cp: false,
//         photo_url: "",
//         communication_preference: {
//           is_email_enabled: false,
//         },
//       },
//     ];
//     formik.setFieldValue("contact_persons", newContactPersons);
//   };

//   // Function to remove a contact person
//   const removeContact = (index) => {
//     const updatedContacts = [...formik.values.contact_persons];
//     updatedContacts.splice(index, 1);
//     formik.setFieldValue("contact_persons", updatedContacts);
//   };

//   // Function to update a contact person field
//   const updateContact = (index, field, value) => {
//     const updatedContacts = [...formik.values.contact_persons];
//     updatedContacts[index][field] = value;
//     formik.setFieldValue("contact_persons", updatedContacts);
//   };

//   return (
//     <Box sx={{ width: "1200px" }}>
//       <TableContainer>
//         <Table
//           sx={{
//             maxWidth: 1200,
//             borderCollapse: "separate",
//             borderSpacing: 0,
//             "& .MuiTableCell-root": {
//               borderBottom: "1px solid #e0e0e0",
//               padding: "8px 16px",
//             },
//             "& .MuiTableRow-root": {
//               "&:last-child td": {
//                 borderBottom: 0,
//               },
//             },
//           }}
//         >
//           <TableHead>
//             <TableRow>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderLeft: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 SALUTATION
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 FIRST NAME
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 LAST NAME
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 EMAIL ADDRESS
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 WORK PHONE
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 MOBILE
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 Skype Name/Number
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 Designation
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   borderTop: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               >
//                 Department
//               </TableCell>
//               <TableCell
//                 sx={{
//                   width: "60px",
//                   borderTop: "1px solid #e0e0e0",
//                   borderRight: "1px solid #e0e0e0",
//                   borderBottom: "1px solid #e0e0e0",
//                 }}
//               ></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {formik.values.contact_persons.map((contact, index) => (
//               <TableRow key={index}>
//                 <TableCell
//                   sx={{
//                     borderLeft: "1px solid #e0e0e0",
//                     padding: "4px 8px",
//                   }}
//                 >
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={contact.salutation || ""}
//                       onChange={(e) =>
//                         updateContact(index, "salutation", e.target.value)
//                       }
//                       displayEmpty
//                       IconComponent={KeyboardArrowDownIcon}
//                       sx={{
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       }}
//                     >
//                       <MenuItem value="">
//                         <em>Select</em>
//                       </MenuItem>
//                       <MenuItem value="Mr.">Mr.</MenuItem>
//                       <MenuItem value="Mrs.">Mrs.</MenuItem>
//                       <MenuItem value="Ms.">Ms.</MenuItem>
//                       <MenuItem value="Dr.">Dr.</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </TableCell>
//                 <TableCell sx={{ padding: "4px 8px" }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     value={contact.first_name || ""}
//                     onChange={(e) =>
//                       updateContact(index, "first_name", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ padding: "4px 8px" }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     value={contact.last_name || ""}
//                     onChange={(e) =>
//                       updateContact(index, "last_name", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ padding: "4px 8px" }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     value={contact.email || ""}
//                     onChange={(e) =>
//                       updateContact(index, "email", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ padding: "4px 8px" }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     value={contact.phone || ""}
//                     onChange={(e) =>
//                       updateContact(index, "phone", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ padding: "4px 8px" }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     value={contact.mobile || ""}
//                     onChange={(e) =>
//                       updateContact(index, "mobile", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ padding: "4px 8px" }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     value={contact.skype || ""}
//                     onChange={(e) =>
//                       updateContact(index, "skype", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ padding: "4px 8px" }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     value={contact.designation || ""}
//                     onChange={(e) =>
//                       updateContact(index, "designation", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ padding: "4px 8px" }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     value={contact.department || ""}
//                     onChange={(e) =>
//                       updateContact(index, "department", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#1976d2",
//                           borderWidth: "2px",
//                         },
//                       },
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell
//                   align="center"
//                   sx={{
//                     borderRight: "1px solid #e0e0e0",
//                     padding: "4px 8px",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <IconButton
//                       size="small"
//                       sx={{
//                         padding: 0.5,
//                         color: "text.secondary",
//                       }}
//                     >
//                       <MoreVertIcon fontSize="small" />
//                     </IconButton>
//                     {formik.values.contact_persons.length > 1 && (
//                       <IconButton
//                         size="small"
//                         onClick={() => removeContact(index)}
//                         sx={{
//                           padding: 0.5,
//                           color: "#f44336",
//                         }}
//                       >
//                         <CancelOutlinedIcon fontSize="small" />
//                       </IconButton>
//                     )}
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Button
//         startIcon={<AddCircleOutlineIcon />}
//         onClick={addContact}
//         variant="text"
//         sx={{
//           mt: 2,
//           textTransform: "none",
//           color: "#1976d2",
//           fontWeight: "normal",
//           fontSize: "14px",
//           "&:hover": {
//             backgroundColor: "transparent",
//             textDecoration: "underline",
//           },
//         }}
//       >
//         Add Contact Person
//       </Button>
//     </Box>
//   );
// };

// export default ContactPersonTable;

"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  styled,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import theme from "../../theme";

const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

const StyledSelect = styled(Select)({
  height: "35px", // Changed from 36px to 35px
  "& .MuiSelect-select": {
    padding: "6px 12px",
    fontSize: "13px", // 13px
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "7px", // Changed from default to 7px
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.primary,
    border: ".1px solid #408dfb",
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
});

const ContactPersonTable = ({ formik }) => {
  const [showAdditionalColumns, setShowAdditionalColumns] = useState(false);

  const addContact = () => {
    formik.setFieldValue("contact_persons", [
      ...formik.values.contact_persons,
      {
        salutation: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        mobile: "",
        department: "",
        designation: "",
        skype: "",
      },
    ]);
  };

  const removeContact = (index) => {
    const updatedContacts = [...formik.values.contact_persons];
    updatedContacts.splice(index, 1);
    formik.setFieldValue("contact_persons", updatedContacts);
  };

  const updateContact = (index, field, value) => {
    const updatedContacts = [...formik.values.contact_persons];
    updatedContacts[index][field] = value;
    formik.setFieldValue("contact_persons", updatedContacts);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200 }}>
      <TableContainer>
        <Table
          sx={{
            borderCollapse: "collapse",
            width: "100%",
            "& .MuiTableCell-root": {
              border: "1px solid #e0e0e0",
              padding: "4px 8px",
              fontSize: "13px", // Decreased font size
            },
          }}
        >
          <TableHead>
            <TableRow>
              {[
                "SALUTATION",
                "FIRST NAME",
                "LAST NAME",
                "EMAIL ADDRESS",
                "WORK PHONE",
                "MOBILE",
                ...(showAdditionalColumns
                  ? ["SKYPE NAME/NUMBER", "DESIGNATION", "DEPARTMENT"]
                  : []),
                "",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  sx={{ fontWeight: "bold", padding: "6px" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {formik.values.contact_persons.map((contact, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <StyledSelect
                      value={contact.salutation || ""}
                      onChange={(e) =>
                        updateContact(index, "salutation", e.target.value)
                      }
                      displayEmpty
                      size="small"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{
                        fontSize: "13px",
                        border: "none",
                        "& fieldset": { border: "none" },
                        "& .MuiSvgIcon-root": { width: "17px" },
                      }}
                    >
                      {["Mr.", "Mrs.", "Ms.", "Dr."].map((label) => (
                        <MenuItem
                          key={label}
                          value={label}
                          sx={{
                            fontSize: "12px",
                            "&:hover": {
                              backgroundColor:
                                theme.palette.hover?.background || "#408dfb",
                              color: theme.palette.hover?.text || "white",
                              borderRadius: "5px",
                          
                            },
                          }}
                        >
                          {label}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                </TableCell>
                {["first_name", "last_name", "email", "phone", "mobile"].map(
                  (field) => (
                    <TableCell key={field}>
                      <TextField
                        fullWidth
                        variant="standard"
                        size="small"
                        value={contact[field] || ""}
                        onChange={(e) =>
                          updateContact(index, field, e.target.value)
                        }
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            fontSize: "13px",
                            "& input": {
                              fontSize: "13px", // actual input font size
                              padding: "4px 0", // optional: reduce vertical padding
                            },
                          },
                        }}
                      />
                    </TableCell>
                  )
                )}

                {showAdditionalColumns &&
                  ["skype", "designation", "department"].map((field) => (
                    <TableCell key={field}>
                      <TextField
                        fullWidth
                        variant="standard"
                        size="small"
                        value={contact[field] || ""}
                        onChange={(e) =>
                          updateContact(index, field, e.target.value)
                        }
                        InputProps={{
                          disableUnderline: true,
                        }}
                        sx={{ fontSize: "12px", border: "none" }}
                      />
                    </TableCell>
                  ))}
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowAdditionalColumns(!showAdditionalColumns)
                      }
                      sx={{ padding: 0.5, color: "text.secondary" }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    {formik.values.contact_persons.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeContact(index)}
                        sx={{ padding: 0.5, color: "#f44336" }}
                      >
                        <CancelOutlinedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={addContact}
        variant="text"
        sx={{
          mt: 2,
          textTransform: "none",
          color: "#1976d2",
          fontWeight: "normal",
          fontSize: "14px",
          "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
          },
        }}
      >
        Add Contact Person
      </Button>
    </Box>
  );
};

export default ContactPersonTable;
