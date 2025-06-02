import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  Divider,
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TagIcon from "@mui/icons-material/LocalOffer";
import BarcodeIcon from "@mui/icons-material/QrCode";
import CodeIcon from "@mui/icons-material/Code";

import StatusIcon from "@mui/icons-material/RadioButtonChecked";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import FitbitIcon from "@mui/icons-material/Fitbit";
import StraightenIcon from "@mui/icons-material/Straighten";
import VersionIcon from "@mui/icons-material/Rule";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import SpeedIcon from "@mui/icons-material/Speed";
import { api } from "../apiConfig";

// List of collections to exclude from the UI
const EXCLUDED_COLLECTIONS = ["admins", "tabledatas"];

// Collection order definitions for each basic code
const COLLECTION_ORDERS = {
  FEP631: [
    "Explosion protection Certification",
    "Housing Type / Housing Material / Cable Glands",
    "Nominal Diameter",
    "Process connection",
    "Liner Material",
    "Process connection material",
    "Electrode design",
    "Measuring electrode material",
    "Grounding Electrode / Full Pipe Detection",
    "Grounding accessories",
    "Protection Class Transmitter / Protection Class Sensor",
    "Power supply",
    "Display",
    "Outputs",
    "Design Level",
    "Option Card 1",
    "Option Card 2",
    "Usage Certifications",
    "SIL certficate",
    "Shipping Register Certificate",
    "Calibration Certifications",
    "Other Usage Certifications",
    "Sensor Length",
    "Potable Water and Food&Beverage Approvals",
    "Other Explosion Protection Certifications and other Approvals",
    "Other Options",
    "Documentation Language",
    "Pressure Bearing parts Material Source Tests & Reports",
    "Sensor Housing Material",
    "Configuration Type",
    "Transmitter Software Function Package",
    "Calibration Type",
    "Signal cable",
    "Device Identification Label",
    "Temperature Range of Installation / Ambient Temperature Range",
    "Number of Testpoints",
    "Verification Capability",
    "Communication options activated",
    "Connector type",
  ],
  FEP632: [
    "Explosion protection Certification",
    "Housing Type / Housing Material / Cable Glands",
    "Nominal Diameter",
    "Process connection",
    "Liner Material",
    "Process connection material",
    "Electrode design",
    "Measuring electrode material",
    "Grounding Electrode / Full Pipe Detection",
    "Grounding accessories",
    "Protection Class Transmitter / Protection Class Sensor",
    "Power supply",
    "Display",
    "Outputs",
    "Design Level",
    "Option Card 1",
    "Option Card 2",
    "Usage Certifications",
    "Calibration Certifications",
    "Other Usage Certifications",
    "Power Supply Line Frequency",
    "Sensor Length",
    "Potable Water and Food&Beverage Approvals",
    "Other Explosion Protection Certifications and other Approvals",
    "Other Options",
    "Documentation Language",
    "Pressure Bearing parts Material Source Tests & Reports",
    "Sensor Housing Material",
    "Configuration Type",
    "Transmitter Software Function Package",
    "Calibration Type",
    "Signal cable",
    "Device Identification Label",
    "Temperature Range of Installation / Ambient Temperature Range",
    "Number of Testpoints",
    "Verification Capability",
  ],
  FET632: [
    "Explosion protection Certification Transmitter",
    "Housing Type / Housing Material / Cable Glands Transmitter",
    "Protection Class Transmitter / Protection Class Sensor Transmitter",
    "Power supply Transmitter",
    "Display Transmitter",
    "Outputs Transmitter",
    "Option Card 1 Transmitter",
    "Option Card 2 Transmitter",
    "SIL certificate Transmitter",
    "Shipping Register Certificate Transmitter",
    "Potable Water and Food & Beverage Approvals Transmitter",
    "Other Explosion Protection Certifications and other Approvals Transmitter",
    "Other Options Transmitter",
    "Documentation Language Transmitter",
    "Device Identification Label Transmitter",
    "Temperature Range of Installation / Ambient Temperature Range Transmitter",
    "Remote Transmitter Mounting Kit Transmitter",
    "Transmitter Software Function Package Transmitter",
  ],
};

