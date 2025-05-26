const express = require("express");
const route = express.Router();
const Table = require("../Models/Table");

// POST Route to create a new Label
route.post("/table", async (req, res) => {
  try {
    const {
      LabelType,
      SerialNumber,
      TagNumber,
      LabelDetails,
      LogoType,
      DevVersion,
      Date,
      Status,
      ss,
      sz,
      powerSupply,
      ProtectionClass,
      Tamb,
      selectedQmax,
      selectedTmedDropdown,
      Size,
      LinerMaterial, // Add this to the destructuring
      // Add the 10 additional fields from frontend
      field1,
      field2,
      field3,
      field4,
      field5,
      field6,
      field7,
      field8,
      field9,
      field10,
    } = req.body;

    // Log the received data for debugging
    console.log("Received form data:", {
      LabelType,
      SerialNumber,
      TagNumber,
      LabelDetails,
      LogoType,
      DevVersion,
      Date,
      Status,
      ss,
      sz,
      powerSupply,
      ProtectionClass,
      Tamb,
      selectedQmax,
      selectedTmedDropdown,
      Size,
      LinerMaterial,
      field1,
      field2,
      field3,
      field4,
      field5,
      field6,
      field7,
      field8,
      field9,
      field10,
    });

    const newLabel = new Table({
      LabelType,
      SerialNumber,
      TagNumber,
      LabelDetails,
      LogoType,
      Date,
      ss,
      sz,
      Status,
      DevVersion,
      powerSupply,
      ProtectionClass,
      Tamb,
      selectedQmax,
      selectedTmedDropdown,
      Size,
      LinerMaterial,
      // Include the additional fields if your schema supports them
      field1,
      field2,
      field3,
      field4,
      field5,
      field6,
      field7,
      field8,
      field9,
      field10,
    });

    await newLabel.save();

    res
      .status(201)
      .json({ message: "Label saved successfully", data: newLabel });
  } catch (error) {
    console.error("Saving Label Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// GET Route to fetch all Labels
route.get("/tableData", async (req, res) => {
  try {
    const labels = await Table.find();
    res.status(200).json({ data: labels });
  } catch (error) {
    console.error("Fetching Labels Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = route;
