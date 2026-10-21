"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { usePermissions } from "../../../services/PermissionProvider";
import StatusChip from "./StatusChip";
import { CREDIT_KINDS, formatINR, headerCellSx } from "./creditConfig";

const FILTERS = [
  ["all", "All"],
  ["open", "Open"],
  ["draft", "Draft"],
  ["closed", "Closed"],
  ["void", "Void"],
];

export default function CreditList({ kind }) {
  const cfg = CREDIT_KINDS[kind];
  const router = useRouter();
  const perms = usePermissions();
  const { showMessage } = useSnackbar();
  const [orgId, setOrgId] = useState(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const canCreate = perms?.can(cfg.pageKey, "create");

  useEffect(() => {
    setOrgId(localStorage.getItem("organization_id"));
  }, []);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const res = await apiService({
        method: "GET",
        url: cfg.api,
        params: {
          org_id: orgId,
          ...(status !== "all" ? { status } : {}),
          ...(search.trim() ? { search: search.trim() } : {}),
        },
      });
      setCredits(res.data?.data || []);
    } catch (error) {
      showMessage(error?.message || `Couldn't load ${cfg.title.toLowerCase()}`, "error");
    } finally {
      setLoading(false);
    }
  }, [orgId, status, search, cfg]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  return (
    <Box sx={{ bgcolor: "#f6f6fa", minHeight: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#4C526C" }}>
            {cfg.section}
          </Typography>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>{cfg.title}</Typography>
        </Box>
        {canCreate && (
          <Button
            data-rbac-ignore
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push(`${cfg.base}/new`)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            New {cfg.single}
          </Button>
        )}
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontSize: "13px", color: "#6c718a", mb: 2 }}>{cfg.intro}</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 1,
          }}
        >
          <Tabs
            value={status}
            onChange={(_, v) => setStatus(v)}
            sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontSize: "13px" } }}
          >
            {FILTERS.map(([value, label]) => (
              <Tab key={value} value={value} label={label} />
            ))}
          </Tabs>
          <TextField
            size="small"
            placeholder={`Search number, ${cfg.contactLabel.toLowerCase()} or reference`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 280, bgcolor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Date</TableCell>
                <TableCell sx={headerCellSx}>{cfg.single} #</TableCell>
                <TableCell sx={headerCellSx}>{cfg.contactLabel}</TableCell>
                <TableCell sx={headerCellSx}>Reference</TableCell>
                <TableCell sx={headerCellSx}>Status</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Amount
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Balance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : credits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: "14px", mb: canCreate ? 1.5 : 0 }}>
                      {search || status !== "all"
                        ? `No ${cfg.title.toLowerCase()} match.`
                        : `No ${cfg.title.toLowerCase()} yet.`}
                    </Typography>
                    {canCreate && !search && status === "all" && (
                      <Button
                        data-rbac-ignore
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => router.push(`${cfg.base}/new`)}
                        sx={{ textTransform: "none" }}
                      >
                        Create your first {cfg.single.toLowerCase()}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                credits.map((c) => (
                  <TableRow
                    key={c.credit_number}
                    hover
                    onClick={() => router.push(`${cfg.base}/${c.credit_number}`)}
                    sx={{ cursor: "pointer", "& td": { fontSize: "13px" } }}
                  >
                    <TableCell>{dayjs(c.date).format("DD/MM/YYYY")}</TableCell>
                    <TableCell sx={{ color: "primary.main", fontWeight: 500 }}>{c.credit_number}</TableCell>
                    <TableCell>{c.contact_name}</TableCell>
                    <TableCell>{c.reference_number || "—"}</TableCell>
                    <TableCell>
                      <StatusChip status={c.status} />
                    </TableCell>
                    <TableCell align="right">{formatINR(c.total)}</TableCell>
                    <TableCell align="right">{formatINR(c.balance)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
