// ============================================================
// All static data in one place
// Easy to update prices, packages, testimonials etc.
// ============================================================

export const PACKAGES = [
  {
    id: 1,
    name: "Quick Guidance",
    duration: "15 min",
    price: 299,
    icon: "⚡",
    popular: false,
    desc: "Fast answers to your most pressing questions.",
    features: [
      "Career path advice",
      "Quick doubt resolution",
      "Next step roadmap",
      "Chat support 24h",
    ],
  },
  {
    id: 2,
    name: "Roadmap Session",
    duration: "30 min",
    price: 599,
    icon: "🗺️",
    popular: true,
    desc: "Deep dive into your personalized learning roadmap.",
    features: [
      "Personalized roadmap",
      "Skill gap analysis",
      "Resource recommendations",
      "PDF summary post-call",
    ],
  },
  {
    id: 3,
    name: "Full Mentorship",
    duration: "60 min",
    price: 999,
    icon: "🚀",
    popular: false,
    desc: "Comprehensive session covering skills and career strategy.",
    features: [
      "Everything in Roadmap",
      "Live coding walkthrough",
      "LinkedIn/GitHub review",
      "30-day follow-up plan",
    ],
  },
  {
    id: 4,
    name: "Resume Review",
    duration: "30 min",
    price: 499,
    icon: "📄",
    popular: false,
    desc: "Get your resume noticed by top recruiters.",
    features: [
      "ATS optimization",
      "Formatting & design",
      "Keyword analysis",
      "3 revision rounds",
    ],
  },
  {
    id: 5,
    name: "Interview Prep",
    duration: "45 min",
    price: 799,
    icon: "🎯",
    popular: false,
    desc: "Mock interviews with detailed feedback.",
    features: [
      "Mock technical interview",
      "HR round simulation",
      "DSA problem practice",
      "Feedback report",
    ],
  },
  {
    id: 6,
    name: "Project Guidance",
    duration: "60 min",
    price: 899,
    icon: "💻",
    popular: false,
    desc: "Plan and build a portfolio project that stands out.",
    features: [
      "Project ideation",
      "Tech stack selection",
      "Architecture review",
      "Deployment walkthrough",
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: "Priya Mehta",
    college: "VIT Pune",
    avatar: "PM",
    color: "#f0a500",
    stars: 5,
    text: "Arjun helped me crack Infosys and TCS in the same month! The roadmap session gave me clarity I'd been missing for 2 years.",
  },
  {
    name: "Rohan Das",
    college: "DTU Delhi",
    avatar: "RD",
    color: "#00d4aa",
    stars: 5,
    text: "Resume review was worth every rupee. I went from 0 callbacks to 4 interview calls in one week.",
  },
  {
    name: "Anjali Singh",
    college: "KIIT Bhubaneswar",
    avatar: "AS",
    color: "#4f8ef7",
    stars: 5,
    text: "The 1-hour mentorship session completely changed my approach to learning MERN stack.",
  },
  {
    name: "Karan Patel",
    college: "BMS Bangalore",
    avatar: "KP",
    color: "#ff5c5c",
    stars: 5,
    text: "Got into my dream startup after the interview prep. The mock rounds were brutally honest and exactly what I needed.",
  },
  {
    name: "Divya Nair",
    college: "MCA - Symbiosis",
    avatar: "DN",
    color: "#a855f7",
    stars: 5,
    text: "As an MCA student, I was confused about my career path. One session and I had a 6-month plan ready.",
  },
  {
    name: "Amit Kumar",
    college: "NIT Warangal",
    avatar: "AK",
    color: "#ec4899",
    stars: 5,
    text: "Freelancing guidance helped me land my first ₹40k project. Couldn't believe how practical the advice was.",
  },
];

export const SERVICES = [
  {
    icon: "🧭",
    name: "Tech Career Guidance",
    desc: "Navigate your tech career with confidence. Explore roles, companies, and growth paths.",
  },
  {
    icon: "📚",
    name: "BCA/BTech/MCA Roadmaps",
    desc: "Customized semester-by-semester plans to maximize academic and career outcomes.",
  },
  {
    icon: "⚙️",
    name: "MERN Stack Guidance",
    desc: "From zero to full-stack developer. MongoDB, Express, React, Node deep dives.",
  },
  {
    icon: "🐍",
    name: "Python & ML Guidance",
    desc: "Python fundamentals to ML pipelines. Data science career roadmaps included.",
  },
  {
    icon: "🏢",
    name: "Internship & Placement",
    desc: "Resume crafting, aptitude prep, and interview strategies for top companies.",
  },
  {
    icon: "🌐",
    name: "Freelancing & SaaS",
    desc: "Build and launch your first freelancing profile or SaaS product.",
  },
];

export const FAQS = [
  {
    q: "I have never meditated. Is this for me?",
    a: "Especially for you. The first session assumes nothing. We talk about how your mind actually behaves, and choose one simple practice that fits it. You leave knowing exactly what to do each day and for how long.",
  },
  {
    q: "Is this religious? Do I need to believe anything?",
    a: "No belief is required. The texts we draw from (Vigyana Bhairava Tantra, Kashmir Shaivism, Advaita Vedanta) are practical manuals about attention and experience. You test everything in your own sitting. Whatever your background, the practice meets you there.",
  },
  {
    q: "How is a session conducted?",
    a: "One-on-one on Google Meet, usually 45 to 75 minutes depending on the session you choose. Part conversation, part guided practice. Nothing is rushed and nothing is recorded.",
  },
  {
    q: "How do payments work?",
    a: "You pick a session and a time, then pay by UPI. I confirm personally, usually within a few hours, and the Meet link arrives by email. If a session ever doesn't happen from my side, you get a full refund or a rebooking, your choice.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes. From your dashboard you can request a new time and I approve it, or suggest another. Life happens; the practice should bend with it, not break.",
  },
  {
    q: "What if my practice has gone dry after years of sitting?",
    a: "That is one of the most common reasons people come, and one of the most workable. Dryness usually means the practice needs to change form, not that you have failed. We look at what happened and adjust.",
  },
];

export const SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM",
];

export const STATS = [
  { num: "1200+", label: "Students Mentored" },
  { num: "3800+", label: "Sessions Done" },
  { num: "4.9★", label: "Avg Rating" },
  { num: "6+", label: "Years Exp" },
];

export const YEARS = [
  "1st Year", "2nd Year", "3rd Year", "4th Year",
  "Post Graduate", "Working Professional",
];