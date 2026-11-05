"use client";

// The top bar's controls: global search, quick create, notifications,
// settings, the apps grid and the profile menu. Every entry is filtered by
// the user's page permissions (usePermissions), and the backend applies the
// same rules to search results and notifications.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Popover,
  Popper,
  ClickAwayListener,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AppsIcon from "@mui/icons-material/Apps";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import apiService from "../../services/axiosService";
import { usePermissions } from "../../services/PermissionProvider";

const orgId = () => (typeof window !== "undefined" ? localStorage.getItem("organization_id") : null);

// [label, route, page key]. Shown only when the user may create on that page.
export const QUICK_CREATE = [
  {
    group: "Sales",
    items: [
      ["Customer", "/sales/customer/create", "customers"],
      ["Quote", "/sales/quotes/new", "quotes"],
      ["Sales Order", "/sales/salesOrder/new", "salesOrders"],
      ["Delivery Challan", "/sales/deliveryChallan/new", "deliveryChallans"],
      ["Invoice", "/sales/invoices/new", "invoices"],
      ["Recurring Invoice", "/sales/recurringInvoice/new", "recurringInvoices"],
      ["Payment Received", "/sales/paymentsReceived/newPaymentReceived", "paymentsReceived"],
      ["Credit Note", "/sales/creditNotes/new", "creditNotes"],
    ],
  },
  {
    group: "Purchases",
    items: [
      ["Vendor", "/purchase/vendor/createvendor", "vendors"],
      ["Expense", "/purchase/expense/newexpense", "expenses"],
      ["Purchase Order", "/purchase/purchaseorder/create", "purchaseOrders"],
      ["Bill", "/purchase/bills/create", "bills"],
      ["Payment Made", "/purchase/paymentmade/create", "paymentMade"],
      ["Recurring Bill", "/purchase/recurringbills/newRecurringBill", "recurringBills"],
      ["Vendor Credit", "/purchase/vendorcredits/new", "vendorCredits"],
    ],
  },
  {
    group: "General",
    items: [
      ["Item", "/common/newitem", "items"],
      ["Journal Entry", "/accountant/journals?new=1", "journalEntries"],
    ],
  },
];

const iconSx = { color: "menu.text.normal" };

// Small popover wrapper so each control only manages its anchor.
function useAnchor() {
  const [anchor, setAnchor] = useState<any>(null);
  return { anchor, open: (e) => setAnchor(e.currentTarget), close: () => setAnchor(null) };
}

