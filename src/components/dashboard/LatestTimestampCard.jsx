// src/components/dashboard/LatestTimestampCard.jsx
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { format, parseISO } from "date-fns";

const LatestTimestampCard = ({ timestamp, onRefresh, isLoading }) => {
  // Format date and time from timestamp
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "d MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "h:mm a");
    } catch (error) {
      console.error("Error formatting time:", error);
      return dateString;
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Last Update
            </Typography>
            <Typography variant="h6">
              {formatDateTime(timestamp)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTime(timestamp)}
            </Typography>
          </Box>
          <IconButton
            color="primary"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LatestTimestampCard;