const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  LabelType: {
    type: String,
    required: true,
  },
  SerialNumber: {
    type: String,
    required: true,
  },
  TagNumber: {
    type: String,
    required: true,
  },
  LabelDetails: {
    type: String,
    required: true,
  },
  LogoType: {
    type: String,
  },
  ss: {
    type: String,
    required: true,
  },
  sz: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  AddedBy: {
    type: String,
    default: "Admin",
  },
  Status: {
    type: String,
    required: true,
  },
  DevVersion: {
    type: String,
  },
  powerSupply: {
    type: String,
  },
  ProtectionClass: {
    type: String,
  },
  Tamb: {
    type: String,
  },
  selectedQmax: {
    type: String,
  },
  selectedTmedDropdown: {
    type: String,
  },
  Size: {
    type: String,
  },
  LinerMaterial: {
    type: String,
  },
  // Add the 10 additional display fields from the frontend
  field1: {
    type: String,
  },
  field2: {
    type: String,
  },
  field3: {
    type: String,
  },
  field4: {
    type: String,
  },
  field5: {
    type: String,
  },
  field6: {
    type: String,
  },
  field7: {
    type: String,
  },
  field8: {
    type: String,
  },
  field9: {
    type: String,
  },
  field10: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const table = mongoose.model("tableData", tableSchema);
module.exports = table;
