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

  // Form fields that match the schema
  const [LabelType, setLabelType] = useState("");
  const [SerialNumber, setSerialNumber] = useState("");
  const [TagNumber, setTagNumber] = useState("");
  const [LabelDetails, setLabelDetails] = useState("");
  const [Date, setDate] = useState("");
  const [Status, setStatus] = useState("active");

  // Fetch collections and codes on component mount
  useEffect(() => {
    const fetchCollectionsAndCodes = async () => {
      try {
        const response = await api.get("/all-collections-codes");
        if (response.data.success) {
          const allCollections = response.data.collectionsWithCodes;

          // Filter out excluded collections
          const filteredCollections = {};
          Object.keys(allCollections).forEach((collectionName) => {
            if (!EXCLUDED_COLLECTIONS.includes(collectionName)) {
              filteredCollections[collectionName] =
                allCollections[collectionName];
            }
          });

          setCollectionsWithCodes(filteredCollections);
          setCollectionNames(Object.keys(filteredCollections));

          // Initially set filtered collection names to be the same as all collection names
          setFilteredCollectionNames(Object.keys(filteredCollections));
        }
      } catch (error) {
        console.error("Error fetching collections and codes:", error);
      }
    };

    fetchCollectionsAndCodes();
  }, []);

  // Filter collections based on basicCode
  useEffect(() => {
    if (basicCode === "FET632") {
      // Filter collections that end with "Transmitter"
      const transmitterCollections = collectionNames.filter((name) =>
        name.toLowerCase().endsWith("transmitter")
      );
      setFilteredCollectionNames(transmitterCollections);
    } else {
      // For other basic codes, show all collections
      setFilteredCollectionNames(collectionNames);
    }

    // Clear previously selected collections that are no longer available
    const updatedSelectedCollections = { ...selectedCollections };
    Object.keys(updatedSelectedCollections).forEach((collectionName) => {
      if (!filteredCollectionNames.includes(collectionName)) {
        delete updatedSelectedCollections[collectionName];
      }
    });
    setSelectedCollections(updatedSelectedCollections);

    // Update label details with the filtered collections
    updateLabelDetails(updatedSelectedCollections, ss, sz, basicCode);
  }, [basicCode, collectionNames]);

  // Handle basic code selection with default model type
  const handleBasicCodeChange = (event) => {
    const value = event.target.value;
    setBasicCode(value);

    setShowCollectionDropdown(!!value);
    setSelectedCollections({});

    let defaultModelType = "";
    if (value === "FEP631") {
      defaultModelType = "Sensor";
    } else if (value === "FEP632") {
      defaultModelType = "Transmitter";
    } else if (value === "FET632") {
      defaultModelType = "Transmitter";
    }

    setModelType(defaultModelType);
    updateLabelDetails({}, ss, sz, value); // Pass the basic code instead of model type
  };

  // Handle model type change
  const handleModelTypeChange = (event) => {
    const value = event.target.value;
    setModelType(value);
    updateLabelDetails(selectedCollections, ss, sz, basicCode); // Use basic code instead of model type
  };

  // Handle collection code selection
  const handleCollectionCodeChange = (collectionName, code) => {
    // Create a new updated collections object with the latest change
    const updatedCollections = {
      ...selectedCollections,
      [collectionName]: code,
    };

    // Set the state
    setSelectedCollections(updatedCollections);

    // Use the updated object directly when calling updateLabelDetails
    // Instead of relying on state that might not be updated yet
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

  // Update label details based on selected collections, SS, SZ and basicCode
  const updateLabelDetails = (
    selections,
    currentSS,
    currentSZ,
    currentBasicCode
  ) => {
    // Start with basic code
    let details = currentBasicCode || "";

    // Add SS and SZ if they exist
    if (currentSS) {
      details += currentSS;
    }

    if (currentSZ) {
      details += currentSZ;
    }

    // Process collection values
    const collectionKeys = Object.keys(selections);

    if (collectionKeys.length > 0) {
      collectionKeys.forEach((collectionName) => {
        const code = selections[collectionName];

        // Important: Explicitly check for empty string
        if (code === "") {
          // This is where the fix matters most - add a hyphen for "None" (empty string)
          details += "-";
        } else if (code) {
          // Add the selected code if it exists and isn't empty
          details += code;
        }
      });
    }

    // Only update states if we have some actual details
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

    // Validate all required fields are present
    if (
      !LabelType ||
      !SerialNumber ||
      !TagNumber ||
      !LabelDetails ||
      !Date ||
      !Status
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = {
        LabelType,
        SerialNumber,
        TagNumber,
        LabelDetails,
        Date,
        Status,
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
        setStatus("active");
        setBasicCode("");
        setModelType("");
        setSS("");
        setSZ("");
        setSelectedCollections({});
        setShowCollectionDropdown(false);
        setAllSelectionsDone(false);
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
                        onChange={(e) => setLabelType(e.target.value)}
                        IconComponent={() => null}
                        endAdornment={
                          <InputAdornment position="end">
                            <BarcodeIcon color="action" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="sensor_1">Sensor(96x98)</MenuItem>
                        <MenuItem value="sensor_2">Sensor(115x35)</MenuItem>
                        <MenuItem value="sensor">Sensor</MenuItem>
                        <MenuItem value="transmitter">Transmitter</MenuItem>
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
                        <MenuItem value="FEP631">FEP631</MenuItem>
                        <MenuItem value="FEP632">FEP632</MenuItem>
                        <MenuItem value="FET632">FET632</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

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
                    }}
                  >
                    <Typography variant="h6" mb={2} color="primary.main">
                      Collection Selection
                    </Typography>
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
                            ([collection, value]) => (
                              <Chip
                                key={collection}
                                label={`${collection}: ${
                                  value === "" ? "Null (-)" : value
                                }`}
                                color="primary"
                                onDelete={() =>
                                  handleCollectionCodeChange(collection, "")
                                }
                              />
                            )
                          )}
                        </Box>
                      </Box>
                    )}

                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      Available Collections{" "}
                      {basicCode === "FET632" ? "(Transmitter Only)" : ""}
                    </Typography>

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
                                >
                                  <MenuItem value="">Null</MenuItem>
                                  {collectionsWithCodes[collectionName] &&
                                    collectionsWithCodes[collectionName].map(
                                      (code) => (
                                        <MenuItem key={code} value={code}>
                                          {code}
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
                        No collections available for the selected basic code.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}

              {/* Display generated label details */}
              {allSelectionsDone && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
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
