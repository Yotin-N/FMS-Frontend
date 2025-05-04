import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import UserForm from "./UserForm";

const UserDialog = ({
  open,
  onClose,
  onSubmit,
  initialData = {},
  isLoading = false,
  isEdit = false,
  title = "Add New User",
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          overflow: "visible",
          width: "500px",
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
            color: theme.palette.text.primary,
          }}
        >
          {title}
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
        <UserForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
