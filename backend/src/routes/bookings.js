const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

const services = [
  { id: "1", name: "Deep Home Cleaning", price: 1499, icon: "🧹" },
  { id: "2", name: "AC Repair & Service", price: 799, icon: "❄️" },
  { id: "3", name: "Plumbing Service", price: 599, icon: "🔧" },
  { id: "4", name: "Electrical Work", price: 699, icon: "💡" },
  { id: "5", name: "Painting Service", price: 2999, icon: "🎨" },
  { id: "6", name: "Pest Control", price: 1299, icon: "🐛" },
  { id: "7", name: "Carpenter Service", price: 899, icon: "🪚" },
  { id: "8", name: "Appliance Repair", price: 999, icon: "⚙️" },
];

router.post("/", auth, async (req, res) => {
  try {
    const { serviceId, slotDate, slotTime, address } = req.body;

    if (!serviceId || !slotDate || !slotTime || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const service = services.find((s) => s.id === serviceId);
    if (!service) return res.status(400).json({ error: "Invalid service" });

    const prisma = req.app.locals.prisma;

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.userId,
        serviceName: service.name,
        servicePrice: service.price,
        slotDate,
        slotTime,
        address,
        status: "PENDING",
      },
    });

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: service.price,
        status: "CREATED",
      },
    });

    res.json({ success: true, booking: { ...booking, payment } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;

    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.userId },
      include: { payment: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;

    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: { payment: true },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

module.exports = router;
