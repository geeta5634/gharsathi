import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const services = [
    { category: "PLUMBER", name: "Plumber", baseCharge: 199, isEmergency: true },
    { category: "ELECTRICIAN", name: "Electrician", baseCharge: 199, isEmergency: true },
    { category: "DRIVER", name: "Driver", baseCharge: 299 },
    { category: "MAID", name: "Maid/Bai", baseCharge: 149 },
    { category: "CARPENTER", name: "Carpenter", baseCharge: 249 },
    { category: "HOUSE_PAINTER", name: "House Painter", baseCharge: 399 },
    { category: "HOUSE_CLEANER", name: "House Cleaning", baseCharge: 299 },
    { category: "LOCKSMITH", name: "Locksmith", baseCharge: 199, isEmergency: true },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { category: svc.category },
      update: svc,
      create: svc,
    });
  }

  console.log("Seeded services:", services.length);

  const workers = [
    { phone: "9111111111", name: "Rajesh Kumar", category: "PLUMBER", charge: 199, exp: 5 },
    { phone: "9222222222", name: "Suresh Singh", category: "ELECTRICIAN", charge: 199, exp: 7 },
    { phone: "9333333333", name: "Amit Sharma", category: "CARPENTER", charge: 249, exp: 4 },
    { phone: "9444444444", name: "Vikram Joshi", category: "HOUSE_CLEANER", charge: 299, exp: 3 },
    { phone: "9555555555", name: "Deepak Verma", category: "DRIVER", charge: 299, exp: 6 },
  ];

  for (const w of workers) {
    const existing = await prisma.user.findUnique({ where: { phone: w.phone } });
    if (!existing) {
      const user = await prisma.user.create({
        data: { phone: w.phone, name: w.name, role: "WORKER" },
      });
      const skillsMap: Record<string, string[]> = {
        PLUMBER: ["pipe repair", "faucet installation", "drain cleaning"],
        ELECTRICIAN: ["wiring", "switch repair", "circuit troubleshooting"],
        CARPENTER: ["furniture repair", "cabinet installation", "woodworking"],
        HOUSE_CLEANER: ["deep cleaning", "sofa cleaning", "bathroom scrubbing"],
        DRIVER: ["local driving", "outstation trips", "pickup/drop"],
      };
      await prisma.worker.create({
        data: {
          userId: user.id,
          serviceCategory: w.category as any,
          visitCharge: w.charge,
          hourlyRate: w.charge + 50,
          yearsOfExperience: w.exp,
          rating: 4 + Math.random(),
          totalReviews: Math.floor(Math.random() * 50) + 10,
          trustScore: 70 + Math.floor(Math.random() * 25),
          isAvailable: true,
          isVerified: true,
          kycStatus: "VERIFIED",
          city: "Jodhpur",
          area: "Sardarpura",
          skills: skillsMap[w.category] ?? ["general service"],
          totalEarnings: 50000 + Math.floor(Math.random() * 50000),
          completedJobs: 50 + Math.floor(Math.random() * 100),
        },
      });
    }
  }
  console.log("Seeded workers:", workers.length);

  const adminPhone = "9999999999";
  const existingAdmin = await prisma.user.findUnique({ where: { phone: adminPhone } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        phone: adminPhone,
        name: "Admin",
        role: "ADMIN",
      },
    });
    console.log("Created admin user:", adminPhone);
  }

  const customerPhone = "8888888888";
  const existingCustomer = await prisma.user.findUnique({ where: { phone: customerPhone } });
  if (!existingCustomer) {
    const user = await prisma.user.create({
      data: { phone: customerPhone, name: "Priya Patel", role: "CUSTOMER" },
    });
    await prisma.customer.create({
      data: { userId: user.id, city: "Jodhpur", area: "Pratap Nagar" },
    });
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: "PREMIUM",
        startDate: now,
        endDate,
        totalFreeVisits: 2,
      },
    });
    console.log("Created test customer:", customerPhone);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
