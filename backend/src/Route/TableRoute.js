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
      selectedTmedDropdown, // Fixed: matches frontend variable name
      Size,
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
      selectedTmedDropdown, // Fixed: matches frontend variable name
      Size,
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
