/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import {
  getAllUsers,
  deleteUser,
  createUser,
  updateUser,
} from "../../services/api";
import useAuth from "../../hooks/useAuth";
import UserDialog from "../../components/user/UserDialog";

const UserListPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // State
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Load users from API
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllUsers();
      setUsers(response || []);
      setFilteredUsers(response || []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user creation
  const handleCreateUser = async (userData) => {
    setIsLoading(true);

    try {
      await createUser(userData);
      await loadUsers();
      setCreateDialogOpen(false);
      setSuccess("User created successfully!");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user update
  const handleUpdateUser = async (userData) => {
    if (!selectedUser) return;

    setIsLoading(true);

    try {
      await updateUser(selectedUser.id, userData);
      await loadUsers();
      setEditDialogOpen(false);
      setSuccess("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    // Prevent deleting yourself
    if (selectedUser.id === currentUser?.id) {
      setError("You cannot delete your own account");
      setDeleteDialogOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      await deleteUser(selectedUser.id);
      await loadUsers();
      setDeleteDialogOpen(false);
      setSuccess("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Open edit dialog
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Close snackbar alerts
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
    setSuccess(null);
  };

  // Get chip color based on role
  const getRoleChipColor = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          bg: theme.palette.primary.main,
          text: "white",
        };
      default:
        return {
          bg: theme.palette.secondary.main,
          text: theme.palette.primary.main,
        };
    }
  };

  // Get status chip color
  const getStatusChipColor = (status) => {
    return status === "ACTIVE"
      ? {
          bg: theme.palette.success.light,
          text: theme.palette.success.dark,
        }
      : {
          bg: theme.palette.error.light,
          text: theme.palette.error.dark,
        };
  };

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4" component="h1">
          User Management
        </Typography>

        <Box
          sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}
        >
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              minWidth: { sm: "200px" },
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon sx={{ ml: 1 }} />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ whiteSpace: "nowrap", width: "40%" }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Error Display */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Display */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Users Table */}
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.secondary.light }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" py={2}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" py={2}>
                      {searchQuery
                        ? "No users match your search"
                        : "No users found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const roleColor = getRoleChipColor(user.role);

                  const status =
                    user.isActive === false ? "INACTIVE" : "ACTIVE";
                  const statusColor = getStatusChipColor(status);
                  const isCurrentUser = user.id === currentUser?.id;

                  return (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        backgroundColor: isCurrentUser
                          ? "rgba(76, 175, 80, 0.08)"
                          : "inherit",
                      }}
                    >
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role || "USER"}
                          size="small"
                          sx={{
                            backgroundColor: roleColor.bg,
                            color: roleColor.text,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          size="small"
                          sx={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditClick(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            isCurrentUser ? "Cannot delete yourself" : "Delete"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(user)}
                              disabled={isCurrentUser}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create User Dialog */}
      <UserDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateUser}
        isLoading={isLoading}
        title="Add New User"
      />

      {/* Edit User Dialog */}
      <UserDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdateUser}
        initialData={selectedUser}
        isLoading={isLoading}
        isEdit
        title="Edit User"
      />

      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 5,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            {selectedUser
              ? `${selectedUser.firstName} ${selectedUser.lastName}`
              : "this user"}
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserListPage;
