"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  CircularProgress,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  ListAlt,
} from "@mui/icons-material";
import SalesSideTable from "../../../../../src/app/common/SalesSideTable";
import ViewComponent from "../../../../../src/app/sales/quotes/quoteViewComponent";
import CustomFilterMenu from "../../../common/customFilterMenu";
import SearchModal from "../../../common/searchModal";
import { useRouter } from "next/navigation";
import apiService from "../../../../../src/services/axiosService";
import config from "../../../../../src/services/config";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import ExportModal from "../../../common/export/ExportModal";

const dummyFavorites = [];

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Draft",
    value: "Status.Draft",
    key: "Draft",
    empty_msg: "There are no draft items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Pending Approval",
    value: "Status.PendingApproval",
    key: "Pending Approval quotes",
    empty_msg: "There are no pending approval items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Approved",
    value: "Status.Approved",
    key: "Approved quotes",
    empty_msg: "There are no approved items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Sent",
    value: "Status.Sent",
    key: "Sent quotes",
    empty_msg: "There are no sent items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    isFavorite: false,
    label: "Customer Viewed",
    value: "Status.CustomerViewed",
    key: "Customer Viewed quotes",
    empty_msg: "There are no customer viewed items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    isFavorite: false,
    label: "Accepted",
    value: "Status.Accepted",
    key: "Accepted quotes",
    empty_msg: "There are no accepted items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "8",
    isFavorite: false,
    label: "Invoiced",
    value: "Status.Invoiced",
    key: "Invoiced quotes",
    empty_msg: "There are no invoiced items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "9",
    isFavorite: false,
    label: "Declined",
    value: "Status.Declined",
    key: "Declined quotes",
    empty_msg: "There are no declined items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "10",
    isFavorite: false,
    label: "Expired",
    value: "Status.Expired",
    key: "Expired quotes",
    empty_msg: "There are no expired items for this filter",
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
      { key: "date", label: "Date", order: "D" },
      { key: "estimate_number", label: "Quote Number", order: "D" },
      {
        key: "customer_name",
        label: "Customer Name",
        order: "D",
      },
      { key: "total", label: "Amount", order: "D" },
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "updateAt", label: "Last Modified Time", order: "D" },
    ],
  },
  {
    text: "Import Quotes",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Quotes",
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
    icon: <ListAlt className="menu-icon" />,
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
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const Quotes = () => {
  const [selectedType, setSelectedType] = useState("All Quotes");
  const [selectedKey, setSelectedKey] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [organizationData, setOrganizationData] = useState(null);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [quotesList, setQuotesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [loadingView, setLoadingView] = useState(false);
  const [quotesData, setQuotesData] = useState(null);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [totalCount, setTotalCount] = useState(0);
  const page = useRef(1);
  const limit = useRef(10);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  const allSelected =
    quotesList.length > 0 && selected.length === quotesList.length;
  const someSelected = selected.length > 0 && !allSelected;
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  const [open, setOpen] = useState(false);
  const handleMenuItemClick = (item) => {
    console.log("Selected menu item:", item);
    if (item === "Export Quotes") {
      setOpen(true);
    } else if (item === "Refresh List") {
      fetchQuotesList(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRowClick = (row) => {
    router.push(`/sales/quotes/${row.quote_id}`);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(quotesList.map((row) => row._id));
    }
  };

  const handleSelectRow = (id, event) => {
    // Prevent row click event when clicking on the checkbox
    if (event) {
      event.stopPropagation();
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchQuotesList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchQuotesList(filterBy, sortColumn, sortOrder);
  };

  const handleSelect = (type, value, key) => {
    setSelectedType(type);
    setSelectedKey(key);
    fetchQuotesList(value, sortColumn, sortOrder);
    page.current = 1;
    limit.current = 10;
    setFilterBy(value);
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchQuotesList(filterBy, sortColumn, sortOrder);
    const path = window.location.pathname;
    const segments = path.split("/");
    const id = segments[segments.length - 1];
    setUniqueId(id);
    getQuotes(id);
  }, []);

  const getQuotes = (id) => {
    getQuotesData(id);
  };

  const organization_id = localStorage.getItem("organization_id");

  const fetchQuotesList = async (filterValue = "", sort_column, sort_order) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/estimates`,
        params: {
          filter: filterValue,
          page: page.current,
          per_page: limit.current, // Fetch more at once for client-side pagination
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current, // Increased to support client-side pagination
          organization_id: organization_id,
        },
        customBaseUrl: config.SO_Base_url,
      });
      setQuotesList(response.data.estimates);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quotes list:", error);
      setLoading(false);
    }
  };

  const callBackAPI = (id) => {
    getQuotesData(id);
    fetchQuotesList(filterBy, sortColumn, sortOrder);
  };

  const getQuotesData = async (id) => {
    setLoadingView(true);
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/estimates/${id}?organization_id=${organization_id}`,
      });
      setQuotesData(response.data.estimate);
      setOrganizationData(response.data.organization);
      setLoadingView(false);
    } catch (error) {
      console.error("Error fetching quotes data:", error);
      setLoadingView(false);
    }
  };

  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "90vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "340px",
            backgroundColor: "white",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
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
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={
                <KeyboardArrowDownIcon
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
              }
              color="black"
              style={{
                fontWeight: 600,
                fontSize: "15px",
                textTransform: "none",
              }}
            >
              {selectedType.length > 10
                ? `${selectedType.slice(0, 10)}...`
                : selectedType}
            </Button>
            <CustomFilterMenu
              anchorEl={anchorEl}
              handleClose={() => setAnchorEl(null)}
              favoritesData={favorites}
              filtersData={filters}
              onSelect={handleSelect}
              onFavoriteToggle={(filter) => {
                const updatedFilters = filters.map((f) =>
                  f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
                );
                setFilters(updatedFilters);
                const updatedFilter = updatedFilters.find(
                  (f) => f.id === filter.id
                );
                if (updatedFilter.isFavorite) {
                  setFavorites([...favorites, updatedFilter]);
                } else {
                  setFavorites(favorites.filter((f) => f.id !== filter.id));
                }
              }}
              selectedType={selectedType}
            />
            <Box>
              <IconButton
                className="button-icon"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover":{
                    backgroundColor: "primary.main",
                  }
                }}
                onClick={() => router.push("/sales/quotes/new")}
              >
                <AddOutlined className="button-svg" />
              </IconButton>
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
                    width: "190px",
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
                        menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                      borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
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
                            ml: "",
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
                              fetchSalesList(
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
                                fetchSalesList(filterBy, subItem.key, newOrder);
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
                moduleName="Quotes"
                onClose={handleClose}
              />
            </Box>
          </Toolbar>
          <Divider />
          <SalesSideTable
            staticData={quotesList} // Use paginated data instead of full list
            selected={selected}
            handleSelectRow={handleSelectRow}
            handleSelectAll={handleSelectAll}
            allSelected={allSelected}
            someSelected={someSelected}
            selectedType={selectedKey}
            onRowClick={handleRowClick}
            uniqueId={uniqueId}
            getData={getQuotes}
            loading={loading}
            module="quote"
            callBackAPI={handleFetchTable} // pagination key
            page={page.current} // pagination key
            limit={limitSet} // pagination key
            limitValue={limit.current} // pagination key
            hasMore={hasMore} // pagination key
            totalCount={totalCount} // pagination key
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {quotesData && (
            <ViewComponent data={quotesData} callViewAPI={callBackAPI}  organizationData={organizationData}/>
          )}
          {loadingView && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
              <CircularProgress size="30px" />
            </Box>
          )}
        </Box>
      </Box>
      <SearchModal
        open={openSearchDialog}
        onClose={handleCloseSearchDialog}
        onSearch={(searchData) => console.log("Search:", searchData)}
      />
    </Box>
  );
};

export default Quotes;
