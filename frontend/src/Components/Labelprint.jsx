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
const EXCLUDED_COLLECTIONS = ["admins"];

const LabelPrint = () => {
  const navigate = useNavigate();
  const [basicCode, setBasicCode] = useState("");
  const [collectionsWithCodes, setCollectionsWithCodes] = useState({});
  const [collectionNames, setCollectionNames] = useState([]);
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [modelType, setModelType] = useState("");
  const [ss, setSS] = useState("");
  const [sz, setSZ] = useState("");

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
        }
      } catch (error) {
        console.error("Error fetching collections and codes:", error);
      }
    };

    fetchCollectionsAndCodes();
  }, []);

  // Handle basic code selection with default model type
  const handleBasicCodeChange = (event) => {
    const value = event.target.value;
    setBasicCode(value);

    setShowCollectionDropdown(!!value);

    setSelectedCollectionName("");

    if (value === "FEP631") {
      setModelType("Sensor");
    } else if (value === "FEP632") {
      setModelType("Transmitter");
    } else {
      setModelType("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form submission logic here
    console.log("Form submitted with:", {
      basicCode,
      selectedCollectionName,
      modelType,
      ss,
      sz,
    });
  };

  // Group collection names into chunks of 5 for better display
  const groupedCollections = [];
  for (let i = 0; i < collectionNames.length; i += 5) {
    groupedCollections.push(collectionNames.slice(i, i + 5));
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
                    <FormControl variant="outlined">
                      <InputLabel>Label Type</InputLabel>
                      <Select
                        sx={{ width: "150px" }}
                        label="Label Type"
                        defaultValue=""
                        IconComponent={() => null}
                        endAdornment={
                          <InputAdornment position="end">
                            <BarcodeIcon color="action" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="barcode">Barcode Label</MenuItem>
                        <MenuItem value="qr">QR Code Label</MenuItem>
                        <MenuItem value="rfid">RFID Label</MenuItem>
                        <MenuItem value="shipping">Shipping Label</MenuItem>
                        <MenuItem value="price">Price Label</MenuItem>
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
                        <MenuItem value="FET631">FET631</MenuItem>
                        <MenuItem value="UPC-A">UPC-A</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <TextField
                      sx={{ width: "200px" }}
                      label="Manufacturing Date"
                      type="date"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      
                    />
                  </Grid>

                  <Grid item>
                    <FormControl variant="outlined">
                      <InputLabel>Status</InputLabel>
                      <Select
                        sx={{ width: "200px" }}
                        label="Status"
                        defaultValue="active"
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
                            onChange={(e) => setModelType(e.target.value)}
                            IconComponent={() => null}
                            endAdornment={
                              <InputAdornment position="end">
                                <DeviceHubIcon color="action" />
                              </InputAdornment>
                            }
                          >
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
                          onChange={(e) => setSS(e.target.value)}
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
                          onChange={(e) => setSZ(e.target.value)}
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

                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      Available Collections
                    </Typography>

                    {/* Collection selection grid */}
                    {groupedCollections.map((row, rowIndex) => (
                      <Grid container spacing={2} key={rowIndex} sx={{ mb: 2 }}>
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
                                  selectedCollectionName === collectionName
                                    ? collectionsWithCodes[collectionName] &&
                                      collectionsWithCodes[collectionName]
                                        .length > 0
                                      ? collectionsWithCodes[collectionName][0]
                                      : ""
                                    : ""
                                }
                                onChange={() => {
                                  setSelectedCollectionName(collectionName);
                                }}
                              >
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
                    ))}
                  </Paper>
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
