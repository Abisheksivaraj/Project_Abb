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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StatusIcon from "@mui/icons-material/RadioButtonChecked";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import SettingsIcon from "@mui/icons-material/Settings";
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
  // const [Qmax, setQmax] = useState("");
  // const [Tmed, setTmed] = useState("");
  // New states for Qmax and Tamb dropdowns
  const [selectedQmax, setSelectedQmax] = useState("");
  const [selectedTmedDropdown, setSelectedTambDropdown] = useState("");

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
    setSelectedTambDropdown(value);

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
    const remainingCollections = [...collections];

    // Add collections in the specified order
    order.forEach((orderedName) => {
      const index = remainingCollections.findIndex(
        (name) => name.trim().toLowerCase() === orderedName.trim().toLowerCase()
      );
      if (index !== -1) {
        orderedCollections.push(remainingCollections[index]);
        remainingCollections.splice(index, 1);
      }
    });

    // Add any remaining collections that weren't in the order list
    orderedCollections.push(...remainingCollections);

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
    setProtectionClass("");
    setTamb("");
    setSize("");
    setSelectedQmax("");
    setSelectedTambDropdown("");

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
    updateLabelDetails(updatedSelectedCollections, ss, sz, basicCode);
  }, [basicCode, collectionNames]);

  // Handle model type change
  const handleModelTypeChange = (event) => {
    const value = event.target.value;
    setModelType(value);
    updateLabelDetails(selectedCollections, ss, sz, basicCode);
  };

  // Handle collection code selection
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
      lowerName.includes("nominaldiameter") ||
      (lowerName.includes("size") && lowerName.includes("diameter"));

    console.log(`Collection "${collectionName}" detection:`, {
      isPowerSupply,
      isProtectionClass,
      isTamb,
      isAmbianceRangeTransmitter,
      isSize,
      lowerName,
      trimmedName, // Added for debugging
    });

    // Handle special collections
    if (
      isPowerSupply ||
      isProtectionClass ||
      isTamb ||
      isAmbianceRangeTransmitter ||
      isSize
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
          const description = matchingItem?.description || codeValue;

          setStateFunction(description);
          console.log(
            `${fieldName} selected - Code: ${codeValue}, Description: ${description}`
          );
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
    currentSS,
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

    // Add Qmax and Tamb dropdown values to details if selected
    if (selectedQmax) {
      details += selectedQmax;
    }
    if (selectedTmedDropdown) {
      details += selectedTmedDropdown;
    }

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
        ProtectionClass,
        Tamb,

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
        setSelectedTambDropdown("");
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
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <TextField
                      sx={{ width: "200px" }}
                      label="Serial Number"
                      placeholder="Enter Serial Number..."
                      variant="outlined"
                      value={SerialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {/* <SerialNumberIcon color="action" /> */}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      sx={{ width: "200px" }}
                      label="Tag Number"
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
                      <InputLabel>Label Type</InputLabel>
                      <Select
                        sx={{ width: "150px" }}
                        label="Label Type"
                        value={LabelType}
                        onChange={handleLabelTypeChange}
                        IconComponent={() => null}
                        endAdornment={
                          <InputAdornment position="end">
                            <BarcodeIcon color="action" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Sensor(96x98)">Sensor(96x98)</MenuItem>
                        <MenuItem value="Sensor(115x35)">
                          Sensor(115x35)
                        </MenuItem>
                        <MenuItem value="Sensor">Sensor</MenuItem>
                        <MenuItem value="Transmitter">Transmitter</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl variant="outlined">
                      <InputLabel>Basic Code</InputLabel>
                      <Select
                        sx={{ width: "150px" }}
                        label="Basic Code"
                        value={basicCode}
                        onChange={handleBasicCodeChange}
                        IconComponent={() => null}
                        endAdornment={
                          <InputAdornment position="end">
                            <CodeIcon color="action" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="FEP631">FEP631 </MenuItem>
                        <MenuItem value="FEP632">FEP632</MenuItem>
                        <MenuItem value="FET632">FET632</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {showLogoType && (
                    <Grid item>
                      <FormControl variant="outlined" required>
                        <InputLabel>Logo Option</InputLabel>
                        <Select
                          sx={{ width: "150px" }}
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
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="Logo_1">Logo 1 </MenuItem>
                          <MenuItem value="Logo_2">Logo 2</MenuItem>
                          <MenuItem value="Logo_3">Logo 3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item>
                    <TextField
                      sx={{ width: "200px" }}
                      label="Manufacturing Date"
                      type="date"
                      variant="outlined"
                      value={Date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarTodayIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Second row of fields */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <FormControl variant="outlined">
                      <InputLabel>Status</InputLabel>
                      <Select
                        sx={{ width: "150px" }}
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

                  <Grid item>
                    <FormControl variant="outlined">
                      <InputLabel>Model Type</InputLabel>
                      <Select
                        sx={{ width: "150px" }}
                        label="Model Type"
                        value={modelType}
                        onChange={handleModelTypeChange}
                        IconComponent={() => null}
                        endAdornment={
                          <InputAdornment position="end">
                            <DeviceHubIcon color="action" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Sensor">Sensor</MenuItem>
                        <MenuItem value="Transmitter">Transmitter</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <TextField
                      sx={{ width: "150px" }}
                      label="Dev Version"
                      placeholder="Enter Version..."
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

                  <Grid item>
                    <TextField
                      sx={{ width: "100px" }}
                      label="SS"
                      placeholder="SS..."
                      variant="outlined"
                      value={ss}
                      onChange={(e) => handleSSChange(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SettingsIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      sx={{ width: "100px" }}
                      label="SZ"
                      placeholder="SZ..."
                      variant="outlined"
                      value={sz}
                      onChange={(e) => handleSZChange(e.target.value)}
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
                </Grid>
              </Grid>

              {/* Qmax and Tmed Dropdowns */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <FormControl variant="outlined">
                      <InputLabel>Qmax</InputLabel>
                      <Select
                        sx={{ width: "150px" }}
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
                            <Tooltip title={option.description} arrow>
                              <Box>
                                {option.code} - {option.description}
                              </Box>
                            </Tooltip>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl variant="outlined">
                      <InputLabel>Tmed</InputLabel>
                      <Select
                        sx={{ width: "200px" }}
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
                            <Tooltip title={option.description} arrow>
                              <Box>
                                {option.code} - {option.description}
                              </Box>
                            </Tooltip>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Loading and Error States */}
              {isLoading && (
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py={2}
                  >
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    <Typography>Loading collections...</Typography>
                  </Box>
                </Grid>
              )}

              {error && (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "error.light",
                      color: "error.contrastText",
                    }}
                  >
                    <Typography variant="body1">{error}</Typography>
                  </Paper>
                </Grid>
              )}

              {/* Collections Dropdown Section */}
              {showCollectionDropdown && !isLoading && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom color="text.primary">
                      Select Collection Codes ({selectedDatabase} Database)
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {groupedCollections.map((group, groupIndex) => {
                      // Chunk the group into subgroups of 6
                      const chunksOfSix = chunkArray(group, 9);

                      return chunksOfSix.map((chunk, chunkIndex) => (
                        <Grid
                          container
                          spacing={1}
                          key={`${groupIndex}-${chunkIndex}`}
                          sx={{ mb: 2, ml: 2 }}
                        >
                          {chunk.map((collectionName) => {
                            const codeItems =
                              collectionsWithCodes[collectionName] || [];
                            return (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={2}
                                xl={2}
                                key={collectionName}
                              >
                                <FormControl
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  sx={{ minWidth: 210 }}
                                >
                                  <InputLabel>{collectionName}</InputLabel>
                                  <Select
                                    label={collectionName}
                                    value={
                                      selectedCollections[collectionName] || ""
                                    }
                                    onChange={(e) =>
                                      handleCollectionCodeChange(
                                        collectionName,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <MenuItem value="">None</MenuItem>
                                    {codeItems.map((item, index) => (
                                      <MenuItem key={index} value={item.code}>
                                        <Tooltip
                                          title={item.description || item.code}
                                          arrow
                                        >
                                          <Box>
                                            {item.code}
                                            {item.description &&
                                              ` - ${item.description}`}
                                          </Box>
                                        </Tooltip>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            );
                          })}
                        </Grid>
                      ));
                    })}
                  </Paper>
                </Grid>
              )}

              {/* Selected Collections Display */}
              {/* {Object.keys(selectedCollections).length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, bgcolor: "info.light", borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom color="info.main">
                      Selected Collections
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {Object.entries(selectedCollections).map(
                        ([collectionName, code]) => (
                          <Chip
                            key={collectionName}
                            label={`${collectionName}: ${getSelectedDisplayText(
                              collectionName
                            )}`}
                            onDelete={() =>
                              handleRemoveCollection(collectionName)
                            }
                            color="info"
                            variant="outlined"
                            sx={{ m: 0.5 }}
                          />
                        )
                      )}
                    </Box>
                  </Paper>
                </Grid>
              )} */}

              {/* Label Details Display */}
              {LabelDetails && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 2, width: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      Label Details
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      value={LabelDetails}
                      onChange={(e) => setLabelDetails(e.target.value)}
                      InputProps={{
                        readOnly: false,
                        sx: { fontSize: "1.1rem", fontWeight: "medium" },
                      }}
                      sx={{ width: "100%" }}
                    />
                  </Paper>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Save Label
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LabelPrint;
