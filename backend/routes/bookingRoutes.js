const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// 🔥 HELPER: generate slots based on duration
function generateSlots(startTime, endTime, duration) {
  const slots = [];

  let start =
    parseInt(startTime.split(":")[0]) * 60 +
    parseInt(startTime.split(":")[1]);

  let end =
    parseInt(endTime.split(":")[0]) * 60 +
    parseInt(endTime.split(":")[1]);

  while (start + duration <= end) {
    let h = Math.floor(start / 60);
    let m = start % 60;

    const time = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;

    slots.push(time);
    start += duration; // 🔥 dynamic increment
  }

  return slots;
}

// ✅ GET ALL BOOKINGS
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { date: "asc" }
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET AVAILABLE SLOTS (OPTIMIZED)
router.get("/slots/:slug", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    // 🔥 get event
    const event = await prisma.eventType.findFirst({
      where: { slug: req.params.slug }
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔥 get day
    const day = new Date(date).getDay();

    // 🔥 get availability
    const availability = await prisma.availability.findFirst({
      where: { dayOfWeek: day }
    });

    if (!availability) {
      return res.json([]);
    }

    // 🔥 generate slots using event duration
    let slots = generateSlots(
      availability.startTime,
      availability.endTime,
      event.duration
    );

    // 🔥 get booked slots
    const booked = await prisma.booking.findMany({
      where: { date },
      select: { startTime: true }
    });

    const bookedTimes = booked.map(b => b.startTime);

    // 🔥 filter booked
    const availableSlots = slots.filter(
      s => !bookedTimes.includes(s)
    );

    res.json(availableSlots);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE BOOKING
router.post("/", async (req, res) => {
  try {
    const { name, email, date, time, eventTypeId } = req.body;

    if (!name || !email || !date || !time) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔥 prevent double booking
    const existing = await prisma.booking.findFirst({
      where: {
        date,
        startTime: time,
        eventTypeId
      }
    });

    if (existing) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        date,
        startTime: time,
        endTime: time,
        eventTypeId
      }
    });

    res.json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE BOOKING
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.booking.delete({
      where: { id }
    });

    res.json({ message: "Booking cancelled" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;