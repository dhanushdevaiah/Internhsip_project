/**
 * Seed Script – Run with: npm run seed
 * Connects to MongoDB Atlas and populates sample expert data.
 */
const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const path     = require("path");

// Load .env from backend root (one level up from /seed)
dotenv.config({ path: path.join(__dirname, "../.env") });

const Expert = require("../models/Expert");

const experts = [
  {
    name: "Dr. Priya Sharma",
    title: "AI & Machine Learning Engineer",
    category: "Technology",
    bio: "10+ years building production ML systems at FAANG companies. Specializes in NLP, computer vision, and MLOps pipelines. Previously led the AI team at a unicorn startup.",
    expertise: ["Python", "TensorFlow", "PyTorch", "MLOps", "LLMs", "Data Pipelines"],
    hourlyRate: 250, rating: 4.9, totalReviews: 142, experience: 11,
    avatar: "https://i.pravatar.cc/300?img=47",
    isAvailable: true, languages: ["English", "Hindi"], completedSessions: 312,
    availableSlots: [
      { day: "Monday",    startTime: "10:00", endTime: "18:00" },
      { day: "Wednesday", startTime: "10:00", endTime: "18:00" },
      { day: "Friday",    startTime: "09:00", endTime: "15:00" },
    ],
  },
  {
    name: "Rahul Mehta",
    title: "Full Stack Architect & DevOps Lead",
    category: "Technology",
    bio: "Architect of scalable microservices handling millions of daily requests. Expert in cloud-native development, CI/CD, and system design interviews. Mentor to 500+ engineers.",
    expertise: ["Node.js", "React", "AWS", "Docker", "Kubernetes", "System Design"],
    hourlyRate: 180, rating: 4.8, totalReviews: 209, experience: 9,
    avatar: "https://i.pravatar.cc/300?img=12",
    isAvailable: true, languages: ["English", "Hindi", "Marathi"], completedSessions: 487,
    availableSlots: [
      { day: "Tuesday",  startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
      { day: "Saturday", startTime: "10:00", endTime: "14:00" },
    ],
  },
  {
    name: "Aditi Krishnan",
    title: "Corporate Finance & Investment Strategist",
    category: "Finance",
    bio: "CFA charterholder with 12 years on Wall Street. Advises startups on fundraising strategy, financial modeling, and investor relations. Helped raise $200M+ in Series A–C rounds.",
    expertise: ["Financial Modeling", "Valuation", "VC Fundraising", "M&A", "DCF Analysis"],
    hourlyRate: 300, rating: 4.7, totalReviews: 88, experience: 12,
    avatar: "https://i.pravatar.cc/300?img=5",
    isAvailable: true, languages: ["English", "Tamil"], completedSessions: 201,
    availableSlots: [
      { day: "Monday",    startTime: "14:00", endTime: "20:00" },
      { day: "Wednesday", startTime: "14:00", endTime: "20:00" },
    ],
  },
  {
    name: "Vikram Nair",
    title: "IP & Technology Lawyer",
    category: "Legal",
    bio: "Partner at a leading tech-law firm in Bangalore. Expert in SaaS contracts, startup equity, GDPR compliance, and intellectual property. 15 years advising tech companies.",
    expertise: ["SaaS Contracts", "IP Law", "GDPR", "Startup Equity", "NDAs", "Terms of Service"],
    hourlyRate: 220, rating: 4.6, totalReviews: 73, experience: 15,
    avatar: "https://i.pravatar.cc/300?img=33",
    isAvailable: true, languages: ["English", "Malayalam"], completedSessions: 156,
    availableSlots: [
      { day: "Tuesday",  startTime: "11:00", endTime: "19:00" },
      { day: "Thursday", startTime: "11:00", endTime: "19:00" },
    ],
  },
  {
    name: "Dr. Meera Iyer",
    title: "Clinical Psychologist & Burnout Coach",
    category: "Health",
    bio: "PhD in Clinical Psychology. Helps professionals recover from burnout, anxiety, and workplace stress. Evidence-based CBT practitioner with 8 years of clinical experience.",
    expertise: ["CBT", "Burnout Recovery", "Anxiety Management", "Mindfulness", "Career Stress"],
    hourlyRate: 150, rating: 5.0, totalReviews: 177, experience: 8,
    avatar: "https://i.pravatar.cc/300?img=25",
    isAvailable: true, languages: ["English", "Kannada", "Tamil"], completedSessions: 428,
    availableSlots: [
      { day: "Monday",    startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday",    startTime: "09:00", endTime: "13:00" },
    ],
  },
  {
    name: "Arjun Kapoor",
    title: "Growth Marketing & SEO Strategist",
    category: "Marketing",
    bio: "Scaled multiple startups from 0 to 100k users through data-driven growth strategies. Expert in performance marketing, SEO, and conversion optimization. Ex-Zomato, ex-Swiggy.",
    expertise: ["Growth Hacking", "SEO", "Google Ads", "Analytics", "Conversion Optimization", "Content Strategy"],
    hourlyRate: 130, rating: 4.8, totalReviews: 256, experience: 7,
    avatar: "https://i.pravatar.cc/300?img=15",
    isAvailable: true, languages: ["English", "Hindi"], completedSessions: 534,
    availableSlots: [
      { day: "Monday",   startTime: "10:00", endTime: "18:00" },
      { day: "Friday",   startTime: "10:00", endTime: "16:00" },
      { day: "Saturday", startTime: "10:00", endTime: "14:00" },
    ],
  },
  {
    name: "Sneha Reddy",
    title: "UX Research & Product Design Lead",
    category: "Design",
    bio: "Led design at Flipkart and Razorpay. Specializes in user research, design systems, and 0-to-1 product design. Mentor at NID and taught at IIT Bombay's design program.",
    expertise: ["Figma", "User Research", "Design Systems", "Prototyping", "Usability Testing", "Product Strategy"],
    hourlyRate: 160, rating: 4.9, totalReviews: 119, experience: 9,
    avatar: "https://i.pravatar.cc/300?img=44",
    isAvailable: false, languages: ["English", "Telugu"], completedSessions: 278,
    availableSlots: [{ day: "Thursday", startTime: "10:00", endTime: "18:00" }],
  },
  {
    name: "Karthik Subramaniam",
    title: "Startup Founder & Business Strategist",
    category: "Business",
    bio: "2x founder (1 exit, 1 active). Angel investor and startup mentor. Helps founders with go-to-market strategy, fundraising narratives, OKRs, and operational scaling.",
    expertise: ["GTM Strategy", "Fundraising", "OKRs", "Operations", "Pitch Decks", "P&L Management"],
    hourlyRate: 275, rating: 4.7, totalReviews: 64, experience: 13,
    avatar: "https://i.pravatar.cc/300?img=60",
    isAvailable: true, languages: ["English", "Tamil"], completedSessions: 143,
    availableSlots: [
      { day: "Tuesday",  startTime: "10:00", endTime: "16:00" },
      { day: "Saturday", startTime: "09:00", endTime: "13:00" },
    ],
  },
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB Atlas");

    await Expert.deleteMany({});
    console.log("🗑️  Cleared existing experts");

    const inserted = await Expert.insertMany(experts);
    console.log(`🌱 Seeded ${inserted.length} experts successfully`);

    inserted.forEach((e) => console.log(`   ✓ ${e.name} – ${e.category}`));

  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  }
};

seedDB();