// Static data for Tamb dropdown
const TMED_OPTIONS = [
  {
    code: "130°C(266°F)",
    description: "PTFE, PFA, ETFE",
  },
  {
    code: "80°C (194°F/176°F)",
    description: "hard rubber",
  },
  {
    code: "60°C(140°F)",
    description: "soft rubber",
  },
];

// Static data for Qmax dropdown - you can replace this with your actual Qmax values
const QMAX_OPTIONS = [
  { code: "15", description: "100 l/min" },
  { code: "20", description: "150 l/min" },
  { code: "25", description: "200 l/min" },
  { code: "32", description: "400 l/min" },
  { code: "40", description: "600 l/min" },
  { code: "50", description: "60 m³/h" },
  { code: "65", description: "120 m³/h" },
  { code: "80", description: "180 m³/h" },
  { code: "100", description: "240 m³/h" },
  { code: "125", description: "420 m³/h" },
  { code: "150", description: "600 m³/h" },
  { code: "200", description: "1080 m³/h" },
  { code: "250", description: "1800 m³/h" },
  { code: "300", description: "2400 m³/h" },
  { code: "350", description: "3300 m³/h" },
  { code: "400", description: "4500 m³/h" },
  { code: "450", description: "6000 m³/h" },
  { code: "500", description: "6600 m³/h" },
  { code: "600", description: "9600 m³/h" },
];

