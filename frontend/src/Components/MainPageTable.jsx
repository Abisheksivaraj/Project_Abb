import React, { useState, useEffect, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
} from "@mui/material";

import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

import { api } from "../apiConfig";
import fm from "../assets/fm.png";
import black from "../assets/black.png";
import dispose from "../assets/dispose.png";
import manual from "../assets/manual.png";
import hot from "../assets/hot.png";
import warning from "../assets/warning.png";
import QRCode from "qrcode";

const MainPageTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const labelRef = useRef(null);

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

  const handlePrintLabel = async (selectedLabel) => {
    const serialNumber = selectedLabel?.SerialNumber || "3K8225003G0365";
    const modelNumber = selectedLabel?.ModelNumber || "FEP631M1A2030A1T1B1D0";
    const tagNumber = selectedLabel?.TagNumber || "FM17US0062X";
    const date = selectedLabel?.Date || "Mar 2025";

    // Construct a more standard and verifiable URL
    const qrUrl = `https://my-measurement-assistant.abb.com/products/productPage/9AAC183924?SN=${serialNumber}`;

    // Generate base64 QR image
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: "H",
      width: 100, // Reduced width
      margin: 1, // Reduce margin to make QR code more compact
    });

    const printContainer = document.createElement("div");
    printContainer.innerHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Label Print</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page {
          size: 96mm 98mm;
          margin: 3mm;
        }
        body {
          -webkit-print-color-adjust: exact;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        * {
          color: black;
          box-sizing: border-box;
        }
        div, img, hr {
          border-color: black !important;
        }
      </style>
    </head>
    <body class="m-0 p-0 font-sans text-black">
      <div class="w-[94mm] h-[94mm] border border-black rounded-lg flex flex-col text-black">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-black w-full px-1 py-1 rounded-t-lg">
          <div>
            <img src="${black}" alt="" class="w-[35px] h-[35px] object-contain" />
          </div>
          <div class="text-[20px] font-semibold text-center flex-1">ProcessMaster 630</div>
        </div>

        <!-- Main Content -->
        <div class="flex flex-col flex-1 border-b border-black w-full">
          
          <!-- Upper Section -->
          <div class="flex w-full border-b font-semibold border-black">
            <!-- Left Section -->
            <div class="flex-1 text-[7px] border-r border-black p-1">
              <div>Serial No: ${serialNumber}</div>
              <div>Model number: ${modelNumber}</div>
              <div>C70E2M1ADRMCRAM5RCDTCTV2</div>
              <div class="h-[2px]"></div>
              <div>OPTIONS 1 ></div>
              <div>OPTIONS 2 ></div>
              <div class="h-[2px]"></div>
              <div>Dev. version: 01.14.00</div>
              <div>Update:</div>
              <div class="w-[33px] h-[33px] ml-[9rem] border bg-gray-200 text-[6px] text-center flex items-center justify-center">
                <img src="${qrDataUrl}" alt="QR Code" class="w-full h-full object-contain" />
              </div>
            </div>

            <!-- Right Section -->
            <div class="text-[7px] p-1 flex font-semibold">
              <div>
                <div>24 V DC, 60 Hz</div>
                <div>Protection class: IP67/IP67</div>
                <div>Tamb: -20°....+60°C (-4°....140°F)</div>
                <div class="h-[2px]"></div>
                <div>DN 300 (12")</div>
                <div>Qmax: 2400 m³/h</div>
                <div class="h-[2px]"></div>
                <div>Liner mat: PTFE</div>
                <div>Tmed: 130°C (266°F)</div>
                <div class="h-[2px]"></div>
                <div>Ss: 150.214</div>
              </div>
              <div class="mt-10 font-semibold">
                <div>Fitting: ASME CL150</div>
                <div>Fexc: 15_12.5 HZ</div>
                <div>Elect: Hast. C-4 (2.4610)</div>
                <div>PED:</div>
                <div>Sz:  -0.390</div>
              </div>
            </div>
          </div>

          <!-- Middle Section for logo 1 -->
          <div class="flex font-semibold flex-row items-center justify-start text-[7px] border-b border-black w-full p-1">
            <div class="mr-2">
              <img src="${fm}" alt="" class="h-[7rem] w-[9rem]" />
            </div>
            <div>
              <div>${tagNumber}</div>
              <div>NI: CL I, Div 2, GPS ABCD T6...T1</div>
              <div>DIP: CL III, Div 2, GPS EFG T6...T3B</div>
              <div>CL I, ZN 2, AEx qc IIC T6...T1</div>
              <div>ZN 21, AEx tb IIIC T80°C...T165°C</div>
              <br />
              <div class="h-[2px]"></div>
              <div>FM17CA0033X</div>
              <div>NI: CL I, Div 2, GPS ABCD T6...T1</div>
              <div>DIP: CL III, Div 2, GPS EFG T6...T3B</div>
              <div>CL I, ZN 2, Ex ec IIC T6...T1 Gc</div>
              <div>CL I, ZN 21, Ex tb IIIC T80°C...T165°C Db</div>
              <div class="h-[2px]"></div>
              <div>See handbook for temperature class information</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex font-semibold justify-between items-start text-[7px] w-full p-1">
            <div>
              <div>Made in:</div>
              <div>ABB India Limited, Bangalore</div>
              <div class="text-center">${date}</div>
            </div>
            <div>
              <div>Designed by ABB AG</div>
              <div>Goettingen, Germany</div>
            </div>
            <div class="flex gap-[6px] font-bold items-center justify-center">
              <div class="w-[35px] h-[35px] flex items-center justify-center text-[8px]">
              <img src=${dispose} alt="" class="w-[35px] h-[35px]"/>
              </div>
              <div class="w-[35px] h-[35px] flex items-center justify-center text-[8px]">
                <img src=${hot} alt="" class="w-[35px] h-[35px]"/>
              </div>
              <div class="w-[35px] h-[35px] flex items-center justify-center text-[8px]">
                <img src=${warning} alt="" class="w-[35px] h-[35px]"/>
              </div>
              <div class="w-[35px] h-[35px] flex items-center justify-center text-[8px]">
                <img src=${manual} alt="" class="w-[35px] h-[35px]"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    iframe.style.width = "0";
    iframe.style.height = "0";
    document.body.appendChild(iframe);

    // Ensure QR code is fully loaded before printing
    const qrImage = new Image();
    qrImage.src = qrDataUrl;
    qrImage.onload = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(printContainer.innerHTML);
      iframeDoc.close();

      iframe.onload = () => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
      };
    };
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
                            <Button
                              variant="contained"
                              color="success"
                              onClick={handlePrintLabel}
                            >
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
