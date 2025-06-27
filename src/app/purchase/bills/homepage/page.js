"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
  Container,
  styled,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { AddOutlined } from "@mui/icons-material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchModal from "../../../common/searchModal";
import HelpAndSupport from "../../../common/helpAndSupport/HelpAndSupport";
import ExportModal from "../../../common/export/ExportModal";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import BillsWorkflow from "../../../../assets/bills-workflow.png";
import Button from "../../../common/btn/Button";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";

// Custom styled components
const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  borderBottom: "1px solid #eaeaea",
  position: "sticky",
  top: 0,
  backgroundColor: "#f8f9fa",
  zIndex: 100,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "4px",
  padding: "8px 16px",
}));

const GreenButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: "#00b373",
  color: "white",
  "&:hover": {
    backgroundColor: "#009c65",
  },
}));

const OutlinedButton = styled(StyledButton)(({ theme }) => ({
  border: "1px solid #d0d0d0",
  color: "#555",
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const CheckedItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  margin: "16px 0",
}));
const handleClick = () => {
  console.log("Button clicked!");
};
const billsOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Bills",
    value: "Status.All",
    key: "All Customers",
    empty_msg: "There are no Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057004",
    is_favorite: true,
    title: "Draft Bills",
    value: "Status.Draft",
    key: "Active Customers",
    empty_msg: "There are no active Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Open Bills",
    value: "Status.Open",
    key: "Inactive Customers",
    empty_msg: "There are no inactive Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057006",
    is_favorite: false,
    title: "Void Bills",
    value: "Status.Void",
    key: "Void Bills",
    empty_msg: "There are no Void Bills",
    column_orientation_type: "wrap",
  },
];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    iconPosition: "right",
    border: true,
  },
  {
    text: "Import Bills",
    icon: <Download className="menu-icon" />,
    route: "/import-files",
    query: { type: "bills" },
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Bills",
    icon: <Upload className="menu-icon" />,
    // route: "/import-files",
    // query: { type: "bills" },
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Export Current View",
    icon: <Upload className="menu-icon" />,
    // route: "/Export-files",
    // query: { type: "bills" },
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Import Credit Notes",
    icon: <Download className="menu-icon" />,
    // route: "/import-files",
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    // route: "/import-files",
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    // route: "/import-files",
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const columns = [
  { key: "created_time", label: "DATE" },
  { key: "bill_number", label: "BILL#" },
  { key: "billNumber", label: "REFERENCE NUMBER" },
  { key: "vendor_name", label: "VENDOR NAME" },
  { key: "status_type", label: "STATUS" },
  { key: "due_date", label: "DUE DATE" },
  { key: "total", label: "AMOUNT" },
  { key: "due_amt", label: "BALANCE DUE" },
];

const BillsHomePage = () => {
  const [selectedType, setSelectedType] = useState("All Bills");
  const [billsStatusOptions, setBillsStatusOptions] = useState(billsOptions);
  const [selectedStatus, setSelectedStatus] = useState(billsStatusOptions[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [billsList, setBillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredBillDataDetails, setFilteredBillDataDetails] = useState([]);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [totalRows, setTotalRows] = useState(0);
  const [open, setOpen] = useState(false);

  // Get favorite and default options based on current state
  const favoriteOptions = billsStatusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = billsStatusOptions.filter((opt) => !opt.is_favorite);

  const handleOpenHelp = () => {
    setIsHelpOpen(true);
  };
  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewCustomView = () => {
    setAnchorEl(null);
  };

  const handleSelectStatus = (option) => {
    setSelectedStatus(option);
    setSelectedType(option.title);
    setFilterBy(option.value);
    // Uncomment these lines if you have pagination implemented
    // page.current = 1;
    // limit.current = 10;
    // fetchVendorList(option.value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  // Fixed toggleFavorite function
  const toggleFavorite = (id, event) => {
    if (event) {
      event.stopPropagation();
    }

    // Create a new array with the updated favorite status
    const updatedOptions = billsStatusOptions.map((option) =>
      option.id === id
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );

    // Update the state with the new options array
    setBillsStatusOptions(updatedOptions);

    // If the toggled option is the currently selected one, update the selectedStatus as well
    if (selectedStatus.id === id) {
      const updatedSelectedStatus = updatedOptions.find(
        (option) => option.id === id
      );
      setSelectedStatus(updatedSelectedStatus);
    }

    // Save to localStorage
    try {
      localStorage.setItem(
        "billsStatusOptions",
        JSON.stringify(updatedOptions)
      );
    } catch (error) {
      console.error("Error saving status options to localStorage:", error);
    }
  };

  // Handle menu item click
  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item.text);
    setMenuAnchorEl(null);

    // Handle export modal
    if (item.text === "Export Bills" || item.text === "Export Current View") {
      setOpen(true);
    }

    // Handle routing if applicable
    if (item.route) {
      // Implement routing logic here (e.g., router.push)
      console.log(`Navigating to ${item.route}`);
    }
  };

  // Load saved options from localStorage on component mount
  useEffect(() => {
    try {
      const savedOptions = localStorage.getItem("billsStatusOptions");
      if (savedOptions) {
        const parsedOptions = JSON.parse(savedOptions);
        setBillsStatusOptions(parsedOptions);

        // Update selected status to maintain consistency with saved options
        const currentSelectedId = selectedStatus.id;
        const updatedSelected = parsedOptions.find(
          (opt) => opt.id === currentSelectedId
        );
        if (updatedSelected) {
          setSelectedStatus(updatedSelected);
        }
      }
    } catch (error) {
      console.error("Error loading status options from localStorage:", error);
    }
  }, []);

  return (
    <Box>
      {/* Main Content */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "white",
        }}
      >
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Typography
            color="black"
            style={{
              fontWeight: 500,
              fontSize: "22px",
              textTransform: "none",
            }}
          >
            {selectedType}
          </Typography>
          <KeyboardArrowDownIcon />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              width: 250,
              // height: "360px",
              marginLeft: "-10px",
              maxHeight: 500,
              overflowY: "auto",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              mt: 1,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
              "& .MuiList-root": {
                padding: "0px",
              },
            },
          }}
        >
          <Box
            sx={{
              maxHeight: "310px", // Limit scroll height
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
              },
            }}
          >
            {favoriteOptions.length > 0 && (
              <>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "black",
                    px: 2,
                    py: 1,
                  }}
                >
                  FAVORITES
                </Typography>
                <Divider />
                {favoriteOptions.map((option) => (
                  <MenuItem
                    key={option.id}
                    onClick={() => handleSelectStatus(option)}
                    sx={{
                      backgroundColor:
                        selectedStatus.id === option.id
                          ? "#E6F1FF"
                          : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#408dfb", // Hover effect color
                        color: "white",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: selectedStatus.id === option.id ? 600 : 400,
                        color:
                          selectedStatus.id === option.id
                            ? "#4285F4"
                            : "inherit",
                      }}
                    >
                      {option.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => toggleFavorite(option.id, e)}
                      sx={{ padding: 0 }}
                    >
                      <StarIcon
                        sx={{
                          fontSize: 18,
                          color: "orange",
                        }}
                      />
                    </IconButton>
                  </MenuItem>
                ))}
                {favoriteOptions.length > 0 && defaultOptions.length > 0 && (
                  <Divider />
                )}
              </>
            )}

            {defaultOptions.length > 0 && (
              <>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "black",
                    px: 2,
                    py: 1,
                  }}
                >
                  DEFAULT FILTERS
                </Typography>
                <Divider />
                {defaultOptions.map((option) => (
                  <MenuItem
                    key={option.id}
                    onClick={() => handleSelectStatus(option)}
                    sx={{
                      backgroundColor:
                        selectedStatus.id === option.id
                          ? "#E6F1FF"
                          : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#408dfb", // Hover effect color
                        color: "white",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: selectedStatus.id === option.id ? 600 : 400,
                        color:
                          selectedStatus.id === option.id
                            ? "#4285F4"
                            : "inherit",
                      }}
                    >
                      {option.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => toggleFavorite(option.id, e)}
                      sx={{ padding: 0 }}
                    >
                      <StarBorderIcon
                        sx={{
                          fontSize: 18,
                          color: "#888",
                        }}
                      />
                    </IconButton>
                  </MenuItem>
                ))}
              </>
            )}
          </Box>

          {/* New Custom View Fixed at Bottom */}
          <Divider />
          <MenuItem
            onClick={handleNewCustomView}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              position: "sticky",
              bottom: 0,
              backgroundColor: "white", // Ensure it stays on top
              zIndex: 1,
              "&:hover": {
                backgroundColor: "#E6F1FF",
              },
            }}
          >
            <IconButton
              size="small"
              sx={{
                backgroundColor: "#4285F4",
                width: 20,
                height: 20,
                borderRadius: "50%",
                marginRight: 1,
              }}
            >
              <AddIcon
                sx={{
                  fontSize: 14,
                  color: "white",
                }}
              />
            </IconButton>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#4285F4",
              }}
            >
              New Custom View
            </Typography>
          </MenuItem>
        </Menu>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box sx={{ mr: 0.5 }}>
            <Button
              variant="contained"
              
              startIcon={<AddOutlined />}
              onClick={() => {
                // Use router for navigation if available
                if (typeof router !== "undefined") {
                  router.push("/purchase/bills/create");
                } else {
                  // Fallback for when router is not defined
                  window.location.href = "/purchase/bills/create";
                }
              }}
            >
              New
            </Button>
          </Box>

          <IconButton
            className="more-icon"
            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon className="button-more-svg" />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => setMenuAnchorEl(null)}
            PaperProps={{
              sx: {
                width: "200px",
                height: "275px",
                fontSize: "11px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
                mt: 1,
              },
            }}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.text}
                onClick={() => handleMenuItemClick(item)}
                sx={{
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: "5px",
                    "& .menu-icon": {
                      color: "white !important",
                    },
                  },
                  borderBottom: item.border ? "1px solid #ddd" : "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {item.icon}
                    <Typography
                      sx={{
                        ml: item.iconPosition === "right" ? 0 : 2,
                        fontSize: "13px",
                        fontWeight: item.hasArrow ? 500 : 400,
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                  {item.hasArrow && <ChevronRight className="menu-icon" />}
                </Box>
              </MenuItem>
            ))}
          </Menu>
          <ExportModal open={open} moduleName="Bills" onClose={handleClose} />
          <IconButton
            onClick={handleOpenHelp}
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              borderRadius: 1,
              "&:hover": { backgroundColor: "#e68900" },
              height: "35px",
              width: "35px",
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
          <HelpAndSupport open={isHelpOpen} onClose={handleCloseHelp} />
        </Box>
      </Toolbar>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Expense Management Section */}
        <Paper
          elevation={1}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 6,
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto",
            mt: 5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ position: "relative", mb: 2 }}>
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#e0f7e6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  margin: "30px",
                }}
              >
                <PlayCircleIcon sx={{ color: "#00b373", fontSize: "32px" }} />
              </Box>
            </Box>
            <Box sx={{ borderLeft: "2px solid #00b373", pl: 2 }}>
              <Box sx={{ mr: 2 }}>
                <Typography
                  component="div"
                  sx={{ fontSize: "13px", fontWeight: 500, color: "#555" }}
                >
                  <Box
                    component="img"
                    src="https://books.zoho.in/ogp.png"
                    alt="Zoho Books"
                    width={60}
                    height={30}
                    sx={{ verticalAlign: "middle" }}
                  />
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "14px", color: "#555" }}>
                How to record Bills
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* CTA Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Owe money? It&apos;s good to pay bills on time!
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "15px" }}>
            If you&apos;ve purchased something for your business, and you
            don&apos;t have to repay it immediately, then you can record it as a
            bill.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Link href="/purchase/bills/create">
            <Button onClick={handleClick}>CREATE A BILL</Button>
          </Link>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Typography
            sx={{ color: "#4285f4", fontSize: "14px", cursor: "pointer" }}
          >
            Import Bills
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Expense Chart Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 6,
              fontWeight: 500,
            }}
          >
            Life cycle of a Bill
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Image src={BillsWorkflow} alt="Bills Workflow" priority />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Features List */}
        <Box
          sx={{
            mb: 5,
            mt: 10,
            marginLeft: "30%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
            In the Bills module, you can:
          </Typography>
          <Box
            sx={{
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Create bills and record payments
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Apply credits to bills
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Make online payments
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Allocate landed costs
              </Typography>
            </CheckedItem>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BillsHomePage;
