import React, { useState, useEffect, useMemo } from "react";
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
  Switch,
  FormControlLabel,
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
    "SIL certificate",
    "Shipping Register Certificate",
    "Calibration Certifications",
    "Other Usage Certifications",
    "Sensor Length",
    "Potable Water and Food&Beverage Approvals",
    "Other Explosion Protection Certifications and other Approvals",
    "Other Options",
    "Documentation Language",
    "Pressure Bearing parts Material Source",
    "Tests & Reports",
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
    "Pressure Bearing parts Material Source",
    "Tests & Reports",
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
    "Explosion protection Certification transmitter",
    "Housing Type / Housing Material / Cable Glands transmitter",
    "Protection Class Transmitter / Protection Class Sensor transmitter",
    "Power supply transmitter",
    "Display transmitter",
    "Outputs transmitter",
    "Option Card 1 transmitter",
    "Option Card 2 transmitter",
    "SIL certificate transmitter",
    "Shipping Register Certificate transmitter",
    "Potable Water and Food & Beverage Approvals transmitter",
    "Other Explosion Protection Certifications and other Approvals transmitter",
    "Other Options transmitter",
    "Documentation Language transmitter",
    "Device Identification Label transmitter",
    "Temperature Range of Installation / Ambient Temperature Range transmitter",
    "Remote Transmitter Mounting Kit transmitter",
    "Transmitter Software Function Package transmitter",
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

