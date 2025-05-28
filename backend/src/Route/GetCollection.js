const express = require("express");
const {
  getAllCodeModels,
  getModelByCollectionName,
} = require("../Models/DynamicModals");
const route = express.Router();
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

// MongoDB connection string with better fallback handling
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const defaultDbName = process.env.DEFAULT_DB_NAME || "ProjectABB";

// Create a cached client instance to avoid reconnecting on every request
let clientConnection = null;

// Get MongoDB client connection with better error handling
const getClient = async () => {
  try {
    if (!clientConnection) {
      console.log("Creating new MongoDB connection...");
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      clientConnection = await client.connect();
      console.log("MongoDB connection established successfully");
    }
    return clientConnection;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    clientConnection = null;
    throw error;
  }
};

// 1. GET ALL DATABASES
route.get("/databases", async (req, res) => {
  console.log("\n=== Fetching all databases ===");

  try {
    const client = await getClient();
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();

    // Filter out system databases if needed
    const userDatabases = databases.databases.filter(
      (db) => !["admin", "local", "config"].includes(db.name)
    );

    console.log(`Found ${userDatabases.length} user databases`);

    res.json({
      success: true,
      databases: userDatabases.map((db) => ({
        name: db.name,
        sizeOnDisk: db.sizeOnDisk,
        empty: db.empty || false,
      })),
      totalDatabases: userDatabases.length,
    });
  } catch (error) {
    console.error("Error fetching databases:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching databases",
      error: error.message,
    });
  }
});

// 2. GET DATABASE STRUCTURE (databases with their collections)
route.get("/database-structure", async (req, res) => {
  console.log("\n=== Fetching complete database structure ===");

  try {
    const client = await getClient();
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();

    const databaseStructure = {};

    // Get collections for each database
    for (const dbInfo of databases.databases) {
      // Skip system databases
      if (["admin", "local", "config"].includes(dbInfo.name)) {
        continue;
      }

      try {
        const db = client.db(dbInfo.name);
        const collections = await db.listCollections().toArray();

        databaseStructure[dbInfo.name] = {
          info: {
            sizeOnDisk: dbInfo.sizeOnDisk,
            empty: dbInfo.empty || false,
          },
          collections: collections.map((col) => ({
            name: col.name,
            type: col.type || "collection",
          })),
        };

        console.log(
          `Database ${dbInfo.name}: ${collections.length} collections`
        );
      } catch (dbError) {
        console.error(`Error accessing database ${dbInfo.name}:`, dbError);
        databaseStructure[dbInfo.name] = {
          info: { error: "Access denied or connection failed" },
          collections: [],
        };
      }
    }

    res.json({
      success: true,
      databaseStructure,
      totalDatabases: Object.keys(databaseStructure).length,
    });
  } catch (error) {
    console.error("Error fetching database structure:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching database structure",
      error: error.message,
    });
  }
});

