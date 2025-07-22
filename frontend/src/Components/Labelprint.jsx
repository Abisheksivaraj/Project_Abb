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
// FIXED: Helper function to update special fields from parsed collections - also needs specific matching
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

    // Field type detection with specific matching
    const isPowerSupply =
      lowerName.includes("power") && lowerName.includes("supply");

    // FIXED: More specific matching for protection class
    const isProtectionClass =
      (lowerName.includes("protection class") &&
        (lowerName.includes("transmitter") || lowerName.includes("sensor"))) ||
      trimmedName === "Protection Class Transmitter / Protection Class Sensor";

    const isTamb = lowerName.includes("temperature");
    const isSize =
      trimmedName === "Nominal Diameter" ||
      lowerName.includes("nominal diameter");
    const isPower =
      trimmedName === "Power Supply Line Frequency" ||
      lowerName.includes("power supply line frequency");
    const isLiner =
      lowerName.includes("liner") && lowerName.includes("material");

    // FIXED: More specific matching for process connection
    const isProcessConnection =
      (lowerName.includes("process connection") &&
        !lowerName.includes("material")) ||
      trimmedName === "Process connection";

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

// FIXED: Handle collection code selection - more specific protection class matching

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
  // NEW: Async version of loadCollectionsFromCache that returns a Promise
  const loadCollectionsFromCacheAsync = async (dbName) => {
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
        // Call the API version and wait for it
        const success = await fetchCollectionsFromDatabase(dbName);
        return success;
      }
    } catch (error) {
      console.error(`Error loading from cache for ${dbName}:`, error);
      setError(`Error loading collections: ${error.message}`);
      setIsLoading(false);
      return false;
    }
  };

  // FIXED: Make fetchCollectionsFromDatabase return a Promise
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
        setIsLoading(false);
        return true;
      } else {
        setError("Failed to fetch collections: " + response.data.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error(`Error fetching collections from ${dbName}:`, error);
      setError(`Error fetching collections: ${error.message}`);
      setIsLoading(false);
      return false;
    }
  };

  // Fallback function for API calls (only used if cache miss)

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

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log("=== STATE DEBUG ===");
    console.log("- LabelType:", LabelType);
    console.log("- BasicCode:", basicCode);
    console.log(
      "- Collections count:",
      Object.keys(collectionsWithCodes).length
    );
    console.log("- Show dropdown:", showCollectionDropdown);
    console.log("- Is Edit Mode:", isInEditMode);
  }, [
    LabelType,
    basicCode,
    collectionsWithCodes,
    showCollectionDropdown,
    isInEditMode,
  ]);

  // ENHANCED: Debug useEffect to monitor dropdown visibility
  useEffect(() => {
    console.log("=== DROPDOWN VISIBILITY DEBUG ===");
    console.log("- basicCode:", basicCode);
    console.log(
      "- collectionsWithCodes keys:",
      Object.keys(collectionsWithCodes)
    );
    console.log(
      "- collectionsWithCodes count:",
      Object.keys(collectionsWithCodes).length
    );
    console.log("- showCollectionDropdown:", showCollectionDropdown);
    console.log("- isInEditMode:", isInEditMode);
    console.log("- LabelType:", LabelType);
    console.log("- isLoading:", isLoading);

    // FIXED: Show dropdown when basic code is set and collections are loaded
    if (basicCode && Object.keys(collectionsWithCodes).length > 0) {
      if (!showCollectionDropdown) {
        console.log(
          `🔧 FIXING: Setting showCollectionDropdown to true for ${basicCode}`
        );
        setShowCollectionDropdown(true);
      }
    } else if (!basicCode) {
      if (showCollectionDropdown) {
        console.log(
          "🔧 FIXING: Hiding collection dropdown - no basic code selected"
        );
        setShowCollectionDropdown(false);
      }
    }
  }, [
    basicCode,
    collectionsWithCodes,
    showCollectionDropdown,
    isInEditMode,
    LabelType,
    isLoading,
  ]);

  // FIXED: Handle LabelType change with collection loading logic
  // FIXED: Handle LabelType change with proper async collection loading
  const handleLabelTypeChange = async (event) => {
    const value = event.target.value;
    console.log(`=== LABEL TYPE CHANGE: ${value} ===`);
    setLabelType(value);

    // Handle LogoType visibility (this should work for both edit and new mode)
    const shouldHideLogoType =
      value === "Sensor(115x35)" || value === "Transmitter";
    setShowLogoType(!shouldHideLogoType);

    if (shouldHideLogoType) {
      setLogoType("");
    }

    // FIXED: Only handle collection loading logic for new mode
    if (!isInEditMode) {
      console.log("Setting basicCode and loading collections for new mode");

      // Reset states first
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

      // Set basicCode to match LabelType
      setBasicCode(value);

      // REMOVED: Don't update LabelDetails with LabelType value
      // setLabelDetails(value);

      // Determine database and load collections
      const dbName = getDatabaseForBasicCode(value);
      setSelectedDatabase(dbName);

      if (dbName && value) {
        console.log(
          `Loading collections for LabelType: ${value}, Database: ${dbName}`
        );

        // Load collections and wait for completion
        try {
          const success = await loadCollectionsFromCacheAsync(dbName);
          if (success) {
            setShowCollectionDropdown(true);
            console.log(`✓ Collections loaded successfully for ${value}`);
          } else {
            console.log(`✗ Failed to load collections for ${value}`);
          }
        } catch (error) {
          console.error(`Error loading collections for ${value}:`, error);
        }
      }

      // Set model type based on the selected value
      let defaultModelType = "";
      if (value === "FEP631" || value === "FEP632") {
        defaultModelType = "Sensor";
      } else if (value === "FET632") {
        defaultModelType = "Transmitter";
      }
      setModelType(defaultModelType);

      // Update label details with basic code only (for new entries)
      updateLabelDetails({}, ss, sz, value);
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

  // Update handleSZChange:
  const handleSZChange = (value) => {
    setSZ(value);

    // UPDATED: Use the new logic for edit mode updates
    if (!isInEditMode || allowEditModeUpdates) {
      updateLabelDetails(selectedCollections, ss, value, basicCode);
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

  // Add this mapping object near your TMED_OPTIONS constant
  const LINER_MATERIAL_TO_TMED_MAPPING = {
    // PTFE materials
    PTFE: "130°C(266°F)",
    ptfe: "130°C(266°F)",
    PFA: "130°C(266°F)",
    pfa: "130°C(266°F)",
    ETFE: "130°C(266°F)",
    etfe: "130°C(266°F)",

    // Hard rubber materials
    "hard rubber": "80°C (194°F/176°F)",
    "Hard Rubber": "80°C (194°F/176°F)",
    "HARD RUBBER": "80°C (194°F/176°F)",
    hardrubber: "80°C (194°F/176°F)",

    // Soft rubber materials
    "soft rubber": "60°C(140°F)",
    "Soft Rubber": "60°C(140°F)",
    "SOFT RUBBER": "60°C(140°F)",
    softrubber: "60°C(140°F)",
    rubber: "60°C(140°F)", // Default rubber to soft rubber
    Rubber: "60°C(140°F)",
    RUBBER: "60°C(140°F)",
  };

  // Function to auto-update Tmed based on liner material
  const autoUpdateTmedFromLinerMaterial = (linerMaterialDescription) => {
    if (!linerMaterialDescription) return;

    console.log(
      `Auto-updating Tmed for liner material: ${linerMaterialDescription}`
    );

    // Check for exact match first
    let tmedValue = LINER_MATERIAL_TO_TMED_MAPPING[linerMaterialDescription];

    // If no exact match, check if the description contains any of the key materials
    if (!tmedValue) {
      const lowerDescription = linerMaterialDescription.toLowerCase();

      // Check for PTFE, PFA, ETFE materials (highest temperature)
      if (
        lowerDescription.includes("ptfe") ||
        lowerDescription.includes("pfa") ||
        lowerDescription.includes("etfe")
      ) {
        tmedValue = "130°C(266°F)";
      }
      // Check for hard rubber materials
      else if (
        lowerDescription.includes("hard") &&
        lowerDescription.includes("rubber")
      ) {
        tmedValue = "80°C (194°F/176°F)";
      }
      // Check for soft rubber or general rubber materials
      else if (lowerDescription.includes("rubber")) {
        tmedValue = "60°C(140°F)";
      }
    }

    if (tmedValue) {
      console.log(`Setting Tmed to: ${tmedValue}`);
      setSelectedTmedDropdown(tmedValue);

      // Also update the label details if not in edit mode or if updates are allowed
      if (!isInEditMode || allowEditModeUpdates) {
        updateLabelDetails(selectedCollections, ss, sz, basicCode);
      }
    } else {
      console.log(
        `No Tmed mapping found for liner material: ${linerMaterialDescription}`
      );
    }
  };

  // Enhanced version of your auto-update system with better integration

  const NOMINAL_DIAMETER_TO_QMAX_MAPPING = [
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

  // You'll need to update your Qmax options to include these flow rate values
  const QMAX_OPTIONS = [
    { value: "", label: "" },
    // Diameter codes
    ...[
      "15",
      "20",
      "25",
      "32",
      "40",
      "50",
      "65",
      "80",
      "100",
      "125",
      "150",
      "200",
      "250",
      "300",
      "350",
      "400",
      "450",
      "500",
      "600",
    ].map((val) => ({ value: val, label: val })),
    // Flow rate descriptions
    ...[
      "100 l/min",
      "150 l/min",
      "200 l/min",
      "400 l/min",
      "600 l/min",
      "60 m³/h",
      "120 m³/h",
      "180 m³/h",
      "240 m³/h",
      "420 m³/h",
      "600 m³/h",
      "1080 m³/h",
      "1800 m³/h",
      "2400 m³/h",
      "3300 m³/h",
      "4500 m³/h",
      "6000 m³/h",
      "6600 m³/h",
      "9600 m³/h",
    ].map((val) => ({ value: val, label: val })),
  ];

  const autoUpdateQmaxFromNominalDiameter = (nominalDiameterDescription) => {
    if (!nominalDiameterDescription) return;

    console.log(
      `Auto-updating Qmax for nominal diameter: ${nominalDiameterDescription}`
    );

    let qmaxValue = null;

    let searchCode = nominalDiameterDescription;
    if (nominalDiameterDescription.includes("||")) {
      searchCode = nominalDiameterDescription.split("||")[0].trim();
    }

    const mapping = NOMINAL_DIAMETER_TO_QMAX_MAPPING.find(
      (item) =>
        item.code === searchCode ||
        item.code === searchCode.padStart(4, "0") ||
        item.code === searchCode.replace(/^0+/, "")
    );

    if (mapping) {
      qmaxValue = mapping.description;
      console.log(`Found direct mapping: ${searchCode} -> ${qmaxValue}`);
    } else {
      const lowerDescription = nominalDiameterDescription.toLowerCase();
      const diameterMatch = lowerDescription.match(
        /\b(15|20|25|32|40|50|65|80|100|125|150|200|250|300|350|400|450|500|600)\b/
      );

      if (diameterMatch) {
        const diameterCode = diameterMatch[1];
        const foundMapping = NOMINAL_DIAMETER_TO_QMAX_MAPPING.find(
          (item) => item.code === diameterCode
        );
        if (foundMapping) {
          qmaxValue = foundMapping.description;
          console.log(
            `Found diameter pattern: ${diameterCode} -> ${qmaxValue}`
          );
        }
      } else {
        const dnMatch = lowerDescription.match(/dn\s*(\d+)/);
        if (dnMatch) {
          const dnValue = dnMatch[1];
          const foundMapping = NOMINAL_DIAMETER_TO_QMAX_MAPPING.find(
            (item) => item.code === dnValue
          );
          if (foundMapping) {
            qmaxValue = foundMapping.description;
            console.log(`Found DN pattern: DN${dnValue} -> ${qmaxValue}`);
          }
        } else {
          const inchMappings = {
            "1/2": "15",
            "3/4": "20",
            1: "25",
            "1-1/4": "32",
            "1 1/4": "32",
            1.25: "32",
            "1-1/2": "40",
            "1 1/2": "40",
            1.5: "40",
            2: "50",
            "2-1/2": "65",
            "2 1/2": "65",
            2.5: "65",
            3: "80",
            4: "100",
            5: "125",
            6: "150",
            8: "200",
            10: "250",
            12: "300",
            14: "350",
            16: "400",
            18: "450",
            20: "500",
            24: "600",
          };

          const inchMatch = lowerDescription.match(
            /(\d+(?:\.\d+)?(?:\/\d+)?(?:\s*-\s*\d+(?:\.\d+)?(?:\/\d+)?)?)\s*(?:in|inch)/
          );

          if (inchMatch) {
            const inchValue = inchMatch[1].trim();
            const diameterCode = inchMappings[inchValue];
            if (diameterCode) {
              const foundMapping = NOMINAL_DIAMETER_TO_QMAX_MAPPING.find(
                (item) => item.code === diameterCode
              );
              if (foundMapping) {
                qmaxValue = foundMapping.description;
                console.log(`Found inch pattern: ${inchValue} -> ${qmaxValue}`);
              }
            }
          } else {
            for (const [inch, code] of Object.entries(inchMappings)) {
              if (lowerDescription.includes(inch)) {
                const foundMapping = NOMINAL_DIAMETER_TO_QMAX_MAPPING.find(
                  (item) => item.code === code
                );
                if (foundMapping) {
                  qmaxValue = foundMapping.description;
                  console.log(`Found inch match: ${inch} -> ${qmaxValue}`);
                  break;
                }
              }
            }
          }
        }
      }
    }

    if (qmaxValue) {
      const isValid = QMAX_OPTIONS.find((opt) => opt.value === qmaxValue);
      if (isValid) {
        setSelectedQmax(qmaxValue);
        if (!isInEditMode || allowEditModeUpdates) {
          updateLabelDetails(selectedCollections, ss, sz, basicCode);
        }
      } else {
        console.warn(`Qmax "${qmaxValue}" not found in QMAX_OPTIONS`);
      }
    } else {
      console.log(
        `No Qmax mapping found for nominal diameter: ${nominalDiameterDescription}`
      );
    }
  };

  // Updated handleCollectionCodeChange function remains the same
  const handleCollectionCodeChange = (collectionName, codeValue) => {
    console.log(`Collection code change: ${collectionName} -> "${codeValue}"`);
    const trimmedName = collectionName.trim();
    const lowerName = trimmedName.toLowerCase();

    // Update special field states with more specific matching
    const isPowerSupply =
      lowerName.includes("power") && lowerName.includes("supply");
    const isProtectionClass =
      (lowerName.includes("protection class") &&
        (lowerName.includes("transmitter") || lowerName.includes("sensor"))) ||
      trimmedName === "Protection Class Transmitter / Protection Class Sensor";
    const isTamb = lowerName.includes("temperature");
    const isSize =
      trimmedName === "Nominal Diameter" ||
      lowerName.includes("nominal diameter");
    const isPower =
      trimmedName === "Power Supply Line Frequency" ||
      lowerName.includes("power supply line frequency");
    const isLiner =
      lowerName.includes("liner") && lowerName.includes("material");
    const isProcessConnection =
      (lowerName.includes("process connection") &&
        !lowerName.includes("material")) ||
      trimmedName === "Process connection";
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
          // Clear Qmax when nominal diameter is cleared
          setSelectedQmax("");
        } else if (isLiner) {
          setLinerMaterial("");
          setSelectedTmedDropdown(""); // Clear Tmed when liner material is cleared
        } else if (isProcessConnection) setFitting("");
        else if (isElect) setElect("");
      } else {
        const codeItems = collectionsWithCodes[collectionName] || [];
        const matchingItem = codeItems.find((item) => item.code === codeValue);
        const description = matchingItem?.description || codeValue;

        if (isSize) {
          setSize(codeValue);
          setSizeDescription(description);

          // AUTO-UPDATE QMAX WHEN NOMINAL DIAMETER CHANGES
          // Pass the code value instead of description for better matching
          autoUpdateQmaxFromNominalDiameter(codeValue);
        } else {
          if (isPowerSupply) setPowerSupply(description);
          else if (isProtectionClass) setProtectionClass(description);
          else if (isTamb) setTamb(description);
          else if (isLiner) {
            setLinerMaterial(description);
            // AUTO-UPDATE TMED WHEN LINER MATERIAL CHANGES
            autoUpdateTmedFromLinerMaterial(description);
          } else if (isProcessConnection) setFitting(description);
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

    // Update label details if not in edit mode or if updates are allowed
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

  // FIXED: Updated function to respect edit mode and exclude hyphens completely
  // FIXED: Updated function to respect edit mode and exclude LabelType, ss, and sz from model number
  const updateLabelDetails = (
    selections,
    currentSS,
    currentSZ,
    currentBasicCode
  ) => {
    // UPDATED: Check both edit mode status and the allow updates flag
    if (isInEditMode && !allowEditModeUpdates) {
      console.log(
        "Preserving original label details in edit mode (auto-update disabled)"
      );
      return;
    }

    let details = currentBasicCode || basicCode || "";

    // Get the collection order for the current basic code
    const order = COLLECTION_ORDERS[currentBasicCode || basicCode];
    if (order) {
      // Process collections in the specified order
      order.forEach((orderedName) => {
        const matchingCollection = Object.keys(selections).find(
          (collectionName) =>
            collectionName.trim().toLowerCase() ===
            orderedName.trim().toLowerCase()
        );

        if (matchingCollection) {
          const code = selections[matchingCollection];
          // FIXED: Only add codes that have values, skip empty values entirely (no hyphens)
          if (code && code !== "" && code !== null && code !== undefined) {
            details += code;
          }
        }
      });
    }

    // REMOVED: Don't add SS and SZ to the model number
    // The following lines are commented out:
    // if (currentSS) details += currentSS;
    // if (currentSZ) details += currentSZ;

    // FIXED: Always update LabelDetails, even if just basic code
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

  // FIXED: Async version of handleBasicCodeChange
  const handleBasicCodeChange = async (event) => {
    const value = event.target.value;
    setBasicCode(value);

    // FIXED: Update LabelDetails immediately with the basic code
    if (!isInEditMode) {
      setLabelDetails(value);
    }

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
    setSelectedTmedDropdown("");

    // Determine which database to use based on the basic code
    const dbName = getDatabaseForBasicCode(value);
    setSelectedDatabase(dbName);

    if (dbName && value) {
      try {
        // FIXED: Use async version and wait for completion
        const success = await loadCollectionsFromCacheAsync(dbName);
        if (success) {
          setShowCollectionDropdown(true);
          console.log(`✓ Collections loaded and dropdown shown for ${value}`);
        } else {
          console.log(`✗ Failed to load collections for ${value}`);
        }
      } catch (error) {
        console.error(`Error loading collections for ${value}:`, error);
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
    updateLabelDetails({}, ss, sz, value);
  };

  // Filter collections based on basicCode and apply ordering
  useEffect(() => {
    // FIXED: Show dropdown when basic code is set and collections are loaded
    if (basicCode && Object.keys(collectionsWithCodes).length > 0) {
      setShowCollectionDropdown(true);
      console.log(`✓ Showing collection dropdown for basic code: ${basicCode}`);
    } else if (!basicCode) {
      setShowCollectionDropdown(false);
      console.log("✗ Hiding collection dropdown - no basic code selected");
    }
  }, [basicCode, collectionsWithCodes]);

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
        <Alert severity="info" sx={{ mb: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2">
              <strong>Edit Mode:</strong> Toggle the button to enable editing
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={allowEditModeUpdates}
                  onChange={(e) => setAllowEditModeUpdates(e.target.checked)}
                  color="primary"
                />
              }
              sx={{ ml: 2 }}
            />
          </Box>
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
                          <MenuItem value="Sensor(96x98)">
                            Sensor(96x98)
                          </MenuItem>
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
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SpeedIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Replace both dropdowns with these readonly text fields */}

                    {/* Qmax - Readonly Text Field */}
                    <Grid item>
                      <TextField
                        label="Qmax"
                        value={selectedQmax}
                        size="small"
                        variant="outlined"
                        sx={{ width: "140px" }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <SpeedIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Tmed - Readonly Text Field */}
                    <Grid item>
                      <TextField
                        label="Tmed"
                        value={selectedTmedDropdown}
                        size="small"
                        variant="outlined"
                        sx={{ width: "200px" }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <ThermostatIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
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