const LabelPrint = () => {
  const navigate = useNavigate();
  const [basicCode, setBasicCode] = useState("");
  const [collectionsWithCodes, setCollectionsWithCodes] = useState({});
  const [collectionNames, setCollectionNames] = useState([]);
  const [filteredCollectionNames, setFilteredCollectionNames] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState({});
  const [modelType, setModelType] = useState("");
  const [ss, setSS] = useState("");
  const [sz, setSZ] = useState("");
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [allSelectionsDone, setAllSelectionsDone] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form fields that match the schema
  const [LabelType, setLabelType] = useState("");
  const [LogoType, setLogoType] = useState("");
  const [SerialNumber, setSerialNumber] = useState("");
  const [TagNumber, setTagNumber] = useState("");
  const [LabelDetails, setLabelDetails] = useState("");
  const [Date, setDate] = useState("");
  const [Status, setStatus] = useState("Active");
  const [DevVersion, setDevVersion] = useState("");

  // Add powerSupply state
  const [powerSupply, setPowerSupply] = useState("");
  const [ProtectionClass, setProtectionClass] = useState("");
  const [Tamb, setTamb] = useState("");
  const [Size, setSize] = useState("");
  const [LinerMaterial, setLinerMaterial] = useState("");
  const [Fitting, setFitting] = useState("");
  const [Elect, setElect] = useState("");
  // New states for Qmax and Tamb dropdowns
  const [selectedQmax, setSelectedQmax] = useState("");
  const [selectedTmedDropdown, setSelectedTmedDropdown] = useState("");

  // New state to control LogoType visibility
  const [showLogoType, setShowLogoType] = useState(true);

  // Handle LabelType change with LogoType visibility logic
  const handleLabelTypeChange = (event) => {
    const value = event.target.value;
    setLabelType(value);

    // Check if we should hide the LogoType field
    const shouldHideLogoType =
      value === "Sensor(115x35)" || value === "Transmitter";
    setShowLogoType(!shouldHideLogoType);

    // Reset LogoType value when the field is hidden
    if (shouldHideLogoType) {
      setLogoType("");
    }
  };

  // Handle Qmax dropdown change
  const handleQmaxChange = (event) => {
    const value = event.target.value;
    setSelectedQmax(value);

    // Update label details when Qmax changes
    updateLabelDetails(selectedCollections, ss, sz, basicCode);
  };

  // Handle Tamb dropdown change
  const handleTambDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedTmedDropdown(value);

    // Update label details when Tamb changes
    updateLabelDetails(selectedCollections, ss, sz, basicCode);
  };

  // Fetch collections and codes from specific database based on basic code
  const fetchCollectionsFromDatabase = async (dbName) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching collections from database: ${dbName}`);
      const response = await api.get(`/collections-by-database/${dbName}`);

      if (response.data.success) {
        const dbCollections = response.data.collectionsWithData;
        console.log("API Response:", response.data);

        // Filter out excluded collections
        const filteredCollections = {};
        Object.keys(dbCollections).forEach((collectionName) => {
          if (!EXCLUDED_COLLECTIONS.includes(collectionName)) {
            filteredCollections[collectionName] = dbCollections[collectionName];
          }
        });

        // Log all collections and their item counts
        Object.keys(filteredCollections).forEach((collName) => {
          console.log(
            `${collName}: ${filteredCollections[collName].length} items`
          );
        });

        setCollectionsWithCodes(filteredCollections);
        setCollectionNames(Object.keys(filteredCollections));
        setFilteredCollectionNames(Object.keys(filteredCollections));
      } else {
        setError("Failed to fetch collections: " + response.data.message);
      }
    } catch (error) {
      console.error(`Error fetching collections from ${dbName}:`, error);
      setError(`Error fetching collections: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // CORRECTED function to determine which database to use based on basic code
  const getDatabaseForBasicCode = (code) => {
    switch (code) {
      case "FEP631":
        return "Fep631"; // Maps to the Fep631 database
      case "FEP632":
        return "Fep632"; // Maps to the Fep632 database
      case "FET632":
        return "Transmitter"; // Maps to the Transmitter database
      default:
        return "";
    }
  };

  // Function to order collections based on the basic code
  const orderCollections = (collections, basicCode) => {
    const order = COLLECTION_ORDERS[basicCode];
    if (!order) return collections;

    const orderedCollections = [];
    const availableCollections = [...collections];

    // Add collections in the exact order specified in COLLECTION_ORDERS
    order.forEach((orderedName) => {
      const matchingIndex = availableCollections.findIndex(
        (name) => name.trim().toLowerCase() === orderedName.trim().toLowerCase()
      );

      if (matchingIndex !== -1) {
        orderedCollections.push(availableCollections[matchingIndex]);
        availableCollections.splice(matchingIndex, 1);
      }
    });

    // Add any remaining collections that weren't in the order list at the end
    orderedCollections.push(...availableCollections);

    console.log(`Ordered collections for ${basicCode}:`, orderedCollections);
    return orderedCollections;
  };

  // Handle basic code selection with database selection
  const handleBasicCodeChange = (event) => {
    const value = event.target.value;
    setBasicCode(value);

    // Reset collections and selections first
    setCollectionsWithCodes({});
    setCollectionNames([]);
    setFilteredCollectionNames([]);
    setSelectedCollections({});
    setShowCollectionDropdown(false);

    // Reset powerSupply when basic code changes
    setPowerSupply("");
    setLinerMaterial();
    setProtectionClass("");
    setTamb("");
    setFitting();
    setElect();
    setSize("");
    setSelectedQmax("");
    setSelectedTmedDropdown("");

    // Determine which database to use based on the basic code
    const dbName = getDatabaseForBasicCode(value);
    setSelectedDatabase(dbName);

    if (dbName) {
      fetchCollectionsFromDatabase(dbName);
      setShowCollectionDropdown(true);
    }

    let defaultModelType = "";
    if (value === "FEP631") {
      defaultModelType = "Sensor";
    } else if (value === "FEP632") {
      defaultModelType = "Sensor";
    } else if (value === "FET632") {
      defaultModelType = "Transmitter";
    }

    setModelType(defaultModelType);
    updateLabelDetails({}, ss, sz, value);
  };

  // Filter collections based on basicCode and apply ordering
  useEffect(() => {
    if (!collectionNames.length) return;

    let filtered = [...collectionNames];

    if (basicCode === "FET632") {
      // Filter collections that end with "Transmitter"
      filtered = collectionNames.filter((name) =>
        name.toLowerCase().includes("transmitter")
      );
      console.log("Filtered transmitter collections:", filtered);
    }

    // Apply ordering based on basic code
    const orderedFiltered = orderCollections(filtered, basicCode);
    setFilteredCollectionNames(orderedFiltered);

    // Clear previously selected collections that are no longer available
    const updatedSelectedCollections = { ...selectedCollections };
    Object.keys(updatedSelectedCollections).forEach((collectionName) => {
      if (!orderedFiltered.includes(collectionName)) {
        delete updatedSelectedCollections[collectionName];
      }
    });
    setSelectedCollections(updatedSelectedCollections);

    // Update label details with the filtered collections
    updateLabelDetails(updatedSelectedCollections, basicCode);
  }, [basicCode, collectionNames]);

  // Handle model type change
  const handleModelTypeChange = (event) => {
    const value = event.target.value;
    setModelType(value);
    updateLabelDetails(selectedCollections, ss, sz, basicCode);
  };

  // Handle collection code selection
  // Handle collection code selection - FIXED VERSION
  const handleCollectionCodeChange = (collectionName, codeValue) => {
    console.log(`Collection code change: ${collectionName} -> "${codeValue}"`);

    const trimmedName = collectionName.trim();
    const lowerName = trimmedName.toLowerCase();

    // Special collection detectors
    const isPowerSupply =
      lowerName.includes("power") && lowerName.includes("supply");

    const isProtectionClass =
      lowerName.includes("protection") &&
      (lowerName.includes("transmitter") || lowerName.includes("sensor"));

    const isTamb =
      lowerName.includes("temperature") &&
      (lowerName.includes("ambient") || lowerName.includes("range"));

    const isAmbianceRangeTransmitter =
      lowerName.includes("temperature") &&
      lowerName.includes("ambiance") &&
      lowerName.includes("transmitter");

    // FIXED: More comprehensive Size detection
    const isSize =
      trimmedName === "Nominal Diameter" ||
      (lowerName.includes("nominal") && lowerName.includes("diameter")) ||
      lowerName.includes("nominaldiameter");

    const isLiner =
      trimmedName === "Liner Material" ||
      (lowerName.includes("liner") && lowerName.includes("material")) ||
      lowerName.includes("linermaterial");

    // Process connection detection for Fitting
    const isProcessConnection =
      trimmedName === "Process connection" ||
      lowerName.includes("process connection") ||
      lowerName.includes("processconnection");

    // FIXED: Measuring electrode material detection for Elect
    const isElect =
      trimmedName === "Measuring electrode material" ||
      lowerName.includes("measuring electrode material") ||
      lowerName.includes("measuringelectrodematerial") ||
      (lowerName.includes("measuring") &&
        lowerName.includes("electrode") &&
        lowerName.includes("material"));

    console.log(`Collection "${collectionName}" detection:`, {
      isPowerSupply,
      isProtectionClass,
      isTamb,
      isAmbianceRangeTransmitter,
      isSize,
      isProcessConnection,
      isLiner,
      isElect,
      lowerName,
      trimmedName,
    });

    // Handle special collections
    if (
      isPowerSupply ||
      isProtectionClass ||
      isTamb ||
      isAmbianceRangeTransmitter ||
      isSize ||
      isLiner ||
      isProcessConnection ||
      isElect
    ) {
      let setStateFunction = null;
      let fieldName = "";

      if (isPowerSupply) {
        setStateFunction = setPowerSupply;
        fieldName = "Power Supply";
      } else if (isProtectionClass) {
        setStateFunction = setProtectionClass;
        fieldName = "Protection Class";
      } else if (isTamb || isAmbianceRangeTransmitter) {
        setStateFunction = setTamb;
        fieldName = "Temperature Range";
      } else if (isSize) {
        setStateFunction = setSize;
        fieldName = "Size/Nominal Diameter";
      } else if (isLiner) {
        setStateFunction = setLinerMaterial;
        fieldName = "Liner Material";
      } else if (isProcessConnection) {
        setStateFunction = setFitting;
        fieldName = "Process Connection/Fitting";
      } else if (isElect) {
        setStateFunction = setElect;
        fieldName = "Measuring electrode material/Elect";
      }

      if (setStateFunction) {
        if (codeValue === "") {
          setStateFunction("");
          console.log(`${fieldName} cleared`);
        } else {
          const codeItems = collectionsWithCodes[collectionName] || [];
          const matchingItem = codeItems.find(
            (item) => item.code === codeValue
          );

          // FIXED: Store the code value instead of description for Size
          // This ensures the actual code gets sent to the backend
          if (isSize) {
            // For Size, store the code value (which contains the actual size info)
            setStateFunction(codeValue);
            console.log(
              `${fieldName} selected - Code: ${codeValue} (stored as code)`
            );
          } else {
            // For other fields (including Liner), store the description as before
            const description = matchingItem?.description || codeValue;
            setStateFunction(description);
            console.log(
              `${fieldName} selected - Code: ${codeValue}, Description: ${description}`
            );
          }
        }
      }
    }

    // Extract code if it includes "||"
    let code = codeValue;
    if (codeValue && codeValue.includes("||")) {
      code = codeValue.split("||")[0];
    }

    const updatedCollections = {
      ...selectedCollections,
      [collectionName]: code,
    };

    console.log("Updated collections:", updatedCollections);

    setSelectedCollections(updatedCollections);
    updateLabelDetails(updatedCollections, ss, sz, basicCode);
  };
  // Handle SS and SZ changes
  const handleSSChange = (value) => {
    setSS(value);
    updateLabelDetails(selectedCollections, value, sz, basicCode);
  };

  const handleSZChange = (value) => {
    setSZ(value);
    updateLabelDetails(selectedCollections, ss, value, basicCode);
  };

  const updateLabelDetails = (
    selections,
    currentSS, // This parameter is still received but won't be used
    currentSZ,
    currentBasicCode
  ) => {
    let details = currentBasicCode || "";

    const collectionKeys = Object.keys(selections);

    if (collectionKeys.length > 0) {
      collectionKeys.forEach((collectionName) => {
        const code = selections[collectionName];

        console.log(
          `Collection: ${collectionName}, Value: "${code}", Type: ${typeof code}`
        );

        if (code === "") {
          details += "-";
          console.log(
            `Added hyphen for ${collectionName}, details now: ${details}`
          );
        } else if (code) {
          // Add the selected code if it exists and isn't empty
          details += code;
          console.log(
            `Added code ${code} for ${collectionName}, details now: ${details}`
          );
        }
      });
    }

    // Add SZ value to details if it exists (SS is excluded)
   

    // Add Qmax and Tamb dropdown values to details if selected
    // if (selectedQmax) {
    //   details += selectedQmax;
    // }
    // if (selectedTmedDropdown) {
    //   details += selectedTmedDropdown;
    // }

    console.log(`Final label details: ${details}`);

    // Only update states if we have some actual details
    if (details) {
      setAllSelectionsDone(true);
      setLabelDetails(details);
    } else {
      setAllSelectionsDone(false);
      setLabelDetails("");
    }
  };

  // Function to remove a collection selection
  const handleRemoveCollection = (collectionName) => {
    const updatedCollections = { ...selectedCollections };
    delete updatedCollections[collectionName];
    setSelectedCollections(updatedCollections);

    const lowerName = collectionName.toLowerCase();
    const trimmedName = collectionName.trim();

    // Clear the appropriate state based on collection type
    if (lowerName.includes("power") && lowerName.includes("supply")) {
      setPowerSupply("");
    } else if (lowerName.includes("protection")) {
      setProtectionClass("");
    } else if (lowerName.includes("temperature")) {
      setTamb("");
    } else if (
      trimmedName === "Nominal Diameter" ||
      (lowerName.includes("nominal") && lowerName.includes("diameter")) ||
      lowerName.includes("nominaldiameter") ||
      (lowerName.includes("size") && lowerName.includes("diameter"))
    ) {
      setSize(""); // This should clear the Size state
      console.log("Size field cleared due to collection removal");
    }

    updateLabelDetails(updatedCollections, ss, sz, basicCode);
  };

  // Function to get display text for selected collection value
  const getSelectedDisplayText = (collectionName) => {
    if (!selectedCollections[collectionName]) {
      return "Null";
    }

    const code = selectedCollections[collectionName];
    const codeItems = collectionsWithCodes[collectionName] || [];
    const matchingItem = codeItems.find((item) => item.code === code);

    if (matchingItem && matchingItem.description) {
      return `${code} - ${matchingItem.description}`;
    }

    return code;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all required fields are present
    const requiredFields = [
      LabelType,
      SerialNumber,
      TagNumber,
      LabelDetails,
      Date,
      Status,
      ss,
      sz,
    ];

    // Only validate LogoType if it's visible
    if (showLogoType && !LogoType) {
      alert("Please fill in all required fields");
      return;
    }

    if (requiredFields.some((field) => !field)) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = {
        LabelType,
        SerialNumber,
        TagNumber,
        LabelDetails,
        LogoType,
        Date,
        Status,
        DevVersion,
        ss,
        sz,
        powerSupply,
        LinerMaterial,
        ProtectionClass,
        Tamb,
        Fitting,
        Elect,
        Size,
        selectedQmax,
        selectedTmedDropdown,
      };

      console.log("Submitting form data:", formData);

      const response = await api.post("/table", formData);

      if (response.status === 201) {
        console.log("Label saved successfully:", response.data);
        alert("Label saved successfully!");

        // Reset form fields
        setLabelType("");
        setSerialNumber("");
        setTagNumber("");
        setLabelDetails("");
        setDate("");
        setLogoType("");
        setStatus("Active");
        setDevVersion("");
        setPowerSupply("");
        setTamb("");
        setSize("");
        setProtectionClass("");
        setBasicCode("");
        setModelType("");
        setSS("");
        setSZ("");
        setSelectedQmax("");
        setSelectedTmedDropdown("");
        setSelectedCollections({});
        setShowCollectionDropdown(false);
        setAllSelectionsDone(false);
        setShowLogoType(true);
      }
    } catch (error) {
      console.error("Error saving label:", error);
      alert(
        "Error saving label: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const groupedCollections = [];
  for (let i = 0; i < filteredCollectionNames.length; i += 5) {
    groupedCollections.push(filteredCollectionNames.slice(i, i + 5));
  }
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Label Print
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/mainTable")}
        >
          Back to List
        </Button>
      </Box>

      {/* Form Card */}
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardHeader
          title="Master Form"
          sx={{
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            color: "white",
            py: 2,
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* First row of fields */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <TextField
                        sx={{ width: "150px" }}
                        size="small"
                        label="Serial No"
                        placeholder="Enter Serial Number..."
                        variant="outlined"
                        value={SerialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <FormatListNumberedRtlIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item>
                      <TextField
                        sx={{ width: "150px" }}
                        size="small"
                        label="Tag No"
                        placeholder="Enter Tag Number..."
                        variant="outlined"
                        value={TagNumber}
                        onChange={(e) => setTagNumber(e.target.value)}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <TagIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item>
                      <FormControl variant="outlined" required>
                        <InputLabel
                          sx={{
                            textAlign: "center",
                            width: "100%",
                            left: 0,
                            transformOrigin: "center",
                          }}
                        >
                          Label Type
                        </InputLabel>
                        <Select
                          sx={{
                            width: "150px",
                            "& .MuiSelect-select": {
                              textAlign: "center",
                            },
                          }}
                          label="Label Type"
                          size="small"
                          value={LabelType}
                          onChange={handleLabelTypeChange}
                          IconComponent={() => null}
                          endAdornment={
                            <InputAdornment position="end">
                              <BarcodeIcon color="action" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="" sx={{ justifyContent: "center" }}>
                            Select
                          </MenuItem>
                          <MenuItem
                            value="Sensor(96x98)"
                            sx={{ justifyContent: "center" }}
                          >
                            Sensor(96x98)
                          </MenuItem>
                          <MenuItem
                            value="Sensor(115x35)"
                            sx={{ justifyContent: "center" }}
                          >
                            Sensor(115x35)
                          </MenuItem>
                          <MenuItem
                            value="Sensor"
                            sx={{ justifyContent: "center" }}
                          >
                            Sensor
                          </MenuItem>
                          <MenuItem
                            value="Transmitter"
                            sx={{ justifyContent: "center" }}
                          >
                            Transmitter
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item>
                      <FormControl variant="outlined">
                        <InputLabel
                          sx={{
                            textAlign: "center",
                            width: "100%",
                            left: 0,
                            transformOrigin: "center",
                          }}
                        >
                          Basic Code
                        </InputLabel>
                        <Select
                          sx={{
                            width: "150px",
                            "& .MuiSelect-select": {
                              textAlign: "center",
                            },
                          }}
                          label="Basic Code"
                          size="small"
                          value={basicCode}
                          onChange={handleBasicCodeChange}
                          IconComponent={() => null}
                          endAdornment={
                            <InputAdornment position="end">
                              <CodeIcon color="action" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="" sx={{ justifyContent: "center" }}>
                            Select
                          </MenuItem>
                          <MenuItem
                            value="FEP631"
                            sx={{ justifyContent: "center" }}
                          >
                            FEP631{" "}
                          </MenuItem>
                          <MenuItem
                            value="FEP632"
                            sx={{ justifyContent: "center" }}
                          >
                            FEP632
                          </MenuItem>
                          <MenuItem
                            value="FET632"
                            sx={{ justifyContent: "center" }}
                          >
                            FET632
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {showLogoType && (
                      <Grid item>
                        <FormControl variant="outlined" required>
                          <InputLabel
                            sx={{
                              textAlign: "center",
                              width: "100%",
                              left: 0,
                              transformOrigin: "center",
                            }}
                          >
                            Logo Option
                          </InputLabel>
                          <Select
                            sx={{
                              width: "150px",
                              "& .MuiSelect-select": {
                                textAlign: "center",
                              },
                            }}
                            size="small"
                            label="Logo Option"
                            value={LogoType}
                            onChange={(e) => setLogoType(e.target.value)}
                            IconComponent={() => null}
                            endAdornment={
                              <InputAdornment position="end">
                                <FitbitIcon color="action" />
                              </InputAdornment>
                            }
                          >
                            <MenuItem
                              value=""
                              sx={{ justifyContent: "center" }}
                            >
                              Select
                            </MenuItem>
                            <MenuItem
                              value="Logo_1"
                              sx={{ justifyContent: "center" }}
                            >
                              Logo 1{" "}
                            </MenuItem>
                            <MenuItem
                              value="Logo_2"
                              sx={{ justifyContent: "center" }}
                            >
                              Logo 2
                            </MenuItem>
                            <MenuItem
                              value="Logo_3"
                              sx={{ justifyContent: "center" }}
                            >
                              Logo 3
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    <Grid item>
                      <TextField
                        sx={{ width: "150px" }}
                        size="small"
                        label="Manufacturing Date"
                        type="date"
                        variant="outlined"
                        value={Date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        sx={{ width: "120px" }}
                        size="small"
                        label="Device Version"
                        placeholder="Enter Device Version..."
                        variant="outlined"
                        value={DevVersion}
                        onChange={(e) => setDevVersion(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <VersionIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Second row - SS and SZ */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Model Type */}
                    <Grid item>
                      <TextField
                        label="Model Type"
                        sx={{ width: "150px" }}
                        size="small"
                        variant="outlined"
                        value={modelType}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <DeviceHubIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item>
                      <FormControl variant="outlined" required>
                        <InputLabel>Status</InputLabel>
                        <Select
                          sx={{ width: "150px" }}
                          size="small"
                          label="Status"
                          value={Status}
                          onChange={(e) => setStatus(e.target.value)}
                          IconComponent={() => null}
                          endAdornment={
                            <InputAdornment position="end">
                              <StatusIcon color="action" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* SS Field */}
                    <Grid item>
                      <TextField
                        sx={{ width: "150px" }}
                        size="small"
                        label="SS"
                        placeholder="Enter SS..."
                        variant="outlined"
                        value={ss}
                        onChange={(e) => handleSSChange(e.target.value)}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <StraightenIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* SZ Field */}
                    <Grid item>
                      <TextField
                        sx={{ width: "150px" }}
                        size="small"
                        label="SZ"
                        placeholder="Enter SZ..."
                        variant="outlined"
                        value={sz}
                        onChange={(e) => handleSZChange(e.target.value)}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SpeedIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Qmax Dropdown */}
                    <Grid item>
                      <FormControl
                        sx={{ width: "150px" }}
                        size="small"
                        variant="outlined"
                      >
                        <InputLabel>Qmax</InputLabel>
                        <Select
                          label="Qmax"
                          value={selectedQmax}
                          onChange={handleQmaxChange}
                          IconComponent={() => null}
                          endAdornment={
                            <InputAdornment position="end">
                              <SpeedIcon color="action" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">Select</MenuItem>
                          {QMAX_OPTIONS.map((option) => (
                            <MenuItem key={option.code} value={option.code}>
                              {option.code} - {option.description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Tmed Dropdown */}
                    <Grid item>
                      <FormControl
                        sx={{ width: "200px" }}
                        size="small"
                        variant="outlined"
                      >
                        <InputLabel>Tmed</InputLabel>
                        <Select
                          label="Tmed"
                          value={selectedTmedDropdown}
                          onChange={handleTambDropdownChange}
                          IconComponent={() => null}
                          endAdornment={
                            <InputAdornment position="end">
                              <ThermostatIcon color="action" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">Select</MenuItem>
                          {TMED_OPTIONS.map((option) => (
                            <MenuItem key={option.code} value={option.code}>
                              {option.code} - {option.description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Collections Section */}
              {showCollectionDropdown && (
                <Grid item xs={12}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <DeviceHubIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="h6" fontWeight="bold">
                        Configuration Options
                      </Typography>
                      {isLoading && (
                        <CircularProgress size={20} sx={{ ml: 2 }} />
                      )}
                    </Box>

                    {error && (
                      <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                      </Typography>
                    )}

                    {filteredCollectionNames.length > 0 && (
                      <Grid container spacing={2}>
                        {/* Display collections in the exact order defined in COLLECTION_ORDERS */}
                        {filteredCollectionNames.map(
                          (collectionName, index) => {
                            // Calculate row and column position to maintain consistent layout
                            const rowIndex = Math.floor(index / 6);
                            const colIndex = index % 6;

                            return (
                              <Grid
                                item
                                xs={2}
                                key={collectionName}
                                sx={{
                                  // Ensure consistent spacing and alignment
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <FormControl
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    width: "100%",
                                    minWidth: "170px",
                                    maxWidth: "200px",
                                  }}
                                >
                                  <InputLabel>
                                    {collectionName.length > 20
                                      ? `${collectionName.substring(0, 20)}...`
                                      : collectionName}
                                  </InputLabel>
                                  <Select
                                    label={
                                      collectionName.length > 20
                                        ? `${collectionName.substring(
                                            0,
                                            20
                                          )}...`
                                        : collectionName
                                    }
                                    value={
                                      selectedCollections[collectionName] || ""
                                    }
                                    onChange={(e) =>
                                      handleCollectionCodeChange(
                                        collectionName,
                                        e.target.value
                                      )
                                    }
                                    IconComponent={() => null}
                                  >
                                    <MenuItem value="">Select</MenuItem>
                                    {collectionsWithCodes[collectionName]?.map(
                                      (item) => (
                                        <MenuItem
                                          key={item.code}
                                          value={item.code}
                                        >
                                          <Tooltip
                                            title={item.description || ""}
                                            placement="top"
                                          >
                                            <Box>
                                              {item.code}
                                              {item.description &&
                                                ` - ${item.description.substring(
                                                  0,
                                                  30
                                                )}${
                                                  item.description.length > 30
                                                    ? "..."
                                                    : ""
                                                }`}
                                            </Box>
                                          </Tooltip>
                                        </MenuItem>
                                      )
                                    )}
                                  </Select>
                                </FormControl>
                              </Grid>
                            );
                          }
                        )}
                      </Grid>
                    )}
                  </Paper>
                </Grid>
              )}

              {/* Summary Section */}
              <Grid item xs={12}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Model Number
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <TextField
                    fullWidth
                    label="Generated Model Number"
                    variant="outlined"
                    value={LabelDetails}
                    onChange={(e) => setLabelDetails(e.target.value)}
                    required
                    multiline
                    rows={1}
                    InputProps={{
                      readOnly: false,
                      endAdornment: (
                        <InputAdornment position="end">
                          <CodeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        width: "70rem",
                        height: "50px",
                      },
                    }}
                  />
                </Paper>
              </Grid>

              {/* Submit Button */}
            </Grid>
            <Grid item xs={12} mt={3}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    background: (theme) =>
                      `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                    "&:hover": {
                      background: (theme) =>
                        `linear-gradient(45deg, ${theme.palette.success.dark} 30%, ${theme.palette.success.main} 90%)`,
                    },
                  }}
                >
                  Save Label
                </Button>
              </Box>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LabelPrint;
