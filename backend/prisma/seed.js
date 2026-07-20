const { PrismaClient } = require("@prisma/client");

const services = [
  { name: "Deep Home Cleaning", price: 1499, icon: "🧹" },
  { name: "AC Repair & Service", price: 799, icon: "❄️" },
  { name: "Plumbing Service", price: 599, icon: "🔧" },
  { name: "Electrical Work", price: 699, icon: "💡" },
  { name: "Painting Service", price: 2999, icon: "🎨" },
  { name: "Pest Control", price: 1299, icon: "🐛" },
  { name: "Carpenter Service", price: 899, icon: "🪚" },
  { name: "Appliance Repair", price: 999, icon: "⚙️" },
];

const timeSlots = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

async function main() {
  const prisma = new PrismaClient();
  try {
    // Create demo user
    await prisma.user.upsert({
      where: { phone: "9999999999" },
      update: {},
      create: {
        phone: "9999999999",
        name: "Demo User",
        email: "demo@gharsathi.com",
      },
    });

    console.log("Database seeded successfully!");
    console.log("Demo phone: 9999999999 (use any 6-digit OTP)");
    console.log("Services available:", services.length);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
