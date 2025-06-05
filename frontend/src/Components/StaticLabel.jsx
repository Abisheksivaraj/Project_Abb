import React, { useState, useRef } from "react";
import {
  ChevronDown,
  Printer,
  ArrowLeft,
  Check,
  FileText,
  AlertTriangle,
  Shield,
  X,
  Eye,
} from "lucide-react";

import fm from "../assets/fm.png";
import bin from "../assets/bin3.png";
import book from "../assets/book.png";
import warning from "../assets/warning.png";
import hot from "../assets/hot.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, Typography } from "@mui/material";

const StaticLabel = () => {
  const [selectedDiv2Label, setSelectedDiv2Label] = useState("");
  const [selectedDiv1Label, setSelectedDiv1Label] = useState("");
  const [selectedWarningLabel, setSelectedWarningLabel] = useState("");
  const [previewLabel, setPreviewLabel] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const labelRef = useRef(null);

  const div2Labels = [
    "FET-ETHERNET (DIV 2)",
    "FET-GENERAL PURPOSE",
    "FET-W/O ETHERNET (DIV 2)",
    "FEP 631/632 (TYPE 4) -WITH ETHERNET",
  ];

  const div1Labels = [
    "FET-ETHERNET (DIV 2)",
    "FET-GENERAL PURPOSE",
    "FET-W/O ETHERNET (DIV 2)",
    "FEP 631/632 (TYPE 4) -WITH ETHERNET",
  ];

  const warningLabels = [
    "Warning label (Type 3)",
    "Warning label (Type 4)",
    "Thread Identification label",
  ];

  const getCurrentMonthYear = () => {
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    return `${month} ${year}`;
  };

  const date = getCurrentMonthYear();


  const navigate = useNavigate();
    const location = useLocation();


  const handleBack = () => {
    console.log("Back button clicked");
    navigate("/mainTable");
  };

  const handleLabelSelect = (labelType, labelName) => {
    if (labelType === "div2") {
      setSelectedDiv2Label(labelName);
    } else if (labelType === "div1") {
      setSelectedDiv1Label(labelName);
    } else if (labelType === "warning") {
      setSelectedWarningLabel(labelName);
    }
    setPreviewLabel({ type: labelType, name: labelName });
    setOpenDropdown(null);
    setShowPreviewModal(true);

    // Generate the print container HTML for both preview and print
    generatePrintContainer(labelType, labelName);
  };

  const generatePrintContainer = (type, name) => {
    const printContainer = document.createElement("div");

    if (type === "div2") {
      if (name === "FET-ETHERNET (DIV 2)") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Static Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 88mm 28mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 88mm;
              height: 28mm;
              border: 2px solid black;
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Top right barcode icon -->
            <div class="absolute top-1 right-2 w-5 h-6 flex items-center justify-center text-xs">
              <img src="${bin}" alt="Bin Icon" class="w-5 h-6" />
            </div>

            <!-- Content based on label type -->
            <div class="flex items-center mt-2 px-2 flex-grow">
              <div class="flex">
                <div class="h-16 w-32 flex items-center">
                  <img src="${fm}" alt="FM Logo" class="h-16 w-32 -ml-6" />
                </div>
              </div>

              <div class="grid text-[6px] font-bold text-black grid-cols-2 gap-3 -ml-8 -mt-2">
                <div>
                  <div class="">FM17US0062X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T4</div>
                  <div>DIP: CL II,III, Div 2, GPS EFG T4</div>
                </div>
                <div>
                  <div class="font-bold">FM17CA0033X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T4</div>
                  <div>DIP: CL II,III, Div 2, GPS EFG T4</div>
                </div>
                <div class="text-center text-black text-[7px] -mt-2 col-span-2">
                  See handbook for temperature class information
                </div>
              </div>
            </div>

            <div class="flex justify-between font-bold p-1 border-t-2 border-black text-[6px] items-center mt-auto" style="height: 1.9rem ;">
              <div class="">
                <div>Made by:</div>
                <div>ABB India Limited, Bangalore</div>
                <div class="ml-12 mt-1">${date}</div>
              </div>
              <div class="">
                <div class="">Designed by:</div>
                <div>ABB AG, 37081 Gottingen, Germany</div>
              </div>
              <div class="flex space-x-1">
                <img src=${book} alt="" class="w-20 h-6" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      } else if (name === "FET-GENERAL PURPOSE") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Static Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 88mm 28mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 88mm;
              height: 28mm;
              border: 2px solid black;
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Top right barcode icon -->
            <div class="absolute top-1 right-2 w-5 h-6 flex items-center justify-center text-xs">
              <img src="${bin}" alt="Bin Icon" class="w-5 h-6" />
            </div>

            <div class="flex justify-between font-bold p-1 border-t-2 border-black text-[6px] items-center mt-auto" style="height: 1.9rem ;">
              <div class="">
                <div>Made by:</div>
                <div>ABB India Limited, Bangalore</div>
                <div class="ml-12 mt-1">${date}</div>
              </div>
              <div class="">
                <div class="">Designed by:</div>
                <div>ABB AG, 37081 Gottingen, Germany</div>
              </div>
              <div class="flex space-x-1">
                <img src=${book} alt="" class="w-20 h-6" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      } else if (name === "FET-W/O ETHERNET (DIV 2)") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Static Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 88mm 28mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 88mm;
              height: 28mm;
              border: 2px solid black;
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Top right barcode icon -->
            <div class="absolute top-1 right-2 w-5 h-6 flex items-center justify-center text-xs">
              <img src="${bin}" alt="Bin Icon" class="w-5 h-6" />
            </div>

            <!-- Content based on label type -->
            <div class="flex items-center mt-2 px-2 flex-grow">
              <div class="flex">
                <div class="h-16 w-32 flex items-center">
                  <img src="${fm}" alt="FM Logo" class="h-16 w-32 -ml-6" />
                </div>
              </div>

              <div class="grid text-[6px] font-bold text-black grid-cols-2 gap-3 -ml-8 -mt-2">
                <div>
                  <div class="">FM17US0062X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T6 </div>
                  <div> DIP: CL II,III, Div 2, GPS EFG T6</div>
                </div>
                <div>
                  <div class="font-bold">FM17CA0033X</div>
                  <div> NI: CL I, Div 2, GPS ABCD T6</div>
                  <div> DIP: CL II,III, Div 2, GPS EFG T6</div>
                </div>
                <div class="text-center text-black text-[7px] -mt-2 col-span-2">
                  See handbook for temperature class information
                </div>
              </div>
            </div>

            <div class="flex justify-between font-bold p-1 border-t-2 border-black text-[6px] items-center mt-auto" style="height: 1.9rem ;">
              <div class="">
                <div>Made by:</div>
                <div>ABB India Limited, Bangalore</div>
                <div class="ml-12 mt-1">${date}</div>
              </div>
              <div class="">
                <div class="">Designed by:</div>
                <div>ABB AG, 37081 Gottingen, Germany</div>
              </div>
              <div class="flex space-x-1">
                <img src=${book} alt="" class="w-20 h-6" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      } else if (name === "FEP 631/632 (TYPE 4) -WITH ETHERNET") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Static Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 88mm 28mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 88mm;
              height: 28mm;
              border: 2px solid black;
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Top right barcode icon -->
            <div class="absolute top-1 right-2 w-5 h-6 flex items-center justify-center text-xs">
              <img src="${bin}" alt="Bin Icon" class="w-5 h-6" />
            </div>

            <!-- Content based on label type -->
            <div class="flex items-center mt-2 px-2 flex-grow">
              <div class="flex">
                <div class="h-16 w-32 flex items-center">
                  <img src="${fm}" alt="FM Logo" class="h-16 w-32 -ml-6" />
                </div>
              </div>

              <div class="grid text-[6px] font-bold text-black grid-cols-2 gap-3 -ml-10 -mt-2">
                <div>
                  <div class="">FM17US0062X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T6...T1 </div>
                  <div> DIP: CL II,III, Div 2, GPS EFG T6…T3B  </div>
                </div>
                <div>
                  <div class="font-bold">FM17CA0033X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T6...T1</div>
                  <div>DIP: CL II,III, Div 2, GPS EFG T6…T3B</div>
                </div>
                <div class="text-center text-black text-[7px] -mt-2 col-span-2">
                  See handbook for temperature class information
                </div>
              </div>
            </div>

            <div class="flex justify-between font-bold p-1 border-t-2 border-black text-[6px] items-center mt-auto" style="height: 1.9rem ;">
              <div class="">
                <div>Made by:</div>
                <div>ABB India Limited, Bangalore</div>
                <div class="ml-12 mt-1">${date}</div>
              </div>
              <div class="">
                <div class="">Designed by:</div>
                <div>ABB AG, 37081 Gottingen, Germany</div>
              </div>
              <div class="flex space-x-1">
                <img src=${book} alt="" class="w-20 h-6" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      }
    } else if (type === "div1") {
      if (name === "FET-ETHERNET (DIV 2)") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Static Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 88mm 28mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 88mm;
              height: 28mm;
              border: 2px solid black;
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Top right barcode icon -->
            <div class="absolute top-1 right-2 w-5 h-6 flex items-center justify-center text-xs">
              <img src="${bin}" alt="Bin Icon" class="w-5 h-6" />
            </div>

            <!-- Content based on label type -->
            <div class="flex items-center mt-2 px-2 flex-grow">
              <div class="flex">
                <div class="h-16 w-32 flex items-center">
                  <img src="${fm}" alt="FM Logo" class="h-16 w-32 -ml-6" />
                </div>
              </div>

              <div class="grid text-[6px] font-bold text-black grid-cols-2 gap-3 -ml-8 -mt-2">
                <div>
                  <div class="">FM17US0062X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T4 </div>
                  <div> DIP: CL II,III, Div 2, GPS EFG T4</div>
                </div>
                <div>
                  <div class="font-bold"> FM17CA0033X</div>
                  <div> NI: CL I, Div 2, GPS ABCD T4</div>
                  <div>  DIP: CL II,III, Div 2, GPS EFG T4</div>
                </div>
                <div class="text-center text-black text-[7px] -mt-2 col-span-2">
                  See handbook for temperature class information
                </div>
              </div>
            </div>

            <div class="flex justify-between font-bold p-1 border-t-2 border-black text-[6px] items-center mt-auto" style="height: 1.9rem ;">
              <div class="">
                <div>Made by:</div>
                <div>ABB India Limited, Bangalore</div>
                <div class="ml-12 mt-1">${date}</div>
              </div>
              <div class="">
                <div class="">Designed by:</div>
                <div>ABB AG, 37081 Gottingen, Germany</div>
              </div>
              <div class="flex space-x-1">
                <img src=${book} alt="" class="w-20 h-6" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      } else if (name === "FET-GENERAL PURPOSE") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Static Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 88mm 28mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 88mm;
              height: 28mm;
              border: 2px solid black;
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Top right barcode icon -->
            <div class="absolute top-1 right-2 w-5 h-6 flex items-center justify-center text-xs">
              <img src="${bin}" alt="Bin Icon" class="w-5 h-6" />
            </div>

            <div class="flex justify-between font-bold p-1 border-t-2 border-black text-[6px] items-center mt-auto" style="height: 1.9rem ;">
              <div class="">
                <div>Made by:</div>
                <div>ABB India Limited, Bangalore</div>
                <div class="ml-12 mt-1">${date}</div>
              </div>
              <div class="">
                <div class="">Designed by:</div>
                <div>ABB AG, 37081 Gottingen, Germany</div>
              </div>
              <div class="flex space-x-1">
                <img src=${book} alt="" class="w-20 h-6" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      } else if (name === "FET-W/O ETHERNET (DIV 2)") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Static Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 88mm 28mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 88mm;
              height: 28mm;
              border: 2px solid black;
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Top right barcode icon -->
            <div class="absolute top-1 right-2 w-5 h-6 flex items-center justify-center text-xs">
              <img src="${bin}" alt="Bin Icon" class="w-5 h-6" />
            </div>

            <!-- Content based on label type -->
            <div class="flex items-center mt-2 px-2 flex-grow">
              <div class="flex">
                <div class="h-16 w-32 flex items-center">
                  <img src="${fm}" alt="FM Logo" class="h-16 w-32 -ml-6" />
                </div>
              </div>

              <div class="grid text-[6px] font-bold text-black grid-cols-2 gap-3 -ml-8 -mt-2">
                <div>
                  <div class=""> FM17US0062X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T6</div>
                  <div>DIP: CL II,III, Div 2, GPS EFG T6</div>
                </div>
                <div>
                  <div class="font-bold">FM17CA0033X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T6</div>
                  <div>DIP: CL II,III, Div 2, GPS EFG T6</div>
                </div>
                <div class="text-center text-black text-[7px] -mt-2 col-span-2">
                  See handbook for temperature class information
                </div>
              </div>
            </div>

            <div class="flex justify-between font-bold p-1 border-t-2 border-black text-[6px] items-center mt-auto" style="height: 1.9rem ;">
              <div class="">
                <div>Made by:</div>
                <div>ABB India Limited, Bangalore</div>
                <div class="ml-12 mt-1">${date}</div>
              </div>
              <div class="">
                <div class="">Designed by:</div>
                <div>ABB AG, 37081 Gottingen, Germany</div>
              </div>
              <div class="flex space-x-1">
                <img src=${book} alt="" class="w-20 h-6" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      } else if (name === "FEP 631/632 (TYPE 4) -WITH ETHERNET") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Static Label Print</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 88mm 28mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 88mm;
              height: 28mm;
              border: 2px solid black;
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Top right barcode icon -->
            <div class="absolute top-1 right-2 w-5 h-6 flex items-center justify-center text-xs">
              <img src="${bin}" alt="Bin Icon" class="w-5 h-6" />
            </div>

            <!-- Content based on label type -->
            <div class="flex items-center mt-2 px-2 flex-grow">
              <div class="flex">
                <div class="h-16 w-32 flex items-center">
                  <img src="${fm}" alt="FM Logo" class="h-16 w-32 -ml-6" />
                </div>
              </div>

              <div class="grid text-[6px] font-bold text-black grid-cols-2 gap-3 -ml-10 -mt-2">
                <div>
                  <div class="">FM17US0062X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T6...T1 </div>
                  <div> DIP: CL II,III, Div 2, GPS EFG T6…T3B  </div>
                </div>
                <div>
                  <div class="font-bold">FM17CA0033X</div>
                  <div>NI: CL I, Div 2, GPS ABCD T6...T1</div>
                  <div>DIP: CL II,III, Div 2, GPS EFG T6…T3B</div>
                </div>
                <div class="text-center text-black text-[7px] -mt-2 col-span-2">
                  See handbook for temperature class information
                </div>
              </div>
            </div>

            <div class="flex justify-between font-bold p-1 border-t-2 border-black text-[6px] items-center mt-auto" style="height: 1.9rem ;">
              <div class="">
                <div>Made by:</div>
                <div>ABB India Limited, Bangalore</div>
                <div class="ml-12 mt-1">${date}</div>
              </div>
              <div class="">
                <div class="">Designed by:</div>
                <div>ABB AG, 37081 Gottingen, Germany</div>
              </div>
              <div class="flex space-x-1">
                <img src=${book} alt="" class="w-20 h-6" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      }
    } else if (type === "warning") {
      if (name === "Thread Identification label") {
        printContainer.innerHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Thread Identification Label</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page {
                size: 14mm 5mm;
                margin: 0;
              }
              body {
                -webkit-print-color-adjust: exact;
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                color: black;
              }
              .print-container {
                width: 14mm;
                height: 5mm;
                border: 2px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 2px;
                border-radius:3px;
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <div>
                
                <div class="text-[10px] font-bold">NPT 1/2"</div>
              </div>
            </div>
          </body>
          </html>
        `;
      } else if (name === "Warning label (Type 3)") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Warning Label Type 3</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 60mm 60mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 60mm;
              height: 60mm;
              border: 2px solid black;
              padding: 2mm;
              display: flex;
              box-sizing: border-box;
              font-size: 6px;
              position: relative;
            }
            .left-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              padding-right: 0.5mm;
              border-right: 1px solid black;
            }
            .right-content {
              width: 6mm;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding-left: 0.5mm;
            }
            .cable-text {
              writing-mode: vertical-lr;
              text-orientation: mixed;
              font-size: 8px;
              font-weight: bold;
              line-height: 1.2;
            }
            .warning-symbol {
              font-size: 8px;
              margin-right: 1px;
            }
            .section-title {
              font-size: 7px;
              font-weight: bold;
              line-height: 1.1;
            }
            .section-text {
              font-size: 5px;
              line-height: 1.1;
              margin-top: 0.5mm;
            }
            .section {
              border-bottom: 1px solid black;
              padding-bottom: 1mm;
              margin-bottom: 1mm;
            }
            .section:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="left-content">
              <div class="section">
                <div class="flex items-center section-title">
                  <span>Warnung!</span>
                </div>
                <div class="section-text">-Gefahr durch elektrostatische Entladung</div>
                <div class="flex items-center section-title" style="margin-top: 1mm;">
                  <span>Warning!</span>
                </div>
                <div class="section-text">-DANGER BY ELECTROSTATIC UNLOADING</div>
                <div class="section-title" style="margin-top: 1mm;">AVERTISSEMENT!</div>
                <div class="section-text">-Risque de decharge electrostatique</div>
              </div>
              
              <div class="section">
                <div class="section-title">Warnung!</div>
                <div class="section-text">Nicht öffnen wenn eine zünd- oder explosionsfähige Atmosphäre vorhanden ist</div>
                <div class="section-title" style="margin-top: 1mm;">Warning!</div>
                <div class="section-text">DO NOT OPEN WHEN AN EXPLOSIVE ATMOSPHERE IS PRESENT</div>
                <div class="flex items-center section-title" style="margin-top: 1mm;">
                  <span>AVERTISSEMENT!</span>
                </div>
                <div class="section-text">Ne pas ouvrir en présence d'une atmosphère explosive</div>
              </div>
              
              <div class="section">
                <div class="flex items-center section-title">
                  <span>Achtung:</span>
                </div>
                <div class="section-text">Heiße Oberfläche</div>
                <div class="flex items-center section-title" style="margin-top: 1mm;">
                  <span>Warning!</span>
                </div>
                <div class="section-text">HOT SURFACE</div>
                <div class="section-title" style="margin-top: 1mm;">ATTENTION:</div>
                <div class="section-text">Surface très chaude</div>
              </div>
            </div>
            
            <div class="right-content rotate-180">
              <div class="cable-text">Cable Entries : NPT 1/2 in</div>
            </div>
          </div>
        </body>
        </html>
      `;
      } else if (name === "Warning label (Type 4)") {
        printContainer.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Warning Label Type 4</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 90mm 15mm;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: black;
            }
            .print-container {
              width: 90mm;
              height: 15mm;
              border: 2px solid black;
              border-radius: 8px;
              padding: 0.5mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
            }
            .warning-row {
              display: flex;
              align-items: center;
              font-size: 5px;
              font-weight: bold;
              line-height: 1;
              padding: 0.3mm 0.5mm;
              flex: 1;
            }
            .warning-row:not(:last-child) {
              border-bottom: 1px solid black;
            }
            .warning-text {
              margin-right: 2mm;
            }
            .warning-icon {
              height: 3mm;
              width: 4mm;
              flex-shrink: 0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="warning-row">
              <span class="warning-text">Warning - DANGER BY ELECTROSTATIC UNLOADING</span>
              <img src="${warning}" alt="" class="warning-icon"/>
            </div>
            
            <div class="warning-row">
              <span class="warning-text">Warning - DO NOT OPEN WHEN AN EXPLOSIVE ATMOSPHERE IS PRESENT</span>
              <img src="${warning}" alt="" class="warning-icon"/>
            </div>
            
            <div class="warning-row">
              <span class="warning-text">ATTENTION-HOT SURFACE</span>
              <img src="${hot}" alt="" class="warning-icon" />
            </div>
          </div>
        </body>
        </html>
      `;
      }
    }

    // Set timeout to ensure DOM is ready
    setTimeout(() => {
      if (labelRef.current) {
        labelRef.current.innerHTML = "";
        labelRef.current.appendChild(printContainer.cloneNode(true));
      }
    }, 100);
  };

  const handlePrint = () => {
    if (!previewLabel || !labelRef.current) {
      alert("Please select a label to print");
      return;
    }

    // Create an iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    iframe.style.width = "0";
    iframe.style.height = "0";
    document.body.appendChild(iframe);

    const contentToPrint = labelRef.current.innerHTML;

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

  const CustomDropdown = ({
    options,
    selected,
    onSelect,
    placeholder,
    labelType,
    icon,
  }) => (
    <div className="relative">
      <button
        className="w-full px-6 py-4 text-left bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
        onClick={() =>
          setOpenDropdown(openDropdown === labelType ? null : labelType)
        }
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selected ? "bg-blue-100" : "bg-gray-100"
              } group-hover:bg-blue-50 transition-colors`}
            >
              {icon}
            </div>
            <div>
              <div
                className={`font-medium ${
                  selected ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {selected || placeholder}
              </div>
              {selected && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" />
                  Selected
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewLabel({ type: labelType, name: selected });
                  setShowPreviewModal(true);
                  generatePrintContainer(labelType, selected);
                }}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Preview Label"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                openDropdown === labelType ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {openDropdown === labelType && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((option, index) => (
            <button
              key={index}
              className="w-full px-6 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
              onClick={() => {
                onSelect(labelType, option);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{option}</span>
                {selected === option && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Preview Modal Component
  const PreviewModal = () => {
    if (!showPreviewModal || !previewLabel) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Label Preview
              </h3>
              <p className="text-sm text-gray-500">
                {previewLabel.type.toUpperCase()} - {previewLabel.name}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="flex justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div
                ref={labelRef}
                className="print-area"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* The generated HTML content will be displayed here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-5 from-blue-50 via-white to-indigo-50">
      {/* Header with Back Button */}

      <Card
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
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
          <Box sx={{ ml: 2 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "white", mb: 0.5 }}
            >
              Static Labels
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Select and print certification and warning labels
            </Typography>
          </Box>

          <Button
            onClick={handleBack}
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 2,
              px: 3,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <ArrowLeft size={20} />
            Back
          </Button>
        </Box>
      </Card>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Label Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Certification Label (DIV 2) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Certification Label
                </h2>
                <p className="text-sm text-gray-500">
                  Division 2 Classification
                </p>
              </div>
            </div>
            <CustomDropdown
              options={div2Labels}
              selected={selectedDiv2Label}
              onSelect={handleLabelSelect}
              placeholder="Select DIV 2 label type"
              labelType="div2"
              icon={<Shield className="w-5 h-5 text-blue-600" />}
            />
          </div>

          {/* Certification Label (DIV 1) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Certification Label
                </h2>
                <p className="text-sm text-gray-500">
                  Division 1 Classification
                </p>
              </div>
            </div>
            <CustomDropdown
              options={div1Labels}
              selected={selectedDiv1Label}
              onSelect={handleLabelSelect}
              placeholder="Select DIV 1 label type"
              labelType="div1"
              icon={<Shield className="w-5 h-5 text-green-600" />}
            />
          </div>

          {/* Warning Labels */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Warning Labels
                </h2>
                <p className="text-sm text-gray-500">Safety & Identification</p>
              </div>
            </div>
            <CustomDropdown
              options={warningLabels}
              selected={selectedWarningLabel}
              onSelect={handleLabelSelect}
              placeholder="Select warning label type"
              labelType="warning"
              icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
            />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal />

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StaticLabel;
