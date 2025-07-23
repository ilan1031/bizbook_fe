// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Menu,
//   MenuItem,
//   CircularProgress,
//   Alert,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { 
//   fetchItemTransactions, 
//   transformTransactionData, 
//   formatCurrency, 
//   getStatusColor 
// } from "../../../utils/api";
// import apiService from "../../../services/axiosService";

// const moduleTabs = [
//   { key: "estimates", label: "Estimates" },
//   { key: "salesorders", label: "Sales Orders" },
//   { key: "invoices", label: "Invoices" },
//   // Add more modules as needed
// ];

// const TransactionTable = ({ data }) => (
//   <TableContainer>
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>DATE</TableCell>
//           <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>DOCUMENT NUMBER</TableCell>
//           <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>CUSTOMER/VENDOR NAME</TableCell>
//           <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>QUANTITY</TableCell>
//           <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>PRICE</TableCell>
//           <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>TOTAL</TableCell>
//           <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>STATUS</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {data.map((row, idx) => (
//           <TableRow key={idx} hover>
//             <TableCell sx={{ fontSize: 15 }}>{row.date_formatted || row.date}</TableCell>
//             <TableCell sx={{ fontSize: 15 }}>{row.estimate_number || row.invoice_number || row.salesorder_number || row.document_number}</TableCell>
//             <TableCell sx={{ fontSize: 15 }}>{row.customer_name || row.vendor_name}</TableCell>
//             <TableCell sx={{ fontSize: 15 }}>{row.quantity || row.quantity_sold}</TableCell>
//             <TableCell sx={{ fontSize: 15 }}>{formatCurrency(row.price || row.rate)}</TableCell>
//             <TableCell sx={{ fontSize: 15 }}>{(row.item_total_formatted || row.total)}</TableCell>
//             <TableCell sx={{ fontSize: 15, fontWeight: 600, color: getStatusColor(row.status || row.status_formatted) }}>{row.status || row.status_formatted}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// );

// const ItemTransactions = ({ itemId, organizationId }) => {
//   const [loading, setLoading] = useState(false);
//   const [modules, setModules] = useState({});
//   const [error, setError] = useState(null);
//   const [tab, setTab] = useState(0);

//   useEffect(() => {
//     if (itemId && organizationId) {
//       fetchModules();
//     }
//   }, [itemId, organizationId]);

//   const fetchModules = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       console.log("ItemTransactions - Fetching from /item/singleitems/", itemId);
//       const response = await apiService({
//         method: "GET",
//         url: `/api/v1/item/singleitems/${itemId}`,
//         params: { organization_id: organizationId },
//       });
//       console.log("ItemTransactions - API response:", response);
//       if (response && response.data && response.data.data) {
//         setModules(response.data.data);
//         console.log("ItemTransactions - Set modules:", response.data.data);
//       } else {
//         setModules({});
//         setError("No transaction modules found in response");
//         console.log("ItemTransactions - No modules in response:", response);
//       }
//     } catch (err) {
//       setError("Failed to load transactions");
//       setModules({});
//       console.error("ItemTransactions - Error fetching modules:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (event, newValue) => setTab(newValue);

//   // Only show tabs for modules with data
//   const availableTabs = moduleTabs.filter(
//     (mod) => Array.isArray(modules[mod.key]) && modules[mod.key].length > 0
//   );

//   return (
//     <Box sx={{ p: 0, pt: 3, pr: 6, ml: 2 }}>
//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>
//       ) : availableTabs.length === 0 ? (
//         <Box sx={{ p: 3, textAlign: "center" }}>
//           <Typography color="text.secondary">
//             No transactions found for this item.
//           </Typography>
//         </Box>
//       ) : (
//         <>
//           <Tabs value={tab} onChange={handleTabChange}>
//             {availableTabs.map((mod, idx) => (
//               <Tab key={mod.key} label={mod.label} />
//             ))}
//           </Tabs>
//           {availableTabs.map((mod, idx) =>
//             tab === idx && (
//               <TransactionTable data={modules[mod.key]} key={mod.key} />
//             )
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default ItemTransactions; 
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { 
  fetchItemTransactions, 
  transformTransactionData, 
  formatCurrency, 
  getStatusColor 
} from "../../../utils/api";
import apiService from "../../../services/axiosService";

const moduleOptions = [
  { key: "all", label: "All" },
  { key: "estimates", label: "Quotes" },
  { key: "salesorders", label: "Sales Orders" },
  { key: "invoices", label: "Invoices" },
  { key: "delivery_challans", label: "Delivery Challans" },
  { key: "credit_notes", label: "Credit Notes" },
  { key: "recurring_invoices", label: "Recurring Invoices" },
  { key: "purchase_orders", label: "Purchase Orders" },
  { key: "bills", label: "Bills" },
  { key: "vendor_credits", label: "Vendor Credits" },
];

const statusOptions = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent" },
  { key: "client_viewed", label: "Client Viewed" },
  { key: "accepted", label: "Accepted" },
  { key: "invoiced", label: "Invoiced" },
  { key: "declined", label: "Declined" },
  { key: "expired", label: "Expired" },
];

