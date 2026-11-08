const connectDatabase = require("../config/database");
const { Product, Review } = require("../models");

const products = [
  {
    name: "Velvet Matte Rouge Lipstick",
    sku: "LX-LIP-001",
    description:
      "A rich, velvety matte lipstick infused with jojoba oil and vitamin E for long-lasting, hydrating color that glides on smoothly without drying.",
    price: 1499,
    category: "Lipstick",
    Stock: 33,
    variants: [
      { id: "v1", sku: "LX-LIP-001-RR", shade: "Ruby Rouge", hexColor: "#9f1239", price: 1499, stock: 15 },
      { id: "v2", sku: "LX-LIP-001-NP", shade: "Nude Petal", hexColor: "#be7c68", price: 1499, stock: 10 },
      { id: "v3", sku: "LX-LIP-001-VP", shade: "Velvet Plum", hexColor: "#581c87", price: 1599, stock: 8 },
    ],
    images: [
      {
        public_id: "luxe_lipstick_1",
        url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Aria Sharma", rating: 5, comment: "Hands down the best matte lipstick I've used. Doesn't flake or dry my lips at all!" },
      { name: "Pooja Patel", rating: 5, comment: "The shade is gorgeous and stays put even after meals." },
      { name: "Sneha Roy", rating: 4, comment: "Very pigmented and creamy, highly recommended." },
    ],
  },
  {
    name: "Luminous Silk Liquid Foundation",
    sku: "LX-FND-002",
    description:
      "Weightless, medium-to-full buildable coverage with a natural radiant finish. Formulated with hyaluronic acid for 24-hour hydration.",
    price: 2999,
    category: "Foundation",
    Stock: 26,
    variants: [
      { id: "f1", sku: "LX-FND-002-F1", shade: "Fair Porcelain", hexColor: "#f6ede0", price: 2999, stock: 8 },
      { id: "f2", sku: "LX-FND-002-M1", shade: "Medium Warm", hexColor: "#e3bf9a", price: 2999, stock: 12 },
      { id: "f3", sku: "LX-FND-002-D1", shade: "Deep Caramel", hexColor: "#9e6f47", price: 2999, stock: 6 },
    ],
    images: [
      {
        public_id: "luxe_foundation_1",
        url: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Saman Peramuna", rating: 5, comment: "Feels like second skin! Glowy without looking greasy." },
      { name: "Sakith Liyanage", rating: 4, comment: "Matches my undertone perfectly. Great buildable coverage." },
    ],
  },
  {
    name: "Golden Sunset Eyeshadow Palette",
    sku: "LX-EYE-003",
    description:
      "12 highly pigmented warm neutral and shimmer shades designed for seamless blending from daytime subtle to evening glam.",
    price: 2499,
    category: "Eyeshadow",
    Stock: 15,
    variants: [
      { id: "e1", sku: "LX-EYE-003-WN", shade: "Warm Neutrals", hexColor: "#c28153", price: 2499, stock: 10 },
      { id: "e2", sku: "LX-EYE-003-RG", shade: "Rose Gold Luxe", hexColor: "#b76e79", price: 2699, stock: 5 },
    ],
    images: [
      {
        public_id: "luxe_eyeshadow_1",
        url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Deepa Reddy", rating: 5, comment: "Zero fallout, ultra blendable shimmers. Worth every rupee." },
      { name: "Ananya Das", rating: 5, comment: "My everyday go-to palette now!" },
    ],
  },
  {
    name: "Lash Luxe Volume & Length Mascara",
    description:
      "Intense black carbon formula with an hourglass brush that lifts, thickens, and curls every single lash without clumping or smudging.",
    price: 1199,
    category: "Mascara",
    Stock: 30,
    images: [
      {
        public_id: "luxe_mascara_1",
        url: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Meera Nair", rating: 5, comment: "Gives false-lash effect in just two coats!" },
      { name: "Sanya Gupta", rating: 4, comment: "Smudge-proof all day long even in humid weather." },
    ],
  },
  {
    name: "Soft Radiance Powder Blush",
    description:
      "Silky, micro-milled powder blush that imparts a healthy, natural flush with a soft luminous sheen.",
    price: 1299,
    category: "Blush",
    Stock: 20,
    images: [
      {
        public_id: "luxe_blush_1",
        url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Ishita Rao", rating: 5, comment: "Very subtle yet buildable. Gives that fresh post-workout glow." },
      { name: "Tanvi Kapoor", rating: 4, comment: "Blends seamlessly into the skin." },
    ],
  },
  {
    name: "Hydra-Glow Vitamin C Face Serum",
    description:
      "Potent 15% Vitamin C and Niacinamide serum that brightens dark spots, refines skin texture, and restores radiant youthful vitality.",
    price: 2199,
    category: "Skincare",
    Stock: 22,
    images: [
      {
        public_id: "luxe_serum_1",
        url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Divya Verma", rating: 5, comment: "My skin tone cleared up noticeably in 2 weeks!" },
      { name: "Pooja Bose", rating: 5, comment: "Lightweight and absorbs instantly without tackiness." },
    ],
  },
  {
    name: "Rose Petal Eau de Parfum",
    description:
      "An intoxicating blend of fresh Bulgarian rose, French jasmine, and subtle amberwood. A sophisticated, long-lasting signature scent.",
    price: 4599,
    category: "Fragrance",
    Stock: 12,
    images: [
      {
        public_id: "luxe_perfume_1",
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Nisha Singhania", rating: 5, comment: "Got so many compliments at a wedding party. Smells truly luxurious." },
      { name: "Ayesha Khan", rating: 5, comment: "Lasts easily 10+ hours on clothes." },
    ],
  },
  {
    name: "Glass Shine Hydrating Lip Gloss",
    description:
      "Non-sticky, ultra-reflective glossy finish packed with peptides and shea butter for visibly plump, cushiony soft lips.",
    price: 899,
    category: "Lipstick",
    Stock: 35,
    images: [
      {
        public_id: "luxe_lipgloss_1",
        url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Shreya Joshi", rating: 5, comment: "Not sticky at all! Perfect shine over lipstick." },
      { name: "Simran Kaur", rating: 4, comment: "Very moisturizing and looks like glass." },
    ],
  },
  {
    name: "Ultra-HD Translucent Setting Powder",
    description:
      "Microfine invisible powder that sets makeup for 16 hours, blurs fine lines and pores with zero flashback in photography.",
    price: 1799,
    category: "Foundation",
    Stock: 24,
    images: [
      {
        public_id: "luxe_powder_1",
        url: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Aditi Ghosh", rating: 5, comment: "Keeps my T-zone matte the entire work day." },
    ],
  },
  {
    name: "Midnight Recovery Night Cream",
    description:
      "Rich nourishing peptide cream that repairs the skin barrier overnight, leaving you with plump, deeply restored skin by morning.",
    price: 2799,
    category: "Skincare",
    Stock: 16,
    images: [
      {
        public_id: "luxe_nightcream_1",
        url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Natasha Roy", rating: 5, comment: "Woke up with baby soft skin. Smells calming too." },
    ],
  },
  {
    name: "Sculpt & Glow Dual Contour Stick",
    description:
      "Creamy double-ended stick for effortless sculpting and highlighting. Glides on smoothly and melts into skin for natural definition.",
    price: 1399,
    category: "Blush",
    Stock: 28,
    images: [
      {
        public_id: "luxe_contour_1",
        url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Bhavna Jain", rating: 5, comment: "So beginner friendly and easy to blend with fingers or sponge." },
    ],
  },
  {
    name: "Pure Vanilla Musk Fragrance Oil",
    description:
      "Warm Madagascar vanilla beans wrapped in soft white musk and warm cedar. Concentrated alcohol-free roll-on with all-day scent.",
    price: 3499,
    category: "Fragrance",
    Stock: 14,
    images: [
      {
        public_id: "luxe_vanilla_1",
        url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
      },
    ],
    reviews: [
      { name: "Pallavi Iyer", rating: 5, comment: "The warmest, coziest vanilla ever. Stays on skin all day." },
    ],
  },
];

async function seed() {
  try {
    await connectDatabase();

    console.log("Cleaning old product seed data...");
    await Review.destroy({ where: {} });
    await Product.destroy({ where: {} });

    console.log("Seeding products...");
    for (const item of products) {
      const { reviews, ...prodData } = item;

      // Calculate rating
      let totalRating = 0;
      reviews.forEach((r) => (totalRating += r.rating));
      prodData.ratings = reviews.length > 0 ? totalRating / reviews.length : 0;
      prodData.numOfReviews = reviews.length;

      const product = await Product.create(prodData);

      for (const rev of reviews) {
        await Review.create({
          productId: product.id,
          name: rev.name,
          rating: rev.rating,
          comment: rev.comment,
        });
      }

      console.log(`✓ Added ${product.name} (${product.category})`);
    }

    console.log(`\nSuccessfully seeded ${products.length} makeup products!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
