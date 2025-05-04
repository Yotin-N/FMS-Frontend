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
  Autocomplete,
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
  getAllUsers,
  getFarmMembers,
  addFarmMember,
  removeFarmMember,
} from "../../../services/api";
import { alpha } from "@mui/material/styles";

// Note: Add a new prop 'onUpdate' to update the parent component
const FarmMembersDialog = ({ open, onClose, farmId, farmName, onUpdate }) => {
  const theme = useTheme();

  // States
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [membersChanged, setMembersChanged] = useState(false);

  // Load members and all users when dialog opens
  useEffect(() => {
    if (open && farmId) {
      loadFarmMembers();
      loadAllUsers();
    }
  }, [open, farmId]);

  // Filter available users (not current members) based on search query
  useEffect(() => {
    if (!allUsers.length) return;

    // Get array of member IDs for easy comparison
    const memberIds = members.map((member) => member.id);

    // Filter users who are not members and match the search query
    const available = allUsers.filter(
      (user) =>
        !memberIds.includes(user.id) &&
        (user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(userSearchQuery.toLowerCase()))
    );

    setFilteredUsers(available);
  }, [allUsers, members, userSearchQuery]);

  // Load all users
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await getAllUsers();
      setAllUsers(Array.isArray(users) ? users : []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load farm members
  const loadFarmMembers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // The API returns an array of members directly
      const membersList = await getFarmMembers(farmId);

      // Since we don't know who the owner is from the API,
      // we'll assume no one is the owner for now
      const processedMembers = membersList.map((member) => ({
        ...member,
        isOwner: false, // Could be updated if you have owner information
      }));

      setMembers(processedMembers);
    } catch (err) {
      console.error("Error loading farm members:", err);
      setError("Failed to load farm members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.email?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      `${member.firstName || ""} ${member.lastName || ""}`
        .toLowerCase()
        .includes(memberSearchQuery.toLowerCase())
  );

  // Handle adding a member
  const handleAddMember = async () => {
    if (!selectedUser) {
      setError("Please select a user first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addFarmMember(farmId, selectedUser.id);

      // Reload farm members and reset selection
      await loadFarmMembers();
      setSelectedUser(null);
      setUserSearchQuery("");
      setSuccess("Member added successfully!");
      setMembersChanged(true); // Track that members have changed
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

  // Handle removing a member
  const handleRemoveMember = async (memberId) => {
    // We're skipping the isOwner check since we don't have that info
    // but you could add it back if you do have a way to identify the owner

    setIsLoading(true);
    setError(null);

    try {
      await removeFarmMember(farmId, memberId);
      await loadFarmMembers();
      setSuccess("Member removed successfully!");
      setMembersChanged(true); // Track that members have changed
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
    // If members changed, call the onUpdate callback
    if (membersChanged && typeof onUpdate === "function") {
      onUpdate();
    }

    setMemberSearchQuery("");
    setUserSearchQuery("");
    setSelectedUser(null);
    setError(null);
    setSuccess(null);
    setMembersChanged(false);
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* FIXED ISSUE 1: Match button height by setting the same height and styling */}
            <Autocomplete
              fullWidth
              value={selectedUser}
              options={filteredUsers}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName} (${option.email})`
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1">
                      {option.firstName} {option.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </li>
              )}
              loading={loadingUsers}
              onInputChange={(_, value) => setUserSearchQuery(value)}
              onChange={(_, newValue) => {
                setSelectedUser(newValue);
                setUserSearchQuery("");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search users"
                  placeholder="Search by name or email"
                  size="medium"
                  InputProps={{
                    ...params.InputProps,
                    style: { height: 40 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loadingUsers ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ flex: 1 }}
              openOnFocus
              disableClearable
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleAddMember}
              disabled={isLoading || !selectedUser}
              sx={{
                height: 40, // Match Autocomplete height
                whiteSpace: "nowrap",
                borderRadius: 1,
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Members List */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Filter members..."
              value={memberSearchQuery}
              onChange={(e) => setMemberSearchQuery(e.target.value)}
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

          {/* FIXED ISSUE 3: Correctly show the loaded members */}
          {!isLoading && filteredMembers.length === 0 && (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {memberSearchQuery
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
                  backgroundColor: member.isOwner
                    ? alpha(theme.palette.primary.light, 0.1)
                    : "transparent",
                  "&:hover": {
                    bgcolor: member.isOwner
                      ? alpha(theme.palette.primary.light, 0.15)
                      : theme.palette.action.hover,
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
                          icon={<AdminIcon style={{ fontSize: 16 }} />}
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
                  {member.isOwner ? (
                    <Tooltip title="Farm owner cannot be removed">
                      <span>
                        <IconButton
                          edge="end"
                          disabled={true}
                          sx={{ color: theme.palette.text.disabled }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Remove member">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={isLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
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
