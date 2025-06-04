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
  Fitting: {
    type: String,
  },
  Elect: {
    type: String,
  },
  Fexc: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to automatically set Fexc based on Size
tableSchema.pre("save", function (next) {
  // Only set Fexc if Size is provided
  if (this.Size) {
    // Extract numeric value from Size (assuming format like "DN 50", "DN 100", etc.)
    const sizeMatch = this.Size.match(/DN\s*(\d+)/i);

    if (sizeMatch) {
      const sizeValue = parseInt(sizeMatch[1]);

      if (sizeValue < 65) {
        this.Fexc = "30_15 HZ";
      } else if (sizeValue >= 65) {
        this.Fexc = "15_12.5 HZ";
      }
    } else {
      // If Size doesn't match DN format, try to extract just the number
      const numericMatch = this.Size.match(/(\d+)/);
      if (numericMatch) {
        const sizeValue = parseInt(numericMatch[1]);

        if (sizeValue < 65) {
          this.Fexc = "30_15 HZ";
        } else if (sizeValue >= 65) {
          this.Fexc = "15_12.5 HZ";
        }
      }
    }
  }

  next();
});

// Pre-update middleware to handle updates
tableSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  const update = this.getUpdate();

  // Check if Size is being updated
  if (update.Size || (update.$set && update.$set.Size)) {
    const sizeValue = update.Size || update.$set.Size;

    // Extract numeric value from Size
    const sizeMatch = sizeValue.match(/DN\s*(\d+)/i);
    let numericSize;

    if (sizeMatch) {
      numericSize = parseInt(sizeMatch[1]);
    } else {
      const numericMatch = sizeValue.match(/(\d+)/);
      if (numericMatch) {
        numericSize = parseInt(numericMatch[1]);
      }
    }

    if (numericSize !== undefined) {
      if (numericSize < 65) {
        if (update.$set) {
          update.$set.Fexc = "30_15 HZ";
        } else {
          update.Fexc = "30_15 HZ";
        }
      } else if (numericSize >= 65) {
        if (update.$set) {
          update.$set.Fexc = "15_12.5 HZ";
        } else {
          update.Fexc = "15_12.5 HZ";
        }
      }
    }
  }

  next();
});

const table = mongoose.model("tableData", tableSchema);
module.exports = table;
