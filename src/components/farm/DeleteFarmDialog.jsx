// src/components/farm/DeleteFarmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

const DeleteFarmDialog = ({
  open,
  onClose,
  onConfirm,
  farmName = "",
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          overflow: "visible",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          p: 3,
          pb: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 600,
            color: theme.palette.error.main,
          }}
        >
          Delete Farm
        </Typography>

        <IconButton
          edge="end"
          onClick={onClose}
          aria-label="close"
          sx={{
            color: theme.palette.grey[500],
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ p: 3, pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <DeleteIcon
            sx={{
              fontSize: 40,
              color: theme.palette.error.light,
              mr: 2,
            }}
          />
          <Typography variant="h6" component="p">
            Are you sure?
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          You are about to delete "{farmName}". This action cannot be undone and
          all associated data will be permanently removed.
        </Typography>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            color: theme.palette.text.secondary,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "16px",
            px: 3,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "16px",
            px: 3,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            },
          }}
        >
          {isLoading ? "Deleting..." : "Delete Farm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFarmDialog;
