"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter

import {
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
  Container,
  styled,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import DeliveryChallan from "../../../assets/deliverychallan.png";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../../common/btn/Button";

// Custom styled components
const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex" as const,
  justifyContent: "space-between" as const,
  alignItems: "center" as const,
  padding: "16px 24px",
  borderBottom: "1px solid #eaeaea",
  position: "sticky" as const,
  top: 0,
  backgroundColor: "#f8f9fa",
  zIndex: 100,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none" as const,
  borderRadius: "4px",
  padding: "8px 16px",
}));

const OutlinedButton = styled(StyledButton)(({ theme }) => ({
  border: "1px solid #d0d0d0",
  color: "#555",
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const CheckedItem = styled(Box)(({ theme }) => ({
  display: "flex" as const,
  alignItems: "center" as const,
  margin: "16px 0",
}));

const DeliveryChallanPage = (_props?: any) => {
  const router = useRouter(); // Initialize the router

  return (
    <Box>
      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* CTA Section */}
        <Box sx={{ textAlign: "center" as const, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Deliver Goods effectively!
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "15px" }}>
            Create, customize and print professional Delivery Challans
          </Typography>
        </Box>

        <Box sx={{ display: "flex" as const, justifyContent: "center" as const, mb: 3 }}>
          <Button
            variant="contained"
            sx={{ px: 3 }}
            onClick={() => router.push("/sales/deliveryChallan/new")}
          >
            CREATE DELIVERY CHALLAN
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Expense Chart Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              display: "flex" as const,
              justifyContent: "center" as const,
              mb: 6,
              fontWeight: 500,
            }}
          >
            Life cycle of a Delivery Challan
          </Typography>
          <Box
            sx={{
              display: "flex" as const,
              justifyContent: "center" as const,
              mb: 4,
            }}
          >
            <Image
              src={DeliveryChallan}
              alt="Delivery Challan Workflow"
              priority
              width={1400} // Adjust the width
              height={450} // Adjust the height accordingly
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Features List */}
        <Box
          sx={{
            mb: 5,
            textAlign: "center" as const,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
            In the Delivery Challan module, you can:
          </Typography>
          <Box
            sx={{
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" as const }}>
                Create delivery challans to accompany your goods when they are
                in transit.
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" as const }}>
                Convert a delivery challan into an invoice to charge your
                customers.
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" as const }}>
                Mark your delivery challan as returned or record partial
                returns.
              </Typography>
            </CheckedItem>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DeliveryChallanPage;
