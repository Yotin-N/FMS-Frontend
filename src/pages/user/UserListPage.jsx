/* eslint-disable no-unused-vars */
// src/pages/user/UserListPage.jsx
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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
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

  // Get chip styling for role
  const getRoleChipProps = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          icon: <AdminIcon fontSize="small" />,
          label: "Admin",
          sx: {
            fontWeight: 500,
            backgroundColor: "#e8f5e9", // Green background
            color: "#2e7d32", // Green text
            minWidth: "100px",
          },
        };
      default:
        return {
          icon: <PersonIcon fontSize="small" />,
          label: "User",
          sx: {
            fontWeight: 500,
            backgroundColor: "#e8f5e9", // Light green background
            color: "#2e7d32", // Green text
            minWidth: "100px",
          },
        };
    }
  };

  // Get chip styling for status
  const getStatusChipProps = (isActive) => {
    return isActive
      ? {
          icon: <CheckCircleIcon fontSize="small" />,
          label: "Active",
          sx: {
            fontWeight: 500,
            backgroundColor: "#e8f5e9", // Light green background
            color: "#2e7d32", // Green text
            border: "1px solid #2e7d32", // Green border
            minWidth: "100px",
          },
        }
      : {
          icon: <CancelIcon fontSize="small" />,
          label: "Inactive",
          sx: {
            fontWeight: 500,
            backgroundColor: "#ffebee", // Light red background
            color: "#d32f2f", // Red text
            border: "1px solid #d32f2f", // Red border
            minWidth: "100px",
          },
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
                <TableCell sx={{ fontWeight: "bold", pl: 2 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Role
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Actions
                </TableCell>
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
                  const roleChipProps = getRoleChipProps(user.role);
                  const statusChipProps = getStatusChipProps(
                    user.isActive !== false
                  );
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
                        <Typography fontWeight={isCurrentUser ? 600 : 400}>
                          {user.firstName} {user.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell align="center">
                        <Chip {...roleChipProps} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip {...statusChipProps} />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          {/* Edit button */}
                          <IconButton
                            size="small"
                            sx={{
                              color: "#2e7d32", // Green color
                              p: 1,
                            }}
                            onClick={() => handleEditClick(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          {/* Delete button */}
                          <IconButton
                            size="small"
                            sx={{
                              color: "#d32f2f", // Red color
                              p: 1,
                            }}
                            onClick={() => handleDeleteClick(user)}
                            disabled={isCurrentUser}
                          >
                            {isCurrentUser ? (
                              <DeleteIcon
                                fontSize="small"
                                sx={{ color: "#e0e0e0" }}
                              /> // Light gray for disabled
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
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
