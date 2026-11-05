"use client";
import { Box, Typography } from "@mui/material";

// Shown on a view page when the record can't be loaded: an unknown id, a
// deleted record, or one that belongs to another organisation.
export default function NotFoundNotice({ what = "Record", message = "" }: any) {
  return (
    <Box sx={{ p: 4, textAlign: "center" as const }} role="alert">
      <Typography sx={{ fontWeight: 600, mb: 1 }}>{what} not found</Typography>
      <Typography sx={{ fontSize: "14px", color: "#6c718a" }}>
        {message ? `${message.replace(/\.$/, "")}. ` : ""}It may have been deleted, or it belongs to an organisation you don&apos;t have access to.
      </Typography>
    </Box>
  );
}
