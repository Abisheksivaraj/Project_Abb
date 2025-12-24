import React, { useState, useEffect } from "react";
import { api } from "../apiConfig";

function CollectionDropdowns() {
  const [collectionsWithCodes, setCollectionsWithCodes] = useState({});
  const [selectedCodes, setSelectedCodes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch collections and codes from the backend
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await api.get("/all-collections-codes");
        const data = response.data;

        if (data.success) {
          setCollectionsWithCodes(data.collectionsWithCodes);

          // Initialize selectedCodes state with empty values for each collection
          const initialSelectedCodes = {};
          Object.keys(data.collectionsWithCodes).forEach((collection) => {
            initialSelectedCodes[collection] = "";
          });
          setSelectedCodes(initialSelectedCodes);
        } else {
          throw new Error(data.error || "Failed to fetch collections");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch collections");
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleCodeChange = (collection, code) => {
    setSelectedCodes((prev) => ({
      ...prev,
      [collection]: code,
    }));
  };

  if (loading) return <div>Loading collections...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="collections-container">
      {Object.keys(collectionsWithCodes).map((collection) => (
        <div key={collection} className="form-group mb-4">
          <label htmlFor={`select-${collection}`}>{collection}:</label>
          <select
            id={`select-${collection}`}
            value={selectedCodes[collection]}
            onChange={(e) => handleCodeChange(collection, e.target.value)}
            className="form-control"
          >
            <option value="">-- Select {collection} Code --</option>
            {collectionsWithCodes[collection]?.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          {selectedCodes[collection] && (
            <div className="selected-info mt-2">
              <p className="mb-0">
                Selected {collection} Code:{" "}
                <strong>{selectedCodes[collection]}</strong>
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Display a summary of all selected codes if needed */}
      <div className="selected-summary mt-4">
        <h4>Selected Codes Summary:</h4>
        <ul>
          {Object.entries(selectedCodes).map(([collection, code]) =>
            code ? (
              <li key={collection}>
                {collection}: <strong>{code}</strong>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
}

export default CollectionDropdowns;
