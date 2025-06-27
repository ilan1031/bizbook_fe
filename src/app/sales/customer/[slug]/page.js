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
  FormControl,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import SideBarTable from "../../../common/ContactSideTable";
import CustomProfileView from "../../../common/view/view";
import SearchModal from "../../../common/searchModal";
import apiService from "../../../../../src/services/axiosService";
import CustomFilterMenu from "../../../common/customFilterMenu";
import { useRouter } from "next/navigation";
import DotLoader from "../../../../components/DotLoader";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Select } from "antd";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import ExportModal from "../../../common/export/ExportModal";

const dummyFavorites = [
  {
    id: "1",
    isFavorite: true,
    label: "All Customers",
    value: "Status.All",
    key: "All Customers",
    empty_msg: "There are no Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: true,
    label: "Active Customers",
    value: "Status.Active",
    key: "Active Customers",
    empty_msg: "There are no active Customers",
    column_orientation_type: "wrap",
  },
];

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: true,
    label: "All Customers",
    value: "Status.All",
    key: "All Customers",
    empty_msg: "There are no Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: true,
    label: "Active Customers",
    value: "Status.Active",
    key: "Active Customers",
    empty_msg: "There are no active Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Inactive Customers",
    value: "Status.Inactive",
    key: "Inactive Customers",
    empty_msg: "There are no inactive Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Overdue Customers",
    value: "Status.Overdue",
    key: "Overdue Customers",
    empty_msg: "There are no overdue Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Customer Portal Enabled",
    value: "Status.PortalEnabled",
    key: "Customer Portal Enabled",
    empty_msg: "There are no Customer Portal Enabled",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    isFavorite: false,
    label: "Customer Portal Disabled",
    value: "Status.PortalDisabled",
    key: "Customer Portal Disabled",
    empty_msg: "There are no Customer Portal Disabled",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    isFavorite: false,
    label: "Unpaid Customers",
    value: "Invoice.Unpaid",
    key: "Unpaid Customers",
    empty_msg: "There are no Unpaid Customers",
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
      { key: "contact_name", label: "Name", order: "D" },
      { key: "company_name", label: "Company Name", order: "D" },
      { key: "email", label: "Email", order: "D" },
      {
        key: "outstanding_receivable_amount_bcy",
        label: "Receivables (BCY)",
        order: "D",
      },
      {
        key: "unused_credits_receivable_amount_bcy",
        label: "Unused Credits (BCY)",
        order: "D",
      },
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "updatedAt", label: "Last Modified Time", order: "D" },
    ],
  },
  {
    text: "Import Customers",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Customers",
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
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const Customer = () => {
  const [selectedType, setSelectedType] = useState("All Customers");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [customerList, setCustomerList] = useState([]);
  const [uniqueId, setUniqueId] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [totalCount, setTotalCount] = useState(0);
  const page = useRef(1);
  const limit = useRef(10);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const allSelected =
    customerList.length > 0 && selected.length === customerList.length;
  const someSelected = selected.length > 0 && !allSelected;
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("contact_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);



  const handleMenuItemClick = (item) => {
    const OrgId = localStorage.getItem("organization_id");
    if (item.route === "/import-files") {
      router.push(`/import-files?type=customers&organization_id=${OrgId}`);
    }
    if (item.text === "Export Customers") {
      setOpen(true);
    } else if (item === "Refresh List") {
      fetchCustomerList(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowClick = (row) => {
    router.push(`/sales/customer/${row.contact_id}`);
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

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(customerList.map((row) => row._id));
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchCustomerList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchCustomerList(filterBy, sortColumn, sortOrder);
  };

  const handleSelect = (type, value) => {
    setSelectedType(type);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    fetchCustomerList(value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchCustomerList(filterBy, sortColumn, sortOrder);
    const path = window.location.pathname;
    const segments = path.split("/");
    const id = segments[segments.length - 1];
    setUniqueId(id);
    getCustomer(id);
  }, []);

  const getCustomer = (id) => {
    getCustomerData(id);
  };

  const organization_id = localStorage.getItem("organization_id");

  const fetchCustomerList = async (filterValue = "",sort_column,sort_order) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/customers`,
        params: {
          filter_by: filterValue,
          page: page.current,
          per_page: limit.current,
          limit: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          organization_id: organization_id,
        },
        file: false,
      });
      const { data } = response.data;
      setCustomerList(data);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
      setLoading(false);
    }
  };

  const getCustomerData = async (uniqueId) => {
    if (!uniqueId) return;
    try {
      setLoadingView(true);
      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${uniqueId}`,
        params: {
          organization_id: organization_id,
        },
        file: false,
      });
      const { data } = response.data;
      setCustomerData(data);
      setLoadingView(false);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      setLoadingView(false);
    }
  };

  const handleClickCreate = () => {
    router.push("/sales/customer/create");
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
              endIcon={<KeyboardArrowDownIcon color="primary" />}
              color="black"
              style={{
                fontWeight: 600,
                fontSize: "15px",
                textTransform: "none",
              }}
            >
              {selectedType.length > 15
                ? `${selectedType.slice(0, 15)}...`
                : selectedType}
            </Button>
            {/* Custom Filter Menu */}
            <CustomFilterMenu
              anchorEl={anchorEl}
              handleClose={() => setAnchorEl(null)}
              favoritesData={favorites}
              filtersData={filters}
              onSelect={(type, value) => handleSelect(type, value)}
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
                onClick={() => handleClickCreate()}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover":{
                    backgroundColor: "primary.main",
                  }
                }}
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
                                                fetchCustomerList(
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
                                                    ? "menu.text.normal !important"
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
                                                  fetchCustomerList(
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
                moduleName="Customers"
                onClose={handleClose}
              />
            </Box>
          </Toolbar>
          <Divider />
          <SideBarTable
            staticData={customerList}
            selected={selected}
            handleSelectRow={handleSelectRow}
            handleSelectAll={handleSelectAll}
            allSelected={allSelected}
            someSelected={someSelected}
            selectedType={selectedType}
            onRowClick={handleRowClick}
            uniqueId={uniqueId}
            getData={getCustomer}
            loading={loading}
            module="Customer"
            callBackAPI={handleFetchTable} // pagination key
            page={page.current} // pagination key
            limit={limitSet} // pagination key
            limitValue={limit.current} // pagination key
            hasMore={hasMore} // pagination key
            totalCount={totalCount} // pagination key
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {customerData && (
            <CustomProfileView
              details={customerData}
              moduleKey="Customer"
              callViewAPI={getCustomerData}
              uniqueId={uniqueId}
            />
          )}
          {loadingView && <DotLoader />}
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

export default Customer;
