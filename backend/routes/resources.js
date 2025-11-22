import express from "express";
import Resource from "../models/Resource.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Create resource (Admin only)
router.post("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { title, description, link, tag, icon } = req.body;

    if (!title || !description || !link || !tag) {
      return res.status(400).json({ message: "Title, description, link, and tag are required" });
    }

    const resource = await Resource.create({
      title,
      description,
      link,
      tag,
      icon: icon || "FaBook",
      createdBy: req.user._id,
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all resources (Public for authenticated users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const resources = await Resource.find({}).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single resource
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update resource (Admin only)
router.put("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { title, description, link, tag, icon } = req.body;

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { title, description, link, tag, icon: icon || "FaBook" },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete resource (Admin only)
router.delete("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get my resources (Admin)
router.get("/mine", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const resources = await Resource.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

