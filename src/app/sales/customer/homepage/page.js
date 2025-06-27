"use client";
import { useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Typography,
  ButtonGroup,
  Container,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import CustomFilterMenu from "../../../common/customFilterMenu";
import ExportModal from "../../../common/export/ExportModal";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import VendorWorkflow from "../../../../assets/vendor-workflow-home.png";
import Image from "next/image";

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
    route: "/import-files",
    query: { type: "customer" },
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

const CustomerHomePage = () => {
  const [selectedType, setSelectedType] = useState("All Customers");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [filterBy, setFilterBy] = useState("Status.All");
  const router = useRouter();
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [open, setOpen] = useState(false);
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("contact_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  const handleClickCreate = () => {
    router.push("/sales/customer/create");
  };

  const handleSelect = (type, value) => {
    setSelectedType(type);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    setAnchorEl(null);
  };


  const handleMenuItemClick = (item) => {
    const OrgId = localStorage.getItem("organization_id");
    if (item.route === "/import-files") {
      router.push(`/import-files?type=customers&organization_id=${OrgId}`);
    }
    if (item.text === "Export Customers") {
      setOpen(true);
    } 
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
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
        {/* Left Side */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selected.length > 0 && (
            <>
              <ButtonGroup
                variant="contained"
                aria-label="Basic button group"
                className="group-btn"
                sx={{ mr: 1 }}
              >
                <Button className="bulk-update-btn">
                  <MailOutlineIcon className="bulk-update-btn-icon" />
                </Button>
                <Button className="bulk-update-btn">
                  <PrintOutlinedIcon className="bulk-update-btn-icon" />
                </Button>
              </ButtonGroup>
              <Button
                variant="contained"
                className="bulk-update-btn"
                sx={{ mr: 1 }}
              >
                Bulk Update
              </Button>

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
                    fontSize: "12px",
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
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "#408dfb", // Green color for the active dot
                  borderRadius: "50%",
                  ml: 1,
                }}
              />
              <Typography sx={{ ml: 1, fontWeight: 600, fontSize: "16px" }}>
                {selected.length}
              </Typography>
              <Typography sx={{ ml: 1, fontWeight: 500, fontSize: "13px" }}>
                Customer(s) Selected
              </Typography>
            </>
          )}
          {!selected.length > 0 && (
            <>
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
                  fontWeight: 700,
                  fontSize: "large",
                  textTransform: "none",
                }}
              >
                {selectedType}
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
            </>
          )}
        </Box>

        {/* Right Side */}
        {!selected.length > 0 && (
          <Box>
            <Button
              variant="contained"
              className="button-submit"
              startIcon={<AddOutlined />}
              sx={{ mr: 1 }}
              onClick={() => handleClickCreate()}
            >
              New
            </Button>
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
                              const newOrder =
                                subItem.order === "D" ? "A" : "D";
                              subItem.order = newOrder; // mutate local config or handle externally
                              setSortOrder(newOrder);
                              setSortColumn(subItem.key);
                              setSubmenuAnchorEl(null);
                              setMenuAnchorEl(null);
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
            <IconButton
              sx={{
                backgroundColor: "#ff9800",
                color: "white",
                borderRadius: 1,
                "&:hover": { backgroundColor: "#e68900" },
                fontSize: "13px",
                width: "31px",
                fontWeight: 800,
              }}
            >
              ?
            </IconButton>
          </Box>
        )}
      </Toolbar>
      <Divider />
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
            onClick={() => router.push("/sales/customer/create")}
          >
            CREATE NEW CUSTOMER
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Typography
            sx={{ color: "#4285f4", fontSize: "14px", cursor: "pointer" }}
            onClick={() => handleMenuItemClick("Import Vendors")}
          >
            Click here to import customers from file
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

export default CustomerHomePage;
