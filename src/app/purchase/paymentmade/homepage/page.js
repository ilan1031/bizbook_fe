"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
  Menu,
  MenuItem,
  Container,
  Toolbar,
  styled,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import PaymentMadeWorkflow from "../../../../assets/paymentmade-workflow.png";
import HSBCbank from "../../../../assets/paymentmade/hsbc_bank.png";
import SBIbank from "../../../../assets/paymentmade/sbi-logo.png";
import StandardBank from "../../../../assets/paymentmade/standard_chated_bank.png";
import YesBank from "../../../../assets/paymentmade/yes_bank.png";
import { useRouter } from "next/navigation";
import { ChevronRight, Download, Settings, Upload } from "lucide-react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { AddOutlined, ListAlt } from "@mui/icons-material";
import ExportModal from "../../../common/export/ExportModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpAndSupport from "../../../common/helpAndSupport/HelpAndSupport";
import { RefreshCcw, RotateCcw } from "lucide-react";
import Button from "../../../common/btn/Button";

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

const paymentMadeOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Payments",
    value: "Status.All",
    key: "All Payments",
    empty_msg: "There are no Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057004",
    is_favorite: true,
    title: "Advanced Payments",
    value: "Status.Advanced",
    key: "Advanced",
    empty_msg: "There are no Advanced Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Bill Payments",
    value: "Status.Inactive",
    key: "Inactive",
    empty_msg: "There are no Bill Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Pay Via Check",
    value: "Status.Payviacheck",
    key: "Payviacheck",
    empty_msg: "There are no Bill Payviacheck",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "To Be Printed Checks",
    value: "Status.Printed",
    key: "Printed",
    empty_msg: "There are no Printed Checks",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Uncleared Checks",
    value: "Status.Uncleared",
    key: "Uncleared",
    empty_msg: "There are no Uncleared Checks",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Cleared Checks",
    value: "Status.Cleared",
    key: "Cleared",
    empty_msg: "There are no Cleared Checks",
    column_orientation_type: "wrap",
  },
  {
    id: "8",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Void Checks",
    value: "Status.Void",
    key: "Void",
    empty_msg: "There are no Void Checks",
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
    text: "Import Payments",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Payments",
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
];

const columns = [
  { key: "date_formatted", label: "DATE" },
  { key: "payment_id", label: "PAYMENT#" },
  { key: "reference_number", label: "REFERENCE#" },
  { key: "vendor_name", label: "VENDOR NAME" },
  { key: "bill_numbers", label: "BILL#" },
  { key: "payment_mode", label: "MODE" },
  { key: "amount_formatted", label: "AMOUNT" },
  { key: "paid_through_account_id", label: "Paid Through Account" },
];

const PaymentmadeHomePage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedType, setSelectedType] = useState("All Payments");
  const [paymentMadeStatusOptions, setpaymentMadeStatusOptions] =
    useState(paymentMadeOptions);
  const [selectedStatus, setSelectedStatus] = useState(
    paymentMadeStatusOptions[0]
  );
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [error, setError] = useState(null);
  const [welcomePg, setWelcomePg] = useState(false);
  const [filteredBillDataDetails, setFilteredBillDataDetails] = useState([]);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [totalRows, setTotalRows] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [paymentList, setPurchaseOrderList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const router = useRouter();
  const page = useRef(1);
  const limit = useRef(10);

  const favoriteOptions = paymentMadeStatusOptions.filter(
    (opt) => opt.is_favorite
  );
  const defaultOptions = paymentMadeStatusOptions.filter(
    (opt) => !opt.is_favorite
  );
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

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    getPaymentMade();
  };

  const handleMenuItemClick = (item) => {
    if (item === "Refresh List") {
      getPaymentMade();
    } else if (item === "Export Payments") {
      setOpen(true);
    }
    setMenuAnchorEl(null);
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setSelectedType(status.title);
    setFilterBy(status.value);
    getPaymentMade(status.value);
    page.current = 1;
    limit.current = 10;
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
    setAnchorEl(null);
  };
  return (
    <Box>
      {/* Header - Sticky */}
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
              className="button-submit"
              startIcon={<AddOutlined />}
              onClick={() => router.push("/purchase/paymentmade/create")}
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
                height: "210px",
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
          <ExportModal open={open} moduleName="Payment" onClose={handleClose} />
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

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* CTA Section */}
        <Box sx={{ textAlign: "center", mb: 3, mt: 10 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            You haven’t made any payments yet.
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "15px" }}>
            Receipts of your bill payments will show up here.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 4 }}
            onClick={() => router.push("/purchase/paymentmade/create")}
          >
            GO TO UNPAID BILLS
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Typography
            sx={{ color: "#4285f4", fontSize: "14px", cursor: "pointer" }}
          >
            Import Payments
          </Typography>
        </Box>
        {/* Bank Logos */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 5, mt: 10 }}>
          <Image
            src={StandardBank}
            alt="Standard Chartered"
            width={130}
            height={50}
          />
          <Image src={HSBCbank} alt="HSBC" width={100} height={40} />
          <Image src={YesBank} alt="Yes Bank" width={100} height={40} />
          <Image src={SBIbank} alt="SBI" width={100} height={40} />
        </Box>
        <Box
          sx={{
            alignItems: "center",
            textAlign: "center",
            marginLeft: "10%",
            mb: 10,
            mt: 5,
            display: "flex",
          }}
        >
          <Typography
            sx={{ color: "black", fontSize: "15px", textAlign: "center" }}
          >
            We&apos;ve partnered with the above Bank(s). You can now initiate
            payment directly via Zoho Books.
          </Typography>
          <button
            style={{ border: "NONE", backgroundColor: "", color: "#4285f4" }}
          >
            {" "}
            Set up Now
          </button>
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
            Life cycle of a Vendor Payment
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Image
              src={PaymentMadeWorkflow}
              alt="PaymentMade Workflow"
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
            In the Payments Made module, you can:
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
                Record payments made to vendors
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                View receipts of paid bills
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Record payments manually
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Send payment receipts to your customers
              </Typography>
            </CheckedItem>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentmadeHomePage;
