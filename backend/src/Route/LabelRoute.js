const express = require("express");

const route = express.Router();

const Label = require("../Models/Values"); // Adjust the path as needed to your model

// GET all labels

route.get("/getLabels", async (req, res) => {
  try {
    const labels = await Label.find().populate("LabelType");

    res.status(200).json({ success: true, data: labels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a specific label by ID

route.get("/labels/:id", async (req, res) => {
  try {
    const label = await Label.findById(req.params.id).populate("LabelType");

    if (!label) {
      return res.status(404).json({ success: false, error: "Label not found" });
    }

    res.status(200).json({ success: true, data: label });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create a new label

route.post("/label", async (req, res) => {
  try {
    const label = await Label.create(req.body);

    res.status(201).json({ success: true, data: label });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update a label

route.put("/:id", async (req, res) => {
  try {
    const label = await Label.findByIdAndUpdate(req.params.id, req.body, {
      new: true,

      runValidators: true,
    });

    if (!label) {
      return res.status(404).json({ success: false, error: "Label not found" });
    }

    res.status(200).json({ success: true, data: label });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE a label

route.delete("/:id", async (req, res) => {
  try {
    const label = await Label.findByIdAndDelete(req.params.id);

    if (!label) {
      return res.status(404).json({ success: false, error: "Label not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = route;
