"use client";

import React, { useState, useRef } from "react";
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
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import RecurringExpensesWorkflow from "../../../../assets/recurringexpense-workflow.png";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../../../common/btn/Button";
import { useRouter } from "next/navigation";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  WidthFull,
} from "@mui/icons-material";
import CustomFilterMenu from "../../../common/customFilterMenu";
import ExportModal from "../../../common/export/ExportModal";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpAndSupport from "../../../common/helpAndSupport/HelpAndSupport";

const StyledHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  borderBottom: "1px solid #eaeaea",
  position: "sticky",
  top: 0,
  backgroundColor: "#f8f9fa",
  zIndex: 100,
});

const StyledButton = styled(Button)({
  textTransform: "none",
  borderRadius: "4px",
  padding: "8px 16px",
});

const OutlinedButton = styled(StyledButton)({
  border: "1px solid #d0d0d0",
  color: "#555",
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const CheckedItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  margin: "16px 0",
});

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: true,
    title: "All",
    value: "Status.All",
    key: "Recurring Expense",
    empty_msg: "There are no Recurring Expense",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    title: "ACTIVE",
    value: "Status.Active",
    key: "Recurring Expense Active",
    empty_msg: "There are no Active Recurring Expense",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    title: "STOPPED",
    value: "Status.Stopped",
    key: "Recurring Expense Stopped",
    empty_msg: "There are no Stopped Recurring Expense",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    title: "EXPIRED",
    value: "Status.Expired",
    key: "Recurring Expense Expired",
    empty_msg: "There are no Expired Recurring Expense",
    column_orientation_type: "wrap",
  },
];

// Updated dummyFavorites as an empty array that will be populated
const dummyFavorites = [
  {
    id: "1",
    isFavorite: true,
    title: "All",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no Recurring Expense",
    column_orientation_type: "wrap",
  },
];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "start_date", label: "Start Date", order: "D" },
      { key: "profile_name", label: "Profile Name", order: "D" },
      { key: "account_name", label: "Expense Account", order: "D" },
      { key: "total", label: "Amount", order: "D" },
    ],
  },
  {
    text: "Import Recurring Expene",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Recurring Expense",
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
  // { text: "Import Debit Notes", icon: <ReceiptIcon className="menu-icon" /> },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAltIcon className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  // { text: "Configure Online Payments", icon: <PaymentIcon className="menu-icon" /> },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const columns = [
  { key: "profile_name", label: "PROFILE NAME" },
  { key: "account_name", label: "EXPENSE ACCOUNT" },
  { key: "vendor_name", label: "VENDOR NAME" },
  { key: "recurrence_frequency_formatted", label: "FREQUENCY" },
  { key: "end_date_formatted", label: "LAST EXPENSE DATE" },
  { key: "status", label: "STATUS" },
  { key: "total_formatted", label: "AMOUNT" },
];

const RecurringExpensesHomePage = () => {
  const [recurringExpenseList, setRecurringExpenseList] = useState([]);
  const [selectedType, setSelectedType] = useState("All Recurring Expense");
  const [selectedKey, setSelectedKey] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState(dummyDefaultFilters);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);
  const router = useRouter();

  // Compute whether all rows are selected
  const allSelected =
    recurringExpenseList.length > 0 &&
    selected.length === recurringExpenseList.length;
  // Compute whether some rows are selected but not all
  const someSelected = selected.length > 0 && !allSelected;

  // Group options by favorite status
  const favoriteOptions = statusOptions.filter((opt) => opt.isFavorite);
  const defaultOptions = statusOptions.filter((opt) => !opt.isFavorite);

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setSelectedType(status.title);
    setFilterBy(status.value);
    getPurchaseOrder(status.value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewCustomView = (event) => {
    event.stopPropagation();
    console.log("Creating new custom view");
    setAnchorEl(null);
    // Implement new custom view functionality here
  };
  const handleOpenHelp = () => {
    setIsHelpOpen(true);
  };

  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleFavorite = (id, event) => {
    if (event) {
      event.stopPropagation();
    }

    const updatedOptions = statusOptions.map((option) =>
      option.id === id ? { ...option, isFavorite: !option.isFavorite } : option
    );
    setStatusOptions(updatedOptions);

    // Save to localStorage
    try {
      localStorage.setItem(
        "dummyDefaultFilters",
        JSON.stringify(updatedOptions)
      );
    } catch (error) {
      console.error("Error saving status options to localStorage:", error);
    }
  };

  return (
    <Box>
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
                      {option.isFavorite ? (
                        <StarIcon
                          sx={{
                            fontSize: 18,
                            color: "orange",
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
              mt: "5px",
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
              className="button-submit"
              startIcon={<AddOutlined />}
              onClick={() =>
                router.push(
                  "/purchase/recurringexpenses/createrecurringexpense"
                )
              }
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
                onMouseEnter={(e) => {
                  if (item.submenu) {
                    setSubmenuAnchorEl(e.currentTarget);
                  } else {
                    setSubmenuAnchorEl(null);
                  }
                }}
                onMouseLeave={(e) => {
                  setSubmenuAnchorEl(null);
                }}
                onClick={() => {
                  if (!item.submenu) handleMenuItemClick(item);
                }}
                sx={{
                  backgroundColor:
                    menuAnchorEl && item.submenu ? "#408dfb" : "transparent",
                  color: menuAnchorEl && item.submenu ? "white" : "",
                  borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
                  "& .menu-icon": {
                    color: menuAnchorEl && item.submenu && "white !important",
                  },
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
                        ml: "-195px",
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
                          fetchVendorList(filterBy, subItem.key, subItem.order); // default order
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
                            subItem.order = newOrder; // mutate local config or handle externally
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
          <ExportModal
            open={open}
            moduleName="Purchase Order"
            onClose={handleClose}
          />
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
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Create. Set. Repeat.
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "15px" }}>
            Create recurring expenses to handle and pay for stuff you spend on
            periodically.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            sx={{ px: 3 }}
            onClick={() =>
              router.push("/purchase/recurringexpenses/createRecurringExpense")
            }
          >
            NEW RECURRING EXPENSE
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Typography
            sx={{ color: "#4285f4", fontSize: "14px", cursor: "pointer" }}
          >
            Import Recurring Expenses
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

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
            Life cycle of a Recurring Expense
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Image
              src={RecurringExpensesWorkflow}
              alt="Expenses Workflow"
              priority
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            mb: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
            In the Recurring Expenses module, you can:
          </Typography>
          <Box sx={{ maxWidth: "600px", margin: "0 auto" }}>
            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Create a recurring profile to routinely auto-generate expenses.
              </Typography>
            </CheckedItem>
            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                View when each expense was auto-generated.
              </Typography>
            </CheckedItem>
            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Create individual expenses within the recurring profile.
              </Typography>
            </CheckedItem>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RecurringExpensesHomePage;
