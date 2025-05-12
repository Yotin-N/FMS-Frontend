
import { 
    Avatar, 
    Box, 
    Card, 
    CardContent, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Typography 
  } from "@mui/material";
  import WarningIcon from "@mui/icons-material/Warning";
  
  const NotificationsCard = ({ notifications }) => {
    return (
      <Card
        sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <ListItem key={notification.id} sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{ bgcolor: "error.main", width: 32, height: 32 }}
                  >
                    <WarningIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary="2 hours ago"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
  
            {notifications.length === 0 && (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>
    );
  };
  
  export default NotificationsCard;