"use client";

import React, { useState } from "react";
import {
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

/**
 * HelpAndSupport component - A right-side drawer that appears below the app header
 * @param {boolean} open - Controls whether the drawer is open
 * @param {function} onClose - Function to call when drawer should close
 * @param {number} headerHeight - Height of the app header in pixels (default: 55)
 */
const HelpAndSupport = ({ open, onClose, headerHeight = 55 }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Sample FAQ data with answers
  const faqs = [
    {
      id: "panel1",
      question: "When do I need to create a purchase order?",
      answer:
        "You should create a purchase order when you need to formalize an order with a vendor before receiving goods or services. This typically happens when you want to document what you're buying, at what price, and under what terms. It's especially important for larger purchases, recurring orders, or when company policy requires purchase documentation.",
    },
    {
      id: "panel2",
      question: "How do I bill partially from a purchase order?",
      answer:
        "To bill partially from a purchase order, open the purchase order and select 'Create Bill'. In the bill form, you can modify quantities to bill only part of the order. For multiple purchase orders, go to the Bills section, select 'New Bill', and then use the 'Add from Purchase Order' option to select multiple purchase orders to include in a single bill.",
    },
    {
      id: "panel3",
      question: "What does partially billed mean?",
      answer:
        "Partially billed means that a purchase order has been billed for some, but not all, of its items or quantities. This status indicates that the purchase order is still open and awaiting complete billing. You can see this status in the Purchase Orders list, allowing you to track which orders still require additional billing.",
    },
    {
      id: "panel4",
      question:
        "How do I specify the expected delivery date of a purchase order?",
      answer:
        "To specify the expected delivery date, open the purchase order creation form and look for the 'Expected Delivery Date' field. You can either type the date directly or use the calendar picker to select it. This date will be visible to both you and the vendor and can be used for tracking and reporting purposes.",
    },
    {
      id: "panel5",
      question: "How do I assign templates for my purchase orders?",
      answer:
        "To assign templates to purchase orders, first go to Settings > Templates and create your custom purchase order templates. Then, when creating a new purchase order, look for the 'Template' dropdown menu near the top of the form. Select your preferred template from the list. You can also set default templates for all new purchase orders in the Purchase Order Settings section.",
    },
    {
      id: "panel6",
      question:
        "How do I change the billing/shipping address in my purchase orders?",
      answer:
        "To change the billing or shipping address in a purchase order, open the purchase order and locate the 'Billing Address' or 'Shipping Address' sections. Click on the edit (pencil) icon next to the address you want to change. You can either select from saved addresses or enter a new address. Don't forget to save the purchase order after making changes.",
    },
  ];

  // Sample help documents
  const helpDocs = [
    { id: 1, title: "Overview - Purchase Orders" },
    { id: 2, title: "Basic Functions in Purchase Orders" },
    { id: 3, title: "Functions in Purchase Orders" },
  ];

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
        <Box display="flex" alignItems="center">
          <SearchBox>
            <SearchIcon />
          </SearchBox>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DrawerHeader>

      <Box sx={{ p: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <MenuIcon sx={{ mr: 1 }} />
        </Box>
      </Box>

      <Divider />

      <Box sx={{ overflow: "auto", height: "100%" }}>
        <SectionTitle variant="h6">Frequently Asked Questions</SectionTitle>

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

        <SectionTitle variant="h6">Help Documents</SectionTitle>

        <List disablePadding>
          {helpDocs.map((doc) => (
            <React.Fragment key={doc.id}>
              <ListItem
                button
                sx={{
                  padding: "8px 16px",
                  margin: "4px 8px",
                  borderRadius: "4px",
                  "&:hover": {
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    backgroundColor: "rgba(0,0,0,0.01)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <HelpLink>{doc.title}</HelpLink>
              </ListItem>
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ p: 2, textAlign: "left" }}>
          <Typography variant="body2" sx={{ cursor: "pointer", mb: 2 }}>
            Show All
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 4,
              pt: 3,
              boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
              borderTop: "1px solid rgba(0,0,0,0.07)",
              paddingTop: 2,
              px: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">Need Assistance?</Typography>
            </Box>
            <Button variant="outlined" size="small">
              Contact Us
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default HelpAndSupport;
