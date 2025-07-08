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
// import AccountsHomePage from "../../purchase/bills/homepage/page";
import DotLoader from "../../../components/DotLoader";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";

const chartOfAccountsOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Accounts",
    value: "All",
    key: "All Accounts",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057004",
    is_favorite: false,
    title: "Active Accounts",
    value: "Active",
    key: "Active Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Inactive Accounts",
    value: "Inactive",
    key: "Inactive Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057006",
    is_favorite: false,
    title: "Asset Accounts",
    value: "other_current_asset",
    key: "Asset Accounts",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    default_customview_id: "2375679000000057007",
    is_favorite: false,
    title: "Liability Accounts",
    value: "other_current_liability",
    key: "Liability Accounts",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    default_customview_id: "2375679000000057008",
    is_favorite: false,
    title: "Equity Accounts",
    value: "equity",
    key: "Equity Accounts",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    default_customview_id: "2375679000000057009",
    is_favorite: false,
    title: "Income Accounts",
    value: "income",
    key: "Income Accounts",
    column_orientation_type: "wrap",
  },
  {
    id: "8",
    default_customview_id: "2375679000000057010",
    is_favorite: false,
    title: "Expense Accounts",
    value: "expense",
    key: "Expense Accounts",
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
      { key: "account_name", label: "Account Name", order: "D" },
      { key: "account_code", label: "Account Code", order: "D" },
      { key: "account_type", label: "Account Type", order: "D" },
    ],
  },
  {
    text: "Import Accounts",
    icon: <Download className="menu-icon" />,
    route: "/import-files",
    query: { type: "chartOfAccounts" },
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Accounts",
    icon: <Upload className="menu-icon" />,
    // route: "/import-files",
    // query: { type: "chartOfAccounts" },
    hasArrow: false,
    primary: false,
    border: true,
  },
];

const columns = [
  { key: "Account Name", label: "ACCOUNT NAME" },
  { key: "Account Code", label: "ACCOUNT CODE" },
  { key: "Account Type", label: "ACCOUNT TYPE" },
  // { key: "parent_account_name", label: "Parent Account Name" },
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

const AccountsList = () => {
  const [selectedType, setSelectedType] = useState("All Accounts");
  const [chartOfAccountsStatusOptions, setchartOfAccountsStatusOptions] =
    useState(chartOfAccountsOptions);
  const [selectedStatus, setSelectedStatus] = useState(
    chartOfAccountsStatusOptions[0]
  ); // Use the constant instead of state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [chartOfAccountsList, setAccountsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredAccountDataDetails, setFilteredAccountDataDetails] = useState(
    []
  );
  const [filterBy, setFilterBy] = useState("All");
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
  const [sortColumn, setSortColumn] = useState("account_id");
  const [sortOrder, setSortOrder] = useState("A");
  let submenuCloseTimeout = useRef(null);

  // Add safety check for undefined/null arrays
  const favoriteOptions = (chartOfAccountsStatusOptions || []).filter(
    (opt) => opt?.is_favorite
  );
  const defaultOptions = (chartOfAccountsStatusOptions || []).filter(
    (opt) => !opt?.is_favorite
  );

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
      // getAccounts(page.current, rowsPerPage);
    };
    fetchData();
  }, [page, rowsPerPage]);

  // Load saved status options from localStorage on component mount

  const toggleFavorite = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
    const updatedOptions = chartOfAccountsStatusOptions.map((option) =>
      option.id === id
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );
    setchartOfAccountsStatusOptions(updatedOptions);

    // Save to localStorage
    try {
      localStorage.setItem(
        "billschartOfAccountsStatusOptions",
        JSON.stringify(updatedOptions)
      );
    } catch (error) {
      console.error("Error saving status options to localStorage:", error);
    }
  };

  const handleSelectStatus = (status) => {
    console.log(status, "-----------status");
    if (!status) return; // Safety check

    setSelectedStatus(status);
    setSelectedType(status.title);
    setFilterBy(status.value);
    getAccounts(status.value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const allSelected =
    selected.length === chartOfAccountsList.length &&
    chartOfAccountsList.length !== 0;
  const someSelected =
    selected.length > 0 && selected.length < chartOfAccountsList.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected((filteredAccountDataDetails || []).map((row) => row._id));
    }
  };

  const handleSelect = (id, event) => {
    if (event) event.stopPropagation();
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const router = useRouter();
  const handleRowClick = (row) => {
    router.push(`/accountant/chartOfAccounts/${row.account_id}`);
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
      router.push(
        `/import-files?type=chartOfAccounts&organization_id=${OrgId}`
      );
    }
    if (item.text === "Refresh List") {
      getAccounts(filterBy, sortColumn, sortOrder);
    } else if (item.text === "Export Accounts") {
      setOpen(true);
    }
    setMenuAnchorEl(null);
  };

  useEffect(() => {
    getAccounts(filterBy, sortColumn, sortOrder);
  }, []);

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    getAccounts(filterBy, sortCol, sortOrd);
  };

  const getAccounts = async (filter, sort_column, sort_order) => {
    setLoading(true);
    const OrgId = localStorage.getItem("organization_id");
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/COA/coa-list-view`,
        params: {
          org_id: OrgId,
          // page: page.current,
          // limit: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          filter: filter,
          status: filter === "Inactive" ? false : true,
        },
        customBaseUrl: config.PO_Base_url,
        file: false,
      });
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      const chartOfAccounts = response.data.data.chart_of_accounts;
      if (
        filter === "Status.All" &&
        (!chartOfAccounts || chartOfAccounts.length === 0)
      ) {
        setWelcomePg(true);
      } else {
        setWelcomePg(false);
      }
      setAccountsList(chartOfAccounts || []);
      setFilteredAccountDataDetails(chartOfAccounts || []);
      setTotalCount(response.data.pagination?.totalCount || 0);
      setHasMore(response.data.pagination?.hasNextPage || false);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    getAccounts(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    getAccounts(filterBy, sortColumn, sortOrder);
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
                        className="button-submit"
                        startIcon={<AddOutlined />}
                        onClick={() =>
                          router.push("/purchase/chartOfAccounts/create")
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
                                    getAccounts(
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
                                      getAccounts(
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
                      moduleName="Accounts"
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
              onClick={() => getAccounts()}
            >
              Retry
            </Button>
          </Box>
        )} */}

            {/* Replace the plain loading text with the TableSkeleton component */}
            {welcomePg ? (
              //   <AccountsHomePage />
              // ) : loading ? (
              dotsAndSkeleton > 0 && <TableSkeleton columns={columns} />
            ) : (
              <>
                <CustomizedTable
                  columns={columns}
                  staticData={filteredAccountDataDetails} // Add fallback to empty array
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
                  value="chart_of_account"
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

export default AccountsList;
