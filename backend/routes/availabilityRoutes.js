const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// create availability
router.post("/", async (req, res) => {
  const { dayOfWeek, startTime, endTime, timezone } = req.body;

  const data = await prisma.availability.create({
    data: { dayOfWeek, startTime, endTime, timezone }
  });

  res.json(data);
});

// get availability
router.get("/", async (req, res) => {
  const data = await prisma.availability.findMany();
  res.json(data);
});

module.exports = router;