"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Avatar,
  Typography,
  Paper,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  Dialog,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import EmailIcon from "@mui/icons-material/Email";
import CustomerForm from "./customerpopup/page"; // Import the CustomerForm component
import apiService from "../../../src/services/axiosService";
import theme from "../theme";

const CustomerDropDown = ({ handleCustomerChange, onClose }) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const organization_id = localStorage.getItem("organization_id");

  useEffect(() => {
    fetchCustomerList("Status.Active");
  }, []);

  // Fetch customers from API
  const fetchCustomerList = async (filterValue = "") => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/customers`,
        params: {
          filter_by: filterValue,
          page: 1,
          per_page: 50,
          sort_column: "contact_name",
          sort_order: "D",
          organization_id: organization_id,
        },
        file: false,
      });
      const { data } = response.data;
      setCustomerList(data);
      setFilteredCustomers(data); // Initialize with full list
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
    }
  };

  // Handle search input
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);

    // Filter customers based on search
    const filtered = customerList.filter((customer) =>
      customer.contact_name.toLowerCase().includes(value)
    );
    setFilteredCustomers(filtered);
  };

  // Function to open the dialog
  const handleNewCustomerClick = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    onClose();
  };

  const handleSelect = (customer, index) => {
    setActiveIndex(index);
    handleCustomerChange(customer);
  };

  return (
    //  <Box
    //   sx={{
    //     width: "98%",
    //     maxWidth: 500,
    //     margin: "9 auto",
    //     position: "relative",
    //     display: "flex",
    //     flexDirection: "column",
    //     height: "400px", // Fixed height for the dropdown
    //     overflow: "hidden", // 🔹 Prevent outer scrolling
    //   }}
    // >
    //   {/* Sticky Search Bar */}
    //   <Paper
    //     elevation={0}
    //     sx={{
    //       p: 1,
    //       backgroundColor: "#fff",
    //       borderRadius: 2,
    //       position: "sticky", // Keep the search bar fixed at the top
    //       top: 0,
    //       zIndex: 10,
    //     }}
    //   >
    //     <TextField
    //       fullWidth
    //       variant="outlined"
    //       placeholder="Search"
    //       size="small"
    //       value={searchValue}
    //       onChange={handleSearch}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">
    //             <SearchIcon color="action" />
    //           </InputAdornment>
    //         ),
    //         sx: {
    //           fontSize: "13px",
    //           borderRadius: 1.5,
    //           "& .MuiOutlinedInput-notchedOutline": {
    //             borderColor: "#e0e0e0",
    //           },
    //         },
    //       }}
    //       sx={{
    //         "& .MuiOutlinedInput-root": {
    //           borderRadius: 1.5,
    //         },
    //       }}
    //       InputLabelProps={{ sx: { fontSize: "13px" } }}
    //     />
    //   </Paper>

    //   {/* Scrollable Customer List */}
    //   <Box
    //     sx={{
    //       flexGrow: 1, // Allow the list to grow and fill available space
    //       overflowY: "auto", // 🔹 Enable vertical scrolling for the list
    //       maxHeight: "300px", // Limit the height of the scrollable area
    //     }}
    //   >
    //     <List sx={{ width: "100%", padding: 0 }}>
    //       {filteredCustomers.length > 0 &&
    //         filteredCustomers.map((customer, index) => (
    //           <ListItem
    //             key={customer.contact_id} // Use contact_id as key
    //             alignItems="center"
    //             onClick={() => handleSelect(customer, index)}
    //             sx={{
    //               py: 1.5,
    //               px: 2,
    //               fontSize: "13px",
    //               color: "#0000007a",
    //               transition: "background-color 0.3s ease",
    //               bgcolor: activeIndex === index ? "#f0f0f0" : "transparent",
    //               "&:hover": { bgcolor: "#1976d2", color: "white" },
    //               cursor: "pointer",
    //             }}
    //           >
    //             <ListItemAvatar>
    //               <Avatar
    //                 sx={{
    //                   bgcolor: "#f5f5f5",
    //                   color: "grey",
    //                   width: 35,
    //                   height: 35,
    //                   fontSize: "13px",
    //                 }}
    //               >
    //                 {customer.first_name?.charAt(0).toUpperCase() ||
    //                   customer.last_name?.charAt(0).toUpperCase()}{" "}
    //                 {/* Show Initial */}
    //               </Avatar>
    //             </ListItemAvatar>
    //             <Box sx={{ flexGrow: 1 }}>
    //               <Typography
    //                 variant="body1"
    //                 sx={{ fontSize: "13px", fontWeight: "600" }}
    //               >
    //                 {customer.contact_name}
    //               </Typography>
    //               {customer.email && (
    //                 <Box
    //                   sx={{
    //                     display: "flex",
    //                     alignItems: "center",
    //                     mt: 0.5,
    //                   }}
    //                 >
    //                   <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
    //                   <Typography variant="body2" sx={{ fontSize: "13px" }}>
    //                     {customer.email}
    //                   </Typography>
    //                 </Box>
    //               )}
    //             </Box>
    //           </ListItem>
    //         ))}
    //       {filteredCustomers.length === 0 && (
    //         <Typography
    //           sx={{
    //             display: "flex",
    //             justifyContent: "center",
    //             py: 2,
    //             fontSize: "13px",
    //           }}
    //         >
    //           Customer Not found
    //         </Typography>
    //       )}
    //     </List>
    //   </Box>

    //   {/* Fixed New Customer Button */}
    //   <Box
    //     sx={{
    //       borderTop: "1px solid #f0f0f0",
    //       backgroundColor: "#fff",
    //       position: "sticky", // Keep the button fixed at the bottom
    //       bottom: 0,
    //       zIndex: 10,
    //       p: 1.5,
    //     }}
    //   >
    //     <ListItem
    //       button
    //       alignItems="center"
    //       sx={{
    //         py: 1.5,
    //         px: 2,
    //         transition: "background-color 0.3s ease",
    //         "&:hover": { backgroundColor: "#f5f5f5" },
    //       }}
    //       onClick={handleNewCustomerClick}
    //     >
    //       <IconButton
    //         size="small"
    //         sx={{
    //           mr: 2,
    //           bgcolor: "#e3f2fd",
    //           color: "#1976d2",
    //           transition: "background-color 0.3s ease",
    //           "&:hover": { bgcolor: "#bbdefb" },
    //         }}
    //       >
    //         <AddCircleOutlinedIcon fontSize="small" />
    //       </IconButton>
    //       <Typography variant="body1" sx={{ fontSize: "13px" }} color="primary">
    //         New Customer
    //       </Typography>
    //     </ListItem>
    //   </Box>

    //   {/* Dialog for New Customer Form */}
    //   <Dialog
    //     open={isDialogOpen}
    //     onClose={handleCloseDialog}
    //     fullWidth
    //     maxWidth="md"
    //     PaperProps={{
    //       sx: { maxHeight: "90vh" },
    //     }}
    //   >
    //     <CustomerForm />
    //   </Dialog>
    // </Box>
    <Box
      sx={{
        width: "98%",
        maxWidth: 500,
        margin: "9 auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        // Remove fixed height and overflow here
        // height: "400px",
        // overflow: "hidden",
      }}
    >
      {/* Sticky Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          backgroundColor: "#fff",
          borderRadius: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search"
          size="small"
          value={searchValue}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              fontSize: "13px",
              borderRadius: 1.5,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
          InputLabelProps={{ sx: { fontSize: "13px" } }}
        />
      </Paper>

      {/* Scrollable Customer List */}
      <Box
        sx={{
          overflowY: "auto",
          // maxHeight: "400px", // control height here instead
          flexGrow: 1,
        }}
      >
        <List sx={{ width: "100%", padding: 0 }}>
          {filteredCustomers.length > 0 &&
            filteredCustomers.map((customer, index) => (
              <ListItem
                key={customer.contact_id}
                alignItems="center"
                onClick={() => handleSelect(customer, index)}
                sx={{
                  py: 1.5,
                  px: 2,
                  fontSize: "13px",
                  color: "#0000007a",
                  transition: "background-color 0.3s ease",
                  bgcolor: activeIndex === index ? "#f0f0f0" : "transparent",
                  "&:hover": {
                    borderRadius: "5px",
                    backgroundColor: theme.palette.hover?.background || "",
                    color: theme.palette.hover?.text || "",
                  },
                  cursor: "pointer",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: "grey",
                      width: 35,
                      height: 35,
                      fontSize: "13px",
                    }}
                  >
                    {customer.first_name?.charAt(0).toUpperCase() ||
                      customer.last_name?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "13px", fontWeight: "600" }}
                  >
                    {customer.contact_name}
                  </Typography>
                  {customer.email && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 0.5,
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontSize: "13px" }}>
                        {customer.email}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ListItem>
            ))}
          {filteredCustomers.length === 0 && (
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 2,
                fontSize: "13px",
              }}
            >
              Customer Not found
            </Typography>
          )}
        </List>
      </Box>

      {/* Fixed New Customer Button */}
      <Box
        sx={{
          borderTop: "1px solid #f0f0f0",
          backgroundColor: "#fff",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          p: 1,
        }}
      >
        <ListItem
          button
          alignItems="center"
          sx={{
            py: 0,
            px: 0,
            transition: "background-color 0.3s ease",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onClick={handleNewCustomerClick}
        >
          <IconButton
            size="small"
            sx={{
              mr: 2,
              bgcolor: "#e3f2fd",
              color: "#1976d2",
            }}
          >
            <AddCircleOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: "13px" }}
            color="primary"
          >
            New Customer
          </Typography>
        </ListItem>
      </Box>

      {/* Dialog for New Customer Form */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { maxHeight: "90vh" },
        }}
      >
        <CustomerForm />
      </Dialog>
    </Box>
  );
};

export default CustomerDropDown;
