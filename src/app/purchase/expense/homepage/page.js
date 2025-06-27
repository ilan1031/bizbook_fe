"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  // Button,
  Typography,
  IconButton,
  Paper,
  Divider,
  Container,
  styled,
  Toolbar,
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
import ExpensesWorkflow from "../../../../assets/expenses-workflow.png";
// import Button, {
//   BUTTON_COLORS,
//   BUTTON_ANIMATIONS,
//   BUTTON_HOVER_EFFECTS,
//   BUTTON_VARIANTS,
//   BUTTON_BORDER_STYLES,
// } from "../../../common/btn/page";
import Button from "../../../common/btn/Button";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { AddOutlined, ListAlt } from "@mui/icons-material";
import ExportModal from "../../../common/export/ExportModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpAndSupport from "../../../common/helpAndSupport/HelpAndSupport";

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
const columns = [
  { key: "date_formatted", label: "DATE" },
  { key: "account_name", label: "EXPENSE ACCOUNT" },
  { key: "invoice_number", label: "REFERENCE#" },
  { key: "vendor_name", label: "VENDOR NAME" },
  { key: "paid_through_account_id", label: "PAID THROUGH" },
  { key: "client_name", label: "CUSTOMER NAME" },
  { key: "status_text", label: "STATUS" },
  { key: "amount_formatted", label: "AMOUNT" },
];
const paymentMadeOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Expenses",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no Expense",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Non-Billable Expenses",
    value: "Status.Nonbillable",
    key: "Nonbillable ",
    empty_msg: "There are no Non-Billable",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057004",
    is_favorite: false,
    title: "Unbilled Expenses",
    value: "Status.Unbilled",
    key: "Unbilled",
    empty_msg: "There are no Unbilled",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Invoiced Expenses",
    value: "Status.Invoiced",
    key: "Invoiced ",
    empty_msg: "There are no Invoiced",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Reimbursed Expenses",
    value: "Status.Reimbursed",
    key: "Reimbursed ",
    empty_msg: "There are no Reimbursed",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "With Receipts Expenses",
    value: "Status.Withreceipts",
    key: "Withreceipts ",
    empty_msg: "There are no Reimbursed",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Without Receipts Expenses",
    value: "Status.Withoutreceipts",
    key: "Withoutreceipts ",
    empty_msg: "There are no Reimbursed",
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
  },
  {
    text: "Import Expenses",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Expenses",
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
    border: false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAlt className="menu-icon" />,
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

const ExpenseHome = () => {
  const router = useRouter(); // Initialize the router
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedType, setSelectedType] = useState("All Expenses");
  const [paymentMadeStatusOptions, setpaymentMadeStatusOptions] =
    useState(paymentMadeOptions);
  const [selectedStatus, setSelectedStatus] = useState(
    paymentMadeStatusOptions[0]
  );
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [error, setError] = useState(null);
  const [welcomePg, setWelcomePg] = useState(false);
  const [filteredBillDataDetails, setFilteredBillDataDetails] = useState([]);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [expenseList, setExpenseList] = useState([]);
  // const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);

  const page = useRef(1);
  const limit = useRef(10);

  const favoriteOptions = paymentMadeStatusOptions.filter(
    (opt) => opt.is_favorite
  );
  const defaultOptions = paymentMadeStatusOptions.filter(
    (opt) => !opt.is_favorite
  );
  const handleSettingsClick = (event) =>
    setSettingsAnchorEl(event.currentTarget);

  const handleSettingsClose = () => setSettingsAnchorEl(null);
  const handleOpenHelp = () => {
    setIsHelpOpen(true);
  };
  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSelectStatus = (status) => {
    // alert(status.title);
    setSelectedStatus(status);
    setSelectedType(status.title);
    setFilterBy(status.value);
    getExpense(status.value);
    setAnchorEl(null);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setpaymentMadeStatusOptions(
      paymentMadeStatusOptions.map((option) =>
        option.id === id
          ? { ...option, is_favorite: !option.is_favorite }
          : option
      )
    );
  };
  const handleNewCustomView = () => {
    // Implement new custom view functionality
    console.log("Creating new custom view");
    setAnchorEl(null);
  };
  return (
    <Box>
      {/* Main Content */}

      {/* Expense Management Section */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px",
          position: "sticky",
          top: 0,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            width: "100%",
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
              startIcon={<AddOutlined />}
              onClick={() => router.push("/purchase/expense/newexpense")}
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
                height: "310px",
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
                onClick={() => handleMenuItemClick(item.text)}
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
          <ExportModal open={open} moduleName="Expense" onClose={handleClose} />
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

      <Divider />
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
              How to Record and Manage Expenses
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* CTA Section */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Time To Manage Your Expenses!
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "15px" }}>
          Create and manage expenses that are part of your organization’s
          operating costs.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button variant="contained" sx={{ px: 4 }}>
          RECORD EXPENSE
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
        <Typography
          sx={{ color: "#4285f4", fontSize: "14px", cursor: "pointer" }}
        >
          Import Expenses
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
          Life cycle of an Expense
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Image
            src={ExpensesWorkflow}
            alt="Vendor Credits Workflow"
            priority
          />
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
          In the Expenses module, you can:
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
              Record a single expense or record expenses in bulk.
            </Typography>
          </CheckedItem>

          <CheckedItem>
            <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
            <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
              Set mileage rates and record expenses based on the distance
              travelled.
            </Typography>
          </CheckedItem>

          <CheckedItem>
            <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
            <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
              Convert an expense into an invoice to get it reimbursed.
            </Typography>
          </CheckedItem>
        </Box>
      </Box>
    </Box>
  );
};

export default ExpenseHome;
