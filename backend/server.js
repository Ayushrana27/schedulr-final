const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//
// ✅ TEST ROUTE
//
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

//
// ✅ GET ALL EVENTS
//
app.get("/api/events", async (req, res) => {
  try {
    const events = await prisma.eventType.findMany();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

//
// ✅ CREATE EVENT
//
app.post("/api/events", async (req, res) => {
  try {
    const { title, duration } = req.body;

    const event = await prisma.eventType.create({
      data: {
        title,
        duration,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

//
// 🔥 GET SLOTS (IMPORTANT)
//
app.get("/api/bookings/slots/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { date } = req.query;

    // 👉 get event
    const event = await prisma.eventType.findUnique({
      where: { slug },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const duration = event.duration;

    // 👉 generate slots
    const slots = [];
    let start = 9;
    let end = 17;

    for (let h = start; h < end; h++) {
      for (let m = 0; m < 60; m += duration) {
        const time = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }

    // 👉 get booked slots
    const bookings = await prisma.booking.findMany({
      where: { date },
    });

    const bookedTimes = bookings.map((b) => b.startTime);

    // 👉 filter available
    const available = slots.filter((s) => !bookedTimes.includes(s));

    res.json(available);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Slot error" });
  }
});

//
// ✅ CREATE BOOKING
//
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, date, time, eventTypeId } = req.body;

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        date,
        startTime: time,
        endTime: time,
        eventTypeId,
      },
    });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

//
// 🚀 START SERVER
//
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});