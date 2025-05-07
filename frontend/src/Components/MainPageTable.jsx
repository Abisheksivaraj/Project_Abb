import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Breadcrumbs,
  Link,
  AppBar,
  Toolbar,
  CircularProgress,
  Tooltip,
  Card,
  TablePagination,
  Chip,
  Divider,
} from "@mui/material";

import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
} from "@mui/icons-material";

import { api } from "../apiConfig";

const MainPageTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    action: true,
    labelType: true,
    serialNumber: true,
    tagNumber: true,
    labelDetails: true,
    date: true,
    addedBy: true,
    status: true,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/tableData");
        setTableData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  // Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ArrowUpwardIcon fontSize="small" />
      ) : (
        <ArrowDownwardIcon fontSize="small" />
      );
    }
    return null;
  };

  const sortedData = [...tableData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Filter by search term across all columns
  const filteredData = sortedData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current page data
  const currentPageData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columnVisibilityOptions = [
    { id: "sNo", label: "S No" },
    { id: "action", label: "Action" },
    { id: "labelType", label: "Label Type" },
    { id: "serialNumber", label: "Serial Number" },
    { id: "tagNumber", label: "Tag Number" },
    { id: "labelDetails", label: "Label Details" },
    { id: "date", label: "Date" },
    { id: "addedBy", label: "Added By" },
    { id: "status", label: "Status" },
  ];

  const handleColumnVisibilityChange = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: "2rem",
            color: "black",
          }}
        >
          Label Print
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "black" }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="black">Label Print</Typography>
        </Breadcrumbs>
      </Toolbar>

      {/* Main content */}
      <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
        <Card
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
              Label Print Data
            </Typography>
            <Button
              onClick={() => navigate("/Labelprint")}
              variant="contained"
              sx={{
                background: (theme) =>
                  `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                color: "white",
                "&:hover": { bgcolor: "#1e3a8a" },
                textTransform: "none",
                fontWeight: 500,
                boxShadow: 1,
              }}
              startIcon={<PrintIcon />}
            >
              Add New Label
            </Button>
          </Box>

          {/* Search and Filters */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexWrap: { xs: "wrap", md: "nowrap" },
              justifyContent: "space-between",
              gap: 2,
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", md: "300px" }, bgcolor: "white" }}
            />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                size="small"
                variant="outlined"
                sx={{ color: "#475569", borderColor: "#cbd5e1" }}
                onClick={handleColumnMenuOpen}
                startIcon={<VisibilityIcon fontSize="small" />}
              >
                Columns
              </Button>
              <Menu
                anchorEl={columnMenuAnchor}
                open={Boolean(columnMenuAnchor)}
                onClose={handleColumnMenuClose}
                PaperProps={{
                  sx: { maxHeight: 300, width: 200 },
                }}
              >
                {columnVisibilityOptions.map((column) => (
                  <MenuItem
                    key={column.id}
                    onClick={() => handleColumnVisibilityChange(column.id)}
                    dense
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={visibleColumns[column.id]}
                          size="small"
                          color="primary"
                        />
                      }
                      label={column.label}
                      sx={{ width: "100%" }}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

          {/* Export Options */}
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: "#475569",
                borderColor: "#cbd5e1",
                textTransform: "none",
              }}
            >
              Copy
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: "#475569",
                borderColor: "#cbd5e1",
                textTransform: "none",
              }}
            >
              CSV
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: "#475569",
                borderColor: "#cbd5e1",
                textTransform: "none",
              }}
            >
              Excel
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: "#475569",
                borderColor: "#cbd5e1",
                textTransform: "none",
              }}
            >
              PDF
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: "#475569",
                borderColor: "#cbd5e1",
                textTransform: "none",
              }}
              startIcon={<PrintIcon fontSize="small" />}
            >
              Print
            </Button>
          </Box>

          {/* Table */}
          <TableContainer
            sx={{ maxHeight: "calc(100vh - 350px)", minHeight: "300px" }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            ) : error ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </Box>
            ) : (
              <Table stickyHeader aria-label="label print table">
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        bgcolor: "#f1f5f9",
                        fontWeight: "600",
                        color: "#334155",
                      },
                    }}
                  >
                    {visibleColumns.sNo && (
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("_id")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          S No {getSortDirection("_id")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.action && <TableCell>Action</TableCell>}
                    {visibleColumns.labelType && (
                      <TableCell
                        sx={{ cursor: "pointer", minWidth: 150 }}
                        onClick={() => handleSort("LabelType")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Label Type {getSortDirection("LabelType")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.serialNumber && (
                      <TableCell
                        sx={{ cursor: "pointer", minWidth: 150 }}
                        onClick={() => handleSort("SerialNumber")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Serial Number {getSortDirection("SerialNumber")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.tagNumber && (
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("TagNumber")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Tag Number {getSortDirection("TagNumber")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.labelDetails && (
                      <TableCell sx={{ minWidth: 250 }}>
                        Label Details
                      </TableCell>
                    )}
                    {visibleColumns.date && (
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("Date")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Date {getSortDirection("Date")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.addedBy && (
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("AddedBy")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Added By {getSortDirection("AddedBy")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("Status")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Status {getSortDirection("Status")}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentPageData.length > 0 ? (
                    currentPageData.map((row, index) => (
                      <TableRow
                        key={row._id || index}
                        hover
                        sx={{
                          "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {visibleColumns.sNo && (
                          <TableCell>
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                        )}
                        {visibleColumns.action && (
                          <TableCell>
                            <Button variant="contained" color="success">
                              Preview
                            </Button>
                          </TableCell>
                        )}
                        {visibleColumns.labelType && (
                          <TableCell>{row.LabelType}</TableCell>
                        )}
                        {visibleColumns.serialNumber && (
                          <TableCell>{row.SerialNumber}</TableCell>
                        )}
                        {visibleColumns.tagNumber && (
                          <TableCell>{row.TagNumber}</TableCell>
                        )}
                        {visibleColumns.labelDetails && (
                          <TableCell
                            sx={{
                              maxWidth: 250,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Tooltip
                              title={row.LabelDetails}
                              placement="top-start"
                              arrow
                              enterDelay={500}
                              leaveDelay={200}
                            >
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  display: "block",
                                  width: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {row.LabelDetails}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                        )}
                        {visibleColumns.date && (
                          <TableCell>{row.Date}</TableCell>
                        )}
                        {visibleColumns.addedBy && (
                          <TableCell>{row.AddedBy}</TableCell>
                        )}
                        {visibleColumns.status && (
                          <TableCell>
                            <Chip
                              label={row.Status}
                              size="small"
                              sx={{
                                bgcolor:
                                  row.Status === "Active"
                                    ? "#dcfce7"
                                    : "#fff7ed",
                                color:
                                  row.Status === "Active"
                                    ? "#166534"
                                    : "#9a3412",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={
                          Object.values(visibleColumns).filter(Boolean).length
                        }
                        align="center"
                        sx={{ py: 5 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No data found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
            }}
          />
        </Card>
      </Box>
    </Box>
  );
};

export default MainPageTable;
