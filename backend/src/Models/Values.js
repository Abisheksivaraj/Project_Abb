const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
  LabelType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tableData",
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const label = mongoose.model("labelData", labelSchema);
module.exports = label;
