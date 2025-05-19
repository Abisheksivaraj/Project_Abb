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
      powerSupply,
      Tamb,
      size,
      Qmax,
      Linermat,
      Tmed,
      Fitting,
      ProtectionClass,
      Fexc,
      Elect,
      ss,
      sz,
    } = req.body;

    const newLabel = new Table({
      LabelType,
      SerialNumber,
      TagNumber,
      LabelDetails,
      LogoType,
      Date,
      ss,sz,
      Status,
      DevVersion,
      powerSupply,
      Tamb,
      size,
      Qmax,
      Linermat,
      Tmed,
      Fitting,
      ProtectionClass,
      Fexc,
      Elect,
    });

    await newLabel.save();

    res
      .status(201)
      .json({ message: "Label saved successfully", data: newLabel });
  } catch (error) {
    console.error("Saving Label Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
