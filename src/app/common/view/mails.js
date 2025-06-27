
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider,
  CircularProgress
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import apiService from "../../../services/axiosService";
import config from "../../../../src/services/config";

const Mails = ({details}) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const organizationId = localStorage.getItem("organization_id");

  const vendorId =details.contact_id;
  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/email/po-email/logs?organization_id=${organizationId}&contact_id=${vendorId}&page=1&limit=10`,
          customBaseUrl: config.PO_Base_url,
        });

        if (response.data?.data) {          
          setEmails(response.data.data.logs);
          console.log(response.data);
          
        } else {
          setEmails([]);
        }
      } catch (err) {
        console.error("Error fetching emails:", err);
        setError("Failed to load emails. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);
  
const formatDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const timeString = `${formattedHours}:${minutes} ${ampm}`;
  
  // Format date - in MM/DD/YYYY format
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  
  // Final format: MM/DD/YYYY HH:MM AM/PM
  return `${month}/${day}/${year} ${timeString}`;
};

  return (
    <>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          System Mails
        </Typography>
        <Button
          startIcon={<EmailIcon />}
          endIcon={<ArrowDropDownIcon />}
          size="small"
          sx={{
            fontSize: "13px",
            color: "#3174F1",
            border: "1px solid #E0E0E0",
            p: "4px 10px",
          }}
        >
          Link Email account
        </Button>
      </Box>

      <Box
        sx={{
          border: "1px solid #E0E0E0",
          borderRadius: 1,
          bgcolor: "#FFFFFF",
          minHeight: "220px",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "220px",
            }}
          >
            <CircularProgress size={30} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "220px",
            }}
          >
            <Typography  sx={{ fontSize: "14px" }}>
              There are no Emails
            </Typography>
          </Box>
        ) : emails.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // height: "220px",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <WarningAmberIcon
                color="warning"
                sx={{
                  fontSize: 40,
                  mb: 1,
                  color: "#FFC107",
                }}
              />
              <Typography
                sx={{
                  color: "#757575",
                  fontSize: "14px",
                }}
              >
                No emails sent.
              </Typography>
            </Box>
          </Box>
        ) : (
          <List sx={{ width: "100%", p: 0,overflowY:"scroll",height:"470px"}}>
            {emails.length && emails.map((email, index) => (
              <React.Fragment key={email.id || index}>
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#E3F2FD", color: "#2196F3" }}>
                      {email.to_email ? email.to_email.charAt(0).toUpperCase() : ""}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography component="span" sx={{ fontWeight: 500, fontSize: "13px" }}>
                          To {email.to_email || "bharathi.g.ihub@snsgroups.com"}
                        </Typography>
                        <Typography component="span" sx={{ color: "#757575", fontSize: "12px" }}>
                          {formatDate(email.created_at || email.sent_at)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ fontSize: "13px", display: "block" }}
                        >
                          {email.subject_line || "Contact Email"} 
                          {email.subject ? ` - ${email.subject}` : ""}
                        </Typography>
                        {email.purchase_order && (
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ fontSize: "13px", display: "block" }}
                          >
                            (Purchase Order #: {email.purchase_order})
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < emails.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </>
  );
};

export default Mails;