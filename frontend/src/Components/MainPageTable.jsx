import React, { useState } from "react";
<<<<<<< HEAD
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> 32713a809094e7d5cbcaa8942e4b72364fea3a09
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
} from "@mui/material";

import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

const MainPageTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> 32713a809094e7d5cbcaa8942e4b72364fea3a09
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

  // Sample data
  const tableData = [
    {
      id: 1,
      labelType: "FEP631-Integral type 4-General Purpose",
      serialNumber: "TEU",
      tagNumber: "DGJH",
      labelDetails:
        "FEP631Y0S20015D0E1B5G2C70D0M1ADRNDSAC2CSCL5CMDCRAJHK0M5MS0CR0SMANC1NFBR",
      date: "2025-04-12",
      addedBy: "John Smith",
      status: "Active",
    },
    {
      id: 2,
      labelType: "Integral/Remote type 3-Exproof",
      serialNumber: "3K822200236287",
      tagNumber: "FT-0001",
      labelDetails:
        "FEP631A1D10040A1T1B1S2A70A2G0ADRMDSOC0-----CMACRAJ6K0M5MS0CR0SMANC1NFSRCI",
      date: "2025-04-10",
      addedBy: "Emma Johnson",
      status: "Active",
    },
    {
      id: 3,
      labelType: "FEP632-Remote Sensor",
      serialNumber: "22",
      tagNumber: "33",
      labelDetails:
        "FEP632Y0P10015D0E1B5G1B70Y0--A---------CSCL5---------JHKGM1MS0CR0SMANC1NFS---SC2TSY",
      date: "2025-04-05",
      addedBy: "Michael Brown",
      status: "In-active",
    },
  ];

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
        bgcolor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600, color: "#333" }}
          >
            Label Print
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="error" href="/">
              Home
            </Link>
            <Typography color="text.secondary">Label Print</Typography>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {/* Add Button */}
        <Button
<<<<<<< HEAD
=======
          onClick={() => navigate("/Labelprint")}
>>>>>>> 32713a809094e7d5cbcaa8942e4b72364fea3a09
          variant="contained"
          color="error"
          sx={{ mb: 2, bgcolor: "#b71c1c", "&:hover": { bgcolor: "#7f0000" } }}
        >
          Add Label Print
        </Button>

        {/* Table Container */}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {/* Table Header */}
          <Box sx={{ bgcolor: "#b71c1c", color: "white", p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Table Data
            </Typography>
          </Box>

          {/* Table Controls */}
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                color="inherit"
                sx={{
                  bgcolor: "#666",
                  color: "white",
                  "&:hover": { bgcolor: "#444" },
                }}
              >
                Copy
              </Button>
              <Button
                size="small"
                variant="contained"
                color="inherit"
                sx={{
                  bgcolor: "#666",
                  color: "white",
                  "&:hover": { bgcolor: "#444" },
                }}
              >
                CSV
              </Button>
              <Button
                size="small"
                variant="contained"
                color="inherit"
                sx={{
                  bgcolor: "#666",
                  color: "white",
                  "&:hover": { bgcolor: "#444" },
                }}
              >
                Excel
              </Button>
              <Button
                size="small"
                variant="contained"
                color="inherit"
                sx={{
                  bgcolor: "#666",
                  color: "white",
                  "&:hover": { bgcolor: "#444" },
                }}
              >
                PDF
              </Button>
              <Button
                size="small"
                variant="contained"
                color="inherit"
                sx={{
                  bgcolor: "#666",
                  color: "white",
                  "&:hover": { bgcolor: "#444" },
                }}
              >
                Print
              </Button>
              <Button
                size="small"
                variant="contained"
                color="inherit"
                sx={{
                  bgcolor: "#666",
                  color: "white",
                  "&:hover": { bgcolor: "#444" },
                }}
                onClick={handleColumnMenuOpen}
                endIcon={<VisibilityIcon fontSize="small" />}
              >
                Column visibility
              </Button>
              <Menu
                anchorEl={columnMenuAnchor}
                open={Boolean(columnMenuAnchor)}
                onClose={handleColumnMenuClose}
              >
                {columnVisibilityOptions.map((column) => (
                  <MenuItem
                    key={column.id}
                    onClick={() => handleColumnVisibilityChange(column.id)}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={visibleColumns[column.id]}
                          size="small"
                        />
                      }
                      label={column.label}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "240px" }}
            />
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="label print table">
              <TableHead>
                <TableRow>
                  {visibleColumns.sNo && (
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSort("id")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        S No {getSortDirection("id")}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.action && <TableCell>Action</TableCell>}
                  {visibleColumns.labelType && (
                    <TableCell
                      sx={{ cursor: "pointer", minWidth: 200 }}
                      onClick={() => handleSort("labelType")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Label Type {getSortDirection("labelType")}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.serialNumber && (
                    <TableCell
                      sx={{ cursor: "pointer", minWidth: 150 }}
                      onClick={() => handleSort("serialNumber")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Serial Number {getSortDirection("serialNumber")}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.tagNumber && (
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSort("tagNumber")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Tag Number {getSortDirection("tagNumber")}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.labelDetails && (
                    <TableCell sx={{ minWidth: 300 }}>Label Details</TableCell>
                  )}
                  {visibleColumns.date && (
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSort("date")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Date {getSortDirection("date")}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.addedBy && (
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSort("addedBy")}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "5rem",
                        }}
                      >
                        Added By {getSortDirection("addedBy")}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSort("status")}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "5rem",
                        }}
                      >
                        Status {getSortDirection("status")}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id} hover>
                    {visibleColumns.sNo && <TableCell>{row.id}</TableCell>}
                    {visibleColumns.action && (
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          sx={{ textTransform: "none" }}
                        >
                          Preview
                        </Button>
                      </TableCell>
                    )}
                    {visibleColumns.labelType && (
                      <TableCell>{row.labelType}</TableCell>
                    )}
                    {visibleColumns.serialNumber && (
                      <TableCell>{row.serialNumber}</TableCell>
                    )}
                    {visibleColumns.tagNumber && (
                      <TableCell>{row.tagNumber}</TableCell>
                    )}
                    {visibleColumns.labelDetails && (
                      <TableCell
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.labelDetails}
                      </TableCell>
                    )}
                    {visibleColumns.date && <TableCell>{row.date}</TableCell>}
                    {visibleColumns.addedBy && (
                      <TableCell>{row.addedBy}</TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell>
                        <Typography
                          component="span"
                          sx={{
                            bgcolor:
                              row.status === "Active" ? "#e8f5e9" : "#fff3e0",
                            color:
                              row.status === "Active" ? "#2e7d32" : "#e65100",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.875rem",
                          }}
                        >
                          {row.status}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 2,
          px: 3,
          mt: "auto",
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Copyright © 2025 ABB :: Label Printing. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default MainPageTable;
