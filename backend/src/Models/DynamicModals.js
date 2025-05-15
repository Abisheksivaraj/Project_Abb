const mongoose = require("mongoose");

// Create a basic schema for code-description data
const codeSchema = new mongoose.Schema(
  {
    code: String,
    description: String,
  },
  { strict: false }
);

// Function to get models for all RC collections
async function getAllCodeModels() {
  // Get all collections in the database
  const collections = await mongoose.connection.db.listCollections().toArray();

  // Create models for all collections (or filter as needed)
  return collections.map((collection) => {
    const collectionName = collection.name;
    return (
      mongoose.models[collectionName] ||
      mongoose.model(collectionName, codeSchema, collectionName)
    );
  });
}

// Function to get model for a specific collection
async function getModelByCollectionName(collectionName) {
  try {
    // Check if the collection exists
    const collections = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .toArray();

    if (collections.length === 0) {
      return null; // Collection doesn't exist
    }

    // Return existing model or create a new one
    return (
      mongoose.models[collectionName] ||
      mongoose.model(collectionName, codeSchema, collectionName)
    );
  } catch (error) {
    console.error(
      `Error getting model for collection ${collectionName}:`,
      error
    );
    return null;
  }
}

module.exports = { getAllCodeModels, getModelByCollectionName };
