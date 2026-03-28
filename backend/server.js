const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// ✅ Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

/* =========================
   EVENT ROUTES
========================= */

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await prisma.eventType.findMany();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Create event
app.post("/api/events", async (req, res) => {
  try {
    const { title, duration } = req.body;

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const event = await prisma.eventType.create({
      data: {
        title,
        duration: parseInt(duration),
        slug
      }
    });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Update event
app.put("/api/events/:id", async (req, res) => {
  try {
    const { title, duration } = req.body;

    const updated = await prisma.eventType.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        duration: parseInt(duration)
      }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete event
app.delete("/api/events/:id", async (req, res) => {
  try {
    await prisma.eventType.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});


/* =========================
   BOOKING ROUTES
========================= */

// Get bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { eventType: true }
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Create booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, date, startTime, endTime, eventTypeId } = req.body;

    // Prevent double booking
    const exists = await prisma.booking.findFirst({
      where: {
        date,
        startTime,
        eventTypeId: parseInt(eventTypeId)
      }
    });

    if (exists) {
      return res.status(400).json({ error: "Slot already booked" });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        date,
        startTime,
        endTime,
        eventTypeId: parseInt(eventTypeId)
      }
    });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

// Cancel booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});


/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});