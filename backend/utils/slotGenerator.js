function generateSlots(startTime, endTime, duration, bookedSlots) {
  console.log("START:", startTime);
  console.log("END:", endTime);
  console.log("DURATION:", duration);

  const slots = [];

  let start = 9 * 60;   // force 9:00
  let end = 17 * 60;    // force 17:00

  while (start + duration <= end) {
    let hours = Math.floor(start / 60);
    let minutes = start % 60;

    let time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    slots.push(time);

    start += duration;
  }

  console.log("FINAL SLOTS:", slots);

  return slots;
}

module.exports = generateSlots;