// Cache for storing fetched collections data
const collectionsCache = new Map();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache management functions
const setCacheData = (key, data) => {
  collectionsCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const getCacheData = (key) => {
  const cached = collectionsCache.get(key);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY_TIME;
  if (isExpired) {
    collectionsCache.delete(key);
    return null;
  }

  return cached.data;
};

// Enhanced Model Number Parser that handles all basic codes
const parseModelNumberForAllCollections = (
  modelNumber,
  basicCode,
  collectionsWithCodes
) => {
  if (!modelNumber || !basicCode || !collectionsWithCodes) {
    console.log("Missing required parameters for parsing");
    return {};
  }

  console.log("=== ENHANCED MODEL NUMBER PARSING ===");
  console.log("Model Number:", modelNumber);
  console.log("Basic Code:", basicCode);
  console.log("Available Collections:", Object.keys(collectionsWithCodes));

  // Remove the basic code from the beginning
  let remainingCode = modelNumber.replace(basicCode, "");
  console.log("Code to parse (after removing basic code):", remainingCode);

  const parsedCollections = {};
  const order = COLLECTION_ORDERS[basicCode];

  if (!order) {
    console.log("No collection order found for basic code:", basicCode);
    return {};
  }

  console.log("Collection order for", basicCode, ":", order);

  // Get ordered collection names that exist in collectionsWithCodes
  const orderedCollectionNames = [];
  order.forEach((orderedName) => {
    const matchingCollection = Object.keys(collectionsWithCodes).find(
      (collectionName) =>
        collectionName.trim().toLowerCase() === orderedName.trim().toLowerCase()
    );
    if (matchingCollection) {
      orderedCollectionNames.push(matchingCollection);
    }
  });

  console.log("Available ordered collections:", orderedCollectionNames);

  let currentPosition = 0;

  // Process each collection in order
  for (let i = 0; i < orderedCollectionNames.length; i++) {
    const collectionName = orderedCollectionNames[i];
    const collectionCodes = collectionsWithCodes[collectionName] || [];

    console.log(
      `\n--- Processing Collection ${i + 1}/${
        orderedCollectionNames.length
      }: ${collectionName} ---`
    );
    console.log(
      `Current position: ${currentPosition}, Remaining: "${remainingCode.substring(
        currentPosition
      )}"`
    );
    console.log(
      `Available codes for this collection: ${collectionCodes.length}`
    );

    if (currentPosition >= remainingCode.length) {
      console.log("Reached end of string");
      break;
    }

    // Check if current position is a dash (empty selection)
    if (remainingCode.charAt(currentPosition) === "-") {
      console.log("Found dash - empty selection");
      parsedCollections[collectionName] = "";
      currentPosition += 1;
      continue;
    }

    // Find the longest matching code for this collection
    let bestMatch = null;
    let bestMatchLength = 0;

    // Sort codes by length (longest first) to find the best match
    const sortedCodes = collectionCodes
      .map((item) => item.code)
      .sort((a, b) => b.length - a.length);

    for (const code of sortedCodes) {
      const remainingSubstring = remainingCode.substring(currentPosition);

      if (remainingSubstring.startsWith(code)) {
        console.log(
          `Found potential match: "${code}" (length: ${code.length})`
        );
        bestMatch = code;
        bestMatchLength = code.length;
        break; // Take the first (longest) match
      }
    }

    if (bestMatch) {
      parsedCollections[collectionName] = bestMatch;
      currentPosition += bestMatchLength;
      console.log(`✓ Matched "${bestMatch}" for ${collectionName}`);
      console.log(`New position: ${currentPosition}`);
    } else {
      console.log(`✗ No match found for ${collectionName}`);
      // Try to find any single character or skip this collection
      // This handles cases where the format might be different
      if (currentPosition < remainingCode.length) {
        const nextChar = remainingCode.charAt(currentPosition);
        if (nextChar !== "-") {
          // Look for single character codes
          const singleCharMatch = collectionCodes.find(
            (item) => item.code === nextChar
          );
          if (singleCharMatch) {
            parsedCollections[collectionName] = nextChar;
            currentPosition += 1;
            console.log(`✓ Found single char match: "${nextChar}"`);
          } else {
            console.log(`Skipping unmatched character: "${nextChar}"`);
            // Don't increment position, let next collection try
          }
        }
      }
    }
  }

  console.log("\n=== PARSING RESULTS ===");
  console.log(
    "Total collections parsed:",
    Object.keys(parsedCollections).length
  );
  console.log("Parsed collections:", parsedCollections);
  console.log("Final position:", currentPosition, "of", remainingCode.length);

  return parsedCollections;
};

// Helper function to update special fields from parsed collections
const updateSpecialFieldsFromCollections = (
  parsedCollections,
  collectionsWithCodes,
  setters
) => {
  console.log("=== UPDATING SPECIAL FIELDS ===");

  Object.entries(parsedCollections).forEach(([collectionName, codeValue]) => {
    if (!codeValue) return; // Skip empty values

    const trimmedName = collectionName.trim();
    const lowerName = trimmedName.toLowerCase();

    // Field type detection
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

    // Find the matching item in the collection
    const codeItems = collectionsWithCodes[collectionName] || [];
    const matchingItem = codeItems.find((item) => item.code === codeValue);

    if (matchingItem) {
      console.log(
        `Updating field for ${collectionName}: ${codeValue} -> ${matchingItem.description}`
      );

      if (isSize) {
        setters.setSize(codeValue);
        setters.setSizeDescription(matchingItem.description || "");
      } else {
        const description = matchingItem.description || codeValue;
        if (isPowerSupply) setters.setPowerSupply(description);
        else if (isProtectionClass) setters.setProtectionClass(description);
        else if (isTamb) setters.setTamb(description);
        else if (isLiner) setters.setLinerMaterial(description);
        else if (isProcessConnection) setters.setFitting(description);
        else if (isElect) setters.setElect(description);
        else if (isPower) setters.setPower(description);
      }
    } else {
      console.log(`No matching item found for ${collectionName}: ${codeValue}`);
    }
  });

  console.log("=== SPECIAL FIELDS UPDATE COMPLETE ===");
};

// Fast Loading Dropdown Component with Virtual Scrolling
const FastDropdown = ({
  label,
  value,
  onChange,
  options = [],
  stepNumber,
  collectionName,
  isSelected,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized filtered options for performance
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(
      (option) =>
        option.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.description &&
          option.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  // Truncate collection name for display
  const truncateCollectionName = (name, maxLength = 25) => {
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      fullWidth
      sx={{
        minWidth: "200px",
        "& .MuiOutlinedInput-root": {
          backgroundColor: isSelected ? "rgba(76, 175, 80, 0.08)" : "white",
          "&:hover": {
            backgroundColor: isSelected
              ? "rgba(76, 175, 80, 0.12)"
              : "rgba(0, 0, 0, 0.04)",
          },
        },
      }}
      {...props}
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
        {truncateCollectionName(label, 20)}
      </InputLabel>

      <Tooltip title={label.length > 20 ? label : ""} placement="top" arrow>
        <Select
          label={`${stepNumber ? `${stepNumber} ` : ""}${truncateCollectionName(
            label,
            20
          )}`}
          value={value || ""}
          onChange={onChange}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => {
            setOpen(false);
            setSearchTerm("");
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                width: 350,
              },
            },
            // Disable auto focus to improve performance
            autoFocus: false,
            // Add search functionality
            MenuListProps: {
              onKeyDown: (e) => {
                if (e.key.length === 1) {
                  setSearchTerm((prev) => prev + e.key);
                } else if (e.key === "Backspace") {
                  setSearchTerm((prev) => prev.slice(0, -1));
                }
              },
            },
          }}
          sx={{
            "& .MuiSelect-select": {
              fontSize: "0.875rem",
            },
          }}
        >
          {/* Search field for large option lists */}
          {options.length > 10 && (
            <MenuItem
              disabled
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 1,
              }}
            >
              <TextField
                size="small"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => {
                  e.stopPropagation();
                  setSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => e.stopPropagation()}
                fullWidth
                autoFocus
              />
            </MenuItem>
          )}

          <MenuItem
            value=""
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            Select Option
          </MenuItem>

          {filteredOptions.map((item, index) => (
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
              <Typography variant="body2" fontWeight="bold" color="primary">
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
  );
};

// Optimized Collection Dropdowns Component
const OptimizedCollectionDropdowns = ({
  basicCode,
  collectionsWithCodes,
  selectedCollections,
  onCollectionCodeChange,
  isLoading,
}) => {
  // Memoized ordered collections to prevent recalculation
  const orderedCollectionNames = useMemo(() => {
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
  }, [basicCode, collectionsWithCodes]);

  // Memoized step number calculation
  const getStepNumber = useMemo(() => {
    return (collectionName) => {
      const order = COLLECTION_ORDERS[basicCode];
      if (!order) return null;

      const index = order.findIndex(
        (orderedName) =>
          orderedName.trim().toLowerCase() ===
          collectionName.trim().toLowerCase()
      );

      return index !== -1 ? index + 1 : null;
    };
  }, [basicCode]);

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
              <FastDropdown
                label={collectionName}
                value={selectedCollections[collectionName]}
                onChange={(e) =>
                  onCollectionCodeChange(collectionName, e.target.value)
                }
                options={collectionsWithCodes[collectionName] || []}
                stepNumber={stepNumber}
                collectionName={collectionName}
                isSelected={isSelected}
              />
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
  const [allowEditModeUpdates, setAllowEditModeUpdates] = useState(false);

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

  // FIXED: Control states for edit mode
  const [isEditModeInitialized, setIsEditModeInitialized] = useState(false);
  const [isInEditMode, setIsInEditMode] = useState(false); // NEW: Persistent edit mode flag
  const [originalLabelDetails, setOriginalLabelDetails] = useState(""); // NEW: Store original value

  // Preload all databases on component mount for instant access
  useEffect(() => {
    const preloadAllDatabases = async () => {
      const databases = ["Fep631", "Fep632", "Transmitter"];

      // Check cache first
      const cachedPromises = databases.map(async (dbName) => {
        const cached = getCacheData(dbName);
        if (cached) {
          console.log(`Using cached data for ${dbName}`);
          return { dbName, data: cached };
        }

        try {
          console.log(`Preloading collections from database: ${dbName}`);
          const response = await api.get(`/collections-by-database/${dbName}`);

          if (response.data.success) {
            const dbCollections = response.data.collectionsWithData;

            // Filter out excluded collections
            const filteredCollections = {};
            Object.keys(dbCollections).forEach((collectionName) => {
              if (!EXCLUDED_COLLECTIONS.includes(collectionName)) {
                filteredCollections[collectionName] =
                  dbCollections[collectionName];
              }
            });

            // Cache the data
            setCacheData(dbName, filteredCollections);
            console.log(
              `Preloaded and cached ${dbName}: ${
                Object.keys(filteredCollections).length
              } collections`
            );

            return { dbName, data: filteredCollections };
          }
        } catch (error) {
          console.error(`Error preloading ${dbName}:`, error);
          return { dbName, data: null };
        }

        return { dbName, data: null };
      });

      await Promise.all(cachedPromises);
      console.log("All databases preloaded successfully");
    };

    preloadAllDatabases();
  }, []);

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

  // Enhanced collections loading specifically for edit mode
  const loadCollectionsForEditMode = async (dbName) => {
    console.log(`=== LOADING COLLECTIONS FOR EDIT MODE: ${dbName} ===`);
    setIsLoading(true);
    setError(null);

    try {
      // First try cache
      const cachedData = getCacheData(dbName);

      if (cachedData) {
        console.log(
          `✓ Using cached data for ${dbName} (${
            Object.keys(cachedData).length
          } collections)`
        );
        setCollectionsWithCodes(cachedData);
        setCollectionNames(Object.keys(cachedData));
        setFilteredCollectionNames(Object.keys(cachedData));
        setIsLoading(false);
        return true;
      }

      // Fallback to API
      console.log(`Cache miss for ${dbName}, fetching from API...`);
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

        console.log(
          `✓ Loaded ${
            Object.keys(filteredCollections).length
          } collections from API`
        );

        // Cache the data
        setCacheData(dbName, filteredCollections);

        setCollectionsWithCodes(filteredCollections);
        setCollectionNames(Object.keys(filteredCollections));
        setFilteredCollectionNames(Object.keys(filteredCollections));
        setIsLoading(false);
        return true;
      } else {
        throw new Error(response.data.message || "Failed to fetch collections");
      }
    } catch (error) {
      console.error(`✗ Error loading collections for ${dbName}:`, error);
      setError(`Error loading collections: ${error.message}`);
      setIsLoading(false);
      return false;
    }
  };

  // Ultra-fast collections loading from cache
  const loadCollectionsFromCache = (dbName) => {
    setIsLoading(true);
    setError(null);

    try {
      const cachedData = getCacheData(dbName);

      if (cachedData) {
        console.log(`Loading collections from cache for: ${dbName}`);
        setCollectionsWithCodes(cachedData);
        setCollectionNames(Object.keys(cachedData));
        setFilteredCollectionNames(Object.keys(cachedData));

        console.log(
          `Collections loaded from cache: ${
            Object.keys(cachedData).length
          } collections`
        );
        setIsLoading(false);
        return true;
      } else {
        console.log(`No cache found for ${dbName}, falling back to API call`);
        return fetchCollectionsFromDatabase(dbName);
      }
    } catch (error) {
      console.error(`Error loading from cache for ${dbName}:`, error);
      setError(`Error loading collections: ${error.message}`);
      setIsLoading(false);
      return false;
    }
  };

  // Fallback function for API calls (only used if cache miss)
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

        // Cache the data for future use
        setCacheData(dbName, filteredCollections);

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

  // FIXED: Initialize edit mode - this runs once when component mounts in edit mode
  useEffect(() => {
    if (isEditMode && editData && !isEditModeInitialized) {
      console.log("=== INITIALIZING EDIT MODE ===");
      console.log("Edit data:", editData);

      // FIXED: Set persistent edit mode flags
      setIsEditModeInitialized(true);
      setIsInEditMode(true);
      setOriginalLabelDetails(editData.LabelDetails || "");

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

        // Load collections and show dropdown using cache
        const dbName = getDatabaseForBasicCode(extractedBasicCode);
        setSelectedDatabase(dbName);
        setShowCollectionDropdown(true);

        if (dbName) {
          console.log("Loading collections for database:", dbName);
          loadCollectionsForEditMode(dbName);
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

  // Enhanced effect to handle collection parsing with better error handling
  useEffect(() => {
    if (
      isEditMode &&
      editData &&
      isEditModeInitialized &&
      basicCode &&
      collectionsWithCodes &&
      Object.keys(collectionsWithCodes).length > 0
    ) {
      console.log("=== INITIALIZING EDIT MODE COLLECTIONS ===");
      console.log(
        "Current selectedCollections:",
        Object.keys(selectedCollections).length
      );

      // Only parse if we haven't already populated the collections
      if (Object.keys(selectedCollections).length === 0) {
        const modelNumber = editData.LabelDetails || "";

        if (modelNumber && modelNumber.length > basicCode.length) {
          console.log("Starting model number parsing...");

          const parsedCollections = parseModelNumberForAllCollections(
            modelNumber,
            basicCode,
            collectionsWithCodes
          );

          if (Object.keys(parsedCollections).length > 0) {
            console.log(
              `Successfully parsed ${
                Object.keys(parsedCollections).length
              } collections`
            );
            setSelectedCollections(parsedCollections);

            // Update special fields based on parsed collections
            const setters = {
              setPowerSupply,
              setProtectionClass,
              setTamb,
              setSize,
              setSizeDescription,
              setLinerMaterial,
              setFitting,
              setElect,
              setPower,
            };

            updateSpecialFieldsFromCollections(
              parsedCollections,
              collectionsWithCodes,
              setters
            );

            console.log("✓ Edit mode collections initialized successfully");
          } else {
            console.log("⚠ No collections could be parsed from model number");
          }
        } else {
          console.log("⚠ Model number too short or missing");
        }
      } else {
        console.log("Collections already populated, skipping parsing");
      }
    }
  }, [
    isEditMode,
    editData,
    isEditModeInitialized,
    basicCode,
    collectionsWithCodes,
  ]);

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

  // FIXED: Handle Qmax dropdown change - don't auto-update model number in edit mode
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

    // FIXED: Don't auto-update model number in edit mode
    if (!isInEditMode || allowEditModeUpdates) {
      updateLabelDetails(selectedCollections, ss, sz, basicCode);
    }
  };

  const handleTambDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedTmedDropdown(value);

    // UPDATED: Use the new logic for edit mode updates
    if (!isInEditMode || allowEditModeUpdates) {
      updateLabelDetails(selectedCollections, ss, sz, basicCode);
    }
  };

  // Update handleSSChange:
  const handleSZChange = (value) => {
    setSZ(value);

    // UPDATED: Use the new logic for edit mode updates
    if (!isInEditMode || allowEditModeUpdates) {
      updateLabelDetails(selectedCollections, ss, value, basicCode);
    }
  };

  // FIXED: Handle basic code selection with instant cache loading
  const handleBasicCodeChange = (event) => {
    const value = event.target.value;
    setBasicCode(value);

    // FIXED: Don't reset if in edit mode
    if (!isInEditMode) {
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
      // Try to load from cache first for instant response
      const success = loadCollectionsFromCache(dbName);
      if (success) {
        setShowCollectionDropdown(true);
      }
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

    // FIXED: Don't auto-update model number in edit mode
    if (!isInEditMode) {
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

    // FIXED: In edit mode, don't clear selections when filtering
    if (!isInEditMode) {
      const updatedSelectedCollections = { ...selectedCollections };
      Object.keys(updatedSelectedCollections).forEach((collectionName) => {
        if (!orderedFiltered.includes(collectionName)) {
          delete updatedSelectedCollections[collectionName];
        }
      });
      setSelectedCollections(updatedSelectedCollections);

      updateLabelDetails(updatedSelectedCollections, ss, sz, basicCode);
    }
  }, [basicCode, collectionNames, isInEditMode]);

  // FIXED: Handle collection code selection - don't auto-update model number in edit mode
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

    // UPDATED: Use the new logic for edit mode updates
    if (!isInEditMode || allowEditModeUpdates) {
      updateLabelDetails(updatedCollections, ss, sz, basicCode);
    }
  };

  // FIXED: Handle SS and SZ changes - don't auto-update model number in edit mode
  const handleSSChange = (value) => {
    setSS(value);

    // FIXED: Don't auto-update model number in edit mode
    if (!isInEditMode || allowEditModeUpdates) {
      updateLabelDetails(selectedCollections, value, sz, basicCode);
    }
  };

  // FIXED: Updated function to respect edit mode and exclude SS/SZ in edit mode
  const updateLabelDetails = (
    selections,
    currentSS,
    currentSZ,
    currentBasicCode
  ) => {
    // UPDATED: Check both edit mode status and the allow updates flag
    if (isInEditMode && !allowEditModeUpdates) {
      console.log("Preserving original label details in edit mode (auto-update disabled)");
      return;
    }
  
    let details = currentBasicCode || "";
  
    // Get the collection order for the current basic code
    const order = COLLECTION_ORDERS[currentBasicCode];
    if (order) {
      // Process collections in the specified order
      order.forEach((orderedName) => {
        const matchingCollection = Object.keys(selections).find(
          (collectionName) =>
            collectionName.trim().toLowerCase() === orderedName.trim().toLowerCase()
        );
  
        if (matchingCollection) {
          const code = selections[matchingCollection];
          // FIXED: In edit mode, don't add hyphens for empty values
          if (code === "" || code === null || code === undefined) {
            if (!isInEditMode) {
              details += "-";
            }
          } else if (code) {
            details += code;
          }
        } else {
          // If this ordered collection is not in selections, add a dash only if not in edit mode
          if (!isInEditMode) {
            details += "-";
          }
        }
      });
    } 
    
    // FIXED: Don't add SS and SZ in edit mode
    if (!isInEditMode) {
      if (currentSS) details += currentSS;
      if (currentSZ) details += currentSZ;
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2">
              <strong>Edit Mode:</strong> Model number changes are controlled by
              the toggle below. SS and SZ values are excluded from the generated model number.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={allowEditModeUpdates}
                  onChange={(e) => setAllowEditModeUpdates(e.target.checked)}
                  color="primary"
                />
              }
              label="Auto-update model number"
              sx={{ ml: 2 }}
            />
          </Box>
        </Alert>
      )}
      
      {/* Performance indicator */}
      {!isLoading &&
        collectionsWithCodes &&
        Object.keys(collectionsWithCodes).length > 0 && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              ⚡ Fast loading enabled - Collections loaded instantly from cache!
              {isEditMode && Object.keys(selectedCollections).length > 0 && (
                <span>
                  {" "}
                  | {Object.keys(selectedCollections).length} dropdown
                  selections loaded
                </span>
              )}
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
                        sx={{ width: "140px" }}
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
                        sx={{ width: "140px" }}
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
                      <FormControl
                        sx={{ width: "140px" }}
                        size="small"
                        required
                      >
                        <InputLabel>Label Type</InputLabel>
                        <Select
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
                        <FormControl
                          sx={{ width: "140px" }}
                          size="small"
                          variant="outlined"
                          required
                        >
                          <InputLabel>Logo Option</InputLabel>
                          <Select
                            sx={{
                              width: "140px",
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
                        sx={{ width: "140px" }}
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
                      <FormControl sx={{ width: "140px" }} size="small">
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
                        sx={{ width: "140px" }}
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
                          sx={{ width: "140px" }}
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
                        sx={{ width: "140px" }}
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
                        sx={{ width: "140px" }}
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
                        sx={{ width: "140px" }}
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

              {/* Collections Section - Updated with Optimized Dropdowns */}
              {showCollectionDropdown && (
                <Grid item xs={12}>
                  <OptimizedCollectionDropdowns
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
                        backgroundColor: isInEditMode
                          ? "rgba(255, 193, 7, 0.1)"
                          : "rgba(255, 255, 255, 0.8)",
                        width: "70rem",
                        height: "50px",
                      },
                    }}
                    helperText={
                      isInEditMode
                        ? "Edit mode: Model number can be manually edited (SS and SZ excluded from auto-generation)"
                        : "Auto-generated based on selections"
                    }
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