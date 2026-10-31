import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const rafiq = await prisma.user.upsert({
    where: { phone: "01700000001" },
    update: {},
    create: {
      name: "Rafiq H.",
      phone: "01700000001",
      passwordHash,
      location: "Dhanmondi, Dhaka"
    }
  });

  const shila = await prisma.user.upsert({
    where: { phone: "01700000002" },
    update: {},
    create: {
      name: "Shila A.",
      phone: "01700000002",
      passwordHash,
      location: "Mirpur, Dhaka"
    }
  });

  await prisma.listing.create({
    data: {
      userId: rafiq.id,
      listingType: "SELL",
      partType: "Display",
      phoneBrand: "Apple",
      phoneModel: "iPhone 8 Plus",
      condition: "USED_GOOD",
      price: 2200,
      description:
        "Original display from a working iPhone 8 Plus. No dead pixels, no scratches. Removed only because the battery was replaced.",
      location: "Dhanmondi, Dhaka"
    }
  });

  await prisma.listing.create({
    data: {
      userId: shila.id,
      listingType: "BUY",
      partType: "Battery",
      phoneBrand: "Samsung",
      phoneModel: "Galaxy A33",
      condition: "USED_GOOD",
      description: "Need a working battery, any condition considered.",
      location: "Mirpur, Dhaka"
    }
  });

  console.log("Seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
