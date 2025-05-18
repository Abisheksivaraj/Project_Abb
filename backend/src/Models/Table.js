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
  Tamb: {
    type: String,
  },
  size: {
    type: String,
  },
  Qmax: {
    type: String,
  },
  Linermat: {
    type: String,
  },
  Tmed: {
    type: String,
  },
  Fitting: {
    type: String,
  },

  ProtectionClass: {
    type: String,
  },

  Fexc: {
    type: String,
  },

  Elect: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const table = mongoose.model("tableData", tableSchema);
module.exports = table;
