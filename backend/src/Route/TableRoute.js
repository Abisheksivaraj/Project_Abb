const express = require("express");
const route = express.Router();
const Table = require("../Models/Table");

// POST Route to create a new label
route.post("/table", async (req, res) => {
  try {
    console.log("=== CREATE LABEL REQUEST ===");
    console.log("Request body:", req.body);

    const {
      LabelType,
      SerialNumber,
      TagNumber,
      LabelDetails,
      LogoType,
      DevVersion,
      Date: labelDate, // Renamed to avoid shadowing global Date
      Status,
      ss,
      sz,
      powerSupply,
      ProtectionClass,
      Tamb,
      selectedQmax,
      selectedTmedDropdown,
      Size,
      LinerMaterial,
      Fitting,
      Elect,
      Fexc,
    } = req.body;

    // Validate required fields
    if (!SerialNumber || !LabelDetails) {
      return res.status(400).json({
        message: "Serial Number and Label Details (Model Number) are required",
      });
    }

    // Check for duplicate serial number
    const existingLabel = await Table.findOne({
      SerialNumber: SerialNumber.trim(),
    });

    if (existingLabel) {
      return res.status(400).json({
        message: "A label with this serial number already exists",
      });
    }

    // Create new label document
    const newLabel = new Table({
      LabelType: LabelType || "",
      SerialNumber: SerialNumber.trim(),
      TagNumber: TagNumber || "",
      LabelDetails: LabelDetails.trim(),
      LogoType: LogoType || "Logo_1",
      Date: labelDate || new Date().toISOString().split("T")[0],
      ss: ss || "",
      sz: sz || "",
      Status: Status || "Active",
      DevVersion: DevVersion || "",
      powerSupply: powerSupply || "",
      ProtectionClass: ProtectionClass || "",
      Tamb: Tamb || "",
      selectedQmax: selectedQmax || "",
      selectedTmedDropdown: selectedTmedDropdown || "",
      Size: Size || "",
      LinerMaterial: LinerMaterial || "",
      Fitting: Fitting || "",
      Elect: Elect || "",
      Fexc: Fexc || "",
      AddedBy: "Admin", // You can make this dynamic based on logged-in user
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Creating new label:", newLabel);

    const savedLabel = await newLabel.save();

    console.log("Label saved successfully:", savedLabel);

    res.status(201).json({
      message: "Label saved successfully",
      data: savedLabel,
      success: true,
    });
  } catch (error) {
    console.error("=== CREATE LABEL ERROR ===");
    console.error("Error details:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation Error",
        errors: validationErrors,
        success: false,
      });
    }

    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({
        message: "Duplicate entry found",
        error: "A label with this data already exists",
        success: false,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// GET Route to fetch all Labels
route.get("/tableData", async (req, res) => {
  try {
    console.log("=== FETCH ALL LABELS REQUEST ===");

    const {
      page = 1,
      limit = 0, // 0 means no limit
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      status = "",
      labelType = "",
    } = req.query;

    // Build search query
    const searchQuery = {};

    // Add text search across multiple fields
    if (search) {
      searchQuery.$or = [
        { SerialNumber: { $regex: search, $options: "i" } },
        { LabelDetails: { $regex: search, $options: "i" } },
        { TagNumber: { $regex: search, $options: "i" } },
        { LabelType: { $regex: search, $options: "i" } },
        { LogoType: { $regex: search, $options: "i" } },
        { AddedBy: { $regex: search, $options: "i" } },
      ];
    }

    // Add status filter
    if (status) {
      searchQuery.Status = status;
    }

    // Add label type filter
    if (labelType) {
      searchQuery.LabelType = { $regex: labelType, $options: "i" };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    let query = Table.find(searchQuery).sort(sortObj);

    // Apply pagination if limit is specified
    if (limit > 0) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const labels = await query.exec();

    // Get total count for pagination info
    const totalCount = await Table.countDocuments(searchQuery);

    console.log(`Found ${labels.length} labels out of ${totalCount} total`);

    const response = {
      data: labels,
      count: labels.length,
      totalCount: totalCount,
      success: true,
    };

    // Add pagination info if limit was specified
    if (limit > 0) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      response.pagination = {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("=== FETCH LABELS ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// GET Route to fetch a specific label by ID
route.get("/table/:id", async (req, res) => {
  try {
    console.log("=== FETCH SINGLE LABEL REQUEST ===");

    const { id } = req.params;
    console.log("Requested label ID:", id);

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid label ID format",
        success: false,
      });
    }

    const label = await Table.findById(id);

    if (!label) {
      console.log("Label not found with ID:", id);
      return res.status(404).json({
        message: "Label not found",
        success: false,
      });
    }

    console.log("Found label:", label);

    res.status(200).json({
      data: label,
      success: true,
    });
  } catch (error) {
    console.error("=== FETCH SINGLE LABEL ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// PUT Route to update a specific label by ID
route.put("/table/:id", async (req, res) => {
  try {
    console.log("=== UPDATE LABEL REQUEST ===");

    const { id } = req.params;
    console.log("Updating label ID:", id);
    console.log("Update data received:", req.body);

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid label ID format",
        success: false,
      });
    }

    const {
      LabelType,
      SerialNumber,
      TagNumber,
      LabelDetails,
      LogoType,
      DevVersion,
      Date: labelDate, // Renamed to avoid shadowing global Date
      Status,
      ss,
      sz,
      powerSupply,
      ProtectionClass,
      Tamb,
      selectedQmax,
      selectedTmedDropdown,
      Size,
      LinerMaterial,
      Fitting,
      Elect,
      Fexc,
    } = req.body;

    // Validate required fields
    if (!SerialNumber || !LabelDetails) {
      return res.status(400).json({
        message: "Serial Number and Label Details (Model Number) are required",
        success: false,
      });
    }

    // Check for duplicate serial number (excluding current record)
    const existingLabel = await Table.findOne({
      SerialNumber: SerialNumber.trim(),
      _id: { $ne: id },
    });

    if (existingLabel) {
      return res.status(400).json({
        message: "A label with this serial number already exists",
        success: false,
      });
    }

    // Find and update the label
    const updatedLabel = await Table.findByIdAndUpdate(
      id,
      {
        LabelType: LabelType || "",
        SerialNumber: SerialNumber.trim(),
        TagNumber: TagNumber || "",
        LabelDetails: LabelDetails.trim(),
        LogoType: LogoType || "Logo_1",
        Date: labelDate || new Date().toISOString().split("T")[0],
        ss: ss || "",
        sz: sz || "",
        Status: Status || "Active",
        DevVersion: DevVersion || "",
        powerSupply: powerSupply || "",
        ProtectionClass: ProtectionClass || "",
        Tamb: Tamb || "",
        selectedQmax: selectedQmax || "",
        selectedTmedDropdown: selectedTmedDropdown || "",
        Size: Size || "",
        LinerMaterial: LinerMaterial || "",
        Fitting: Fitting || "",
        Elect: Elect || "",
        Fexc: Fexc || "",
        UpdatedBy: "Admin", // You can make this dynamic
        updatedAt: new Date(),
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedLabel) {
      console.log("Label not found for update with ID:", id);
      return res.status(404).json({
        message: "Label not found",
        success: false,
      });
    }

    console.log("Label updated successfully:", updatedLabel);

    res.status(200).json({
      message: "Label updated successfully",
      data: updatedLabel,
      success: true,
    });
  } catch (error) {
    console.error("=== UPDATE LABEL ERROR ===");
    console.error("Error details:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation Error",
        errors: validationErrors,
        success: false,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid label ID format",
        success: false,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry found",
        error: "A label with this data already exists",
        success: false,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// DELETE Route to delete a specific label by ID
route.delete("/table/:id", async (req, res) => {
  try {
    console.log("=== DELETE LABEL REQUEST ===");

    const { id } = req.params;
    console.log("Deleting label ID:", id);

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid label ID format",
        success: false,
      });
    }

    const deletedLabel = await Table.findByIdAndDelete(id);

    if (!deletedLabel) {
      console.log("Label not found for deletion with ID:", id);
      return res.status(404).json({
        message: "Label not found",
        success: false,
      });
    }

    console.log("Label deleted successfully:", deletedLabel);

    res.status(200).json({
      message: "Label deleted successfully",
      data: deletedLabel,
      success: true,
    });
  } catch (error) {
    console.error("=== DELETE LABEL ERROR ===");
    console.error("Error details:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid label ID format",
        success: false,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// PATCH Route for partial updates
route.patch("/table/:id", async (req, res) => {
  try {
    console.log("=== PARTIAL UPDATE LABEL REQUEST ===");

    const { id } = req.params;
    console.log("Partial update for label ID:", id);
    console.log("Partial update data:", req.body);

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid label ID format",
        success: false,
      });
    }

    // Remove empty values and prepare update object
    const updateData = {};
    Object.keys(req.body).forEach((key) => {
      if (
        req.body[key] !== undefined &&
        req.body[key] !== null &&
        req.body[key] !== ""
      ) {
        updateData[key] = req.body[key];
      }
    });

    // Add update metadata
    updateData.UpdatedBy = "Admin"; // Make dynamic
    updateData.updatedAt = new Date();

    // Check for duplicate serial number if SerialNumber is being updated
    if (updateData.SerialNumber) {
      const existingLabel = await Table.findOne({
        SerialNumber: updateData.SerialNumber.trim(),
        _id: { $ne: id },
      });

      if (existingLabel) {
        return res.status(400).json({
          message: "A label with this serial number already exists",
          success: false,
        });
      }
    }

    const updatedLabel = await Table.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedLabel) {
      console.log("Label not found for partial update with ID:", id);
      return res.status(404).json({
        message: "Label not found",
        success: false,
      });
    }

    console.log("Label partially updated successfully:", updatedLabel);

    res.status(200).json({
      message: "Label updated successfully",
      data: updatedLabel,
      success: true,
    });
  } catch (error) {
    console.error("=== PARTIAL UPDATE LABEL ERROR ===");
    console.error("Error details:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation Error",
        errors: validationErrors,
        success: false,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid label ID format",
        success: false,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry found",
        error: "A label with this data already exists",
        success: false,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// GET Route to fetch labels with advanced filtering and pagination
route.get("/tableData/search", async (req, res) => {
  try {
    console.log("=== ADVANCED SEARCH LABELS REQUEST ===");

    const {
      page = 1,
      limit = 10,
      search = "",
      labelType = "",
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      dateFrom = "",
      dateTo = "",
      addedBy = "",
    } = req.query;

    console.log("Search parameters:", req.query);

    // Build search query
    const searchQuery = {};

    // Text search across multiple fields
    if (search) {
      searchQuery.$or = [
        { SerialNumber: { $regex: search, $options: "i" } },
        { LabelDetails: { $regex: search, $options: "i" } },
        { TagNumber: { $regex: search, $options: "i" } },
        { LabelType: { $regex: search, $options: "i" } },
        { LogoType: { $regex: search, $options: "i" } },
        { AddedBy: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by label type
    if (labelType) {
      searchQuery.LabelType = { $regex: labelType, $options: "i" };
    }

    // Filter by status
    if (status) {
      searchQuery.Status = status;
    }

    // Filter by added by
    if (addedBy) {
      searchQuery.AddedBy = { $regex: addedBy, $options: "i" };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      searchQuery.Date = {};
      if (dateFrom) {
        searchQuery.Date.$gte = dateFrom;
      }
      if (dateTo) {
        searchQuery.Date.$lte = dateTo;
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const labels = await Table.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalCount = await Table.countDocuments(searchQuery);

    console.log(`Found ${labels.length} labels out of ${totalCount} total`);

    res.status(200).json({
      data: labels,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount: totalCount,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
      success: true,
    });
  } catch (error) {
    console.error("=== ADVANCED SEARCH LABELS ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// GET Route to fetch label statistics
route.get("/tableData/stats", async (req, res) => {
  try {
    console.log("=== FETCH LABEL STATISTICS REQUEST ===");

    // Get total count
    const totalLabels = await Table.countDocuments();

    // Get count by status
    const statusStats = await Table.aggregate([
      {
        $group: {
          _id: "$Status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get count by label type
    const labelTypeStats = await Table.aggregate([
      {
        $group: {
          _id: "$LabelType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get count by logo type
    const logoTypeStats = await Table.aggregate([
      {
        $group: {
          _id: "$LogoType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent labels (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLabels = await Table.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    console.log("Statistics generated successfully");

    res.status(200).json({
      data: {
        totalLabels,
        recentLabels,
        statusBreakdown: statusStats,
        labelTypeBreakdown: labelTypeStats,
        logoTypeBreakdown: logoTypeStats,
      },
      success: true,
    });
  } catch (error) {
    console.error("=== FETCH STATISTICS ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// POST Route to bulk delete labels
route.post("/table/bulk-delete", async (req, res) => {
  try {
    console.log("=== BULK DELETE LABELS REQUEST ===");

    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of label IDs to delete",
        success: false,
      });
    }

    // Validate all IDs
    const invalidIds = ids.filter((id) => !id.match(/^[0-9a-fA-F]{24}$/));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Invalid label ID format",
        invalidIds,
        success: false,
      });
    }

    console.log(`Attempting to delete ${ids.length} labels`);

    const result = await Table.deleteMany({
      _id: { $in: ids },
    });

    console.log(`Successfully deleted ${result.deletedCount} labels`);

    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} labels`,
      deletedCount: result.deletedCount,
      success: true,
    });
  } catch (error) {
    console.error("=== BULK DELETE ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

// POST Route to bulk update label status
route.post("/table/bulk-update-status", async (req, res) => {
  try {
    console.log("=== BULK UPDATE STATUS REQUEST ===");

    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of label IDs to update",
        success: false,
      });
    }

    if (!status || !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        message: "Please provide a valid status (Active or Inactive)",
        success: false,
      });
    }

    // Validate all IDs
    const invalidIds = ids.filter((id) => !id.match(/^[0-9a-fA-F]{24}$/));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Invalid label ID format",
        invalidIds,
        success: false,
      });
    }

    console.log(
      `Attempting to update status for ${ids.length} labels to ${status}`
    );

    const result = await Table.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          Status: status,
          UpdatedBy: "Admin",
          updatedAt: new Date(),
        },
      }
    );

    console.log(`Successfully updated ${result.modifiedCount} labels`);

    res.status(200).json({
      message: `Successfully updated status for ${result.modifiedCount} labels`,
      modifiedCount: result.modifiedCount,
      success: true,
    });
  } catch (error) {
    console.error("=== BULK UPDATE STATUS ERROR ===");
    console.error("Error details:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
});

module.exports = route;
