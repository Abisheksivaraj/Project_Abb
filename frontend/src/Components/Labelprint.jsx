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
import SerialNumberIcon from "@mui/icons-material/Pin";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import SettingsIcon from "@mui/icons-material/Settings";
import FitbitIcon from "@mui/icons-material/Fitbit";
import StraightenIcon from "@mui/icons-material/Straighten";
import { api } from "../apiConfig";

// List of collections to exclude from the UI
const EXCLUDED_COLLECTIONS = ["admins", "tabledatas"];

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
  const [Status, setStatus] = useState("active");

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

  // Filter collections based on basicCode
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

    setFilteredCollectionNames(filtered);

    // Clear previously selected collections that are no longer available
    const updatedSelectedCollections = { ...selectedCollections };
    Object.keys(updatedSelectedCollections).forEach((collectionName) => {
      if (!filtered.includes(collectionName)) {
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

    // Check if the value contains code and description
    let code = codeValue;
    if (codeValue && codeValue.includes("||")) {
      // Extract just the code part from the selection
      code = codeValue.split("||")[0];
    }

    // Always include the collection in selections, even with empty string (Null)
    // This ensures "Null" selections are tracked and hyphens are added
    const updatedCollections = {
      ...selectedCollections,
      [collectionName]: code,
    };

    // Log the updated collections object
    console.log("Updated collections:", updatedCollections);

    // Set the state
    setSelectedCollections(updatedCollections);

    // Use the updated object directly when calling updateLabelDetails
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
        // Database: selectedDatabase, // Add the selected database to the form data
      };

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
        setStatus("active");
        setBasicCode("");
        setModelType("");
        setSS("");
        setSZ("");
        setSelectedCollections({});
        setShowCollectionDropdown(false);
        setAllSelectionsDone(false);
        // setSelectedDatabase("");
        setShowLogoType(true); // Reset logo visibility
      }
    } catch (error) {
      console.error("Error saving label:", error);
      alert(
        "Error saving label: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Group collection names into chunks of 5 for better display
  const groupedCollections = [];
  for (let i = 0; i < filteredCollectionNames.length; i += 5) {
    groupedCollections.push(filteredCollectionNames.slice(i, i + 5));
  }

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
                            <SerialNumberIcon color="action" />
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

                  <Grid item>
                    <FormControl variant="outlined" required>
                      <InputLabel>Status</InputLabel>
                      <Select
                        sx={{ width: "200px" }}
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
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Error display */}
              {error && (
                <Grid item xs={12}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      mt: 1,
                      mb: 0,
                      bgcolor: "#ffebee",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="error">
                      Error: {error}
                    </Typography>
                  </Paper>
                </Grid>
              )}

              {showCollectionDropdown && (
                <Grid item xs={12}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      mt: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: "#f9f9f9",
                      position: "relative",
                    }}
                  >
                    {isLoading && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          zIndex: 1,
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}

                    {/* <Typography variant="h6" mb={2} color="primary.main">
                      Collection Selection from {selectedDatabase} Database
                    </Typography> */}
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item>
                        <FormControl variant="outlined">
                          <InputLabel>Model Type</InputLabel>
                          <Select
                            sx={{ width: "200px" }}
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
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Transmitter">Transmitter</MenuItem>
                            <MenuItem value="Sensor">Sensor</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item>
                        <TextField
                          sx={{ width: "200px" }}
                          label="SS"
                          placeholder="Enter SS..."
                          variant="outlined"
                          value={ss}
                          onChange={(e) => handleSSChange(e.target.value)}
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
                          sx={{ width: "200px" }}
                          label="SZ"
                          placeholder="Enter SZ..."
                          variant="outlined"
                          value={sz}
                          onChange={(e) => handleSZChange(e.target.value)}
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

                    {/* Selected collections display */}
                    {Object.keys(selectedCollections).length > 0 && (
                      <Box mb={3}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Selected Collections:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {Object.entries(selectedCollections).map(
                            ([collection, value]) => {
                              // Find description for this value if available
                              const codeItems =
                                collectionsWithCodes[collection] || [];
                              const matchingItem = codeItems.find(
                                (item) => item.code === value
                              );
                              const description =
                                matchingItem?.description || "";

                              return (
                                <Tooltip
                                  key={collection}
                                  title={
                                    description
                                      ? description
                                      : "No description available"
                                  }
                                  arrow
                                >
                                  <Chip
                                    label={`${collection}: ${
                                      value === "" ? "Null (-)" : value
                                    }`}
                                    color="primary"
                                    onDelete={() =>
                                      handleRemoveCollection(collection)
                                    }
                                  />
                                </Tooltip>
                              );
                            }
                          )}
                        </Box>
                      </Box>
                    )}

                    {/* <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      Available Collections from {selectedDatabase}
                      {basicCode === "FET632" ? " (FET632)" : ""}
                    </Typography> */}

                    {filteredCollectionNames.length > 0 ? (
                      /* Collection selection grid */
                      groupedCollections.map((row, rowIndex) => (
                        <Grid
                          container
                          spacing={2}
                          key={rowIndex}
                          sx={{ mb: 2 }}
                        >
                          {row.map((collectionName) => (
                            <Grid
                              item
                              key={collectionName}
                              xs={12}
                              sm={6}
                              md={2.4}
                              width={210}
                            >
                              <FormControl fullWidth variant="outlined">
                                <InputLabel>{collectionName}</InputLabel>
                                <Select
                                  label={collectionName}
                                  value={
                                    selectedCollections.hasOwnProperty(
                                      collectionName
                                    )
                                      ? selectedCollections[collectionName]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    handleCollectionCodeChange(
                                      collectionName,
                                      e.target.value
                                    );
                                  }}
                                  renderValue={() =>
                                    getSelectedDisplayText(collectionName)
                                  }
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 300,
                                      },
                                    },
                                  }}
                                >
                                  <MenuItem value="">Null</MenuItem>
                                  {collectionsWithCodes[collectionName] &&
                                    collectionsWithCodes[collectionName].map(
                                      (item) => (
                                        <MenuItem
                                          key={item.code}
                                          value={item.code}
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                          }}
                                        >
                                          <Typography variant="body1">
                                            {item.code}
                                          </Typography>
                                          {item.description && (
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                              sx={{ lineHeight: 1 }}
                                            >
                                              {item.description}
                                            </Typography>
                                          )}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              </FormControl>
                            </Grid>
                          ))}
                        </Grid>
                      ))
                    ) : (
                      <Typography color="text.secondary">
                        No collections available for the selected database and
                        basic code.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}

              {/* Display generated label details */}
              {allSelectionsDone && (
                <Grid item xs={12}>
                  <TextField
                    sx={{ width: "50rem" }}
                    label="Label Details"
                    variant="outlined"
                    value={LabelDetails}
                    onChange={(e) => setLabelDetails(e.target.value)}
                    required
                    InputProps={{
                      readOnly: false,
                    }}
                  />
                </Grid>
              )}
            </Grid>

            {/* Submit Button */}
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                type="submit"
                variant="contained"
                color="error"
                endIcon={<ArrowForwardIcon />}
                size="large"
                sx={{ px: 4, py: 1 }}
              >
                Submit
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LabelPrint;
