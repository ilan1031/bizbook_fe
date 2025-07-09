"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Edit,
  Plus,
  Trash2,
  Eye,
  Download,
  Upload,
  Settings,
  User,
  Calendar,
  Clock,
} from "lucide-react";

const ItemHistory = ({ itemId, organizationId }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (itemId) {
      fetchHistory();
    }
  }, [itemId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would be replaced with actual API call
      // const response = await apiService({
      //   method: "GET",
      //   url: `/api/v1/items/${itemId}/history`,
      //   params: { organization_id: organizationId },
      // });

      // Mock data for demonstration
      const mockHistory = [
        {
          id: 1,
          action: "created",
          description: "Item created",
          user: "John Doe",
          timestamp: "2024-01-15T10:30:00Z",
          changes: null,
          type: "create",
        },
        {
          id: 2,
          action: "updated",
          description: "Updated item details",
          user: "Jane Smith",
          timestamp: "2024-01-16T14:20:00Z",
          changes: {
            rate: { from: "₹1200", to: "₹1500" },
            description: { from: "Basic description", to: "Updated description" },
          },
          type: "update",
        },
        {
          id: 3,
          action: "stock_adjusted",
          description: "Stock quantity adjusted",
          user: "Mike Johnson",
          timestamp: "2024-01-17T09:15:00Z",
          changes: {
            stock_quantity: { from: "100", to: "95" },
            reason: "Damaged goods",
          },
          type: "stock",
        },
        {
          id: 4,
          action: "viewed",
          description: "Item details viewed",
          user: "Sarah Wilson",
          timestamp: "2024-01-18T16:45:00Z",
          changes: null,
          type: "view",
        },
        {
          id: 5,
          action: "exported",
          description: "Item data exported",
          user: "Admin User",
          timestamp: "2024-01-19T11:30:00Z",
          changes: null,
          type: "export",
        },
        {
          id: 6,
          action: "settings_changed",
          description: "Item settings modified",
          user: "John Doe",
          timestamp: "2024-01-20T13:20:00Z",
          changes: {
            status: { from: "active", to: "inactive" },
            reorder_level: { from: "10", to: "15" },
          },
          type: "settings",
        },
      ];

      setHistory(mockHistory);
    } catch (err) {
      setError("Failed to fetch history");
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case "create":
        return <Plus size={16} />;
      case "update":
        return <Edit size={16} />;
      case "delete":
        return <Trash2 size={16} />;
      case "view":
        return <Eye size={16} />;
      case "export":
        return <Download size={16} />;
      case "import":
        return <Upload size={16} />;
      case "settings":
        return <Settings size={16} />;
      case "stock":
        return <Plus size={16} />;
      default:
        return <Edit size={16} />;
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case "create":
        return "success";
      case "update":
        return "primary";
      case "delete":
        return "error";
      case "view":
        return "info";
      case "export":
        return "warning";
      case "import":
        return "warning";
      case "settings":
        return "secondary";
      case "stock":
        return "info";
      default:
        return "default";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const renderChanges = (changes) => {
    if (!changes) return null;

    return (
      <Box sx={{ mt: 1 }}>
        {Object.entries(changes).map(([field, change]) => (
          <Box key={field} sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
              {field.replace(/_/g, " ").toUpperCase()}:
            </Typography>
            {change.from && change.to ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" color="error">
                  {change.from}
                </Typography>
                <Typography variant="caption">→</Typography>
                <Typography variant="caption" color="success.main">
                  {change.to}
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" color="primary">
                {change}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Activity History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track all changes and activities related to this item
        </Typography>
      </Box>

      {/* History Timeline */}
      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : history.length > 0 ? (
          <Timeline position="left">
            {history.map((item, index) => {
              const { date, time } = formatTimestamp(item.timestamp);
              return (
                <TimelineItem key={item.id}>
                  <TimelineOppositeContent sx={{ m: "auto 0" }} variant="body2" color="text.secondary">
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="caption" display="block">
                        {date}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {time}
                      </Typography>
                    </Box>
                  </TimelineOppositeContent>
                  
                  <TimelineSeparator>
                    <TimelineDot color={getActionColor(item.type)}>
                      {getActionIcon(item.type)}
                    </TimelineDot>
                    {index < history.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                          {item.description}
                        </Typography>
                        <Chip
                          label={item.action.replace(/_/g, " ")}
                          size="small"
                          color={getActionColor(item.type)}
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 20, height: 20, fontSize: "0.75rem" }}>
                          <User size={12} />
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {item.user}
                        </Typography>
                      </Box>
                      
                      {renderChanges(item.changes)}
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Clock size={48} color="#ccc" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No activity history
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No activity has been recorded for this item yet.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Summary Stats */}
      {history.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {history.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Activities
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {history.filter(h => h.type === "update").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updates
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {new Set(history.map(h => h.user)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users Involved
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {formatTimestamp(history[0]?.timestamp).date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Activity
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ItemHistory; 