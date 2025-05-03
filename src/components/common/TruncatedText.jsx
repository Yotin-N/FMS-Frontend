// src/components/common/TruncatedText.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Collapse,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

/**
 * A component that handles text overflow in various ways:
 * - Single line with ellipsis and tooltip
 * - Multi-line with expansion capability
 * - Fixed height with "show more" functionality
 */
const TruncatedText = ({
  text,
  variant = "body1",
  color = "inherit",
  lines = 1,
  expandable = false,
  maxHeight,
  width = "100%",
  tooltipPlacement = "top",
  component = "div",
  sx = {},
  showTooltip = true,
  ...props
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Single line truncation with tooltip
  if (lines === 1 && !expandable) {
    return (
      <Tooltip
        title={showTooltip ? text : ""}
        placement={tooltipPlacement}
        disableHoverListener={!showTooltip}
      >
        <Typography
          variant={variant}
          color={color}
          component={component}
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            width,
            ...sx,
          }}
          {...props}
        >
          {text}
        </Typography>
      </Tooltip>
    );
  }

  // Multi-line truncation with fixed number of lines
  if (lines > 1 && !expandable) {
    return (
      <Tooltip
        title={showTooltip ? text : ""}
        placement={tooltipPlacement}
        disableHoverListener={!showTooltip}
      >
        <Typography
          variant={variant}
          color={color}
          component={component}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: lines,
            WebkitBoxOrient: "vertical",
            width,
            ...sx,
          }}
          {...props}
        >
          {text}
        </Typography>
      </Tooltip>
    );
  }

  // Expandable content with "show more/less" functionality
  if (expandable) {
    return (
      <Box sx={{ width, position: "relative", ...sx }}>
        <Collapse in={expanded} collapsedSize={maxHeight || `${lines * 1.5}em`}>
          <Typography
            variant={variant}
            color={color}
            component={component}
            sx={{
              width: "100%",
              position: "relative",
              mr: 3, // Space for expand button
            }}
            {...props}
          >
            {text}
          </Typography>
        </Collapse>

        {text && text.length > 20 && (
          <IconButton
            size="small"
            onClick={toggleExpand}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: expanded
                ? theme.palette.primary.light + "20"
                : theme.palette.background.paper,
              borderRadius: "50%",
              padding: "2px",
              "&:hover": {
                backgroundColor: expanded
                  ? theme.palette.primary.light + "30"
                  : theme.palette.action.hover,
              },
            }}
          >
            {expanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>
    );
  }

  // Fallback for invalid props
  return (
    <Typography
      variant={variant}
      color={color}
      component={component}
      sx={{ width, ...sx }}
      {...props}
    >
      {text}
    </Typography>
  );
};

export default TruncatedText;
