"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "../../../services/PermissionProvider";
import { ListItemButton,
  Drawer,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  InputBase,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Styled components
const DrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  backgroundColor: "#2D3748",
  color: "white",
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: theme.spacing(1),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1),
    width: "100%",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  margin: theme.spacing(2, 0),
  padding: theme.spacing(0, 2),
}));

const HelpLink = styled(Typography)(({ theme }) => ({
  color: "#1976d2",
  "&:hover": {
    textDecoration: "underline",
  },
}));

// Custom styled Accordion
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  "&:hover": {
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    backgroundColor: "rgba(0,0,0,0.01)",
  },
  margin: "4px 8px",
  borderRadius: "4px",
  transition: "all 0.2s ease",
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  minHeight: "48px",
  borderRadius: "4px",
  "&.Mui-expanded": {
    minHeight: "48px",
    backgroundColor: "rgba(25, 118, 210, 0.04)",
  },
  "& .MuiAccordionSummary-content": {
    margin: "8px 0",
    "&.Mui-expanded": {
      margin: "8px 0",
    },
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
  backgroundColor: "#f8f8f8",
  borderBottomLeftRadius: "4px",
  borderBottomRightRadius: "4px",
}));

// Questions people ask about the app. `pages` ties a topic to the screens
// where it matters most; those come first on that screen.
const FAQS = [
  {
    id: "permissions",
    question: "Why can't I see a page or a button?",
    answer:
      "Your administrator decides which pages you can open and whether you can create, edit, delete or convert on each one. Buttons for actions you don't have are hidden. Ask your administrator (Users & Access) to switch a page or action on for you.",
  },
  {
    id: "convert",
    pages: ["/sales/quotes", "/sales/salesOrder", "/sales/deliveryChallan"],
    question: "How do I turn a quote into an invoice or sales order?",
    answer:
      "Open the quote and choose Convert to Invoice or Convert to Sales Order. Sales orders and delivery challans convert to invoices the same way. You need the Convert permission on that page.",
  },
  {
    id: "gst",
    pages: ["/sales/quotes", "/sales/salesOrder", "/sales/invoices"],
    question: "How is GST worked out on a document?",
    answer:
      "Pick a GST rate on each line. When the place of supply is your own state, the tax is split into CGST and SGST; for another state it's IGST. The totals and the posting to the output tax accounts follow automatically.",
  },
  {
    id: "draft",
    pages: ["/sales/invoices", "/purchase/bills"],
    question: "Why doesn't my invoice or bill show in the reports?",
    answer:
      "Drafts and void documents aren't posted to the books. Mark an invoice as sent (or a bill as open) and it appears in Profit and Loss, the Balance Sheet and the Journal Report.",
  },
  {
    id: "payments",
    pages: ["/sales/paymentsReceived", "/purchase/paymentmade", "/sales/invoices", "/purchase/bills"],
    question: "How do I record a payment against an invoice or bill?",
    answer:
      "Use Payments Received (for customers) or Payments Made (for vendors), choose the contact and enter the amount against each open document. Any amount left over is kept as an advance.",
  },
  {
    id: "credits",
    pages: ["/sales/creditNotes", "/purchase/vendorcredits"],
    question: "How do credit notes and vendor credits work?",
    answer:
      "Create a credit note for goods returned by a customer (or a vendor credit for goods you returned). Open it to apply the balance to open invoices or bills, or record a refund. Unapplied credit shows in your notifications.",
  },
  {
    id: "recurring",
    pages: ["/sales/recurringInvoice", "/purchase/recurringbills", "/purchase/recurringexpenses"],
    question: "How do recurring invoices, bills and expenses work?",
    answer:
      "Set a start date and how often it repeats. Each time it's due a new document is created from the profile. Stop or resume the profile from its page.",
  },
  {
    id: "import",
    pages: ["/import", "/import-files"],
    question: "Can I import my existing data?",
    answer:
      "Yes. Go to Import Data, upload a CSV or Excel file, map its columns to the fields here and confirm. You need the Import Data page switched on.",
  },
  {
    id: "search",
    question: "How do I find a customer or document quickly?",
    answer:
      "Press / anywhere (outside a text field) to jump to the search box at the top. It looks through customers, vendors, items and every document type you can open.",
  },
  {
    id: "orgs",
    question: "How do I switch organisations?",
    answer:
      "Click the organisation name at the top right and choose another one. Each organisation keeps its own books.",
  },
  {
    id: "password",
    question: "How do I change my password or check my devices?",
    answer:
      "Open your profile from the avatar menu (My profile). You can change your password there and see the IP addresses approved for your account.",
  },
];

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

