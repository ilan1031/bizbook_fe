"use client";
import { useEffect, useState, useRef } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Grid,
  Skeleton,
  Typography,
  TablePagination,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchModal from "../../common/searchModal";
import CustomizedTable from "../../common/table";
import { useRouter } from "next/navigation";
import config from "../../../services/config";
import apiService from "../../../services/axiosService";
import HelpAndSupport from "../../common/helpAndSupport/HelpAndSupport";
import ExportModal from "../../common/export/ExportModal";
import BillsHomePage from "./homepage/page";
import DotLoader from "../../../components/DotLoader";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";

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
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "date", label: "Date", order: "D" },
      { key: "bill_number", label: "Bill#", order: "D" },
      {
        key: "vendor_name",
        label: "Vendor Name",
        order: "D",
      },
      { key: "total", label: "Amount", order: "D" },
      { key: "due_date", label: "Delivery Date", order: "D" },
      { key: "updatedAt", label: "Last Modified Time", order: "D" },
    ],
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

// TableSkeleton component for loading state
const TableSkeleton = () => {
  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <Box sx={{ display: "flex", mb: 1 }}>
        <Skeleton variant="rectangular" width={28} height={24} sx={{ mr: 1 }} />
        {columns.map((column, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={`${100 / (columns.length + 1)}%`}
            height={40}
            sx={{ mr: 1 }}
          />
        ))}
      </Box>

      {/* Data Rows - Generate 5 skeleton rows */}
      {[...Array(5)].map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: "flex", mb: 1 }}>
          <Skeleton
            variant="rectangular"
            width={28}
            height={24}
            sx={{ mr: 1 }}
          />
          {columns.map((column, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / (columns.length + 1)}%`}
              height={40}
              sx={{ mr: 1 }}
              animation="wave"
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

const BillsList = () => {
  const [selectedType, setSelectedType] = useState("All Bills");
  const [billsStatusOptions, setbillsStatusOptions] = useState(billsOptions);
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
  const [selectedKey, setSelectedKey] = useState("");
  const [welcomePg, setWelcomePg] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("vendor_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

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

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log("page, rowsPerPage", page.current, rowsPerPage);
      // getBills(page.current, rowsPerPage);
    };
    fetchData();
  }, [page, rowsPerPage]);

  const toggleFavorite = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
    const updatedOptions = billsStatusOptions.map((option) =>
      option.id === id
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );
    setbillsStatusOptions(updatedOptions);

    // Save to localStorage
    try {
      localStorage.setItem(
        "billsbillsStatusOptions",
        JSON.stringify(updatedOptions)
      );
    } catch (error) {
      console.error("Error saving status options to localStorage:", error);
    }
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setSelectedType(status.title);
    setFilterBy(status.value);
    getBills(status.value, sortColumn, sortOrder);
    page.current = 1;
    limit.current = 10;
    setAnchorEl(null);
  };
  const allSelected =
    selected.length === billsList.length && billsList.length !== 0;
  const someSelected =
    selected.length > 0 && selected.length < billsList.length;
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(filteredBillDataDetails.map((row) => row._id));
    }
  };

  const handleSelect = (id, event) => {
    if (event) event.stopPropagation();
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const router = useRouter();
  const handleRowClick = (customer) => {
    router.push(`/purchase/bills/${customer.bill_number}`);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewCustomView = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item) => {
    const OrgId = localStorage.getItem("organization_id");
    if (item.route === "/import-files") {
      router.push(`/import-files?type=bills&organization_id=${OrgId}`);
    }
    if (item.text === "Refresh List") {
      getBills(filterBy, sortColumn, sortOrder);
    } else if (item.text === "Export Bills") {
      setOpen(true);
    }
    setMenuAnchorEl(null);
  };

  useEffect(() => {
    getBills(filterBy, sortColumn, sortOrder);
  }, []);

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    getBills(filterBy, sortCol, sortOrd);
  };

  const getBills = async (filter, sort_column, sort_order) => {
    setLoading(true);
    const OrgId = localStorage.getItem("organization_id");
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/bills/get-bills`,
        params: {
          org_id: OrgId,
          page: page.current,
          limit: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          filter: filter,
        },
        customBaseUrl: config.PO_Base_url,
        file: false,
      });
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      const bills = response.data.data;
      if (filter === "Status.All" && (!bills || bills.length === 0)) {
        setWelcomePg(true);
      } else {
        setWelcomePg(false);
      }
      setBillsList(bills);
      setFilteredBillDataDetails(bills);
      setTotalCount(response.data.pagination.totalCount);
      setHasMore(response.data.pagination.hasNextPage);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    getBills(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    getBills(filterBy, sortColumn, sortOrder);
  };
  const handleSettingsClick = (event) =>
    setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);
  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);
  const handleSearch = (searchData) => {
    handleCloseSearchDialog();
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      {loading && dotsAndSkeleton === 0 ? (
        <DotLoader />
      ) : (
        <Grid container>
          <Grid bgcolor="white" item xs={12}>
            {welcomePg ? (
              <></>
            ) : (
              <>
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
                        overflowY: "auto", // Scrollable content
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Smooth shadow
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
                                    ? "primary.main"
                                    : "transparent",
                                color: selectedStatus.id === option.id
                                    ? "menu.text.normal"
                                    : "menu.text.default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1,
                                "&:hover": {
                                  backgroundColor: "primary.main",
                                  "& .MuiTypography-root":{
                                    color: "menu.text.normal",
                                  }
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight:
                                    selectedStatus.id === option.id ? 500 : 400,
                                  color: selectedStatus.id === option.id
                                    ? "menu.text.normal"
                                    : "menu.text.default",
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
                                  fontSize="small" sx={{ color: '#f3cf00' }}
                                />
                              </IconButton>
                            </MenuItem>
                          ))}
                          {favoriteOptions.length > 0 &&
                            defaultOptions.length > 0 && <Divider />}
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
                                    ? "primary.main"
                                    : "transparent",
                                color: selectedStatus.id === option.id
                                    ? "menu.text.normal"
                                    : "menu.text.default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1,
                                "&:hover": {
                                  backgroundColor: "primary.main", // Hover effect color
                                  "& .MuiTypography-root":{
                                    color: "menu.text.normal",
                                  }
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight:
                                    selectedStatus.id === option.id ? 500 : 400,
                                  color:
                                    selectedStatus.id === option.id
                                      ? "menu.text.normal"
                                      : "menu.text.default",
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
                          backgroundColor: "primary.main",
                          width: 15,
                          height: 15,
                          borderRadius: "50%",
                          marginRight: 1,
                        }}
                      >
                        <AddIcon
                          sx={{
                            fontSize: 10,
                            color: "menu.text.normal",
                          }}
                        />
                      </IconButton>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "primary.main",
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
                        onClick={() => router.push("/purchase/bills/create")}
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
                              menuAnchorEl && item.submenu
                                ? "primary.main"
                                : "transparent",
                            color: menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                            borderRadius:
                              menuAnchorEl && item.submenu ? "5px" : "",
                            "& .menu-icon": {
                              color:
                                menuAnchorEl &&
                                item.submenu &&
                                "menu.text.normal !important",
                            },
                            "&:hover": {
                              backgroundColor: "primary.main",
                              color: "menu.text.normal",
                              borderRadius: "5px",
                              "& .menu-icon": {
                                color: "menu.text.normal !important",
                              },
                            },
                            borderBottom: item.border
                              ? "1px solid #ddd"
                              : "none",
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
                            {item.hasArrow && (
                              <ChevronRight className="menu-icon" />
                            )}
                          </Box>
                          {/* Submenu */}
                          {item.submenu && (
                            <Menu
                              anchorEl={submenuAnchorEl}
                              open={Boolean(
                                submenuAnchorEl &&
                                  submenuAnchorEl.textContent.includes(
                                    item.text
                                  )
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
                                  submenuCloseTimeout.current = setTimeout(
                                    () => {
                                      setSubmenuAnchorEl(null);
                                    },
                                    200
                                  );
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
                                    getBills(
                                      filterBy,
                                      subItem.key,
                                      subItem.order
                                    ); // default order
                                  }}
                                  selected={sortColumn === subItem.key}
                                  sx={{
                                    fontSize: "12px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 1,
                                    "&:hover": {
                                      backgroundColor: "primary.main !important",
                                      color: "menu.text.default",
                                      "& .sort-icon": {
                                        color: "menu.text.default",
                                      },
                                    },
                                    backgroundColor:
                                      sortColumn === subItem.key
                                        ? "primary.main !important"
                                        : "transparent",
                                    color:
                                      sortColumn === subItem.key
                                        ? "menu.text.default !important"
                                        : "",
                                    fontWeight:
                                      sortColumn === subItem.key ? 600 : 400,
                                  }}
                                >
                                  <Typography sx={{ fontSize: "12px" }}>
                                    {subItem.label}
                                  </Typography>

                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newOrder =
                                        subItem.order === "D" ? "A" : "D";
                                      subItem.order = newOrder; // mutate local config or handle externally
                                      setSortOrder(newOrder);
                                      setSortColumn(subItem.key);
                                      setSubmenuAnchorEl(null);
                                      setMenuAnchorEl(null);
                                      getBills(filterBy, subItem.key, newOrder);
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
                      moduleName="Bills"
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
                    <HelpAndSupport
                      open={isHelpOpen}
                      onClose={handleCloseHelp}
                    />
                  </Box>
                </Toolbar>
                <Divider />
              </>
            )}

            {/* Error message display
        {error && (
          <Box sx={{ p: 2, color: "error.main", textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => getBills()}
            >
              Retry
            </Button>
          </Box>
        )} */}

            {/* Replace the plain loading text with the TableSkeleton component */}
            {welcomePg ? (
              <BillsHomePage />
            ) : loading ? (
              dotsAndSkeleton > 0 && <TableSkeleton columns={columns} />
            ) : (
              <>
                <CustomizedTable
                  columns={columns}
                  staticData={filteredBillDataDetails}
                  hasMore={hasMore} // pagination key
                  totalCount={totalCount} // pagination key
                  selected={selected}
                  handleSelectAll={handleSelectAll}
                  handleSelectRow={handleSelect}
                  allSelected={allSelected}
                  settingsAnchorEl={settingsAnchorEl}
                  handleSettingsClick={handleSettingsClick}
                  handleSettingsClose={handleSettingsClose}
                  selectedMenuItem={selectedMenuItem}
                  onRowClick={handleRowClick}
                  setSelectedMenuItem={setSelectedMenuItem}
                  handleOpenSearchDialog={handleOpenSearchDialog}
                  value="bill"
                  callBackAPI={handleFetchTable}
                  selectedType={selectedType}
                  someSelected={someSelected}
                  page={page.current}
                  limit={limitSet}
                  limitValue={limit.current}
                  loading={loading}
                  sortColumn={sortColumn} //sortby
                  sortOrder={sortOrder} //sortby
                  handleSort={handleSort} //sortby
                />
              </>
            )}
          </Grid>
          <SearchModal
            open={openSearchDialog}
            onClose={handleCloseSearchDialog}
            onSearch={handleSearch}
          />
        </Grid>
      )}
    </>
  );
};

export default BillsList;
