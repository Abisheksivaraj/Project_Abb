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
} from "@mui/icons-material";

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

  const handlePrintLabel = async (label) => {
    try {
      openPreviewModal(label);

      const serialNumber = label?.SerialNumber || "3K8225003G0365";
      const modelNumber =
        label?.ModelNumber || "FEP631M1A2030A1T1B1D0aerdkejygdukhrweu";

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
          <!-- Black Middle Section for logo 1 (96x98) -->
          <div class="flex-1 border-b-2 border-black w-full p-1">
            <!-- Black space -->
          </div>`;
        } else if (logoType === "logo_2") {
          middleSectionContent = `
          <!-- Middle Section for logo 2 (96x98) -->
          <div class="flex font-semibold flex-row items-center justify-start text-[7px] border-b-2 border-black w-full p-1">
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
          <div class="flex font-semibold flex-row items-center justify-start text-[7px] border-b-2 border-black w-full p-1">
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
          <div class="flex mt-[0.3rem] flex-row font-semibold items-center justify-between text-[7px] border-b-2 h-[3rem] border-black w-full p-1">
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
         <div class="flex mt-[0.3rem] flex-row font-bold items-center gap-5 text-[7px] border-b-2 h-[3rem] border-black w-full p-1">
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
          <title>Sensor Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 115mm 35mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            * {
              box-sizing: border-box;
              color: black;
            }
            .label-border {
              border: 2px solid black;
              box-sizing: border-box;
            }
            .divider {
              border-color: black;
            }
          </style>
        </head>
        <body class="m-0 p-0 font-sans text-black text-[7px]">
          <!-- Single container with complete border -->
          <div class="w-[115mm] h-[35mm] label-border">
            <!-- Inner padding wrapper -->
            <div class="flex flex-col h-full">
              <!-- Header with bottom border -->
            <div class="flex justify-between items-center border-b-2 border-black">

                <!-- Left Logo -->
                <div class="w-[2.5rem] flex-shrink-0">
                  <img src=${black} alt="ABB Logo" class="w-full object-contain" />
                </div>
                <!-- Title -->
                <div class="text-center text-[14px] font-bold flex-grow">ProcessMaster 630</div>
                <!-- Dispose Icon -->
                <div class="w-[6mm] h-[6mm] flex-shrink-0">
                  <img src=${dispose} alt="Dispose" class="w-full h-full object-contain" />
                </div>
              </div>
              <!-- Main content flex container -->
              <div class="flex font-bold text-[8px] mt-1 leading-[0.8rem] flex-grow">
                
            <!-- Left side with fixed-width columns to ensure QR code doesn't resize -->
      <div class="w-1/2 p-1 border-r-2 divider h-full flex flex-col justify-between">
        <div class="flex">
          <!-- Fixed width for the text column -->
          <div class="flex flex-col space-y-[1px] w-[60%] overflow-hidden mr-1">
            <div class="w-full whitespace-nowrap">Serial No: ${serialNumber}</div>
            <div class="pb-1">
              <span class="font-bold">Model number: </span>
              <span class="break-words">${modelNumber}</span>
            </div>
            <div><strong>Dev. version:</strong> 01.14.00</div>
            <div><strong>Update:</strong></div>
          </div>
          <!-- Fixed size for QR code -->
          <div class="w-[40px]  mt-12 ml-[3rem] flex-shrink-0">
            <img src=${qrDataUrl} alt="QR" class="border w-[40px] h-[40px] object-contain" />
          </div>
        </div>
      </div>
                <!-- Right side full height -->
                <div class="w-[60%] pl-2 text-[8px] leading-[10px] h-full">
            

<div class="flex flex-row  gap-[3rem]">
<p>
24 V DC, 60 Hz   
</p>
<p>
  Smax>20VA
</p>

</div>

<p>

Protection class : IP 67 / IP 67
</p>


<p>
Tamb : -20.....+60°C (-4°....140° F)
</p>


<div class="flex flex-row gap-8">
<p>

Size :  DN 150 (6")
</p>

<p>

 Fitting: ASME CL150
</p>


</div>


<div class="flex flex-row gap-[2.1rem]">
<p>

Qmax : 600 m³/h
</p>

<p>


 Fexec: 15_12.5 HZ
</p>


</div>




<div class="flex flex-row gap-12">
<p>

Liner mat : PTFE
</p>

<p>

  Elect:Stainless steel 316Ti (1.4571)
</p>


</div>


<div class="flex flex-row gap-5">
<p>

 Tmed : 130°C (266°F)
</p>

<p>

 PED:

</p>


</div>



<div class="flex flex-row gap-[4.2rem]">
<p>

 Ss:  0.34
</p>

<p>
 Sz:  0.34
</p>


</div>








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
          <title>Sensor Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 115mm 35mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            * {
              box-sizing: border-box;
              color: black;
            }
            .label-border {
              border: 2px solid black;
              box-sizing: border-box;
            }
            .divider {
              border-color: black;
            }
          </style>
        </head>
        <body class="m-0 p-0 font-sans text-black text-[7px]">
          <!-- Single container with complete border -->
          <div class="w-[115mm] h-[35mm] label-border">
            <!-- Inner padding wrapper -->
            <div class="flex flex-col h-full">
              <!-- Header with bottom border -->
            <div class="flex justify-between items-center border-b-2 border-black">

                <!-- Left Logo -->
                <div class="w-[2.5rem] flex-shrink-0">
                  <img src=${black} alt="ABB Logo" class="w-full object-contain" />
                </div>
                <!-- Title -->
                <div class="text-center text-[14px] font-bold flex-grow">ProcessMaster 630</div>
                <!-- Dispose Icon -->
                <div class="w-[6mm] h-[6mm] flex-shrink-0">
                  <img src=${dispose} alt="Dispose" class="w-full h-full object-contain" />
                </div>
              </div>
              <!-- Main content flex container -->
              <div class="flex font-bold text-[8px] mt-1 leading-[0.8rem] flex-grow">
                
            <!-- Left side with fixed-width columns to ensure QR code doesn't resize -->
      <div class="w-1/2 p-1 border-r-2 divider h-full flex flex-col justify-between">
        <div class="flex">
          <!-- Fixed width for the text column -->
          <div class="flex flex-col space-y-[1px] w-[60%] overflow-hidden mr-1">
            <div class="w-full whitespace-nowrap">Serial No: ${serialNumber}</div>
            <div class="pb-1">
              <span class="font-bold">Model number: </span>
              <span class="break-words">${modelNumber}</span>
            </div>
            <div><strong>Dev. version:</strong> 01.14.00</div>
            <div><strong>Update:</strong></div>
          </div>
          <!-- Fixed size for QR code -->
          <div class="w-[40px]  mt-12 ml-[3rem] flex-shrink-0">
            <img src=${qrDataUrl} alt="QR" class="border w-[40px] h-[40px] object-contain" />
          </div>
        </div>
      </div>
                <!-- Right side full height -->
                <div class="w-[60%] pl-2 text-[8px] leading-[10px] h-full">
            

<div class="flex flex-row  gap-[3rem]">
<p>
24 V DC, 60 Hz   
</p>


</div>

<p>

Protection class : IP 67 / IP 67
</p>


<p>
Tamb : -20.....+60°C (-4°....140° F)
</p>


<div class="flex flex-row gap-8">
<p>

Size :  DN 150 (6")
</p>

<p>

 Fitting: ASME CL150
</p>


</div>


<div class="flex flex-row gap-[2.1rem]">
<p>

Qmax : 600 m³/h
</p>

<p>


 Fexec: 15_12.5 HZ
</p>


</div>




<div class="flex flex-row gap-12">
<p>

Liner mat : PTFE
</p>

<p>

  Elect:Stainless steel 316Ti (1.4571)
</p>


</div>


<div class="flex flex-row gap-5">
<p>

 Tmed : 130°C (266°F)
</p>

<p>

 PED:

</p>


</div>



<div class="flex flex-row gap-[4.2rem]">
<p>

 Ss:  0.34
</p>

<p>
 Sz:  0.34
</p>


</div>








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
          <div class="w-[42%] text-[7px] border-r-2 border-black p-1 relative font-bold">
            <div>Serial No: ${serialNumber}</div>
            <div>Model number: <span class="break-words">${modelNumber}</span></div>
            <div class="h-[2px]"></div>
            <div class="mt-7">Dev. version: 01.14.00</div>
            <!-- QR Code positioned with absolute positioning -->
            <div class="w-[33px] h-[33px] absolute right-2 top-[3.5rem] border border-black">
              <img src="${qrDataUrl}" alt="QR Code" class="w-full h-full object-contain" />
            </div>
          </div>
    
          <!-- Right Section -->
          <div class="text-[7px] w-[60%] p-1 font-bold">
            <p>24 V DC, 60 Hz</p>
            <p>Protection class: IP67/IP67</p>
            <p>Tamb: -20°....+60°C (-4°....140°F)</p>
            
            <div class="flex gap-9">
              <p>Size : DN 100(4")</p>
              <p>Fitting: ASME CL 150</p>
            </div>

            <div class="flex gap-[1.5rem]">
              <p>Qmax : 240 m³/h(4")</p>
              <p>Fexc: 15_12.5 HZ</p>
            </div>

            <div class="flex gap-[2.4rem]">
              <p>Liner mat : PTFE</p>
              <p>Elect: Stainless steel 316Ti (1.4571)</p>
            </div>

            <div class="flex gap-[1.4rem]">
              <p>Tmed : 130°C (266°F)</p>
              <p>PED:</p>
            </div>

            <div class="flex gap-[3.3rem]">
              <p>Ss : 147.130</p>
              <p>Sz: -10.07900</p>
            </div>
          </div>
        </div>
    
       
           ${middleSectionContent}
        
     
    
        <!-- Footer -->
         <div class="flex font-bold justify-between items-start text-[7px] w-full px-2">
                  <div>
                    <div>Made in:</div>
                    <div>ABB India Limited, Bangalore</div>
                    <div class="text-center">${date}</div>
                  </div>
                  <div>
                    <div>Designed by ABB AG</div>
                    <div>Goettingen, Germany</div>
                  </div>
                  <div class="flex mt-1 gap-[6px] font-bold items-center justify-center">
                    <div class="w-[25px] h-[25px] flex items-center justify-center text-[8px]">
                    <img src=${dispose} alt="Dispose Icon" class="w-[25px] h-[25px]"/>
                    </div>
                    <div class="w-[25px] h-[25px] flex items-center justify-center text-[8px]">
                      <img src=${hot} alt="Hot Surface Icon" class="w-[25px] h-[25px]"/>
                    </div>
                    <div class="w-[25px] h-[25px] flex items-center justify-center text-[8px]">
                      <img src=${warning} alt="Warning Icon" class="w-[25px] h-[25px]"/>
                    </div>
                    <div class="w-[25px] h-[25px] flex items-center justify-center text-[8px]">
                      <img src=${manual} alt="Manual Icon" class="w-[25px] h-[25px]"/>
                    </div>
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
              font-family: Arial
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
             <div class="flex items-center justify-between border-b-2 border-black w-full rounded-t-lg h-[3.5rem]">
  <div class="h-full flex items-center">
    <img src="${black}" alt="ABB Logo" class="w-[4rem] h-[4rem] object-contain" />
  </div>
  <div class="text-[20px] font-bold text-center flex-1 leading-none font-[Arial]">
    ProcessMaster 630
  </div>
</div>

        
              <!-- Main Content -->
              <div class="flex flex-col flex-1 border-b-2 border-black w-full">
                
                <!-- Upper Section -->
                <div class="flex w-full border-b-2 font-semibold border-black">
                  <!-- Left Section -->
                 <div class="w-[9rem] font-bold  text-[8px] border-r-2 border-black p-1">
  <div>Serial No: ${serialNumber}</div>
  
  <div>Model number: <span class="break-words">${modelNumber}</span></div>
  
  <div class="h-[2px]"></div>
  <div>OPTIONS 1 ></div>
  <div>OPTIONS 2 ></div>
  <div class="h-[2px]"></div>
  <div>Dev. version: 01.14.00</div>
  <div>Update:</div>

  <div class="w-[33px] h-[33px] ml-[5.5rem] border text-center flex items-center justify-center -mt-4">
    <img src="${qrDataUrl}" alt="QR Code" class="w-full h-full object-contain" />
  </div>
</div>

        
                  <!-- Right Section -->
                  <div class="font-bold  text-[8px] h-4 p-1 flex font-fam ">
                    <div>
                      <div>24 V DC, 60 Hz</div>
                      <div>Protection class: IP67/IP67</div>
                      <div class="whitespace-nowrap">Tamb: -20°....+60°C (-4°....140°F)</div>
                      <div class="h-[2px]"></div>
                      

<div class="flex flex-col gap-[1px]">
<div class="flex gap-[.8rem]">
                      <div class="w-full">size:DN 300 (12")</div>
                      <div class="w-full whitespace-nowrap">Fitting: ASME CL150</div>
                      </div>

  <div class="flex items-center gap-[2.6rem]">
    <div>Qmax: 2400 m³/h</div>
    <div class="whitespace-nowrap">Fexc: 15_12.5 HZ</div>
  </div>

  <div class="flex items-center gap-[2.8rem]">
    <div class="whitespace-nowrap">Liner mat: PTFE</div>
    <div class="whitespace-nowrap">Elect: Hast. C-4 (2.4610)</div>
  </div>

  <div class="flex items-center gap-[1.8rem]">
    <div>Tmed: 130°C (266°F)</div>
    <div>PED:</div>
  </div>

  <div class="flex items-center gap-[3.9rem]">
    <div>Ss: 150.214</div>
    <div>Sz: -0.390</div>
  </div>
</div>

                      
                    
                  
                      
                    </div>
                  </div>
                </div>
        
                ${middleSectionContent}
        
                <!-- Footer -->
                <div class="flex font-semibold justify-between items-start text-[7px] w-full px-2">
                  <div>
                    <div>Made in:</div>
                    <div>ABB India Limited, Bangalore</div>
                    <div class="text-center">${date}</div>
                  </div>
                  <div>
                    <div>Designed by ABB AG</div>
                    <div>Goettingen, Germany</div>
                  </div>
                  <div class="flex mt-1 gap-[6px] font-bold items-center justify-center">
                    <div class="w-[25px] h-[25px] flex items-center justify-center text-[8px]">
                    <img src=${dispose} alt="Dispose Icon" class="w-[25px] h-[25px]"/>
                    </div>
                    <div class="w-[25px] h-[25px] flex items-center justify-center text-[8px]">
                      <img src=${hot} alt="Hot Surface Icon" class="w-[25px] h-[25px]"/>
                    </div>
                    <div class="w-[25px] h-[25px] flex items-center justify-center text-[8px]">
                      <img src=${warning} alt="Warning Icon" class="w-[25px] h-[25px]"/>
                    </div>
                    <div class="w-[25px] h-[25px] flex items-center justify-center text-[8px]">
                      <img src=${manual} alt="Manual Icon" class="w-[25px] h-[25px]"/>
                    </div>
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
                    {visibleColumns.logoType && (
                      <TableCell
                        sx={{ cursor: "pointer", minWidth: 120 }}
                        onClick={() => handleSort("LogoType")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Logo Type {getSortDirection("LogoType")}
                        </Box>
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
                              onClick={() => handlePrintLabel(row)}
                              size="small"
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
                        {visibleColumns.logoType && (
                          <TableCell>{row.LogoType}</TableCell>
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
                              color={
                                row.Status === "Active" ? "success" : "default"
                              }
                              sx={{ fontWeight: 500 }}
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
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          No matching records found
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
    </Box>
  );
};

export default MainPageTable;
