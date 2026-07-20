const express = require("express");
const router = express.Router();

const services = [
  { id: "1", name: "Deep Home Cleaning", price: 1499, icon: "🧹", description: "Complete deep cleaning of your entire home", duration: "3-4 hours", rating: 4.8, reviews: 342 },
  { id: "2", name: "AC Repair & Service", price: 799, icon: "❄️", description: "Professional AC repair and maintenance", duration: "1-2 hours", rating: 4.7, reviews: 218 },
  { id: "3", name: "Plumbing Service", price: 599, icon: "🔧", description: "Fix leaks, installations, and pipe repair", duration: "1-3 hours", rating: 4.6, reviews: 189 },
  { id: "4", name: "Electrical Work", price: 699, icon: "💡", description: "Wiring, fixtures, and electrical repairs", duration: "1-2 hours", rating: 4.7, reviews: 156 },
  { id: "5", name: "Painting Service", price: 2999, icon: "🎨", description: "Interior and exterior painting solutions", duration: "1-2 days", rating: 4.9, reviews: 412 },
  { id: "6", name: "Pest Control", price: 1299, icon: "🐛", description: "Complete pest elimination treatment", duration: "2-3 hours", rating: 4.5, reviews: 267 },
  { id: "7", name: "Carpenter Service", price: 899, icon: "🪚", description: "Furniture repair and custom woodwork", duration: "2-4 hours", rating: 4.6, reviews: 178 },
  { id: "8", name: "Appliance Repair", price: 999, icon: "⚙️", description: "Repair for washing machines, fridge, etc.", duration: "1-3 hours", rating: 4.7, reviews: 234 },
];

const timeSlots = [
  { id: "t1", time: "09:00 AM - 11:00 AM", available: true },
  { id: "t2", time: "11:00 AM - 01:00 PM", available: true },
  { id: "t3", time: "02:00 PM - 04:00 PM", available: true },
  { id: "t4", time: "04:00 PM - 06:00 PM", available: true },
  { id: "t5", time: "06:00 PM - 08:00 PM", available: true },
];

router.get("/", (req, res) => {
  res.json({ services });
});

router.get("/:id", (req, res) => {
  const service = services.find((s) => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json({ service });
});

router.get("/:id/slots", (req, res) => {
  const service = services.find((s) => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });

  const today = new Date();
  const dates = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      date: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      slots: timeSlots,
    });
  }

  res.json({ service, availableDates: dates });
});

module.exports = router;