export function RefreshButton(_props?: any) {
  const router = useRouter();
  return (
    <Tooltip title="Refresh">
      <IconButton
        size="small"
        aria-label="Refresh page"
        sx={{ ...iconSx, mr: 3 }}
        onClick={() => {
          router.refresh();
          window.location.reload();
        }}
      >
        <RefreshIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

export function GlobalSearch(_props?: any) {
  const router = useRouter();
  const [boxEl, setBoxEl] = useState<any>(null);
  const inputRef = useRef<any>(null);
  const [q, setQ] = useState<any>("");
  const [results, setResults] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [active, setActive] = useState<number>(0);

  // "/" focuses the search box from anywhere except inside a field.
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (e.key === "/" && !["input", "textarea", "select"].includes(tag) && !e.target?.isContentEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return undefined;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiService({
          method: "GET",
          url: "api/v1/user/search",
          params: { organization_id: orgId(), q: term },
        });
        if (!cancelled) {
          setResults(res.data?.data || []);
          setActive(0);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q]);

  const go = (r) => {
    setOpen(false);
    setQ("");
    setResults([]);
    router.push(r.href);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active]);
    }
  };

  const term = q.trim();
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={setBoxEl} sx={{ position: "relative" as const }}>
        <Box
          sx={{
            display: "flex" as const,
            alignItems: "center" as const,
            backgroundColor: "menu.text.normal",
            borderRadius: "6px",
            px: 1,
            width: 320,
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
          <InputBase
            inputRef={inputRef}
            value={q}
            onChange={(e) => {
              setQ((e.target as any).value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search customers, invoices, bills... ( / )"
            inputProps={{ "aria-label": "Search" }}
            sx={{ color: "menu.text.default", ml: 1, fontSize: 14, flex: 1 }}
          />
          {loading && <CircularProgress size={14} />}
        </Box>
        <Popper open={open && term.length >= 2} anchorEl={boxEl} placement="bottom-start" sx={{ zIndex: 1400 }}>
          <Paper sx={{ mt: 0.5, width: 380, maxHeight: 420, overflowY: "auto" as const, boxShadow: 6 }}>
            {!loading && results.length === 0 ? (
              <Typography sx={{ p: 2, fontSize: 14, color: "text.secondary" }}>
                No matches for &quot;{term}&quot;.
              </Typography>
            ) : (
              <List dense disablePadding>
                {results.map((r, i) => {
                  const header = i === 0 || results[i - 1].group !== r.group;
                  return (
                    <React.Fragment key={`${r.type}-${r.href}`}>
                      {header && <ListSubheader sx={{ lineHeight: "28px", fontSize: 12 }}>{r.group}</ListSubheader>}
                      <ListItemButton selected={i === active} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                        <ListItemText
                          primary={r.title}
                          secondary={r.subtitle || null}
                          primaryTypographyProps={{ fontSize: 14 }}
                          secondaryTypographyProps={{ fontSize: 12 }}
                        />
                      </ListItemButton>
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

export function QuickCreateMenu(_props?: any) {
  const router = useRouter();
  const perms = usePermissions();
  const { anchor, open, close } = useAnchor();
  const groups = useMemo(
    () =>
      QUICK_CREATE.map((g) => ({ ...g, items: g.items.filter(([, , page]) => perms?.can(page, "create")) })).filter(
        (g) => g.items.length
      ),
    [perms]
  );
  if (!groups.length) return null;
  return (
    <>
      <Tooltip title="Quick create">
        <Button
          onClick={open}
          aria-label="Quick create"
          sx={{
            minWidth: 0,
            width: 32,
            height: 32,
            borderRadius: "6px",
            backgroundColor: "primary.main",
            color: "menu.text.normal",
            fontSize: 20,
            mr: 1.5,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          +
        </Button>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ display: "flex" as const, gap: 2, p: 2 }}>
          {groups.map((g) => (
            <Box key={g.group} sx={{ minWidth: 170 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 0.5, textTransform: "uppercase" as const }}>
                {g.group}
              </Typography>
              <List dense disablePadding>
                {g.items.map(([label, href]) => (
                  <ListItemButton
                    key={href}
                    sx={{ borderRadius: 1, py: 0.25 }}
                    onClick={() => {
                      close();
                      router.push(href);
                    }}
                  >
                    <ListItemText primary={`+ ${label}`} primaryTypographyProps={{ fontSize: 14 }} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
}

// Read state is kept per signed-in user and per organisation, so one person's
// "mark all as read" never hides another person's or another business's items.
const readKey = (userId: string, org: string | null) => `bizbooks_read_notifications:${userId}:${org || "none"}`;
const readIds = (key: string | null) => {
  if (!key) return new Set<string>();
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return new Set<string>();
  }
};
// The item's date (when it has one), as a short day, e.g. "5 Nov 2026".
const itemDate = (v: unknown) => {
  const d = v ? new Date(v as string) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
};
const SEVERITY_ICON = {
  error: <ErrorOutlineIcon fontSize="small" color="error" />,
  warning: <WarningAmberIcon fontSize="small" color="warning" />,
  info: <InfoOutlinedIcon fontSize="small" color="info" />,
  success: <CheckCircleOutlineIcon fontSize="small" color="success" />,
};

export function NotificationsMenu(_props?: any) {
  const router = useRouter();
  const { anchor, open, close } = useAnchor();
  const perms = usePermissions();
  const scope = perms?.me?.id && orgId() ? readKey(perms.me.id, orgId()) : null;
  const [items, setItems] = useState<any>([]);
  const [read, setRead] = useState(() => new Set<string>());
  const [loading, setLoading] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiService({ method: "GET", url: "api/v1/user/notifications", params: { organization_id: orgId() } });
      // apiService resolves error responses too (no validateStatus), so a 4xx/5xx
      // must be turned into a failed load here, not an empty list.
      if (res.statusCode < 200 || res.statusCode >= 300) throw new Error(`notifications ${res.statusCode}`);
      setItems(res.data?.data || []);
      setFailed(false);
    } catch {
      // Keep what was loaded before, and say the load failed: never "all caught up".
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and every 5 minutes, so the badge stays current.
  useEffect(() => {
    load();
    const timer = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Read state for this user and organisation. Browser-only, so it is read
  // after the first render, and again when the user or organisation is known.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRead(readIds(scope));
  }, [scope]);

  const markRead = (ids: string[]) => {
    const next = new Set([...read, ...ids]);
    // Keep only ids that still exist so the list doesn't grow forever.
    const keep = [...next].filter((id) => items.some((n) => n.id === id));
    setRead(new Set(keep));
    if (!scope) return;
    try {
      localStorage.setItem(scope, JSON.stringify(keep));
    } catch {
      // Storage blocked or full: the read marks last for this page view only.
    }
  };

  const unread = items.filter((n) => !read.has(n.id)).length;
  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          size="small"
          aria-label="Notifications"
          sx={iconSx}
          onClick={(e) => {
            open(e);
            load();
          }}
        >
          <Badge badgeContent={unread} color="error" max={9}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: 360 }}>
          <Box sx={{ display: "flex" as const, alignItems: "center" as const, justifyContent: "space-between" as const, px: 2, py: 1.25 }}>
            <Typography fontWeight={600}>Notifications</Typography>
            {unread > 0 && (
              <Button size="small" sx={{ textTransform: "none" as const }} onClick={() => markRead(items.map((n) => n.id))}>
                Mark all as read
              </Button>
            )}
          </Box>
          <Divider />
          {loading && !items.length ? (
            <Box sx={{ p: 3, textAlign: "center" as const }}>
              <CircularProgress size={20} />
            </Box>
          ) : failed && items.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" as const }}>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Couldn&apos;t load notifications.</Typography>
              <Button size="small" startIcon={<RefreshIcon />} sx={{ mt: 1, textTransform: "none" as const }} onClick={load}>
                Try again
              </Button>
            </Box>
          ) : items.length === 0 ? (
            <Typography sx={{ p: 3, fontSize: 14, color: "text.secondary", textAlign: "center" as const }}>
              You&apos;re all caught up.
            </Typography>
          ) : (
            <>
              {failed && (
                <Box sx={{ display: "flex" as const, alignItems: "center" as const, justifyContent: "space-between" as const, px: 2, py: 0.5 }}>
                  <Typography sx={{ fontSize: 12, color: "error.main" }}>Couldn&apos;t refresh notifications.</Typography>
                  <Button size="small" sx={{ textTransform: "none" as const }} onClick={load}>
                    Try again
                  </Button>
                </Box>
              )}
              <List dense disablePadding sx={{ maxHeight: 400, overflowY: "auto" as const }}>
                {items.map((n) => (
                  <ListItemButton
                    key={n.id}
                    alignItems="flex-start"
                    sx={{ gap: 1.5, bgcolor: read.has(n.id) ? "transparent" : "action.hover" }}
                    onClick={() => {
                      markRead([n.id]);
                      close();
                      if (n.href) router.push(n.href);
                    }}
                  >
                    <Box sx={{ pt: 0.5 }}>{SEVERITY_ICON[n.severity] || SEVERITY_ICON.info}</Box>
                    <ListItemText
                      primary={n.title}
                      secondary={
                        <>
                          {n.detail}
                          {itemDate(n.date) && (
                            <Box component="span" sx={{ display: "block" as const, mt: 0.25, color: "text.disabled" }}>
                              {itemDate(n.date)}
                            </Box>
                          )}
                        </>
                      }
                      primaryTypographyProps={{ fontSize: 14, fontWeight: read.has(n.id) ? 400 : 600 }}
                      secondaryTypographyProps={{ fontSize: 12 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}
        </Box>
      </Popover>
    </>
  );
}

export function SettingsMenu(_props?: any) {
  const router = useRouter();
  const perms = usePermissions();
  const { anchor, open, close } = useAnchor();
  const entries = [
    ["My profile", "/profile"],
    ["Organizations", "/organization-list"],
    ["Users & Access", "/admin/users"],
    ["Users & Roles", "/settings/users"],
    ["Chart of Accounts", "/accountant/chartOfAccounts"],
    ["Invoice & Quote Templates", "/settings/templates"],
    ["Import data", "/import"],
  ].filter(([, href]) => perms?.canAccessPath(href));
  return (
    <>
      <Tooltip title="Settings">
        <IconButton size="small" aria-label="Settings" sx={iconSx} onClick={open}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <List dense sx={{ minWidth: 200 }}>
          <ListSubheader sx={{ lineHeight: "28px" }}>Settings</ListSubheader>
          {entries.map(([label, href]) => (
            <ListItemButton
              key={href}
              onClick={() => {
                close();
                router.push(href);
              }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}

// Pages whose first catalog route isn't a screen of its own.
const LANDING = { items: "/items/itemtable" };

// Every page the user may open, grouped like the permission matrix.
export function AppsMenu(_props?: any) {
  const router = useRouter();
  const perms = usePermissions();
  const { anchor, open, close } = useAnchor();
  const groups = useMemo(() => {
    const out: Record<string, any[]> = {};
    for (const page of perms?.me?.catalog || []) {
      if (page.apiOnly || !page.routes?.length || !perms.can(page.key, "view")) continue;
      (out[page.group] = out[page.group] || []).push(page);
    }
    return Object.entries(out);
  }, [perms]);
  return (
    <>
      <Tooltip title="All apps">
        <IconButton size="small" aria-label="All apps" sx={iconSx} onClick={open}>
          <AppsIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {groups.length === 0 ? (
          <Typography sx={{ p: 3, fontSize: 14, color: "text.secondary" }}>
            No pages have been switched on for your account yet.
          </Typography>
        ) : (
          <Box sx={{ display: "grid" as const, gridTemplateColumns: "repeat(3, minmax(160px, 1fr))", gap: 2, p: 2, maxWidth: 620 }}>
            {groups.map(([group, pages]) => (
              <Box key={group}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 0.5, textTransform: "uppercase" as const }}>
                  {group}
                </Typography>
                <List dense disablePadding>
                  {pages.map((p) => (
                    <ListItemButton
                      key={p.key}
                      sx={{ borderRadius: 1, py: 0.25 }}
                      onClick={() => {
                        close();
                        router.push(LANDING[p.key] || p.routes[0]);
                      }}
                    >
                      <ListItemText primary={p.label} primaryTypographyProps={{ fontSize: 14 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}
      </Popover>
    </>
  );
}
