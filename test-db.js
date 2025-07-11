import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Data user:", users);
  } catch (err) {
    console.error("Gagal konek ke DB:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
