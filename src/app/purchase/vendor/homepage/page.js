"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
  Container,
  Toolbar,
  styled,
  Menu,
  MenuItem,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import VendorWorkflow from "../../../../assets/vendor-workflow-home.png";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../../../common/btn/Button";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  WidthFull,
} from "@mui/icons-material";
import CustomFilterMenu from "../../../common/customFilterMenu";
import ExportModal from "../../../common/export/ExportModal";
import HelpAndSupport from "../../../common/helpAndSupport/HelpAndSupport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import StarIcon from "@mui/icons-material/Star";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

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

const vendorOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Vendors",
    value: "Status.All",
    key: "All Vendors",
    empty_msg: "There are no Vendors",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057004",
    is_favorite: true,
    title: "Active Vendors",
    value: "Status.Active",
    key: "Active Vendors",
    empty_msg: "There are no active Vendors",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Inactive Vendors",
    value: "Status.InActive",
    key: "InActive Vendors",
    empty_msg: "There are no inactive Vendors",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057006",
    is_favorite: false,
    title: "Duplicate Vendors",
    value: "Status.Overdue",
    key: "Duplicate Vendors",
    empty_msg: "There are no overdue Vendors",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    default_customview_id: "2375679000000057006",
    is_favorite: false,
    title: "Enabled Vendors",
    value: "Status.Enabled",
    key: "Enabled Vendors",
    empty_msg: "There are no Enabled Vendors",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    default_customview_id: "2375679000000057006",
    is_favorite: false,
    title: "Disable Vendors",
    value: "Status.Disable",
    key: "Disable Vendors",
    empty_msg: "There are no Disable Vendors",
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
    submenu: [
      { key: "contact_name", label: "Name", order: "D" },
      { key: "company_name", label: "Company Name", order: "D" },
      { key: "email", label: "Email", order: "D" },
      {
        key: "outstanding_payable_amount_bcy",
        label: "Payables (BCY)",
        order: "D",
      },
      {
        key: "unused_credits_payable_amount_bcy",
        label: "Unused Credits (BCY)",
        order: "D",
      },
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "updatedAt", label: "Last Modified Time", order: "D" },
    ],
  },
  {
    text: "Import Vendors",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Vendors",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Export Current View",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const columns = [
  { key: "contact_name", label: "NAME" },
  { key: "company_name", label: "COMPANY NAME" },
  { key: "email", label: "EMAIL" },
  { key: "phone", label: "PHONE" },
  { key: "outstanding_payable_amount_formatted", label: "RECEIVABLES" },
  {
    key: "unused_credits_payable_amount_formatted",
    label: "RECEIVABLES (BCY)",
  },
];

const VendorHomePage = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All Profiles");
  const [sortColumn, setSortColumn] = useState("contact_name");
  const [sortOrder, setSortOrder] = useState("D");
  const submenuCloseTimeout = useRef(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const page = useRef(1);
  const limit = useRef(10);

  // Filter menu states
  const [selectedType, setSelectedType] = useState("All Vendors");
  const [selectedKey, setSelectedKey] = useState("All Vendors");
  const [vendorStatusOptions, setVendorStatusOptions] = useState(vendorOptions);
  const [selectedStatus, setSelectedStatus] = useState(vendorStatusOptions[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);

  const favoriteOptions = vendorStatusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = vendorStatusOptions.filter((opt) => !opt.is_favorite);

  // Handle filter selection
  const handleSelect = (type, value, key) => {
    setSelectedType(type);
    setSelectedKey(key);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    fetchVendorList(value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleSelectStatus = (option) => {
    setSelectedStatus(option);
    setSelectedType(option.title);
    setFilterBy(option.value);
    page.current = 1;
    limit.current = 10;
    fetchVendorList(option.value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();

    const updatedOptions = vendorStatusOptions.map((option) => {
      if (option.id === id) {
        return { ...option, is_favorite: !option.is_favorite };
      }
      return option;
    });

    setVendorStatusOptions(updatedOptions);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenExport = () => {
    setOpen(true);
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenHelp = () => {
    setIsHelpOpen(true);
  };

  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };

  const handleNewCustomView = () => {
    console.log("Creating new custom view");
    setAnchorEl(null);
  };

  const handleClickCreate = () => {
    router.push("/purchase/vendor/createvendor");
  };

  // Handle menu item clicks
  const handleMenuItemClick = (text) => {
    console.log(`Menu item clicked: ${text}`);

    if (text === "Export Vendors" || text === "Export Current View") {
      handleOpenExport();
    } else if (text === "Import Vendors") {
      console.log("Import Vendors clicked");
      // Add import functionality here
    } else if (text === "Preferences") {
      console.log("Preferences clicked");
      // Add preferences functionality here
    } else if (text === "Refresh List") {
      fetchVendorList(filterBy, sortColumn, sortOrder);
    } else if (text === "Reset Column Width") {
      console.log("Reset Column Width clicked");
      // Add column width reset functionality here
    }

    setMenuAnchorEl(null);
  };

  // Function for fetching vendor list
  const fetchVendorList = (filter, sortCol, sortDirection) => {
    console.log(
      `Fetching vendors with filter: ${filter}, sortColumn: ${sortCol}, sortOrder: ${sortDirection}`
    );
    // In a real app, you would make an API call here
  };

  useEffect(() => {
    // Fetch initial vendor list when component mounts
    fetchVendorList(filterBy, sortColumn, sortOrder);
  }, []);

  return (
    <Box>
      {/* Header - Sticky */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 16px",
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
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
              maxHeight: "310px",
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
                        backgroundColor: "#408dfb",
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
                        backgroundColor: "#408dfb",
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
                      {option.is_favorite ? (
                        <StarIcon
                          sx={{
                            fontSize: 18,
                            color: "#4285F4",
                          }}
                        />
                      ) : (
                        <StarBorderIcon
                          sx={{
                            fontSize: 18,
                            color: "#888",
                          }}
                        />
                      )}
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
              backgroundColor: "white",
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
              size="small"
              startIcon={<AddOutlined />}
              onClick={handleClickCreate}
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
                width: "180px",
                maxHeight: "275px",
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
                onMouseEnter={(e) => {
                  if (item.submenu) {
                    setSubmenuAnchorEl(e.currentTarget);
                  } else {
                    setSubmenuAnchorEl(null);
                  }
                }}
                onMouseLeave={() => {
                  if (item.submenu) {
                    submenuCloseTimeout.current = setTimeout(() => {
                      if (!submenuHover) {
                        setSubmenuAnchorEl(null);
                      }
                    }, 200);
                  }
                }}
                onClick={() => {
                  if (!item.submenu) handleMenuItemClick(item.text);
                }}
                sx={{
                  backgroundColor:
                    submenuAnchorEl &&
                    submenuAnchorEl.textContent.includes(item.text)
                      ? "#408dfb"
                      : "transparent",
                  color:
                    submenuAnchorEl &&
                    submenuAnchorEl.textContent.includes(item.text)
                      ? "white"
                      : "",
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
                {/* Submenu */}
                {item.submenu && (
                  <Menu
                    anchorEl={submenuAnchorEl}
                    open={Boolean(
                      submenuAnchorEl &&
                        submenuAnchorEl.textContent.includes(item.text)
                    )}
                    onClose={() => setSubmenuAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      onMouseEnter: () => {
                        clearTimeout(submenuCloseTimeout.current);
                        setSubmenuHover(true);
                      },
                      onMouseLeave: () => {
                        setSubmenuHover(false);
                        submenuCloseTimeout.current = setTimeout(() => {
                          setSubmenuAnchorEl(null);
                        }, 200);
                      },
                      sx: {
                        width: "180px",
                        fontSize: "12px",
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                        borderRadius: "8px",
                      },
                    }}
                  >
                    {item.submenu.map((subItem) => (
                      <MenuItem
                        key={subItem.key}
                        onClick={() => {
                          setSubmenuAnchorEl(null);
                          setMenuAnchorEl(null);
                          setSortColumn(subItem.key);
                          setSortOrder(subItem.order);
                          fetchVendorList(filterBy, subItem.key, subItem.order);
                        }}
                        selected={sortColumn === subItem.key}
                        sx={{
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                          "&:hover": {
                            backgroundColor: "#408dfb !important",
                            color: "white",
                            "& .sort-icon": {
                              color: "white",
                            },
                          },
                          backgroundColor:
                            sortColumn === subItem.key
                              ? "#408dfb !important"
                              : "transparent",
                          color:
                            sortColumn === subItem.key
                              ? "white !important"
                              : "",
                          fontWeight: sortColumn === subItem.key ? 600 : 400,
                        }}
                      >
                        <Typography sx={{ fontSize: "12px" }}>
                          {subItem.label}
                        </Typography>

                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            const newOrder = subItem.order === "D" ? "A" : "D";
                            subItem.order = newOrder;
                            setSortOrder(newOrder);
                            setSortColumn(subItem.key);
                            setSubmenuAnchorEl(null);
                            setMenuAnchorEl(null);
                            fetchVendorList(filterBy, subItem.key, newOrder);
                          }}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {subItem.order === "D" ? (
                            <ArrowDownward
                              fontSize="inherit"
                              className="sort-icon"
                            />
                          ) : (
                            <ArrowUpward
                              fontSize="inherit"
                              className="sort-icon"
                            />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </MenuItem>
            ))}
          </Menu>
          <ExportModal open={open} moduleName="Vendors" onClose={handleClose} />

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

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* CTA Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Business is no fun without people.
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "15px" }}>
            Create and manage your contacts, all in one place.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            sx={{ px: 3 }}
            onClick={() => router.push("/purchase/vendor/createvendor")}
          >
            CREATE NEW VENDOR
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Typography
            sx={{ color: "#4285f4", fontSize: "14px", cursor: "pointer" }}
            onClick={() => handleMenuItemClick("Import Vendors")}
          >
            Click here to import vendors from file
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
            Types of contacts
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Image src={VendorWorkflow} alt="Expenses Workflow" priority />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default VendorHomePage;
