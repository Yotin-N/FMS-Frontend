// src/components/farm/members/FarmMembersDialog.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
  Chip,
  Alert,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { addFarmMember, removeFarmMember } from "../../../services/api";

const FarmMembersDialog = ({ open, onClose, farmId, farmName }) => {
  const theme = useTheme();

  // States
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Mock data - in a real app, fetch this from the API
  useEffect(() => {
    if (open && farmId) {
      // Simulate loading members
      setIsLoading(true);
      setTimeout(() => {
        setMembers([
          {
            id: "1",
            email: "owner@example.com",
            firstName: "John",
            lastName: "Doe",
            role: "ADMIN",
            isOwner: true,
          },
          {
            id: "2",
            email: "manager@example.com",
            firstName: "Jane",
            lastName: "Smith",
            role: "USER",
            isOwner: false,
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [open, farmId]);

  // Filter members based on search term
  const filteredMembers = members.filter(
    (member) =>
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${member.firstName} ${member.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    // Clear error when typing
    if (emailError) {
      setEmailError("");
    }
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle add member
  const handleAddMember = async () => {
    // Validate email format
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    // Check if member already exists
    if (members.some((member) => member.email === email)) {
      setEmailError("User is already a member of this farm");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use a placeholder userId for this example
      // In a real app, you would need to look up the userId by email first
      const userId = "mock-user-id";

      // In a real app, this would be an actual API call
      // await addFarmMember(farmId, userId);

      // Simulate successful API call
      setTimeout(() => {
        // Add to the local state
        setMembers([
          ...members,
          {
            id: Math.random().toString(36).substring(7),
            email: email,
            firstName: "New",
            lastName: "User",
            role: "USER",
            isOwner: false,
          },
        ]);

        setEmail("");
        setSuccess("Member added successfully!");
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error adding member:", err);
      setError("Failed to add member. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle remove member
  const handleRemoveMember = async (memberId) => {
    // Don't remove the owner
    const member = members.find((m) => m.id === memberId);
    if (member?.isOwner) {
      setError("Cannot remove the farm owner");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an actual API call
      // await removeFarmMember(farmId, memberId);

      // Simulate successful API call
      setTimeout(() => {
        // Remove from the local state
        setMembers(members.filter((member) => member.id !== memberId));

        setSuccess("Member removed successfully!");
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error removing member:", err);
      setError("Failed to remove member. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setEmail("");
    setEmailError("");
    setSearchTerm("");
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Manage Farm Members</Typography>
          <IconButton edge="end" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          {farmName}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        {/* Add Member Form */}
        <Box sx={{ p: 3, bgcolor: theme.palette.secondary.light }}>
          <Typography variant="subtitle1" gutterBottom>
            Add a New Member
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Email Address"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              placeholder="Enter email address"
              disabled={isLoading}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleAddMember}
              disabled={isLoading}
              sx={{ whiteSpace: "nowrap", py: 1 }}
            >
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Members List with Search */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress size={40} />
            </Box>
          )}

          {!isLoading && filteredMembers.length === 0 && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {searchTerm
                  ? "No members match your search"
                  : "No members found"}
              </Typography>
            </Box>
          )}

          <List sx={{ width: "100%" }}>
            {filteredMembers.map((member) => (
              <ListItem
                key={member.id}
                divider
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: member.isOwner
                        ? theme.palette.primary.main
                        : theme.palette.grey[400],
                    }}
                  >
                    {member.isOwner ? <AdminIcon /> : <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {`${member.firstName} ${member.lastName}`}
                      {member.isOwner && (
                        <Chip
                          label="Owner"
                          size="small"
                          color="primary"
                          sx={{ height: 20, fontSize: "0.75rem" }}
                        />
                      )}
                    </Box>
                  }
                  secondary={member.email}
                />

                <ListItemSecondaryAction>
                  <Tooltip
                    title={
                      member.isOwner ? "Cannot remove owner" : "Remove member"
                    }
                  >
                    <span>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={member.isOwner || isLoading}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FarmMembersDialog;
