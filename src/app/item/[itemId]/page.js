"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Checkbox,
  CircularProgress,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter, useParams } from "next/navigation";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import {
  ChevronRight,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";
import { useSnackbar } from "../../../components/SnackbarProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ITEM_LIST_LIMIT = 50;

const ItemSplitView = () => {
  const { itemId } = useParams();
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(itemId);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [leftMenuAnchor, setLeftMenuAnchor] = useState(null);
  const [rightMenuAnchor, setRightMenuAnchor] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch item list
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const organization_id = localStorage.getItem("organization_id");
        const res = await apiService({
          method: "GET",
          url: `/api/v1/item/getitems?organization_id=${organization_id}&page=1&limit=${ITEM_LIST_LIMIT}`,
        });
        setItems(res.data.data || []);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Fetch selected item details
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    const fetchItem = async () => {
      try {
        const organization_id = localStorage.getItem("organization_id");
        let response = null;
        try {
          response = await apiService({
            method: "GET",
            url: `/api/v1/items/${selectedId}`,
            params: { organization_id },
          });
          console.log("API /api/v1/items/ response:", response);
        } catch (err) {
          console.log("Pattern 1 failed", err);
        }
        if (!response) {
          try {
            response = await apiService({
              method: "GET",
              url: `/api/v1/item/individual`,
              params: { organization_id, item_id: selectedId },
            });
            console.log("API /api/v1/item/individual response:", response);
          } catch (err) {
            console.log("Pattern 2 failed", err);
          }
        }
        if (!response) {
          try {
            response = await apiService({
              method: "GET",
              url: `/api/v1/item/get-individual-item`,
              params: { organization_id, item_id: selectedId },
            });
            console.log("API /api/v1/item/get-individual-item response:", response);
          } catch (err) {
            console.log("Pattern 3 failed", err);
          }
        }
        console.log("Final item API response:", response);
        setItem(response?.data?.data || null);
      } catch (err) {
        console.error("Error fetching item details:", err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [selectedId]);

  // Handle item selection
  const handleSelectItem = (id) => {
    setSelectedId(id);
    router.push(`/item/${id}`);
  };

  // Top left menu
  const handleLeftMenuOpen = (e) => setLeftMenuAnchor(e.currentTarget);
  const handleLeftMenuClose = () => setLeftMenuAnchor(null);

  // Top right menu
  const handleRightMenuOpen = (e) => setRightMenuAnchor(e.currentTarget);
  const handleRightMenuClose = () => setRightMenuAnchor(null);

  // Tab change
  const handleTabChange = (e, v) => setTab(v);

  // Search filter
  const filteredItems = items.filter(
    (item) =>
      item.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // --- Render ---
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fff" }}>
      {/* Left Panel */}
      <Box sx={{ width: 340, borderRight: "1px solid #eee", display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 2, borderBottom: "1px solid #eee" }}>
          <Button
            variant="text"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ fontWeight: 700, fontSize: 18, color: "#222", textTransform: "none", px: 1 }}
          >
            Active Items
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="small" sx={{ mr: 1 }} onClick={() => router.push("/common/newitem")}> <AddIcon /> </IconButton>
          <IconButton size="small" onClick={handleLeftMenuOpen}> <MoreVertIcon /> </IconButton>
          <Menu anchorEl={leftMenuAnchor} open={Boolean(leftMenuAnchor)} onClose={handleLeftMenuClose}>
            <MenuItem disabled>Import Items</MenuItem>
            <MenuItem disabled>Export Items</MenuItem>
            <MenuItem disabled>Preferences</MenuItem>
          </Menu>
        </Box>
      
        {/* Item List */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress size={28} /></Box>
          ) : (
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {filteredItems.map((itm) => (
                  <tr
                    key={itm.item_id || itm._id || itm.id}
                    style={{
                      background: (itm.item_id || itm._id || itm.id) === selectedId ? "#f5f7fa" : "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSelectItem(itm.item_id || itm._id || itm.id)}
                  >
                    <td style={{ width: 36, padding: 0, textAlign: "center" }}>
                      <Checkbox
                        checked={false}
                        sx={{ p: 0.5 }}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-label": "select item" }}
                      />
                    </td>
                    <td style={{ padding: "10px 0 10px 0", fontWeight: 500, fontSize: 15, color: "#222" }}>
                      {itm.item_name || itm.name}
                    </td>
                    <td style={{ padding: "10px 16px 10px 0", textAlign: "right", fontWeight: 500, fontSize: 15, color: "#222" }}>
                      ₹{Number(itm.rate || itm.rate_formatted || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Box>
          )}
        </Box>
      </Box>

      {/* Right Panel */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <Box sx={{ display: "flex", alignItems: "center", px: 4, py: 3, borderBottom: "1px solid #eee" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, flex: 1, color: "#222" }} noWrap>
            {item?.item_name || item?.name || ""}
          </Typography>
          <IconButton onClick={() => router.push(`/item/edit/${selectedId}`)}><EditIcon /></IconButton>
          <IconButton onClick={handleRightMenuOpen}><MoreVertIcon /></IconButton>
          <Menu anchorEl={rightMenuAnchor} open={Boolean(rightMenuAnchor)} onClose={handleRightMenuClose}>
            <MenuItem onClick={() => router.push(`/item/edit/${selectedId}`)}>Edit</MenuItem>
            <MenuItem disabled>Delete</MenuItem>
          </Menu>
          <IconButton onClick={() => router.push("/item")}> <CloseIcon /> </IconButton>
        </Box>
        {/* Tabs */}
        <Box sx={{ px: 4, borderBottom: "1px solid #eee" }}>
          <Tabs value={tab} onChange={handleTabChange} sx={{ minHeight: 44 }} TabIndicatorProps={{ sx: { height: 3, bgcolor: "#222" } }}>
            <Tab label="Overview" sx={{ fontWeight: 500, fontSize: 16, minWidth: 120, color: "#222" }} />
            <Tab label="Transactions" sx={{ fontWeight: 500, fontSize: 16, minWidth: 120, color: "#222" }} />
            <Tab label="History" sx={{ fontWeight: 500, fontSize: 16, minWidth: 120, color: "#222" }} />
          </Tabs>
        </Box>
        {/* Tab Content */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 4, py: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress size={32} /></Box>
          ) : !item ? (
            <Typography color="text.secondary">No item data found.</Typography>
          ) : tab === 0 ? (
            // --- Overview Tab ---
            <Box>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 220, color: 'text.secondary' }}>Item Type</Box>
                  <Box sx={{ fontWeight: 500 }}>{item.type_formatted || item.type || '-'}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 220, color: 'text.secondary' }}>HSN Code</Box>
                  <Box sx={{ fontWeight: 500 }}>{item.hsn_code || item.hsn_or_sac || '-'}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 220, color: 'text.secondary' }}>Created Source</Box>
                  <Box sx={{ fontWeight: 500 }}>{item.created_source || 'User'}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 220, color: 'text.secondary' }}>Tax Preference</Box>
                  <Box sx={{ fontWeight: 500 }}>{item.tax_preference || (item.is_taxable ? 'Taxable' : 'Non-Taxable') || '-'}</Box>
                </Box>
              </Box>
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>Purchase Information</Typography>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 220, color: 'text.secondary' }}>Cost Price</Box>
                  <Box sx={{ fontWeight: 500 }}>₹{Number(item.purchase_rate || item.cost_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 220, color: 'text.secondary' }}>Purchase Account</Box>
                  <Box sx={{ fontWeight: 500 }}>{item.purchase_account_name || item.purchase_account || '-'}</Box>
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>Sales Information</Typography>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 220, color: 'text.secondary' }}>Selling Price</Box>
                  <Box sx={{ fontWeight: 500 }}>₹{Number(item.rate || item.selling_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 220, color: 'text.secondary' }}>Sales Account</Box>
                  <Box sx={{ fontWeight: 500 }}>{item.account_name || item.sales_account || '-'}</Box>
                </Box>
              </Box>
            </Box>
          ) : tab === 1 ? (
            // --- Transactions Tab ---
            <ItemTransactions itemId={selectedId} />
          ) : (
            // --- History Tab ---
            <ItemHistory itemId={selectedId} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

// --- Replace ItemTransactions and ItemHistory with dynamic implementations ---
const TRANSACTION_TYPES = [
  { label: 'Quotes', value: 'quotes' },
  { label: 'Sales Orders', value: 'sales_orders' },
  { label: 'Invoices', value: 'invoices' },
  { label: 'Delivery Challans', value: 'delivery_challans' },
  { label: 'Credit Notes', value: 'credit_notes' },
  { label: 'Recurring Invoices', value: 'recurring_invoices' },
  { label: 'Purchase Orders', value: 'purchase_orders' },
  { label: 'Bills', value: 'bills' },
  { label: 'Vendor Credits', value: 'vendor_credits' },
];
const STATUS_TYPES = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
  { label: 'Draft', value: 'draft' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
];

function ItemTransactions({ itemId }) {
  const [type, setType] = useState(TRANSACTION_TYPES[0].value);
  const [status, setStatus] = useState(STATUS_TYPES[0].value);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const organization_id = localStorage.getItem('organization_id');
        // Example endpoint, adjust as needed
        const res = await apiService({
          method: 'GET',
          url: `/api/v1/items/${itemId}/transactions`,
          params: { organization_id, type, status },
        });
        setData(res.data.data || []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemId, type, status]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          size="small"
          sx={{ mr: 2, textTransform: 'none', fontWeight: 500 }}
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          Filter By: {TRANSACTION_TYPES.find(t => t.value === type)?.label}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {TRANSACTION_TYPES.map(t => (
            <MenuItem key={t.value} selected={t.value === type} onClick={() => { setType(t.value); setAnchorEl(null); }}>{t.label}</MenuItem>
          ))}
        </Menu>
        <Button
          variant="outlined"
          size="small"
          sx={{ textTransform: 'none', fontWeight: 500 }}
          onClick={() => setStatus(status === 'all' ? 'open' : 'all')}
        >
          Status: {STATUS_TYPES.find(s => s.value === status)?.label}
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={28} /></Box>
      ) : data.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 6, textAlign: 'center' }}>
          There are no {TRANSACTION_TYPES.find(t => t.value === type)?.label.toLowerCase()}
        </Typography>
      ) : (
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', color: '#888', fontWeight: 500, padding: '8px 0' }}>Date</th>
              <th style={{ textAlign: 'left', color: '#888', fontWeight: 500, padding: '8px 0' }}>Reference</th>
              <th style={{ textAlign: 'left', color: '#888', fontWeight: 500, padding: '8px 0' }}>Amount</th>
              <th style={{ textAlign: 'left', color: '#888', fontWeight: 500, padding: '8px 0' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id}>
                <td style={{ padding: '8px 0' }}>{row.date || '-'}</td>
                <td style={{ padding: '8px 0' }}>{row.reference || '-'}</td>
                <td style={{ padding: '8px 0' }}>₹{Number(row.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px 0' }}>{row.status || '-'}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      )}
    </Box>
  );
}

function ItemHistory({ itemId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const organization_id = localStorage.getItem('organization_id');
        // Example endpoint, adjust as needed
        const res = await apiService({
          method: 'GET',
          url: `/api/v1/items/${itemId}/history`,
          params: { organization_id },
        });
        setData(res.data.data || []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemId]);
  return (
    <Box>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 2 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', color: '#888', fontWeight: 500, padding: '8px 0' }}>DATE</th>
            <th style={{ textAlign: 'left', color: '#888', fontWeight: 500, padding: '8px 0' }}>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={2}><Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress size={24} /></Box></td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={2}><Typography color="text.secondary" sx={{ mt: 6, textAlign: 'center' }}>No activity history</Typography></td></tr>
          ) : (
            data.map(row => (
              <tr key={row.id}>
                <td style={{ padding: '8px 0' }}>{row.date || row.timestamp || '-'}</td>
                <td style={{ padding: '8px 0' }}>{row.details || row.description || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </Box>
    </Box>
  );
}

export default ItemSplitView;
