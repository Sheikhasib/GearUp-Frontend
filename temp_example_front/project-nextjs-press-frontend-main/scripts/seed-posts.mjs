// Run: node scripts/seed-posts.mjs
// Requires BACKEND_API_URL (default http://localhost:3000)

const BASE = process.env.BACKEND_API_URL || "http://localhost:3000";

const posts = [
  {
    title: "The Future of AI in Modern Journalism",
    content: "Artificial intelligence is reshaping how newsrooms operate. From automated fact-checking to personalized content delivery, AI tools are becoming indispensable for modern journalism.\n\nThis article explores the latest developments in AI-powered journalism and what it means for reporters, editors, and readers alike.",
    tags: ["ai", "technology", "journalism"],
    isPremium: false,
  },
  {
    title: "Local Community Garden Transforms Urban Neighborhood",
    content: "What started as a small plot of land has blossomed into a thriving community garden that brings together residents of all ages. The garden now supplies fresh produce to over 50 families weekly.\n\nVolunteers have transformed vacant lots into green spaces, creating a model for urban renewal that other cities are now studying.",
    tags: ["community", "local", "environment"],
    isPremium: false,
  },
  {
    title: "Championship Finals: Underdog Team Makes Historic Run",
    content: "In what analysts are calling the greatest upset in recent memory, the underdog team has advanced to the championship finals after defeating the top-seeded team in a thrilling overtime victory.\n\nFans erupted in celebration as the final buzzer sounded, capping a season of remarkable determination and teamwork.",
    tags: ["sports", "championship"],
    isPremium: false,
    thumbnail: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=800&h=400&fit=crop",
  },
  {
    title: "New Study Reveals Breakthrough in Renewable Energy Storage",
    content: "Researchers at the National Energy Laboratory have announced a breakthrough in battery technology that could double the storage capacity of renewable energy systems.\n\nThe new solid-state battery design promises to make solar and wind power more reliable by storing excess energy for longer periods at lower cost.",
    tags: ["science", "energy", "technology"],
    isPremium: false,
  },
  {
    title: "Global Summit Addresses Climate Change Commitments",
    content: "World leaders gathered this week to reaffirm and strengthen their commitments to reducing carbon emissions. The summit produced a landmark agreement that sets more ambitious targets for 2030.\n\nEnvironmental groups have cautiously welcomed the deal while emphasizing that concrete actions must follow the promises made.",
    tags: ["climate", "global", "politics"],
    isPremium: false,
  },
  {
    title: "How Remote Work Is Reshaping City Downtowns",
    content: "Three years after the shift to remote work, city downtowns are undergoing a dramatic transformation. Office buildings are being converted into residential spaces, and once-quiet streets are becoming vibrant mixed-use neighborhoods.\n\nUrban planners say this shift presents both challenges and opportunities for the future of our cities.",
    tags: ["business", "urban", "work"],
    isPremium: false,
  },
  {
    title: "Exclusive: Inside the World's Most Advanced Robotics Lab",
    content: "We were granted rare access to the cutting-edge robotics laboratory where engineers are developing humanoid robots capable of performing complex surgical procedures with unprecedented precision.\n\nThe implications for healthcare are enormous, with potential applications ranging from remote surgery in underserved areas to assisted living for the elderly.",
    tags: ["robotics", "healthcare", "exclusive"],
    isPremium: true,
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
  },
  {
    title: "Premium Analysis: Global Markets Navigate Economic Uncertainty",
    content: "Financial markets continue to show resilience despite ongoing geopolitical tensions and supply chain disruptions. Our expert analysts break down the key trends shaping the global economy.\n\nThis in-depth analysis covers currency fluctuations, commodity prices, and emerging market opportunities that sophisticated investors should watch.",
    tags: ["finance", "markets", "economy"],
    isPremium: true,
  },
  {
    title: "New Education Policy Aims to Bridge Digital Divide",
    content: "The government has announced a comprehensive education reform package that includes free internet access for students in underserved communities and a nationwide digital literacy program.\n\nEducation advocates have praised the initiative, noting that access to technology is no longer a luxury but a fundamental requirement for modern learning.",
    tags: ["education", "policy", "technology"],
    isPremium: false,
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop",
  },
  {
    title: "Cultural Festival Draws Record Crowds to Waterfront",
    content: "The annual cultural festival has shattered attendance records this year, drawing over 200,000 visitors to the waterfront district. The event featured performances from 30 countries and over 100 food vendors.\n\nOrganizers say the festival's growth reflects the city's increasing diversity and the community's appetite for cross-cultural experiences.",
    tags: ["culture", "festival", "events"],
    isPremium: false,
  },
];

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "author@press.com", password: "password123" }),
  });
  return res.json();
}

async function register() {
  const res = await fetch(`${BASE}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Author User",
      email: "author@press.com",
      password: "password123",
      profilePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=AU",
    }),
  });
  return res.json();
}

async function createPost(post, token) {
  const res = await fetch(`${BASE}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
    body: JSON.stringify(post),
  });
  return res.json();
}

async function main() {
  console.log("Logging in...");
  let auth = await login();

  if (!auth.success) {
    console.log("Login failed. Registering...");
    const reg = await register();
    if (!reg.success) {
      console.log("Registration also failed. Make sure the backend is running on", BASE);
      console.log("Register response:", reg);
      process.exit(1);
    }
    console.log("Registered. Logging in...");
    auth = await login();
    if (!auth.success) {
      console.log("Login still failed:", auth);
      process.exit(1);
    }
  }

  const token = auth.data.accessToken;
  console.log("Logged in as author@press.com");
  console.log("Creating posts...\n");

  for (const post of posts) {
    const result = await createPost(post, token);
    if (result.success) {
      console.log(`  ✓ "${post.title}"`);
    } else {
      console.log(`  ✗ "${post.title}" — ${result.message || "failed"}`);
    }
  }

  console.log("\nDone! Visit http://localhost:5000/news to see your posts.");
}

main().catch(console.error);
