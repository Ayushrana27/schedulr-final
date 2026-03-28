const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express(); // ✅ YE LINE MISSING THI
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//
// ✅ ROOT
//
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

//
// ✅ GET EVENTS
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
// 🔥 GET SLOTS
//
app.get("/api/bookings/slots/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    const event = await prisma.eventType.findUnique({
      where: { slug },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const duration = event.duration;

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

    const bookings = await prisma.booking.findMany({
      where: { date },
    });

    const bookedTimes = bookings.map((b) => b.startTime);

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

    if (!name || !email || !date || !time) {
      return res.status(400).json({ message: "Missing fields" });
    }

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
// ✅ GET BOOKINGS (MEETINGS PAGE)
//
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        date: "asc",
      },
    });

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

//
// 🚀 START SERVER
//
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});