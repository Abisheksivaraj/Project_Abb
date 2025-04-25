const express = require("express");
const { getAllCodeModels } = require("../Models/DynamicModals");
const router = express.Router();


// Get description for a code from any collection
router.get("/find-description/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const allModels = await getAllCodeModels();

    // Try to find the code in any collection
    let result = null;
    let sourceCollection = null;

    // Search through all collections for the code
    for (const model of allModels) {
      const found = await model.findOne({ code });
      if (found) {
        result = found;
        sourceCollection = model.collection.collectionName;
        break;
      }
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Code not found in any collection",
      });
    }

    res.json({
      success: true,
      code: result.code,
      description: result.description,
      collection: sourceCollection,
    });
  } catch (error) {
    console.error("Error finding code description:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
