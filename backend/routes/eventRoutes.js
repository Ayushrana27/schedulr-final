const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// ✅ CREATE EVENT
router.post("/", async (req, res) => {
  try {
    const { title, duration, slug } = req.body;

    if (!title || !duration || !slug) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔥 check unique slug
    const existing = await prisma.eventType.findFirst({
      where: { slug }
    });

    if (existing) {
      return res.status(400).json({
        message: "Slug already exists"
      });
    }

    const event = await prisma.eventType.create({
      data: {
        title,
        duration,
        slug
      }
    });

    res.json(event);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL EVENTS
router.get("/", async (req, res) => {
  try {
    const events = await prisma.eventType.findMany({
      orderBy: { id: "desc" }
    });

    res.json(events);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SINGLE EVENT
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const event = await prisma.eventType.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE EVENT
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, duration, slug } = req.body;

    if (!title || !duration || !slug) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔥 check slug uniqueness
    const existing = await prisma.eventType.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });

    if (existing) {
      return res.status(400).json({
        message: "Slug already exists"
      });
    }

    const updated = await prisma.eventType.update({
      where: { id },
      data: {
        title,
        duration,
        slug
      }
    });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE EVENT
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.eventType.delete({
      where: { id }
    });

    res.json({ message: "Event deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;