/**
 * HelpAndSupport component - A right-side drawer that appears below the app header
 * @param {boolean} open - Controls whether the drawer is open
 * @param {function} onClose - Function to call when drawer should close
 * @param {number} headerHeight - Height of the app header in pixels (default: 55)
 */
const HelpAndSupport = ({ open, onClose, headerHeight = 55 }) => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname() || "";
  const router = useRouter();
  const perms = usePermissions();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = FAQS.filter((f) => !q || `${f.question} ${f.answer}`.toLowerCase().includes(q));
    const here = (f) => (f.pages || []).some((p) => pathname.startsWith(p));
    return [...matches.filter(here), ...matches.filter((f) => !here(f))];
  }, [query, pathname]);

  const canAsk = perms?.canAccessPath("/bot");

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          width: 400,
          maxWidth: "100%",
          top: `${headerHeight}px`,
          height: `calc(100% - ${headerHeight}px)`,
        },
      }}
    >
      <DrawerHeader>
        <Typography variant="h6">Instant Helper</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DrawerHeader>

      <Box sx={{ p: 1.5 }}>
        <SearchBox sx={{ border: "1px solid #e0e0e0", borderRadius: 1, px: 1, ml: 0 }}>
          <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
          <StyledInputBase
            placeholder="Search help"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            inputProps={{ "aria-label": "Search help" }}
            sx={{ flex: 1 }}
          />
        </SearchBox>
      </Box>

      <Divider />

      <Box sx={{ overflow: "auto", height: "100%" }}>
        <SectionTitle variant="h6">Frequently Asked Questions</SectionTitle>

        {faqs.length === 0 && (
          <Typography sx={{ px: 2, color: "text.secondary" }}>Nothing matches &quot;{query}&quot;.</Typography>
        )}
        <div>
          {faqs.map((faq) => (
            <StyledAccordion
              key={faq.id}
              expanded={expanded === faq.id}
              onChange={handleChange(faq.id)}
              disableGutters
            >
              <StyledAccordionSummary
                expandIcon={
                  <KeyboardArrowRightIcon
                    sx={{
                      transform: expanded === faq.id ? "rotate(90deg)" : "none",
                      transition: "transform 0.3s",
                    }}
                  />
                }
                aria-controls={`${faq.id}-content`}
                id={`${faq.id}-header`}
              >
                <Box>
                  <Typography color="textPrimary">{faq.question}</Typography>
                </Box>
              </StyledAccordionSummary>
              <StyledAccordionDetails>
                <Typography>{faq.answer}</Typography>
              </StyledAccordionDetails>
            </StyledAccordion>
          ))}
        </div>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mt: 4,
            borderTop: "1px solid rgba(0,0,0,0.07)",
            p: 2,
          }}
        >
          <Typography variant="body1">Need Assistance?</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {canAsk && (
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  onClose?.();
                  router.push("/bot");
                }}
              >
                Ask the assistant
              </Button>
            )}
            {SUPPORT_EMAIL && (
              <Button variant="outlined" size="small" href={`mailto:${SUPPORT_EMAIL}?subject=BizBooks%20help`}>
                Contact Us
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default HelpAndSupport;

// Mounted once in the layout: opens the drawer when any "?" button
// dispatches the "bizbooks:help" event (see openHelp).
export function HelpHost() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("bizbooks:help", show);
    return () => window.removeEventListener("bizbooks:help", show);
  }, []);
  return <HelpAndSupport open={open} onClose={() => setOpen(false)} />;
}

export const openHelp = () => window.dispatchEvent(new Event("bizbooks:help"));
