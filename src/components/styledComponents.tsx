import { TableContainer } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CommonTableContainer = styled(TableContainer)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 4,

  "& .MuiTable-root": {
    minWidth: 650,
  },
  "& .MuiTableCell-root": {
    padding: theme.spacing(1.5),
    height: 24,
    borderBottom: `1px solid ${theme.palette.divider}`,
    whiteSpace: "nowrap",
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: "bold",
  },
  "& .MuiTableBody-root .MuiTableRow-root:hover": {
    backgroundColor: `rgba(245, 0, 87, 0.1)`,
  },
  "& .MuiTableSortLabel-root": {
    color: theme.palette.secondary.contrastText,
    "&:hover": {
      color: theme.palette.secondary.contrastText,
    },
    "&.Mui-active": {
      color: theme.palette.secondary.contrastText,
      "& .MuiTableSortLabel-icon": {
        color: theme.palette.secondary.contrastText,
      },
    },
  },
  "& .MuiTableSortLabel-icon": {
    color: theme.palette.secondary.contrastText,
  },
  "& .MuiChip-root": {
    height: 24,
    "& .MuiChip-label": {
      px: 1,
      fontSize: "0.75rem",
    },
  },
}));