// 3. GET COLLECTIONS FOR A SPECIFIC DATABASE
route.get("/databases/:dbName/collections", async (req, res) => {
  const { dbName } = req.params;
  console.log(`\n=== Fetching collections for database: ${dbName} ===`);

  try {
    // Validate database name
    const allowedDatabases = [
      "Fep631",
      "ProjectABB",
      "Project",
      "Fep632",
      "Transmitter",
      "admin",
    ];

    if (!allowedDatabases.includes(dbName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid database name. Allowed databases: ${allowedDatabases.join(
          ", "
        )}`,
      });
    }

    const client = await getClient();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    console.log(`Found ${collections.length} collections in ${dbName}`);

    res.json({
      success: true,
      database: dbName,
      collections: collections.map((col) => ({
        name: col.name,
        type: col.type || "collection",
      })),
      totalCollections: collections.length,
    });
  } catch (error) {
    console.error(`Error fetching collections for database ${dbName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error fetching collections for database ${dbName}`,
      error: error.message,
    });
  }
});

// 4. GET COLLECTION DATA WITH METADATA
route.get(
  "/databases/:dbName/collections/:collectionName",
  async (req, res) => {
    const { dbName, collectionName } = req.params;
    const { limit = 100, skip = 0, fields } = req.query;

    console.log(`\n=== Fetching data from ${dbName}.${collectionName} ===`);

    try {
      // Security validation
      const allowedDatabases = [
        "Fep631",
        "ProjectABB",
        "Project",
        "Fep632",
        "Transmitter",
        "admin",
      ];
      const excludedCollections = ["admins", "tabledatas"];

      if (!allowedDatabases.includes(dbName)) {
        return res.status(400).json({
          success: false,
          message: "Invalid database name",
        });
      }

      if (excludedCollections.includes(collectionName.toLowerCase())) {
        return res.status(403).json({
          success: false,
          message: "Access to this collection is not allowed",
        });
      }

      const client = await getClient();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Get collection statistics
      const stats = await db.command({ collStats: collectionName });
      const totalDocuments = await collection.countDocuments();

      // Build projection object if fields are specified
      let projection = {};
      if (fields) {
        const fieldList = fields.split(",");
        fieldList.forEach((field) => {
          projection[field.trim()] = 1;
        });
      } else {
        // Default projection for code/description pattern
        projection = { code: 1, description: 1, _id: 0 };
      }

      // Fetch documents with pagination
      const documents = await collection
        .find({})
        .project(projection)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .toArray();

      console.log(
        `Retrieved ${documents.length} documents from ${dbName}.${collectionName}`
      );

      res.json({
        success: true,
        database: dbName,
        collection: collectionName,
        metadata: {
          totalDocuments,
          size: stats.size,
          avgObjSize: stats.avgObjSize,
          storageSize: stats.storageSize,
          indexes: stats.nindexes,
        },
        pagination: {
          skip: parseInt(skip),
          limit: parseInt(limit),
          returned: documents.length,
          hasMore: parseInt(skip) + documents.length < totalDocuments,
        },
        data: documents,
      });
    } catch (error) {
      console.error(
        `Error fetching data from ${dbName}.${collectionName}:`,
        error
      );
      res.status(500).json({
        success: false,
        message: "Error fetching collection data",
        error: error.message,
      });
    }
  }
);

// 5. SEARCH ACROSS ALL DATABASES AND COLLECTIONS
route.get("/search", async (req, res) => {
  const { query, field = "code", databases } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  console.log(`\n=== Searching for "${query}" in field "${field}" ===`);

  try {
    const client = await getClient();
    const adminDb = client.db().admin();
    const allDatabases = await adminDb.listDatabases();

    // Filter databases to search
    let databasesToSearch = allDatabases.databases
      .filter((db) => !["admin", "local", "config"].includes(db.name))
      .map((db) => db.name);

    if (databases) {
      const requestedDbs = databases.split(",");
      databasesToSearch = databasesToSearch.filter((db) =>
        requestedDbs.includes(db)
      );
    }

    const searchResults = {};

    for (const dbName of databasesToSearch) {
      try {
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();

        searchResults[dbName] = {};

        for (const colInfo of collections) {
          if (["admins", "tabledatas"].includes(colInfo.name)) {
            continue;
          }

          try {
            const collection = db.collection(colInfo.name);

            // Create search filter
            const searchFilter = {};
            searchFilter[field] = { $regex: query, $options: "i" };

            const results = await collection
              .find(searchFilter)
              .project({ code: 1, description: 1, _id: 0 })
              .limit(50)
              .toArray();

            if (results.length > 0) {
              searchResults[dbName][colInfo.name] = results;
            }
          } catch (colError) {
            console.error(
              `Error searching in ${dbName}.${colInfo.name}:`,
              colError
            );
          }
        }

        // Remove empty databases from results
        if (Object.keys(searchResults[dbName]).length === 0) {
          delete searchResults[dbName];
        }
      } catch (dbError) {
        console.error(`Error searching in database ${dbName}:`, dbError);
      }
    }

    // Count total results
    let totalResults = 0;
    Object.values(searchResults).forEach((dbResults) => {
      Object.values(dbResults).forEach((colResults) => {
        totalResults += colResults.length;
      });
    });

    res.json({
      success: true,
      searchQuery: query,
      searchField: field,
      totalResults,
      results: searchResults,
    });
  } catch (error) {
    console.error("Error performing search:", error);
    res.status(500).json({
      success: false,
      message: "Error performing search",
      error: error.message,
    });
  }
});

// 6. EXISTING ENHANCED ENDPOINT (Updated)
route.get("/collections-by-database/:dbName", async (req, res) => {
  console.log(
    `\n=== Starting collections fetch for database: ${req.params.dbName} ===`
  );

  try {
    const dbName = req.params.dbName;
    console.log(`Requested database: ${dbName}`);

    // Validate the database name for security
    const allowedDatabases = [
      "Fep631",

      "Project",
      "Fep632",
      "Transmitter",
      "admins",
    ];

    if (!allowedDatabases.includes(dbName)) {
      console.log(`Invalid database name requested: ${dbName}`);
      return res.status(400).json({
        success: false,
        message: `Invalid database name. Allowed databases: ${allowedDatabases.join(
          ", "
        )}`,
      });
    }

    const client = await getClient();
    console.log("Client obtained successfully");

    // Connect to the specified database
    const targetDb = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // List all databases for debugging
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    console.log(
      "Available databases:",
      databases.databases.map((db) => db.name)
    );

    // Get all collections in the specified database
    console.log(`Listing collections in database: ${targetDb.databaseName}`);
    const collections = await targetDb.listCollections().toArray();
    console.log(
      `Found ${collections.length} collections:`,
      collections.map((c) => c.name)
    );

    if (collections.length === 0) {
      console.log("No collections found in the database");
      return res.json({
        success: true,
        database: dbName,
        collectionsWithData: {},
        message: "No collections found in the specified database",
      });
    }

    const collectionNames = collections.map((collection) => collection.name);
    const collectionsWithData = {};

    // For each collection, get codes and descriptions
    for (const collectionName of collectionNames) {
      console.log(`\nProcessing collection: ${collectionName}`);

      // Skip excluded collections
      if (["admins", "tabledatas"].includes(collectionName)) {
        console.log(`Skipping excluded collection: ${collectionName}`);
        continue;
      }

      try {
        const collection = targetDb.collection(collectionName);

        // Check if collection exists and has documents
        const docCount = await collection.countDocuments();
        console.log(`Collection ${collectionName} has ${docCount} documents`);

        if (docCount === 0) {
          console.log(`Collection ${collectionName} is empty`);
          collectionsWithData[collectionName] = [];
          continue;
        }

        // Get all documents with code and description fields
        const documents = await collection
          .find({})
          .project({ code: 1, description: 1, _id: 0 })
          .limit(1000)
          .toArray();

        console.log(
          `Retrieved ${documents.length} documents from ${collectionName}`
        );

        if (documents.length > 0) {
          console.log(
            `Sample document from ${collectionName}:`,
            JSON.stringify(documents[0], null, 2)
          );
        }

        collectionsWithData[collectionName] = documents;
      } catch (collectionError) {
        console.error(
          `Error fetching data for collection ${collectionName}:`,
          collectionError
        );
        collectionsWithData[collectionName] = [];
      }
    }

    console.log(`\nFinal results:`);
    console.log(
      `Total collections processed: ${Object.keys(collectionsWithData).length}`
    );
    Object.keys(collectionsWithData).forEach((key) => {
      console.log(`${key}: ${collectionsWithData[key].length} items`);
    });

    const response = {
      success: true,
      database: dbName,
      actualDatabase: targetDb.databaseName,
      collectionsWithData,
      totalCollections: Object.keys(collectionsWithData).length,
      availableDatabases: databases.databases.map((db) => db.name),
    };

    console.log("=== Request completed successfully ===\n");
    res.json(response);
  } catch (error) {
    console.error("=== ERROR in collections-by-database endpoint ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    console.error("=== END ERROR ===\n");

    res.status(500).json({
      success: false,
      message: "Error fetching collections",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// 7. HEALTH CHECK ENDPOINT
route.get("/health-check", async (req, res) => {
  try {
    const client = await getClient();
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();

    res.json({
      success: true,
      message: "MongoDB connection is healthy",
      connectionUri: uri.replace(/\/\/.*@/, "//***:***@"),
      availableDatabases: databases.databases.map((db) => ({
        name: db.name,
        sizeOnDisk: db.sizeOnDisk,
      })),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      success: false,
      message: "MongoDB connection failed",
      error: error.message,
    });
  }
});

// 8. GET COLLECTION INDEXES
route.get(
  "/databases/:dbName/collections/:collectionName/indexes",
  async (req, res) => {
    const { dbName, collectionName } = req.params;

    try {
      const client = await getClient();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      const indexes = await collection.indexes();

      res.json({
        success: true,
        database: dbName,
        collection: collectionName,
        indexes: indexes,
      });
    } catch (error) {
      console.error(
        `Error fetching indexes for ${dbName}.${collectionName}:`,
        error
      );
      res.status(500).json({
        success: false,
        message: "Error fetching collection indexes",
        error: error.message,
      });
    }
  }
);

// Legacy endpoints (keeping for backward compatibility)
route.get("/find-description/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const allModels = await getAllCodeModels();

    let result = null;
    let sourceCollection = null;

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

route.get("/all-collections-data", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((collection) => collection.name);
    const result = {};

    for (const collectionName of collectionNames) {
      if (["admins", "tabledatas"].includes(collectionName)) {
        continue;
      }

      const model = await getModelByCollectionName(collectionName);
      if (model) {
        const data = await model.find({}).select("code description -_id");
        result[collectionName] = data;
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

route.get("/collections-by-name/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;

    if (!collectionName || typeof collectionName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid collection name provided",
      });
    }

    const excludedCollections = ["admins", "tabledatas"];
    if (excludedCollections.includes(collectionName.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Access to this collection is not allowed",
      });
    }

    const model = await getModelByCollectionName(collectionName);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: `Collection '${collectionName}' not found`,
      });
    }

    const data = await model.find({}).select("code description -_id");

    console.log(
      `Retrieved ${data.length} documents from collection: ${collectionName}`
    );

    res.json({
      success: true,
      collection: collectionName,
      data: data,
      count: data.length,
    });
  } catch (error) {
    console.error(
      `Error fetching data from collection ${req.params.collectionName}:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Error fetching collection data",
      error: error.message,
    });
  }
});

module.exports = route;
