"use client";
import { useEffect, useState, useRef } from "react";
import {
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchModal from "../../common/searchModal";
import HelpAndSupport from "../../common/helpAndSupport/HelpAndSupport";
import CustomizedTable from "../../common/table";
import { useRouter } from "next/navigation";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";
import VendorHomePage from "../../purchase/vendor/homepage/page";
import Button from "../../common/btn/Button";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import ExportModal from "../../common/export/ExportModal";
import DotLoader from "../../../components/DotLoader";

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

const Vendor = () => {
  const [selectedType, setSelectedType] = useState("All Vendors");
  const [vendorStatusOptions, setVendorStatusOptions] = useState(vendorOptions);
  const [selectedStatus, setSelectedStatus] = useState(vendorStatusOptions[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const page = useRef(1);
  const limit = useRef(10);
  const router = useRouter();
  const allSelected =
    selected.length === vendorList.length && vendorList.length !== 0;
  const someSelected =
    selected.length > 0 && selected.length < vendorList.length;
  const { showMessage } = useSnackbar();
  const [welcomePg, setWelcomePg] = useState(false);
  const favoriteOptions = vendorStatusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = vendorStatusOptions.filter((opt) => !opt.is_favorite);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("contact_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  const handleOpenHelp = () => {
    setIsHelpOpen(true);
  };
  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };
  const handleRowClick = (vendor) => {
    console.log(vendor, "---vendor---");
    router.push(`/purchase/vendor/${vendor.contact_id}`);
  };
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(vendorList.map((row) => row._id));
    }
  };

  const handleSelect = (id, event) => {
    if (event) {
      event.stopPropagation();
    }

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const handleSelectRow = (contact_id) => {
    setSelected((prev) =>
      prev.includes(contact_id)
        ? prev.filter((id) => id !== contact_id)
        : [...prev, contact_id]
    );
  };

  const handleClickCreate = () => {
    router.push("/purchase/vendor/createvendor");
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item.text);
    // Implement specific actions for each menu item
    if (item === "Refresh List") {
      fetchVendorList(filterBy, sortColumn, sortOrder);
    } else if (item === "Export Vendors") {
      setOpen(true);
    }
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectStatus = (status) => {
    // alert(status.title);
    setSelectedStatus(status);
    setSelectedType(status.title);
    setFilterBy(status.value);
    fetchVendorList(status.value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setVendorStatusOptions(
      vendorStatusOptions.map((option) =>
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

  const handleOpenSearchDialog = () => {
    setOpenSearchDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setOpenSearchDialog(false);
  };

  const handleSearch = (searchData) => {
    console.log("Search:", searchData);
    // Implement search functionality here
    handleCloseSearchDialog();
  };

  useEffect(() => {
    fetchVendorList(filterBy, sortColumn, sortOrder);
  }, []);

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    fetchVendorList(filterBy, sortCol, sortOrd);
  };

  const fetchVendorList = async (filter, sort_column, sort_order) => {
    setLoading(true);
    const organization_id = localStorage.getItem("organization_id");
    try {
      const response = await apiService({
        method: "GET",
        params: {
          organization_id: organization_id,
          page: page.current,
          limit: limit.current,
          per_page: rowsPerPage,
          sort_column: sort_column,
          sort_order: sort_order,
          filter: filter,
        },
        url: `api/v1/vendors`,
        file: false,
      });

      if (response.statusCode === 200) {
        setDotsAndSkeleton(dotsAndSkeleton + 1);
        const data = response.data.data;
        if (filter === "Status.All" && (!data || data.length === 0)) {
          setWelcomePg(true);
        } else {
          setWelcomePg(false);
        }
        setVendorList(data || []);
        setFilteredData(data || []);
        setTotalCount(response.data.pagination?.totalCount || 0);
        setHasMore(response.data.pagination?.has_more_page || false);
        setTotalRows(response.data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch vendor list:", error);
      setError(error);
      showMessage("Failed to load vendors. Please try again.", "error");
      setVendorList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchVendorList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchVendorList(filterBy, sortColumn, sortOrder);
  };
  // Skeleton components
  const TableSkeletonRow = ({ columns }) => (
    <tr>
      <td style={{ padding: "16px 8px" }}>
        <Skeleton
          variant="rectangular"
          width={18}
          height={18}
          sx={{ borderRadius: "2px" }}
        />
      </td>
      {columns.map((col, index) => (
        <td key={index} style={{ padding: "16px" }}>
          <Skeleton
            variant="text"
            width={index === 0 ? 140 : 100}
            height={20}
          />
        </td>
      ))}
    </tr>
  );

  const TableSkeleton = ({ columns, rowCount = 10 }) => (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="rectangular"
            width={18}
            height={18}
            sx={{ borderRadius: "2px", mr: 2 }}
          />
          <Skeleton variant="text" width={80} height={24} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="rectangular"
            width={180}
            height={36}
            sx={{ borderRadius: 1, mr: 1 }}
          />
          <Skeleton variant="circular" width={36} height={36} />
        </Box>
      </Box>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ padding: "16px 8px", width: "30px" }}>
              <Skeleton
                variant="rectangular"
                width={18}
                height={18}
                sx={{ borderRadius: "2px" }}
              />
            </th>
            {columns.map((col, index) => (
              <th key={index} style={{ padding: "16px", textAlign: "left" }}>
                <Skeleton variant="text" width={100} height={24} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(rowCount)
            .fill(0)
            .map((_, index) => (
              <TableSkeletonRow key={index} columns={columns} />
            ))}
        </tbody>
      </table>
    </Box>
  );

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
                {" "}
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
                                color:
                                  selectedStatus.id === option.id
                                    ? "menu.text.normal"
                                    : "menu.text.default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1,
                                "&:hover": {
                                  backgroundColor: "primary.main",
                                  "& .MuiTypography-root": {
                                    color: "menu.text.normal",
                                  },
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
                                <StarIcon
                                  fontSize="small"
                                  sx={{ color: "#f3cf00" }}
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
                                color:
                                  selectedStatus.id === option.id
                                    ? "menu.text.normal"
                                    : "menu.text.default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1,
                                "&:hover": {
                                  backgroundColor: "primary.main", // Hover effect color
                                  "& .MuiTypography-root": {
                                    color: "menu.text.normal",
                                  },
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
                        color="primary"
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
                            if (!item.submenu) handleMenuItemClick(item.text);
                          }}
                          sx={{
                            backgroundColor:
                              menuAnchorEl && item.submenu
                                ? "primary.main"
                                : "transparent",
                            color:
                              menuAnchorEl && item.submenu
                                ? "menu.text.normal"
                                : "",
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
                                  ml: "-183px",
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
                                    fetchVendorList(
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
                                      backgroundColor:
                                        "primary.main !important",
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
                                      fetchVendorList(
                                        filterBy,
                                        subItem.key,
                                        newOrder
                                      );
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
                      moduleName="Vendors"
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

            {/* Error message display */}
            {error && (
              <Box sx={{ p: 2, color: "error.main", textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    fetchVendorList(filterBy, sortColumn, sortOrder)
                  }
                >
                  Retry
                </Button>
              </Box>
            )}

            {/* Conditional rendering for welcome page */}
            {welcomePg ? (
              <VendorHomePage />
            ) : loading ? (
              dotsAndSkeleton > 0 && <TableSkeleton columns={columns} />
            ) : (
              <CustomizedTable
                columns={columns}
                staticData={filteredData}
                hasMore={hasMore} // pagination key
                totalCount={totalCount} // pagination key
                selected={selected}
                handleSelectAll={handleSelectAll}
                handleSelectRow={handleSelectRow}
                allSelected={allSelected}
                settingsAnchorEl={settingsAnchorEl}
                handleSettingsClick={handleSettingsClick}
                handleSettingsClose={handleSettingsClose}
                selectedMenuItem={selectedMenuItem}
                onRowClick={handleRowClick}
                setSelectedMenuItem={setSelectedMenuItem}
                handleOpenSearchDialog={handleOpenSearchDialog}
                handleSelect={handleSelect}
                // callBackAPI={fetchVendorList}
                value="vendor"
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

export default Vendor;
