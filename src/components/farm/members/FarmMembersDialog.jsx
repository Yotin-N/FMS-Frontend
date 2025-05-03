// src/components/farm/members/FarmMembersDialog.jsx - Handling UUID issue
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
import {
  addFarmMember,
  removeFarmMember,
  getAllUsers,
} from "../../../services/api";

const FarmMembersDialog = ({ open, onClose, farmId, farmName }) => {
  const theme = useTheme();

  // States
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Load all users and farm members when dialog opens
  useEffect(() => {
    if (open && farmId) {
      loadFarmMembers();
      loadAllUsers();
    }
  }, [open, farmId]);

  // Load all users to find user IDs
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersData = await getAllUsers();

      // Log the response to debug
      console.log("All users response:", usersData);

      // Handle different response structures
      let users = [];
      if (usersData && Array.isArray(usersData)) {
        users = usersData;
      } else if (usersData && Array.isArray(usersData.data)) {
        users = usersData.data;
      }

      setAllUsers(users);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Simulate loading farm members
  // In real app, you would fetch this from backend
  const loadFarmMembers = async () => {
    setIsLoading(true);
    setError(null);

    // Mock implementation - in real app, replace with API call
    setTimeout(() => {
      const mockMembers = [
        {
          id: "1", // UUID in real implementation
          email: "owner@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "ADMIN",
          isOwner: true,
        },
        {
          id: "2", // UUID in real implementation
          email: "member@example.com",
          firstName: "Jane",
          lastName: "Smith",
          role: "USER",
          isOwner: false,
        },
      ];

      setMembers(mockMembers);
      setIsLoading(false);
    }, 500);
  };

  // Filter members based on search term
  const filteredMembers = members.filter(
    (member) =>
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${member.firstName || ""} ${member.lastName || ""}`
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

  // Find user ID by email from loaded users
  const findUserIdByEmail = (email) => {
    const user = allUsers.find(
      (user) => user.email && user.email.toLowerCase() === email.toLowerCase()
    );
    return user ? user.id : null;
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
    if (
      members.some(
        (member) =>
          member.email && member.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      setEmailError("User is already a member of this farm");
      return;
    }

    // Find user ID from the email
    const userId = findUserIdByEmail(email);
    if (!userId) {
      setEmailError(
        "User not found. Please make sure the email is registered."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Log the data we're sending to the API for debugging
      console.log("Adding member with:", { farmId, userId });

      // Call API with proper UUID
      await addFarmMember(farmId, userId);

      // Reload farm members
      await loadFarmMembers();

      setEmail("");
      setSuccess("Member added successfully!");
    } catch (err) {
      console.error("Error adding member:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to add member. Please try again.";
      setError(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
    } finally {
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
      await removeFarmMember(farmId, memberId);

      // Reload farm members
      await loadFarmMembers();

      setSuccess("Member removed successfully!");
    } catch (err) {
      console.error("Error removing member:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to remove member. Please try again.";
      setError(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
    } finally {
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
          <Typography variant="h6" fontWeight={600}>
            Manage Farm Members
          </Typography>
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
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
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
              disabled={isLoading || loadingUsers}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleAddMember}
              disabled={isLoading || loadingUsers}
              sx={{
                whiteSpace: "nowrap",
                py: 1,
                borderRadius: 1,
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </Box>

          {loadingUsers && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Loading users...
            </Typography>
          )}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
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
                      {`${member.firstName || ""} ${
                        member.lastName || ""
                      }`.trim() || "Unknown User"}
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
                  secondary={member.email || ""}
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
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FarmMembersDialog;
