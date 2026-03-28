const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});

console.log("Prisma Models:", Object.keys(prisma)); // DEBUG

module.exports = prisma;