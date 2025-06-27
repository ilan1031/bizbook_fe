// import React from "react";
// import { Box, Typography, Paper, useTheme } from "@mui/material";
// import Timeline from "@mui/lab/Timeline";
// import TimelineItem from "@mui/lab/TimelineItem";
// import TimelineSeparator from "@mui/lab/TimelineSeparator";
// import TimelineConnector from "@mui/lab/TimelineConnector";
// import TimelineContent from "@mui/lab/TimelineContent";
// import TimelineDot from "@mui/lab/TimelineDot";
// import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
// const RecurringInvoiceTimeline = ({ details }) => {

//   const theme = useTheme();
//   // If details or history are not provided, return an empty div
//   if (!details || !details.comments || details.comments.length === 0) {
//     return <Box></Box>;
//   }
//   return (
//     <Timeline position="right" sx={{ p: 0, m: 0 }}>
//       {details.comments.map((comment, index) => {
//         // Extract date and time from date_formatted
//         const datePart = comment.date_formatted
//           ? comment.date_formatted.split(" ")[0]
//           : "";
//         const timePart =
//           comment.time ||
//           (comment.date_formatted ? comment.date_formatted.split(" ")[1] : "");
//         // Determine the description (use the one from the comment or default to "Bill created.")
//         const description = comment.description || "Invoice created.";
//         // Determine who created the bill
//         let createdBy = "";
//         if (comment.commented_by) {
//           createdBy = comment.commented_by;
//         } else if (comment.commented_by_id) {
//           // If it's an ID like "divya.s.ihub", extract it
//           createdBy = comment.commented_by_id;
//         }
//         const isLast = index === details.comments.length - 1;
//         return (
//           <TimelineItem
//             key={comment.comment_id || index}
//             sx={{ minHeight: "80px" }}
//           >
//             {/* Date and Time on the left */}
//             <TimelineOppositeContent
//               sx={{
//                 flex: 0.2,
//                 py: 4,
//                 px: 0,
//                 textAlign: "right",
//                 paddingRight: 2,
//               }}
//             >
//               <Typography
//                 variant="body2"
//                 fontSize={"12px"}
//                 color="text.secondary"
//               >
//                 {datePart}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 fontSize={"12px"}
//                 color="text.secondary"
//               >
//                 {timePart}
//               </Typography>
//             </TimelineOppositeContent>
//             {/* Timeline separator with dot and connector */}
//             <TimelineSeparator>
//               <TimelineConnector
//                 sx={{
//                   backgroundColor: theme.palette.primary.main,
//                   width: "1px",
//                 }}
//               />
//               <TimelineDot
//                 sx={{
//                   backgroundColor: theme.palette.primary.main,
//                   boxShadow: "none",
//                   borderStyle: "none",
//                   margin: 0,
//                   fontSize: "12px",
//                 }}
//               />
//               <TimelineConnector
//                 sx={{
//                   backgroundColor: theme.palette.primary.main,
//                   width: "1px",
//                 }}
//               />
//             </TimelineSeparator>
//             {/* Content on the right */}
//             <TimelineContent sx={{ py: 1, px: 2 }}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 2,
//                   backgroundColor: "white",
//                   border: "1px solid #F0F0F0",
//                   borderRadius: 1,
//                   width: "70%",
//                 }}
//               >
//                 <Typography
//                   variant="body1"
//                   fontSize={"12px"}
//                   sx={{ fontWeight: 500 }}
//                 >
//                   {description}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   fontSize={"12px"}
//                   color="text.secondary"
//                   sx={{ mt: 0.5 }}
//                 >
//                   by {createdBy}
//                 </Typography>
//               </Paper>
//             </TimelineContent>
//           </TimelineItem>
//         );
//       })}
//     </Timeline>
//   );
// };
// export default RecurringInvoiceTimeline;
import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

const RecurringInvoiceTimeline = ({ details }) => {
  const theme = useTheme();

  if (!details || !Array.isArray(details.history) || details.history.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No history available
        </Typography>
      </Box>
    );
  }

  return (
    <Timeline position="right" sx={{ p: 0, m: 0 }}>
      {details.history.map((entry, index) => {
        const datePart = entry.date_formatted || "";
        const timePart = entry.time || "";

        const description = entry.description || "Status changed.";
        const createdBy = entry.commented_by || entry.commented_by_id || "System";
        const isLast = index === details.history.length - 1;

        return (
          <TimelineItem key={entry.comment_id || `history-${index}`} sx={{ minHeight: "80px" }}>
            {/* Left Side: Date & Time */}
            <TimelineOppositeContent
              sx={{
                flex: 0.2,
                py: 4,
                px: 0,
                textAlign: "right",
                paddingRight: 2,
              }}
            >
              <Typography variant="body2" fontSize={"12px"} color="text.secondary">
                {datePart}
              </Typography>
              <Typography variant="body2" fontSize={"12px"} color="text.secondary">
                {timePart}
              </Typography>
            </TimelineOppositeContent>

            {/* Center Dot & Connector */}
            <TimelineSeparator>
              <TimelineConnector
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  width: "1px",
                }}
              />
              <TimelineDot
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  boxShadow: "none",
                  borderStyle: "none",
                  margin: 0,
                  fontSize: "12px",
                }}
              />
              {!isLast && (
                <TimelineConnector
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    width: "1px",
                  }}
                />
              )}
            </TimelineSeparator>

            {/* Right Side: Description */}
            <TimelineContent sx={{ py: 1, px: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "white",
                  border: "1px solid #F0F0F0",
                  borderRadius: 1,
                  width: "70%",
                }}
              >
                <Typography variant="body1" fontSize={"12px"} sx={{ fontWeight: 500 }}>
                  {description}
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={"12px"}
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  by {createdBy}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default RecurringInvoiceTimeline;