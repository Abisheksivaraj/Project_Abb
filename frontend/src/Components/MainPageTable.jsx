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
  Snackbar,
  Alert,
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
  FileDownload as FileDownloadIcon,
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import { api } from "../apiConfig";
import fm from "../assets/fm.png";
import black from "../assets/black.png";
import dispose from "../assets/dispose.png";
import bin from "../assets/bin3.png";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";

const MainPageTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceVersion, setDeviceVersion] = useState({});
  const csvLinkRef = useRef(null);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const labelRef = useRef(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Print view state
  const [printView, setPrintView] = useState(false);
  const printRef = useRef(null);

  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    action: true,
    labelType: true,
    serialNumber: true,
    tagNumber: true,
    labelDetails: true,
    logoType: true,
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

  const filteredData = sortedData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
    { id: "logoType", label: "Logo Type" },
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

  // Open preview modal and set selected label
  const openPreviewModal = (label) => {
    setSelectedLabel(label);
    setPreviewOpen(true);
  };

  // Close preview modal
  const closePreviewModal = () => {
    setPreviewOpen(false);
    setSelectedLabel(null);
  };

  // Show alert message
  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Close alert
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Handle edit button click
  const handleEditLabel = (row) => {
    // Navigate to label print page with the label data
    navigate("/Labelprint", { state: { editData: row } });
  };

  // Export functions
  const handleCopyToClipboard = () => {
    // Create a string representation of the table data
    const headers = columnVisibilityOptions
      .filter((col) => visibleColumns[col.id])
      .map((col) => col.label);

    const rows = filteredData.map((row, index) => {
      const rowData = [];
      if (visibleColumns.sNo) rowData.push(index + 1);
      if (visibleColumns.labelType) rowData.push(row.LabelType || "");
      if (visibleColumns.serialNumber) rowData.push(row.SerialNumber || "");
      if (visibleColumns.tagNumber) rowData.push(row.TagNumber || "");
      if (visibleColumns.labelDetails) rowData.push(row.LabelDetails || "");
      if (visibleColumns.logoType) rowData.push(row.LogoType || "");
      if (visibleColumns.date) rowData.push(row.Date || "");
      if (visibleColumns.addedBy) rowData.push(row.AddedBy || "");
      if (visibleColumns.status) rowData.push(row.Status || "");
      return rowData.join("\t");
    });

    const tableText = [headers.join("\t"), ...rows].join("\n");

    navigator.clipboard
      .writeText(tableText)
      .then(() => {
        showAlert("Table data copied to clipboard");
      })
      .catch((err) => {
        showAlert("Failed to copy table data", "error");
      });
  };

  const handleCSVExport = () => {
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click();
      showAlert("CSV file downloaded successfully");
    }
  };

  const handleExcelExport = () => {
    try {
      // Prepare data for export
      const headers = columnVisibilityOptions
        .filter((col) => visibleColumns[col.id] && col.id !== "action")
        .map((col) => col.label);

      const exportData = filteredData.map((row, index) => {
        const rowData = {};
        if (visibleColumns.sNo) rowData["S No"] = index + 1;
        if (visibleColumns.labelType)
          rowData["Label Type"] = row.LabelType || "";
        if (visibleColumns.serialNumber)
          rowData["Serial Number"] = row.SerialNumber || "";
        if (visibleColumns.tagNumber)
          rowData["Tag Number"] = row.TagNumber || "";
        if (visibleColumns.labelDetails)
          rowData["Label Details"] = row.LabelDetails || "";
        if (visibleColumns.logoType) rowData["Logo Type"] = row.LogoType || "";
        if (visibleColumns.date) rowData["Date"] = row.Date || "";
        if (visibleColumns.addedBy) rowData["Added By"] = row.AddedBy || "";
        if (visibleColumns.status) rowData["Status"] = row.Status || "";
        return rowData;
      });

      // Create workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData, {
        header: headers,
      });

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Labels");

      // Generate and download file
      XLSX.writeFile(workbook, "label_data.xlsx");
      showAlert("Excel file downloaded successfully");
    } catch (error) {
      console.error("Excel export error:", error);
      showAlert("Failed to export to Excel", "error");
    }
  };

  // Enhanced PDF Export with Professional Design
  const handlePDFExport = () => {
    try {
      // Create new PDF document with better margins
      const doc = new jsPDF("landscape", "mm", "a4");

      // Define colors
      const primaryColor = [51, 65, 85]; // slate-700
      const secondaryColor = [100, 116, 139]; // slate-500
      const accentColor = [239, 68, 68]; // red-500
      const lightGray = [248, 250, 252]; // slate-50

      // PDF Header Section
      const addHeader = () => {
        // Add company/header background
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 297, 25, "F");

        // Main title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Label Print Data Report", 15, 12);

        // Subtitle
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("ProcessMaster 630 Manufacturing Labels", 15, 19);

        // Date and time on the right
        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const timeStr = currentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        doc.setFontSize(10);
        doc.text(`Generated: ${dateStr} at ${timeStr}`, 200, 12);
        doc.text(`Total Records: ${filteredData.length}`, 200, 18);
      };

      // Add footer
      const addFooter = (pageNumber, totalPages) => {
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.rect(0, 185, 297, 25, "F");

        doc.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        // Company info
        doc.text(
          "ABB India Limited - ProcessMaster 630 Label Management System",
          15,
          195
        );

        // Page number
        doc.text(`Page ${pageNumber} of ${totalPages}`, 250, 195);

        // Confidentiality notice
        doc.setFontSize(8);
        doc.text("Confidential - Internal Use Only", 15, 201);
      };

      // Summary section
      const addSummary = () => {
        let yPosition = 35;

        // Summary background
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.rect(15, yPosition, 267, 20, "F");

        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Report Summary", 20, yPosition + 8);

        // Calculate statistics
        const totalRecords = filteredData.length;
        const activeRecords = filteredData.filter(
          (row) => row.Status === "Active"
        ).length;
        const inactiveRecords = totalRecords - activeRecords;
        const uniqueSerialNumbers = new Set(
          filteredData.map((row) => row.SerialNumber)
        ).size;
        const labelTypes = new Set(filteredData.map((row) => row.LabelType))
          .size;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        // Summary statistics in columns
        doc.text(`Total Labels: ${totalRecords}`, 20, yPosition + 15);
        doc.text(`Active: ${activeRecords}`, 80, yPosition + 15);
        doc.text(`Inactive: ${inactiveRecords}`, 120, yPosition + 15);
        doc.text(`Unique Serials: ${uniqueSerialNumbers}`, 170, yPosition + 15);
        doc.text(`Label Types: ${labelTypes}`, 230, yPosition + 15);

        return yPosition + 25;
      };

      // Add the header and summary
      addHeader();
      const tableStartY = addSummary();

      // Prepare table headers (excluding action column)
      const tableColumns = [];
      const columnWidths = [];

      if (visibleColumns.sNo) {
        tableColumns.push("S.No");
        columnWidths.push(15);
      }
      if (visibleColumns.labelType) {
        tableColumns.push("Label Type");
        columnWidths.push(25);
      }
      if (visibleColumns.serialNumber) {
        tableColumns.push("Serial Number");
        columnWidths.push(30);
      }
      if (visibleColumns.tagNumber) {
        tableColumns.push("Tag Number");
        columnWidths.push(25);
      }
      if (visibleColumns.labelDetails) {
        tableColumns.push("Model Number");
        columnWidths.push(70);
      }
      if (visibleColumns.logoType) {
        tableColumns.push("Logo Type");
        columnWidths.push(20);
      }
      if (visibleColumns.date) {
        tableColumns.push("Date");
        columnWidths.push(25);
      }
      if (visibleColumns.addedBy) {
        tableColumns.push("Added By");
        columnWidths.push(25);
      }
      if (visibleColumns.status) {
        tableColumns.push("Status");
        columnWidths.push(20);
      }

      // Prepare table data
      const tableRows = filteredData.map((row, index) => {
        const rowData = [];
        if (visibleColumns.sNo) rowData.push((index + 1).toString());
        if (visibleColumns.labelType) rowData.push(row.LabelType || "-");
        if (visibleColumns.serialNumber) rowData.push(row.SerialNumber || "-");
        if (visibleColumns.tagNumber) rowData.push(row.TagNumber || "-");
        if (visibleColumns.labelDetails) {
          // Truncate long model numbers for better fit
          const modelNumber = row.LabelDetails || "-";
          rowData.push(
            modelNumber.length > 50
              ? modelNumber.substring(0, 47) + "..."
              : modelNumber
          );
        }
        if (visibleColumns.logoType) rowData.push(row.LogoType || "-");
        if (visibleColumns.date) rowData.push(row.Date || "-");
        if (visibleColumns.addedBy) rowData.push(row.AddedBy || "-");
        if (visibleColumns.status) rowData.push(row.Status || "-");
        return rowData;
      });

      // Generate the table with enhanced styling
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: tableStartY + 5,
        margin: { left: 15, right: 15 },

        // Enhanced table styling
        theme: "grid",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
          lineWidth: 0.5,
          lineColor: [255, 255, 255],
        },

        bodyStyles: {
          fontSize: 8,
          cellPadding: 3,
          valign: "middle",
          lineWidth: 0.3,
          lineColor: [200, 200, 200],
        },

        alternateRowStyles: {
          fillColor: lightGray,
        },

        columnStyles: {
          // S.No column
          0: { halign: "center", cellWidth: columnWidths[0] || "auto" },
          // Status column with conditional formatting
          [tableColumns.length - 1]: {
            halign: "center",
            cellWidth: columnWidths[columnWidths.length - 1] || "auto",
          },
        },

        // Custom cell rendering for status colors
        didParseCell: function (data) {
          if (
            data.column.index === tableColumns.indexOf("Status") &&
            data.cell.text[0]
          ) {
            const status = data.cell.text[0];
            if (status === "Active") {
              data.cell.styles.fillColor = [16, 185, 129]; // green-500
              data.cell.styles.textColor = [255, 255, 255];
              data.cell.styles.fontStyle = "bold";
            } else if (status === "Inactive") {
              data.cell.styles.fillColor = [239, 68, 68]; // red-500
              data.cell.styles.textColor = [255, 255, 255];
              data.cell.styles.fontStyle = "bold";
            }
          }
        },

        // Handle page breaks
        didDrawPage: function (data) {
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

          // Add header and footer to each page
          if (currentPage > 1) {
            addHeader();
          }
          addFooter(currentPage, pageCount);
        },

        // Ensure table fits properly
        tableWidth: "auto",
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
        },
      });

      // Add final page count
      const finalPageCount = doc.internal.getNumberOfPages();

      // Go to first page to update footer with correct page count
      for (let i = 1; i <= finalPageCount; i++) {
        doc.setPage(i);
        addFooter(i, finalPageCount);
      }

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[-:]/g, "");
      const filename = `Label_Print_Report_${timestamp}.pdf`;

      // Save the PDF
      doc.save(filename);

      showAlert("Professional PDF report generated successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      showAlert("Failed to export to PDF", "error");
    }
  };

  // Enhanced Print Function for Table
  const handlePrintTable = () => {
    const printWindow = window.open("", "_blank");

    // Prepare visible columns for print
    const visibleColumnsList = columnVisibilityOptions.filter(
      (col) => visibleColumns[col.id] && col.id !== "action"
    );

    // Generate print HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Label Print Data - ${new Date().toLocaleDateString()}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 15mm;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #1f2937;
            margin: 0;
            padding: 0;
          }
          
          .print-header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          
          .print-header h1 {
            margin: 0 0 5px 0;
            font-size: 24px;
            font-weight: bold;
          }
          
          .print-header p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
          }
          
          .print-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #e2e8f0;
          }
          
          .print-info div {
            font-weight: 600;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .print-table th {
            background: #334155;
            color: white;
            font-weight: bold;
            padding: 12px 8px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .print-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 9px;
            vertical-align: top;
          }
          
          .print-table tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .print-table tr:hover {
            background: #e0f2fe;
          }
          
          .status-active {
            background: #10b981 !important;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 8px;
            text-align: center;
          }
          
          .status-inactive {
            background: #ef4444 !important;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 8px;
            text-align: center;
          }
          
          .print-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 10px;
          }
          
          .model-number {
            word-break: break-all;
            max-width: 150px;
            font-size: 8px;
            line-height: 1.2;
          }
          
          @media print {
            body { print-color-adjust: exact; }
            .print-table { page-break-inside: auto; }
            .print-table tr { page-break-inside: avoid; page-break-after: auto; }
            .print-table thead { display: table-header-group; }
            .print-table tfoot { display: table-footer-group; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Label Print Data Report</h1>
          <p>ProcessMaster 630 Manufacturing Labels - Complete Data Export</p>
        </div>
        
        <div class="print-info">
          <div>Total Records: ${filteredData.length}</div>
          <div>Generated: ${new Date().toLocaleString()}</div>
          <div>Active Labels: ${
            filteredData.filter((row) => row.Status === "Active").length
          }</div>
        </div>
        
        <table class="print-table">
          <thead>
            <tr>
              ${visibleColumnsList
                .map((col) => `<th>${col.label}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${filteredData
              .map(
                (row, index) => `
              <tr>
                ${visibleColumnsList
                  .map((col) => {
                    let cellValue = "";
                    let cellClass = "";

                    switch (col.id) {
                      case "sNo":
                        cellValue = index + 1;
                        break;
                      case "labelType":
                        cellValue = row.LabelType || "-";
                        break;
                      case "serialNumber":
                        cellValue = row.SerialNumber || "-";
                        break;
                      case "tagNumber":
                        cellValue = row.TagNumber || "-";
                        break;
                      case "labelDetails":
                        cellValue = row.LabelDetails || "-";
                        cellClass = "model-number";
                        break;
                      case "logoType":
                        cellValue = row.LogoType || "-";
                        break;
                      case "date":
                        cellValue = row.Date || "-";
                        break;
                      case "addedBy":
                        cellValue = row.AddedBy || "-";
                        break;
                      case "status":
                        cellValue = row.Status || "-";
                        cellClass =
                          row.Status === "Active"
                            ? "status-active"
                            : "status-inactive";
                        break;
                      default:
                        cellValue = "-";
                    }

                    return `<td class="${cellClass}">${cellValue}</td>`;
                  })
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="print-footer">
          <p><strong>ABB India Limited</strong> - ProcessMaster 630 Label Management System</p>
          <p>This document contains confidential information. Distribution restricted to authorized personnel only.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();

      // Close print window after printing
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };

    showAlert("Print dialog opened successfully");
  };

  // Rest of your existing component code remains the same...

  // Prepare data for CSV export
  const csvData = filteredData.map((row, index) => {
    const csvRow = {};
    if (visibleColumns.sNo) csvRow["S No"] = index + 1;
    if (visibleColumns.labelType) csvRow["Label Type"] = row.LabelType || "";
    if (visibleColumns.serialNumber)
      csvRow["Serial Number"] = row.SerialNumber || "";
    if (visibleColumns.tagNumber) csvRow["Tag Number"] = row.TagNumber || "";
    if (visibleColumns.labelDetails)
      csvRow["Label Details"] = row.LabelDetails || "";
    if (visibleColumns.logoType) csvRow["Logo Type"] = row.LogoType || "";
    if (visibleColumns.date) csvRow["Date"] = row.Date || "";
    if (visibleColumns.addedBy) csvRow["Added By"] = row.AddedBy || "";
    if (visibleColumns.status) csvRow["Status"] = row.Status || "";
    return csvRow;
  });

  const handlePrintLabel = async (label) => {
    try {
      openPreviewModal(label);

      const serialNumber = label?.SerialNumber || "3K8225003G0365";
      const deviceVersion = label?.DevVersion;
      const sz = label?.sz;
      const ss = label?.ss;
      const modelNumber =
        label?.LabelDetails || "FEP631M1A2030A1T1B1D0aerdkejygdukhrweu";
        
      const power = label?.powerSupply;
      const qmax = label?.selectedQmax;
      const tmed = label?.selectedTmedDropdown;
      const tamb = "-20.....+60°C (-4°....140° F)";
      const fitting = label?.Fitting;
      const elect = label?.Elect;
      const size = label?.Size;
      const fexc = label?.Fexc;
      const protection = label?.ProtectionClass;
      const liner = label?.LinerMaterial;

      const getCurrentMonthYear = () => {
        const now = new Date();
        const month = now.toLocaleString("en-US", { month: "short" });
        const year = now.getFullYear();
        return `${month} ${year}`;
      };

      const date = getCurrentMonthYear();
      const logoType = (label?.LogoType || "logo_1").trim().toLowerCase();
      const labelType = (label?.LabelType || "96x98").trim().toLowerCase();

      const qrUrl = `https://my-measurement-assistant.abb.com/products/productPage/9AAC183924?SN=${serialNumber}`;

      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: "H",
        width: 100,
        margin: 1,
      });

      let middleSectionContent = "";

      console.log("Current logoType:", logoType);
      console.log("Current labelType:", labelType);

      if (labelType === "sensor(96x98)") {
        if (logoType === "logo_1") {
          middleSectionContent = `
          <!-- Black Middle Section for logo 1 (96x98) with consistent spacing -->
          <div class="flex font-semibold flex-row items-center justify-start text-[7px] border-b-2 border-black w-full p-1">
            <div class="mr-2">
              <!-- Empty space where logo would be -->
              <div class="h-[7rem] w-[9rem]"></div>
            </div>
            <div>
              <!-- Empty lines with same spacing structure as logo_2 and logo_3 -->
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <br />
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div class="h-[2px]"></div>
              <div>&nbsp;</div>
            </div>
          </div>`;
        } else if (logoType === "logo_2") {
          middleSectionContent = `
          <!-- Middle Section for logo 2 (96x98) -->
          <div class="flex font-semibold flex-row items-center justify-start text-[6px] border-b-2 border-black w-full p-1 h-[10rem]">
            <div class="mr-2">
              <img src="${fm}" alt="FM Logo" class="h-[7rem] w-[9rem]" />
            </div>
            <div>
              <div>FM17US0062X</div>
              <div>NI: CL I, Div 2, GPS ABCD T6...T1</div>
              <div>DIP: CL III, Div 2, GPS EFG T6...T3B</div>
              <div>CL I, ZN 2, AEx qc IIC T6...T1</div>
              <div>ZN 21, AEx tb IIIC T80°C...T165°C</div>
              <br />
              <div>FM17CA0033X</div>
              <div>NI: CL I, Div 2, GPS ABCD T6...T1</div>
              <div>DIP: CL III, Div 2, GPS EFG T6...T3B</div>
              <div>CL I, ZN 2, Ex ec IIC T6...T1 Gc</div>
              <div>CL I, ZN 21, Ex tb IIIC T80°C...T165°C Db</div>
              <div class="h-[2px]"></div>
              <div>See handbook for temperature class information</div>
            </div>
          </div>`;
        } else if (logoType === "logo_3") {
          middleSectionContent = `
          <!-- Middle Section for logo 3 (96x98) -->
          <div class="flex font-semibold flex-row items-center justify-start text-[6px] border-b-2 border-black w-full p-1">
            <div class="mr-2">
              <img src="${fm}" alt="FM Logo" class="h-[7rem] w-[9rem]" />
            </div>
            <div>
              <div>FM17US0062X</div>
              <div>NI:CL I,Div2,GPS ABCD T4</div>
              <div>DIP:CL II,III,Div2,GPS EFG T4</div>
              <div>CL I, ZN 2, AEx ec IIC T4</div>
              <div> ZN 21, AEx tb IIIC T180°C</div>
              <br />
              <div>FM17CA0033X</div>
              <div>NI:CL I,Div2,GPS ABCD T4</div>
              <div>DIP:CL II,III,Div2,GPS EFG T4</div>
              <div>Ex ec IIC T4 Gc</div>
              <div>Ex tb IIIC T180°C Db</div>
              <div>See handbook for temperature class information</div>
            </div>
          </div>`;
        } else {
          middleSectionContent = `
          <!-- Default Middle Section (96x98) -->
          <div class="flex-1 border-b-2 border-black w-full p-1">
            <div class="text-[7px] font-semibold">
              <div>No certification information available</div>
              <div>Please contact ABB support for details</div>
            </div>
          </div>`;
        }
      } else if (labelType === "sensor") {
        if (logoType === "logo_1") {
          middleSectionContent = `
          <!-- Black Middle Section for logo 1 (sensor) -->
          <div class="flex-1 border-b-2 border-black w-full p-1">
            <!-- Black space -->
          </div>`;
        } else if (logoType === "logo_2") {
          middleSectionContent = `
          <!-- Middle Section for logo 2 (sensor) -->
          <div class="flex mt-[0.3rem] flex-row font-semibold items-center justify-between text-[6px] border-b-2 h-[3rem] border-black w-full p-1">
            <div class="flex items-center">
              <img src="${fm}" alt="FM Logo" class="h-[3rem] w-[5rem] mr-2" />
              <div class="text-3px -mt-2 font-bold">
                <div>FM17US0062X</div>
                <div>NI: CL I, Div 2, GPS ABCD T6...T1</div>
                <div>DIP: CL III, Div 2, GPS EFG T6...T3B</div>
                <div>See handbook for temperature class information</div>
              </div>
            </div>
            <div class="mr-6 text-3px font-bold -mt-4  -ml-10">
              <div>CL I, ZN 2, AEx qc IIC T6...T1</div>
              <div>ZN 21, AEx tb IIIC T80°C...T165°C</div>
              
            </div>
          </div>`;
        } else if (logoType === "logo_3") {
          middleSectionContent = `
          <!-- Middle Section for logo 3 (sensor) -->
         <div class="flex mt-[0.3rem] flex-row font-bold items-center gap-5 text-[6px] border-b-2 h-[3rem] border-black w-full p-1">
            <div class="flex items-center">
              <img src="${fm}" alt="FM Logo" class="h-[3rem] w-[5rem] mr-2" />
              <div class="text-3px -mt-2 font-bold">
                <div>FM17US0062X</div>
                <div>NI:CL I,Div2,GPS ABCD T4</div>
                <div>DIP:CL II,III,Div2,GPS EFG T4</div>
                 <div>See handbook for temperature class information</div>
              </div>
            </div>
            <div class="text-3px font-bold -mt-4  -ml-10">
              <div>CL I, ZN 2, AEx ec IIC T4</div>
              <div>ZN 21, AEx tb IIIC T180°C</div>
             
            </div>
          </div>`;
        } else {
          middleSectionContent = `
          <!-- Default Middle Section (sensor) -->
          <div class="flex-1 border-b-2 border-black w-full p-1">
            <div class="text-[7px] font-semibold">
              <div>No certification information available</div>
              <div>Please contact ABB support for details</div>
            </div>
          </div>`;
        }
      } else if (
        labelType === "sensor(115x35)" ||
        labelType === "transmitter"
      ) {
        middleSectionContent = "";
      }

      const printContainer = document.createElement("div");

      if (labelType === "sensor(115x35)") {
        printContainer.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>ABB ProcessMaster 630 Label</title>
        <style>
            @page {
                size: 115mm 35mm;
                margin: 0;
            }
            
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                font-size: 7px;
                line-height: 1.1;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            @media print {
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .print-container {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            }
        </style>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
        <div class="w-[115mm] h-[35mm] border-black border-2 flex flex-col text-black print-container">
            <!-- Header Section -->
            <div class="relative flex items-center justify-between border-b-2 border-black w-full px-1 py-1">
                <!-- Logo aligned to left -->
                <div class="h-6">
                    <img src="${black}" alt="ABB Logo" class="w-16 h-6 object-contain" />
                </div>
    
                <!-- Absolutely centered title -->
                <div class="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold">
                    ProcessMaster 630
                </div>
    
                <div class="w-5 h-6">
                    <img src="${bin}" alt="Dispose Icon" class="w-5 h-6 object-contain" />
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="flex w-full font-semibold border-black flex-grow">
                <!-- Left Section -->
                <div class="w-2/5 font-bold flex flex-col text-[7px] border-r-2 border-black p-1 relative">
                    <div class="mb-1">Serial No: ${serialNumber}</div>
                    
                    <div class="mb-2">
                        <div class="mb-0">
                            <span class="font-bold">Model number: </span>${modelNumber.substring(
                              0,
                              25
                            )}
                        </div>
                        <div class="leading-tight">${modelNumber.substring(
                          25,
                          58
                        )}</div>
                        <div class="leading-tight">${modelNumber.substring(
                          58,
                          97
                        )}</div>
                        <div class="leading-tight">${modelNumber.substring(
                          97,
                          110
                        )}</div>
                    </div>
                    
                    <div class="mt-2">
                        <div>Dev. version: ${deviceVersion}</div>
                        <div>Update:</div>
                    </div>
                    
                    <div class="absolute right-1 bottom-1 w-8 h-8 border border-black bg-white flex items-center justify-center">
                        <img src="${qrDataUrl}" alt="QR Code" class="w-full h-full object-contain" />
                    </div>
                </div>
    
                <!-- Right Section -->
                <div class="text-[7px] w-3/5 p-1 font-bold">
                    <div class="mb-1">${power}</div>
                    <div class="mb-1">Protection class: IP67/IP67</div>
                    <div class="mb-2">Tamb: ${tamb}</div>
                    
                    <!-- Specifications Grid -->
                    <div class="grid grid-cols-2 gap-x-2 text-[7px] leading-tight">
                        <div>Size: ${size}</div>
                        <div>Fitting: ${fitting}</div>
                        
                        <div>Qmax: ${qmax}</div>
                        <div>Fexc: ${fexc}</div>
                        
                        <div>Liner mat: ${liner}</div>
                        <div>Elect: ${elect}</div>
                        
                        <div>Tmed: ${tmed}</div>
                        <div>PED:</div>
                        
                        <div>Ss: ${ss}</div>
                        <div>Sz: ${sz}</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
      } else if (labelType === "transmitter") {
        printContainer.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>ABB ProcessMaster 630 Label</title>
        <style>
            @page {
                size: 115mm 35mm;
                margin: 0;
            }
            
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                font-size: 7px;
                line-height: 1.1;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            @media print {
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .print-container {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            }
        </style>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
        <div class="w-[115mm] h-[35mm] border-black border-2 flex flex-col text-black print-container">
            <!-- Header Section -->
            <div class="relative flex items-center justify-between border-b-2 border-black w-full px-1 py-1">
                <!-- Logo aligned to left -->
                <div class="h-6">
                    <img src="${black}" alt="ABB Logo" class="w-16 h-6 object-contain" />
                </div>
    
                <!-- Absolutely centered title -->
                <div class="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold">
                    ProcessMaster 630
                </div>
    
                <div class="w-5 h-6">
                    <img src="${bin}" alt="Dispose Icon" class="w-5 h-6 object-contain" />
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="flex w-full font-semibold border-black flex-grow">
                <!-- Left Section -->
                <div class="w-2/5 font-bold flex flex-col text-[7px] border-r-2 border-black p-1 relative">
                    <div class="mb-1">Serial No: ${serialNumber}</div>
                    
                    <div class="mb-2">
                        <div class="mb-0">
                            <span class="font-bold">Model number: </span>${modelNumber.substring(
                              0,
                              23
                            )}
                        </div>
                        <div class="leading-tight">${modelNumber.substring(
                          25,
                          70
                        )}</div>
                    </div>
                    
                    <div class="mt-2">
                        <div>Dev. version: ${deviceVersion}</div>
                        <div>Update:</div>
                    </div>
                    
                    <div class="absolute right-1 bottom-1 w-8 h-8 border border-black bg-white flex items-center justify-center">
                        <img src="${qrDataUrl}" alt="QR Code" class="w-full h-full object-contain" />
                    </div>
                </div>
    
                <!-- Right Section -->
                <div class="text-[7px] w-3/5 p-1 font-bold">
                    <div class="mb-1">${power}</div>
                    <div class="mb-1">Protection class: IP67/IP67</div>
                    <div class="mb-2">Tamb: ${tamb}</div>
                    
                    <!-- Specifications Grid -->
                    <div class="grid grid-cols-2 gap-x-2 text-[7px] leading-tight">
                        <div>Size:</div>
                        <div>Fitting:</div>
                        
                        <div>Qmax:</div>
                        <div>Fexc:</div>
                        
                        <div>Liner mat:</div>
                        <div>Elect:</div>
                        
                        <div>Tmed:</div>
                        <div>PED:</div>
                        
                        <div>Ss:</div>
                        <div>Sz:</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
      } else if (labelType === "sensor") {
        printContainer.innerHTML = `
     <!DOCTYPE html>
<html>
<head>
  <title>Sensor Label Print</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      size: 113.50mm 58.50mm;
      margin: 0;
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
    /* Ensure consistent border rendering */
    .label-container {
      width: 113.50mm;
      height: 58.50mm;
      border: 2px solid black;
      border-radius: 8px;
      overflow: hidden;
    }
  </style>
</head>
<body class="m-0 p-0 font-sans text-black">
  <div class="label-container flex flex-col text-black">
    <!-- Header -->
    <div class="relative flex items-center border-b-2 border-black w-full px-1 py-1 rounded-t-lg">
      <!-- Logo aligned to left -->
      <div class="h-8">
        <img src="${black}" alt="ABB Logo" class="w-[4rem] h-[2rem] object-contain" />
      </div>

      <!-- Absolutely centered title -->
      <div class="absolute left-1/2 transform -translate-x-1/2 text-[18px] font-bold">
        ProcessMaster 630
      </div>
    </div>
  
    <!-- Main Content -->
    <div class="flex flex-col flex-1 w-full">
      <!-- Upper Section -->
      <div class="flex w-full border-b-2 h-[5.8rem] border-black">
        <!-- Left Section -->
        <div class="w-[50%] text-[6px] border-r-2 border-black p-1 relative font-bold">
          <div>Serial No: ${serialNumber}</div>
          <div class="h-[5px]"></div>
          <div style="margin-top: 1px;">
            <span class="font-bold">Model number: </span>${modelNumber.substring(
              0,
              33
            )}
          </div>
          <div style="margin-top: 0px;">${modelNumber.substring(33, 73)}</div>
          <div style="margin-top: 0px;">${modelNumber.substring(73, 120)}</div>
        
          <div class="h-[2px]"></div>
          <div class="mt-2">Dev. version: ${deviceVersion}</div>
          <!-- QR Code positioned with absolute positioning -->
          <div class="w-[33px] h-[33px] absolute right-1 top-[3.3rem] border border-black">
            <img src="${qrDataUrl}" alt="QR Code" class="w-full h-full object-contain" />
          </div>
        </div>
  
                    <!-- Right Section with no gaps between headings and values -->
<div class="text-[6px] w-[60%] leading-[11px] p-1 font-bold">
  <p>${power}</p>
  <p>Protection class:${protection}</p>
  <p>Tamb: ${tamb}</p>
  
  <!-- Using table display for perfect alignment without gaps -->
  <div style="display: table; width: 100%;">
    <div style="display: table-row;">
      <div style="display: table-cell; width: 50%;">Size:${size}</div>
      <div style="display: table-cell; width: 50%;">Fitting:${fitting}</div>
    </div>
    <div style="display: table-row;">
      <div style="display: table-cell;">Qmax:${qmax}</div>
      <div style="display: table-cell;">Fexc:${fexc}</div>
    </div>
    <div style="display: table-row;">
      <div style="display: table-cell;">Liner mat:${liner}</div>
      <div style="display: table-cell;">Elect:${elect}</div>
    </div>
    <div style="display: table-row;">
      <div style="display: table-cell;">Tmed:${tmed}</div>
      <div style="display: table-cell;">PED:</div>
    </div>
    <div style="display: table-row;">
      <div style="display: table-cell;">Ss:${ss}</div>
      <div style="display: table-cell;">Sz:${sz}</div>
    </div>
  </div>
</div>
      </div>
  
     
         ${middleSectionContent}
      
   
  
      <!-- Footer -->
       <div class="flex font-bold justify-between items-start text-[7px] w-full px-2">
                <div>
                  <div>Made in:</div>
                  <div>ABB India Limited, Bangalore</div>
                  <div class="text-center ml-15">${date}</div>
                </div>
                <div class="mt-1">
                  <div>Designed by ABB AG</div>
                  <div>Goettingen, Germany</div>
                </div>
                
                  <div class="w-[80px] h-[29px]">
                  <img src=${dispose} alt="Dispose Icon" class="w-[80px] h-[29px]"/>
                  </div>
                  
              </div>
    </div>
  </div>
</body>
</html>
      `;
      } else {
        console.log("Creating standard label with logoType:", logoType);
        console.log("Using middleSectionContent:", middleSectionContent);

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
                font-family: Arial;
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
            <div class="w-[96mm] h-[98mm] border-black border-2 rounded-lg flex flex-col text-black">
              
              <!-- Header -->
              <div class="flex items-center justify-between border-b-2 border-black w-full rounded-t-lg h-[2.7rem]">
                <div class="h-full flex items-center">
                  <img src="${black}" alt="ABB Logo" class="w-[4rem] h-[4rem] object-contain" />
                </div>
                <div class="text-[20px] font-bold text-center flex-1 leading-none font-[Arial]">
                  ProcessMaster 630
                </div>
              </div>
        
              <!-- Main Content -->
              <div class="flex w-full border-b-2 font-semibold border-black  h-[7.6rem] relative">
                
                <!-- Left Section -->
                <div class="w-[40%] font-bold text-[6px] border-r-2 border-black p-1">
                  <div>Serial No: ${serialNumber}</div>
                  <div style="margin-top: 4px;">
                    <span class="font-bold">Model number: </span>${modelNumber.substring(
                      0,
                      23
                    )}
                  </div>
                  <div style="margin-top: 0px;">${modelNumber.substring(
                    23,
                    55
                  )}</div>
                  <div style="margin-top: 0px;">${modelNumber.substring(
                    55,
                    88
                  )}</div>
                  <div style="margin-top: 0px;">${modelNumber.substring(
                    88,
                    110
                  )}</div>
        
                  <div class="h-[5px]"></div>
                  <div>OPTIONS 1 ></div>
                  <div>OPTIONS 2 ></div>
                  <div class="h-[5px]"></div>
                  <div>Dev. version:${deviceVersion}</div>
                  <div>Update:</div>
                </div>
        
                <!-- QR Code positioned 10px from bottom border -->
                <div class="absolute bottom-[2px] left-[6.6rem] w-[33px] h-[33px] border text-center flex items-center justify-center">
                  <img src="${qrDataUrl}" alt="QR Code" class="w-full h-full object-contain" />
                </div>
              
                <!-- Right Section with no gaps between headings and values -->
<div class="text-[6px] w-[60%] leading-[0.9rem] p-1 font-bold">
  <p>${power}</p>
  <p>Protection class: IP67/IP67</p>
  <p>Tamb: ${tamb}</p>
  
  <!-- Using table display for perfect alignment without gaps -->
  <div style="display: table; width: 100%;">
    <div style="display: table-row;">
      <div style="display: table-cell; width: 50%;">Size:${size}</div>
      <div style="display: table-cell; width: 50%;">Fitting:${fitting}</div>
    </div>
    <div style="display: table-row;">
      <div style="display: table-cell;">Qmax:${qmax}</div>
      <div style="display: table-cell;">Fexc:${fexc}</div>
    </div>
    <div style="display: table-row;">
      <div style="display: table-cell;">Liner mat:${liner}</div>
      <div style="display: table-cell;">Elect:${elect}</div>
    </div>
    <div style="display: table-row;">
      <div style="display: table-cell;">Tmed:${tmed}</div>
      <div style="display: table-cell;">PED:</div>
    </div>
    <div style="display: table-row;">
      <div style="display: table-cell;">Ss:${ss}</div>
      <div style="display: table-cell;">Sz:${sz}</div>
    </div>
  </div>
</div>
              </div>
        
              <!-- Optional Middle Section -->
              ${middleSectionContent}
        
              <!-- Footer -->
              <div class="flex font-semibold justify-between items-start mt-1 text-[7px] px-2">
                <div>
                  <div>Made in:</div>
                  <div>ABB India Limited, Bangalore</div>
                  <div class="text-center">${date}</div>
                </div>
                                  <div class="-mr-10">
                  <div class="w-full">Designed by ABB AG</div>
                  <div>Goettingen, Germany</div>
                </div>
                <div class="flex mr-6 mt-3">
                  <div class="w-30 h-10">
                    <img src=${dispose} alt="Dispose Icon" class="w-30 h-10" />
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
        `;
      }

      if (labelRef.current) {
        labelRef.current.innerHTML = "";
        labelRef.current.appendChild(printContainer.cloneNode(true));
      }
    } catch (error) {
      console.error("Error generating label preview:", error);
    }
  };

  const printLabel = () => {
    if (!selectedLabel) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    iframe.style.width = "0";
    iframe.style.height = "0";
    document.body.appendChild(iframe);

    const contentToPrint = labelRef.current?.innerHTML;

    if (contentToPrint) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(contentToPrint);
      iframeDoc.close();

      iframe.onload = () => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
      };
    }
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
            <Typography variant="h4" sx={{ fontWeight: 600, color: "white" }}>
              Dynamic Labels
            </Typography>

            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                gap: "15px",
                alignItems: "center",
              }}
            >
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
                Add Dynamic Label
              </Button>

              <Button
                onClick={() => navigate("/Static")}
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
                Add Static Label
              </Button>
            </Box>
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
              onClick={handleCopyToClipboard}
              sx={{
                color: "#475569",
                borderColor: "#cbd5e1",
                textTransform: "none",
              }}
            >
              Copy
            </Button>
            <CSVLink
              data={csvData}
              filename="label_data.csv"
              ref={csvLinkRef}
              style={{ textDecoration: "none" }}
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
                CSV
              </Button>
            </CSVLink>

            <Button
              size="small"
              variant="outlined"
              onClick={handleExcelExport}
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
              onClick={handlePDFExport}
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
              onClick={handlePrintTable}
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
            sx={{
              maxHeight: "calc(100vh - 400px)",
              minHeight: "400px",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f5f9",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                borderRadius: "4px",
                "&:hover": {
                  background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                },
              },
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "400px",
                  gap: 2,
                }}
              >
                <CircularProgress
                  size={48}
                  sx={{
                    color: "#667eea",
                  }}
                />
                <Typography color="#64748b" fontWeight={500}>
                  Loading data...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ p: 6, textAlign: "center" }}>
                <Typography color="error" variant="h6" gutterBottom>
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                    },
                  }}
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </Box>
            ) : (
              <Table stickyHeader aria-label="enhanced label print table">
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        fontWeight: "700",
                        color: "#1e293b",
                        fontSize: "0.875rem",
                        letterSpacing: "0.025em",
                        textTransform: "uppercase",
                        borderBottom: "2px solid #e2e8f0",
                        py: 2,
                      },
                    }}
                  >
                    {visibleColumns.sNo && (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.05)",
                          },
                        }}
                        onClick={() => handleSort("_id")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          S No {getSortDirection("_id")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.action && (
                      <TableCell sx={{ minWidth: 160 }}>Action</TableCell>
                    )}
                    {visibleColumns.labelType && (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          minWidth: 150,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.05)",
                          },
                        }}
                        onClick={() => handleSort("LabelType")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          Label Type {getSortDirection("LabelType")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.serialNumber && (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          minWidth: 150,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.05)",
                          },
                        }}
                        onClick={() => handleSort("SerialNumber")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          Serial Number {getSortDirection("SerialNumber")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.tagNumber && (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.05)",
                          },
                        }}
                        onClick={() => handleSort("TagNumber")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          Tag Number {getSortDirection("TagNumber")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.labelDetails && (
                      <TableCell sx={{ minWidth: 250 }}>Model Number</TableCell>
                    )}
                    {visibleColumns.logoType && (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.05)",
                          },
                        }}
                        onClick={() => handleSort("LogoType")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          Logo Type {getSortDirection("LogoType")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.date && (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.05)",
                          },
                        }}
                        onClick={() => handleSort("Date")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          Date {getSortDirection("Date")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.addedBy && (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.05)",
                          },
                        }}
                        onClick={() => handleSort("AddedBy")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          Added By {getSortDirection("AddedBy")}
                        </Box>
                      </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.05)",
                          },
                        }}
                        onClick={() => handleSort("Status")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
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
                          "&:nth-of-type(odd)": { bgcolor: "#fbfcfd" },
                          "&:hover": {
                            bgcolor: "rgba(102, 126, 234, 0.03) !important",
                            transform: "scale(1.001)",
                            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.1)",
                          },
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "pointer",
                        }}
                      >
                        {visibleColumns.sNo && (
                          <TableCell sx={{ fontWeight: 600, color: "#64748b" }}>
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                        )}
                        {visibleColumns.action && (
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                onClick={() => handlePrintLabel(row)}
                                size="small"
                                sx={{
                                  background:
                                    "linear-gradient(45deg, #138086, #3c4cad)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #138086, #56c596)",
                                    transform: "translateY(-1px)",
                                    boxShadow:
                                      "0 4px 12px rgba(16, 185, 129, 0.4)",
                                  },
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontWeight: 600,
                                  px: 2,
                                  transition: "all 0.2s ease",
                                  minWidth: "80px",
                                }}
                              >
                                Preview
                              </Button>
                              <Button
                                variant="contained"
                                onClick={() => handleEditLabel(row)}
                                size="small"
                                sx={{
                                  background:
                                    "linear-gradient(45deg, #f59e0b, #d97706)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #d97706, #f59e0b)",
                                    transform: "translateY(-1px)",
                                    boxShadow:
                                      "0 4px 12px rgba(245, 158, 11, 0.4)",
                                  },
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontWeight: 600,
                                  px: 2,
                                  transition: "all 0.2s ease",
                                  minWidth: "70px",
                                }}
                                startIcon={<EditIcon fontSize="small" />}
                              >
                                Edit
                              </Button>
                            </Box>
                          </TableCell>
                        )}
                        {visibleColumns.labelType && (
                          <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                            {row.LabelType}
                          </TableCell>
                        )}
                        {visibleColumns.serialNumber && (
                          <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                            {row.SerialNumber}
                          </TableCell>
                        )}
                        {visibleColumns.tagNumber && (
                          <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                            {row.TagNumber}
                          </TableCell>
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
                              sx={{
                                "& .MuiTooltip-tooltip": {
                                  bgcolor: "#1f2937",
                                  borderRadius: 2,
                                  fontSize: "0.875rem",
                                },
                                "& .MuiTooltip-arrow": {
                                  color: "#1f2937",
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontWeight: 500,
                                  color: "#374151",
                                }}
                              >
                                {row.LabelDetails}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                        )}
                        {visibleColumns.logoType && (
                          <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                            {row.LogoType}
                          </TableCell>
                        )}
                        {visibleColumns.date && (
                          <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                            {row.Date}
                          </TableCell>
                        )}
                        {visibleColumns.addedBy && (
                          <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                            {row.AddedBy}
                          </TableCell>
                        )}
                        {visibleColumns.status && (
                          <TableCell>
                            <Chip
                              label={row.Status}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                borderRadius: 2,
                                textTransform: "uppercase",
                                fontSize: "0.75rem",
                                letterSpacing: "0.025em",
                                ...(row.Status === "Active"
                                  ? {
                                      background:
                                        "linear-gradient(45deg, #10b981, #059669)",
                                      color: "white",
                                      boxShadow:
                                        "0 2px 8px rgba(16, 185, 129, 0.3)",
                                    }
                                  : row.Status === "Inactive"
                                  ? {
                                      background:
                                        "linear-gradient(45deg, #ef4444, #dc2626)",
                                      color: "white",
                                      boxShadow:
                                        "0 2px 8px rgba(239, 68, 68, 0.3)",
                                    }
                                  : {
                                      background: "#f3f4f6",
                                      color: "#374151",
                                    }),
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
                        sx={{ textAlign: "center", py: 6 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <SearchIcon sx={{ fontSize: 48, color: "#cbd5e1" }} />
                          <Typography
                            variant="h6"
                            color="#64748b"
                            fontWeight={500}
                          >
                            No matching records found
                          </Typography>
                          <Typography variant="body2" color="#94a3b8">
                            Try adjusting your search criteria
                          </Typography>
                        </Box>
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
          />
        </Card>
      </Box>

      {/* Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={closePreviewModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Label Preview</Typography>
            <IconButton onClick={closePreviewModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            ref={labelRef}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              minHeight: "400px",
            }}
          >
            {/* Label content will be injected here via labelRef */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={closePreviewModal}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={printLabel}
            startIcon={<PrintIcon />}
          >
            Print Label
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainPageTable;
