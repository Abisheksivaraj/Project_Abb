const express = require("express");
const {
  getAllCodeModels,
  getModelByCollectionName,
} = require("../Models/DynamicModals");
const route = express.Router();
const mongoose = require("mongoose");

const { MongoClient } = require("mongodb");

// MongoDB connection string with connection pooling
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://abishekwebdev:2222@projectabb.casqv0l.mongodb.net/" ||
  "mongodb://localhost:27017";

// Create a cached client instance to avoid reconnecting on every request
let clientConnection = null;

// Get MongoDB client connection
const getClient = async () => {
  if (!clientConnection) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });
    clientConnection = await client.connect();
  }
  return clientConnection;
};

// Endpoint to get collections from a specific database with codes and descriptions
route.get("/collections-by-database/:dbName", async (req, res) => {
  try {
    const dbName = req.params.dbName;

    // Validate the database name for security
    const allowedDatabases = [
      "Fep631",
      "ProjectAbb",
      "test",
      "Fep632",
      "Transmitter",
    ];
    if (!allowedDatabases.includes(dbName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid database name",
      });
    }

    const client = await getClient();
    const db = client.db(dbName);

    // Get all collections in the specified database
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);

    // Initialize collectionsWithData object
    const collectionsWithData = {};

    // For each collection, get codes and descriptions
    for (const collectionName of collectionNames) {
      // Skip excluded collections
      if (["admins", "tabledatas"].includes(collectionName)) {
        continue;
      }

      try {
        const collection = db.collection(collectionName);

        // Get all documents with code and description fields
        // Make sure we're retrieving all documents without any limit
        const documents = await collection
          .find()
          .project({ code: 1, description: 1, _id: 0 })
          .toArray();

        // Log the count of documents retrieved for debugging
        console.log(
          `Retrieved ${documents.length} documents from ${collectionName}`
        );

        // Add to the result object
        collectionsWithData[collectionName] = documents;
      } catch (collectionError) {
        console.error(
          `Error fetching data for collection ${collectionName}:`,
          collectionError
        );
        // Still include the collection in the results, but with empty data
        collectionsWithData[collectionName] = [];
      }
    }

    // Log the total collections and their data sizes
    console.log(
      `Total collections found: ${Object.keys(collectionsWithData).length}`
    );
    Object.keys(collectionsWithData).forEach((key) => {
      console.log(`${key}: ${collectionsWithData[key].length} items`);
    });

    res.json({
      success: true,
      database: dbName,
      collectionsWithData,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching collections",
      error: error.message,
    });
  }
});

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

// Enhanced endpoint to get all collections with their codes and descriptions
route.get("/all-collections-data", async (req, res) => {
  try {
    // Get all collections in the database
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    // Extract just the collection names
    const collectionNames = collections.map((collection) => collection.name);

    // Result object to store all collections with their codes and descriptions
    const result = {};

    // Get codes and descriptions for each collection
    for (const collectionName of collectionNames) {
      // Skip excluded collections
      if (["admins", "tabledatas"].includes(collectionName)) {
        continue;
      }

      const model = await getModelByCollectionName(collectionName);
      if (model) {
        const data = await model.find({}).select("code description -_id");
        result[collectionName] = data;

        // Log the count of documents retrieved from each collection
        console.log(
          `Retrieved ${data.length} documents from ${collectionName}`
        );
      }
    }

    res.json({
      success: true,
      collectionsWithData: result,
      totalCollections: Object.keys(result).length,
    });
  } catch (error) {
    console.error("Error fetching collections data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = route;
