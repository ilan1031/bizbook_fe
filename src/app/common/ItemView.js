"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import apiService from "../../services/axiosService";

const ItemView = () => {
  const { id } = useParams();  // Make sure this gets the ID from URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const organization_id = localStorage.getItem("organization_id");

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        const res = await apiService({
          method: "GET",
          url: `/api/v1/item/${id}`,
          params: { organization_id },
        });
        setItem(res.data.data);
      } catch (err) {
        console.error("Error loading item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!item) return <Typography>No item found.</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h5">{item.name}</Typography>
      <Typography>Rate: ₹{item.rate}</Typography>
      <Typography>SKU: {item.sku}</Typography>
      <Typography>Description: {item.description}</Typography>
      {/* Add more fields */}
    </Box>
  );
};

export default ItemView;
