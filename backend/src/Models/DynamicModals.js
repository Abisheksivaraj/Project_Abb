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

module.exports = { getAllCodeModels };
