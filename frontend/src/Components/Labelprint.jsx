import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TagIcon from "@mui/icons-material/LocalOffer";
import BarcodeIcon from "@mui/icons-material/QrCode";
import CodeIcon from "@mui/icons-material/Code";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
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

// Static data for Qmax dropdown
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

const DEV_VERSION_OPTIONS = [
  { value: "01.14.00", label: "01.14.00" },
  { value: "01.15.00", label: "01.15.00" },
  { value: "01.16.00", label: "01.16.00" },
  { value: "01.17.00", label: "01.17.00" },
  { value: "01.18.00", label: "01.18.00" },
  { value: "01.19.00", label: "01.19.00" },
  { value: "01.20.00", label: "01.20.00" },
];

// Ordered Collection Dropdowns Component
const OrderedCollectionDropdowns = ({
  basicCode,
  collectionsWithCodes,
  selectedCollections,
  onCollectionCodeChange,
  isLoading,
}) => {
  // Get ordered collection names based on basic code
  const getOrderedCollections = () => {
    const order = COLLECTION_ORDERS[basicCode];
    if (!order) return [];

    const orderedCollections = [];
    const availableCollections = Object.keys(collectionsWithCodes);

    // First, add collections in the specified order
    order.forEach((orderedName) => {
      const matchingCollection = availableCollections.find(
        (name) => name.trim().toLowerCase() === orderedName.trim().toLowerCase()
      );

      if (matchingCollection && collectionsWithCodes[matchingCollection]) {
        orderedCollections.push(matchingCollection);
      }
    });

    // Then add any remaining collections that weren't in the order
    availableCollections.forEach((collectionName) => {
      if (!orderedCollections.includes(collectionName)) {
        orderedCollections.push(collectionName);
      }
    });

    return orderedCollections;
  };

  const orderedCollectionNames = getOrderedCollections();

  // Helper function to truncate long collection names for display
  const truncateCollectionName = (name, maxLength = 25) => {
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  };

  // Helper function to get step number based on collection order
  const getStepNumber = (collectionName) => {
    const order = COLLECTION_ORDERS[basicCode];
    if (!order) return null;

    const index = order.findIndex(
      (orderedName) =>
        orderedName.trim().toLowerCase() === collectionName.trim().toLowerCase()
    );

    return index !== -1 ? index + 1 : null;
  };

  if (
    !basicCode ||
    !collectionsWithCodes ||
    Object.keys(collectionsWithCodes).length === 0
  ) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <DeviceHubIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="bold">
          Configuration Options - {basicCode}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          ({orderedCollectionNames.length} options)
        </Typography>
        {isLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select options in the recommended order for optimal configuration
      </Typography>

      <Grid container spacing={2}>
        {orderedCollectionNames.map((collectionName, index) => {
          const stepNumber = getStepNumber(collectionName);
          const isSelected = selectedCollections[collectionName];

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              key={`${collectionName}-${index}`}
            >
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  minWidth: "200px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isSelected
                      ? "rgba(76, 175, 80, 0.08)"
                      : "white",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? "rgba(76, 175, 80, 0.12)"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                  },
                }}
              >
                <InputLabel
                  sx={{
                    fontSize: "0.875rem",
                    color: isSelected ? "success.main" : "text.secondary",
                  }}
                >
                  {stepNumber && (
                    <Box
                      component="span"
                      sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        mr: 1,
                        fontWeight: "bold",
                      }}
                    >
                      {stepNumber}
                    </Box>
                  )}
                  {truncateCollectionName(collectionName, 20)}
                </InputLabel>

                <Tooltip
                  title={collectionName.length > 20 ? collectionName : ""}
                  placement="top"
                  arrow
                >
                  <Select
                    label={`${
                      stepNumber ? `${stepNumber} ` : ""
                    }${truncateCollectionName(collectionName, 20)}`}
                    value={selectedCollections[collectionName] || ""}
                    onChange={(e) =>
                      onCollectionCodeChange(collectionName, e.target.value)
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          width: 350,
                        },
                      },
                    }}
                    sx={{
                      "& .MuiSelect-select": {
                        fontSize: "0.875rem",
                      },
                    }}
                  >
                    <MenuItem
                      value=""
                      sx={{ fontStyle: "italic", color: "text.secondary" }}
                    >
                      Select Option
                    </MenuItem>
                    {collectionsWithCodes[collectionName]?.map((item) => (
                      <MenuItem
                        key={`${item.code}-${index}`}
                        value={item.code}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          whiteSpace: "normal",
                          py: 1.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="primary"
                        >
                          {item.code}
                        </Typography>
                        {item.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              wordBreak: "break-word",
                              lineHeight: 1.2,
                            }}
                          >
                            {item.description.length > 60
                              ? `${item.description.substring(0, 60)}...`
                              : item.description}
                          </Typography>
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </Tooltip>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>

      {/* Progress indicator */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Progress:{" "}
          {
            Object.keys(selectedCollections).filter(
              (key) => selectedCollections[key]
            ).length
          }{" "}
          / {orderedCollectionNames.length} options selected
        </Typography>
      </Box>
    </Paper>
  );
};

const LabelPrint = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in edit mode
  const editData = location.state?.editData;
  const isEditMode = !!editData;
  const [editId, setEditId] = useState(editData?._id || null);

  const [basicCode, setBasicCode] = useState("");
  const [collectionsWithCodes, setCollectionsWithCodes] = useState({});
  const [collectionNames, setCollectionNames] = useState([]);
  const [filteredCollectionNames, setFilteredCollectionNames] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState({});
  const [modelType, setModelType] = useState("");
  const [ss, setSS] = useState("");
  const [sz, setSZ] = useState("");
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [allSelectionsDone, setAllSelectionsDone] = useState(false);

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
  const [Fexc, setFexc] = useState("");
  const [power, setPower] = useState("");
  const [selectedQmax, setSelectedQmax] = useState("");
  const [selectedTmedDropdown, setSelectedTmedDropdown] = useState("");

  // New state variables for storing descriptions
  const [sizeDescription, setSizeDescription] = useState("");
  const [qmaxDescription, setQmaxDescription] = useState("");

  // New state to control LogoType visibility
  const [showLogoType, setShowLogoType] = useState(true);

  // Control states for edit mode
  const [isEditModeInitialized, setIsEditModeInitialized] = useState(false);
  const [preserveLabelDetails, setPreserveLabelDetails] = useState(false);

  // Function to determine which database to use based on basic code
  const getDatabaseForBasicCode = (code) => {
    switch (code) {
      case "FEP631":
        return "Fep631";
      case "FEP632":
        return "Fep632";
      case "FET632":
        return "Transmitter";
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

    order.forEach((orderedName) => {
      const matchingIndex = availableCollections.findIndex(
        (name) => name.trim().toLowerCase() === orderedName.trim().toLowerCase()
      );

      if (matchingIndex !== -1) {
        orderedCollections.push(availableCollections[matchingIndex]);
        availableCollections.splice(matchingIndex, 1);
      }
    });

    orderedCollections.push(...availableCollections);
    return orderedCollections;
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

        // Filter out excluded collections
        const filteredCollections = {};
        Object.keys(dbCollections).forEach((collectionName) => {
          if (!EXCLUDED_COLLECTIONS.includes(collectionName)) {
            filteredCollections[collectionName] = dbCollections[collectionName];
          }
        });

        setCollectionsWithCodes(filteredCollections);
        setCollectionNames(Object.keys(filteredCollections));
        setFilteredCollectionNames(Object.keys(filteredCollections));

        console.log(
          "Collections loaded successfully:",
          Object.keys(filteredCollections).length,
          "collections"
        );
        return true;
      } else {
        setError("Failed to fetch collections: " + response.data.message);
        return false;
      }
    } catch (error) {
      console.error(`Error fetching collections from ${dbName}:`, error);
      setError(`Error fetching collections: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize edit mode - this runs once when component mounts in edit mode
  useEffect(() => {
    if (isEditMode && editData && !isEditModeInitialized) {
      console.log("=== INITIALIZING EDIT MODE ===");
      console.log("Edit data:", editData);

      setIsEditModeInitialized(true);
      setPreserveLabelDetails(true);

      // Set all basic form fields immediately
      setLabelType(editData.LabelType || "");
      setLogoType(editData.LogoType || "");
      setSerialNumber(editData.SerialNumber || "");
      setTagNumber(editData.TagNumber || "");
      setLabelDetails(editData.LabelDetails || "");
      setDate(editData.Date || "");
      setStatus(editData.Status || "Active");
      setDevVersion(editData.DevVersion || "");

      // Set additional fields
      setPowerSupply(editData.powerSupply || "");
      setPower(editData.power || "");
      setProtectionClass(editData.ProtectionClass || "");
      setTamb(editData.Tamb || "");
      setSize(editData.Size || "");
      setLinerMaterial(editData.LinerMaterial || "");
      setFitting(editData.Fitting || "");
      setElect(editData.Elect || "");
      setFexc(editData.Fexc || "");
      setSS(editData.ss || "");
      setSZ(editData.sz || "");

      // Handle Qmax
      let qmaxValue = editData.selectedQmax || "";
      const qmaxOptionByDescription = QMAX_OPTIONS.find(
        (option) => option.description === qmaxValue
      );
      const qmaxOptionByCode = QMAX_OPTIONS.find(
        (option) => option.code === qmaxValue
      );

      if (qmaxOptionByCode) {
        setSelectedQmax(qmaxValue);
        setQmaxDescription(qmaxOptionByCode.description);
      } else if (qmaxOptionByDescription) {
        setSelectedQmax(qmaxOptionByDescription.code);
        setQmaxDescription(qmaxValue);
      } else {
        setSelectedQmax(qmaxValue);
        setQmaxDescription("");
      }

      setSelectedTmedDropdown(editData.selectedTmedDropdown || "");

      // Extract basic code and load collections
      const modelNumber = editData.LabelDetails || "";
      let extractedBasicCode = "";
      if (modelNumber.startsWith("FEP631")) {
        extractedBasicCode = "FEP631";
      } else if (modelNumber.startsWith("FEP632")) {
        extractedBasicCode = "FEP632";
      } else if (modelNumber.startsWith("FET632")) {
        extractedBasicCode = "FET632";
      }

      if (extractedBasicCode) {
        console.log("Extracted basic code:", extractedBasicCode);
        setBasicCode(extractedBasicCode);

        // Set model type
        let defaultModelType = "";
        if (
          extractedBasicCode === "FEP631" ||
          extractedBasicCode === "FEP632"
        ) {
          defaultModelType = "Sensor";
        } else if (extractedBasicCode === "FET632") {
          defaultModelType = "Transmitter";
        }
        setModelType(defaultModelType);

        // Load collections and show dropdown
        const dbName = getDatabaseForBasicCode(extractedBasicCode);
        setSelectedDatabase(dbName);
        setShowCollectionDropdown(true);

        if (dbName) {
          console.log("Loading collections for database:", dbName);
          fetchCollectionsFromDatabase(dbName);
        }
      }

      // Handle LogoType visibility
      const shouldHideLogoType =
        editData.LabelType === "Sensor(115x35)" ||
        editData.LabelType === "Transmitter";
      setShowLogoType(!shouldHideLogoType);

      console.log("=== EDIT MODE INITIALIZATION COMPLETE ===");
    }
  }, [isEditMode, editData, isEditModeInitialized]);

  // Handle LabelType change with LogoType visibility logic
  const handleLabelTypeChange = (event) => {
    const value = event.target.value;
    setLabelType(value);

    const shouldHideLogoType =
      value === "Sensor(115x35)" || value === "Transmitter";
    setShowLogoType(!shouldHideLogoType);

    if (shouldHideLogoType) {
      setLogoType("");
    }
  };

  // Handle Qmax dropdown change
  const handleQmaxChange = (event) => {
    const value = event.target.value;
    setSelectedQmax(value);

    const selectedQmaxOption = QMAX_OPTIONS.find(
      (option) => option.code === value
    );
    if (selectedQmaxOption) {
      setQmaxDescription(selectedQmaxOption.description);
    } else {
      setQmaxDescription("");
    }

    if (!preserveLabelDetails) {
      updateLabelDetails(selectedCollections, ss, sz, basicCode);
    }
  };

  // Handle Tamb dropdown change
  const handleTambDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedTmedDropdown(value);

    if (!preserveLabelDetails) {
      updateLabelDetails(selectedCollections, ss, sz, basicCode);
    }
  };

  // Handle basic code selection with database selection
  const handleBasicCodeChange = (event) => {
    const value = event.target.value;
    setBasicCode(value);

    // Don't reset if in edit mode
    if (!isEditMode) {
      // Reset collections and selections first
      setCollectionsWithCodes({});
      setCollectionNames([]);
      setFilteredCollectionNames([]);
      setSelectedCollections({});
      setShowCollectionDropdown(false);

      // Reset all states
      setPowerSupply("");
      setPower("");
      setLinerMaterial("");
      setProtectionClass("");
      setTamb("");
      setFitting("");
      setElect("");
      setSize("");
      setSizeDescription("");
      setSelectedQmax("");
      setQmaxDescription("");
      setSelectedTmedDropdown("");
    }

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

    if (!preserveLabelDetails) {
      updateLabelDetails({}, ss, sz, value);
    }
  };

  // Filter collections based on basicCode and apply ordering
  useEffect(() => {
    if (!collectionNames.length) return;

    let filtered = [...collectionNames];

    if (basicCode === "FET632") {
      filtered = collectionNames.filter((name) =>
        name.toLowerCase().includes("transmitter")
      );
    }

    const orderedFiltered = orderCollections(filtered, basicCode);
    setFilteredCollectionNames(orderedFiltered);

    console.log(
      "Filtered and ordered collections:",
      orderedFiltered.length,
      "collections"
    );

    // In edit mode, don't clear selections when filtering
    if (!isEditMode) {
      const updatedSelectedCollections = { ...selectedCollections };
      Object.keys(updatedSelectedCollections).forEach((collectionName) => {
        if (!orderedFiltered.includes(collectionName)) {
          delete updatedSelectedCollections[collectionName];
        }
      });
      setSelectedCollections(updatedSelectedCollections);

      if (!preserveLabelDetails) {
        updateLabelDetails(updatedSelectedCollections, basicCode);
      }
    }
  }, [basicCode, collectionNames, isEditMode, preserveLabelDetails]);

  // Handle collection code selection
  const handleCollectionCodeChange = (collectionName, codeValue) => {
    console.log(`Collection code change: ${collectionName} -> "${codeValue}"`);

    const trimmedName = collectionName.trim();
    const lowerName = trimmedName.toLowerCase();

    // Update special field states
    const isPowerSupply =
      lowerName.includes("power") && lowerName.includes("supply");

    const isProtectionClass = lowerName.includes("protection");
    const isTamb = lowerName.includes("temperature");
    const isSize =
      trimmedName === "Nominal Diameter" ||
      lowerName.includes("nominal diameter");
    const isPower =
      trimmedName === "Power Supply Line Frequency" ||
      lowerName.includes("power supply line frequency");
    const isLiner =
      lowerName.includes("liner") && lowerName.includes("material");
    const isProcessConnection = lowerName.includes("process connection");
    const isElect =
      lowerName.includes("measuring") && lowerName.includes("electrode");

    if (
      isPowerSupply ||
      isPower ||
      isProtectionClass ||
      isTamb ||
      isSize ||
      isLiner ||
      isProcessConnection ||
      isElect
    ) {
      if (codeValue === "") {
        if (isPowerSupply) setPowerSupply("");
        else if (isProtectionClass) setProtectionClass("");
        else if (isTamb) setTamb("");
        else if (isSize) {
          setSize("");
          setSizeDescription("");
        } else if (isLiner) setLinerMaterial("");
        else if (isProcessConnection) setFitting("");
        else if (isElect) setElect("");
      } else {
        const codeItems = collectionsWithCodes[collectionName] || [];
        const matchingItem = codeItems.find((item) => item.code === codeValue);

        if (isSize) {
          setSize(codeValue);
          setSizeDescription(matchingItem?.description || "");
        } else {
          const description = matchingItem?.description || codeValue;
          if (isPowerSupply) setPowerSupply(description);
          else if (isProtectionClass) setProtectionClass(description);
          else if (isTamb) setTamb(description);
          else if (isLiner) setLinerMaterial(description);
          else if (isProcessConnection) setFitting(description);
          else if (isElect) setElect(description);
          else if (isPower) setPower(description);
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

    setSelectedCollections(updatedCollections);

    if (!preserveLabelDetails) {
      updateLabelDetails(updatedCollections, ss, sz, basicCode);
    }
  };

  // Handle SS and SZ changes
  const handleSSChange = (value) => {
    setSS(value);

    if (!preserveLabelDetails) {
      updateLabelDetails(selectedCollections, value, sz, basicCode);
    }
  };

  const handleSZChange = (value) => {
    setSZ(value);

    if (!preserveLabelDetails) {
      updateLabelDetails(selectedCollections, ss, value, basicCode);
    }
  };

  const updateLabelDetails = (
    selections,
    currentSS,
    currentSZ,
    currentBasicCode
  ) => {
    // Don't update if we're preserving label details (edit mode)
    if (preserveLabelDetails) {
      console.log("Preserving original label details in edit mode");
      return;
    }

    let details = currentBasicCode || "";

    const collectionKeys = Object.keys(selections);

    if (collectionKeys.length > 0) {
      collectionKeys.forEach((collectionName) => {
        const code = selections[collectionName];

        if (code === "") {
          details += "-";
        } else if (code) {
          details += code;
        }
      });
    }

    if (details) {
      setAllSelectionsDone(true);
      setLabelDetails(details);
    } else {
      setAllSelectionsDone(false);
      setLabelDetails("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = [
      LabelType,
      SerialNumber,
      LabelDetails,
      Date,
      Status,
      ss,
      sz,
    ];

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
        Fexc,
        Size: sizeDescription || Size,
        selectedQmax: qmaxDescription || selectedQmax,
        selectedTmedDropdown,
      };

      let response;
      if (isEditMode) {
        response = await api.put(`/table/${editId}`, formData);
        alert("Label updated successfully!");
      } else {
        response = await api.post("/table", formData);
        alert("Label saved successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        navigate("/mainTable");
      }
    } catch (error) {
      console.error("Error saving label:", error);
      alert(
        "Error saving label: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDevVersionChange = (event) => {
    setDevVersion(event.target.value);
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
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {isEditMode ? "Edit Label" : "Label Print"}
          </Typography>
          {isEditMode && (
            <Chip
              icon={<EditIcon />}
              label="Edit Mode"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          )}
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/mainTable")}
        >
          Back to List
        </Button>
      </Box>

      {/* Alert for edit mode */}
      {isEditMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            You are editing an existing label. Make your changes and click
            "Update Label" to save.
          </Typography>
        </Alert>
      )}

      {/* Form Card */}
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardHeader
          title={isEditMode ? "Edit Label Form" : "Master Form"}
          sx={{
            background: (theme) =>
              isEditMode
                ? `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`
                : `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
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
                            FEP631
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
                              Logo 1
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
                      <FormControl sx={{ width: "150px" }} size="small">
                        <InputLabel>Device Version</InputLabel>
                        <Select
                          value={DevVersion}
                          onChange={handleDevVersionChange}
                          label="Device Version"
                        >
                          <MenuItem value="">
                            <em>Select Version</em>
                          </MenuItem>
                          {DEV_VERSION_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <DeviceHubIcon sx={{ mr: 1 }} />
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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

              {/* Collections Section - Updated with Ordered Dropdowns */}
              {showCollectionDropdown && (
                <Grid item xs={12}>
                  <OrderedCollectionDropdowns
                    basicCode={basicCode}
                    collectionsWithCodes={collectionsWithCodes}
                    selectedCollections={selectedCollections}
                    onCollectionCodeChange={handleCollectionCodeChange}
                    isLoading={isLoading}
                  />
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
                  color={isEditMode ? "warning" : "primary"}
                  size="large"
                  endIcon={isEditMode ? <SaveIcon /> : <ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    background: (theme) =>
                      isEditMode
                        ? `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.dark} 90%)`
                        : `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                    "&:hover": {
                      background: (theme) =>
                        isEditMode
                          ? `linear-gradient(45deg, ${theme.palette.warning.dark} 30%, ${theme.palette.warning.main} 90%)`
                          : `linear-gradient(45deg, ${theme.palette.success.dark} 30%, ${theme.palette.success.main} 90%)`,
                    },
                  }}
                >
                  {isEditMode ? "Update Label" : "Save Label"}
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
