const express = require("express");
const {
  getAllCodeModels,
  getModelByCollectionName,
} = require("../Models/DynamicModals");
const route = express.Router();
const mongoose = require("mongoose");

// Get all collection names
// route.get("/collections", async (req, res) => {
//   try {
//     // Get all collections in the database
//     const collections = await mongoose.connection.db
//       .listCollections()
//       .toArray();

//     // Extract just the collection names
//     const collectionNames = collections.map((collection) => collection.name);

//     res.json({
//       success: true,
//       collections: collectionNames,
//       count: collectionNames.length,
//     });
//   } catch (error) {
//     console.error("Error fetching collection names:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// Your existing routes
// Get description for a code from any collection
route.get("/find-description/:code", async (req, res) => {
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

// route.get("/find-description/:collectionName", async (req, res) => {
//   try {
//     const { collectionName, code } = req.params;

//     // Get the specific model for the collection
//     const model = await getModelByCollectionName(collectionName);

//     if (!model) {
//       return res.status(404).json({
//         success: false,
//         message: `Collection '${collectionName}' not found`,
//       });
//     }

//     // Search for the code in the specified collection
//     const result = await model.findOne({ code });

//     if (!result) {
//       return res.status(404).json({
//         success: false,
//         message: `Code '${code}' not found in collection '${collectionName}'`,
//       });
//     }

//     res.json({
//       success: true,
//       code: result.code,
//       description: result.description,
//       collection: collectionName,
//     });
//   } catch (error) {
//     console.error(`Error finding code in collection:`, error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// Get all codes from a specific collection
// route.get("/codes/:collectionName", async (req, res) => {
//   try {
//     const { collectionName } = req.params;

//     const model = await getModelByCollectionName(collectionName);

//     if (!model) {
//       return res.status(404).json({
//         success: false,
//         message: `Collection '${collectionName}' not found`,
//       });
//     }

//     const results = await model.find({}).select("code");

//     if (!results || results.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No codes found in collection '${collectionName}'`,
//       });
//     }

//     // Extract just the code values from the results
//     const codes = results.map((item) => item.code);

//     res.json({
//       success: true,
//       collection: collectionName,
//       codes: codes,
//       count: codes.length,
//     });
//   } catch (error) {
//     console.error(`Error fetching codes from collection:`, error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });










route.get("/all-collections-codes", async (req, res) => {
  try {
    // Get all collections in the database
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    // Extract just the collection names
    const collectionNames = collections.map((collection) => collection.name);

    // Result object to store all collections and their codes
    const result = {};

    // Get codes for each collection
    for (const collectionName of collectionNames) {
      const model = await getModelByCollectionName(collectionName);
      if (model) {
        const codes = await model.find({}).select("code");
        // Extract just the code values from the results
        result[collectionName] = codes.map((item) => item.code);
      }
    }

    res.json({
      success: true,
      collectionsWithCodes: result,
      totalCollections: collectionNames.length,
    });
  } catch (error) {
    console.error("Error fetching collections and codes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});





module.exports = route;