const TransactionTable = ({ data }) => (
  <Paper sx={{ 
    boxShadow: 'none', 
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    marginTop: 2
  }}>
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#fafafa' }}>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '12px', 
              color: '#666', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              DATE
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '12px', 
              color: '#666', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              QUOTE NUMBER
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '12px', 
              color: '#666', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              CUSTOMER NAME
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '12px', 
              color: '#666', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              QUANTITY SOLD
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '12px', 
              color: '#666', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              PRICE
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '12px', 
              color: '#666', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              TOTAL
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '12px', 
              color: '#666', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              STATUS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow 
              key={idx} 
              hover
              sx={{ 
                '&:hover': { 
                  backgroundColor: '#f8f9fa' 
                },
                '&:last-child td': {
                  borderBottom: 'none'
                }
              }}
            >
              <TableCell sx={{ 
                fontSize: '14px',
                color: '#333',
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {row.date_formatted || row.date}
              </TableCell>
              <TableCell sx={{ 
                fontSize: '14px',
                color: '#333',
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {row.estimate_number || row.invoice_number || row.salesorder_number || row.document_number}
              </TableCell>
              <TableCell sx={{ 
                fontSize: '14px',
                color: '#333',
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {row.customer_name || row.vendor_name}
              </TableCell>
              <TableCell sx={{ 
                fontSize: '14px',
                color: '#333',
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {row.quantity || row.quantity_sold}
              </TableCell>
              <TableCell sx={{ 
                fontSize: '14px',
                color: '#333',
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {formatCurrency(row.price || row.rate)}
              </TableCell>
              <TableCell sx={{ 
                fontSize: '14px',
                color: '#333',
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {(row.item_total_formatted || row.total)}
              </TableCell>
              <TableCell sx={{ 
                fontSize: '14px',
                fontWeight: 500,
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <Box
                  component="span"
                  sx={{
                    color: getStatusColor(row.status || row.status_formatted),
                    backgroundColor: getStatusColor(row.status || row.status_formatted) + '15',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}
                >
                  {row.status || row.status_formatted}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const DropdownButton = ({ label, value, options, onChange, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (optionKey) => {
    onChange(optionKey);
    handleClose();
  };

  const selectedOption = options.find(opt => opt.key === value) || options[0];

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        sx={{
          backgroundColor: '#fff',
          border: '1px solid #d0d0d0',
          borderRadius: '4px',
          color: '#333',
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 400,
          padding: '8px 16px',
          minWidth: '120px',
          justifyContent: 'space-between',
          '&:hover': {
            backgroundColor: '#f5f5f5',
            border: '1px solid #ccc'
          }
        }}
        {...props}
      >
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '14px' }}>
            {label}:
          </Typography>
          <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 500 }}>
            {selectedOption.label}
          </Typography>
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            minWidth: '180px'
          }
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.key}
            onClick={() => handleSelect(option.key)}
            selected={option.key === value}
            sx={{
              fontSize: '14px',
              padding: '10px 16px',
              '&.Mui-selected': {
                backgroundColor: '#4285f4',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#3367d6'
                }
              },
              '&:hover': {
                backgroundColor: option.key === value ? '#3367d6' : '#f5f5f5'
              }
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const ItemTransactions = ({ itemId, organizationId }) => {
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState({});
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (itemId && organizationId) {
      fetchModules();
    }
  }, [itemId, organizationId]);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("ItemTransactions - Fetching from /item/singleitems/", itemId);
      const response = await apiService({
        method: "GET",
        url: `/api/v1/item/singleitems/${itemId}`,
        params: { organization_id: organizationId },
      });
      console.log("ItemTransactions - API response:", response);
      if (response && response.data && response.data.data) {
        setModules(response.data.data);
        console.log("ItemTransactions - Set modules:", response.data.data);
      } else {
        setModules({});
        setError("No transaction modules found in response");
        console.log("ItemTransactions - No modules in response:", response);
      }
    } catch (err) {
      setError("Failed to load transactions");
      setModules({});
      console.error("ItemTransactions - Error fetching modules:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered data based on selected module and status
  const getFilteredData = () => {
    if (selectedModule === "all") {
      // Combine all modules
      const allData = [];
      Object.keys(modules).forEach(key => {
        if (Array.isArray(modules[key])) {
          allData.push(...modules[key]);
        }
      });
      return allData;
    } else {
      return Array.isArray(modules[selectedModule]) ? modules[selectedModule] : [];
    }
  };

  const filteredData = getFilteredData().filter(item => {
    if (selectedStatus === "all") return true;
    const status = (item.status || item.status_formatted || "").toLowerCase();
    return status === selectedStatus.toLowerCase() || status.includes(selectedStatus.toLowerCase());
  });

  const hasData = Object.keys(modules).some(key => Array.isArray(modules[key]) && modules[key].length > 0);

  return (
    <Box sx={{ p: 0, pt: 3, pr: 6, ml: 2 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>
      ) : !hasData ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            No transactions found for this item.
          </Typography>
        </Box>
      ) : (
        <>
          {/* Filter Controls */}
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <DropdownButton
              label="Filter By"
              value={selectedModule}
              options={moduleOptions}
              onChange={setSelectedModule}
            />
            <DropdownButton
              label="Status"
              value={selectedStatus}
              options={statusOptions}
              onChange={setSelectedStatus}
            />
          </Box>

          {/* Transaction Table */}
          {filteredData.length > 0 ? (
            <TransactionTable data={filteredData} />
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                No transactions found with the selected filters.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ItemTransactions;