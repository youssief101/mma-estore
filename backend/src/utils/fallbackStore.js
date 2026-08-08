const mockBrands = [
  {
    _id: "650000000000000000000001",
    name: "UFC",
    slug: "ufc",
    logo: "/logos/logo.png",
    isActive: true,
  },
  {
    _id: "650000000000000000000002",
    name: "Venum",
    slug: "venum",
    logo: "/logos/logo.png",
    isActive: true,
  },
];

const mockDepartments = [
  {
    _id: "650000000000000000000011",
    name: "Men",
    slug: "men",
    description: "Men's MMA Apparel and Equipment",
    isActive: true,
  },
  {
    _id: "650000000000000000000012",
    name: "Women",
    slug: "women",
    description: "Women's MMA Apparel and Equipment",
    isActive: true,
  },
  {
    _id: "650000000000000000000013",
    name: "Gear",
    slug: "gear",
    description: "Pro Training Gear and Fight Equipment",
    isActive: true,
  },
];

const mockCategories = [
  {
    _id: "650000000000000000000021",
    name: "Gloves",
    slug: "gloves",
    description: "Official Fight & Training Gloves",
    image: "/images/gloves-category.jpg",
    isActive: true,
  },
  {
    _id: "650000000000000000000022",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Graphic & Walkout Apparel",
    image: "/images/t-shirt-category.jpg",
    isActive: true,
  },
  {
    _id: "650000000000000000000023",
    name: "Belts",
    slug: "belts",
    description: "Championship Replica Belts",
    image: "/images/belts-category.jpg",
    isActive: true,
  },
  {
    _id: "650000000000000000000024",
    name: "Leggings",
    slug: "leggings",
    description: "Compression Fight Leggings",
    image: "/images/leggins-category.jpg",
    isActive: true,
  },
  {
    _id: "650000000000000000000025",
    name: "Hats",
    slug: "hats",
    description: "Headwear & Caps",
    image: "/images/hats-category.jpg",
    isActive: true,
  },
  {
    _id: "650000000000000000000026",
    name: "Accessories",
    slug: "accessories",
    description: "Wraps, Bags & Accessories",
    image: "/images/accessories-category.jpg",
    isActive: true,
  },
];

const mockFighters = [
  {
    _id: "650000000000000000000031",
    firstName: "Islam",
    lastName: "Makhachev",
    nickname: "P4P King",
    slug: "islam-makhachev",
    gender: "MALE",
    weightClass: "Lightweight",
    ranking: 1,
    country: "Russia",
    image: "/fighters/islam.png",
    champion: true,
    isActive: true,
  },
  {
    _id: "650000000000000000000032",
    firstName: "Justin",
    lastName: "Gaethje",
    nickname: "The Highlight",
    slug: "justin-gaethje",
    gender: "MALE",
    weightClass: "Lightweight",
    ranking: 2,
    country: "USA",
    image: "/fighters/gaethje.png",
    champion: false,
    isActive: true,
  },
  {
    _id: "650000000000000000000033",
    firstName: "Alexandre",
    lastName: "Pantoja",
    nickname: "The Cannibal",
    slug: "alexandre-pantoja",
    gender: "MALE",
    weightClass: "Flyweight",
    ranking: 1,
    country: "Brazil",
    image: "/fighters/pantoja.png",
    champion: true,
    isActive: true,
  },
  {
    _id: "650000000000000000000034",
    firstName: "Alexander",
    lastName: "Volkanovski",
    nickname: "The Great",
    slug: "alexander-volkanovski",
    gender: "MALE",
    weightClass: "Featherweight",
    ranking: 1,
    country: "Australia",
    image: "/fighters/volkanovski.png",
    champion: false,
    isActive: true,
  },
  {
    _id: "650000000000000000000035",
    firstName: "Diego",
    lastName: "Prates",
    nickname: "The Machine",
    slug: "diego-prates",
    gender: "MALE",
    weightClass: "Welterweight",
    ranking: 5,
    country: "Brazil",
    image: "/fighters/prates.png",
    champion: false,
    isActive: true,
  },
];

const mockEvents = [
  {
    _id: "650000000000000000000041",
    name: "UFC 300",
    slug: "ufc-300",
    eventDate: "2025-04-13T00:00:00.000Z",
    location: "Las Vegas, NV",
    isActive: true,
  },
];

const mockProducts = [
  {
    _id: "650000000000000000000051",
    productCode: 1001,
    name: "UFC Official Fight Gloves 4oz",
    slug: "ufc-official-fight-gloves-4oz",
    brandID: mockBrands[0],
    categoryID: mockCategories[0],
    departmentID: mockDepartments[2],
    fighterID: mockFighters[0],
    eventID: mockEvents[0],
    description: "Official 4oz competition fight gloves used in championship bouts.",
    price: 129.99,
    oldPrice: 149.99,
    discountPercentage: 13,
    onSale: true,
    audience: "MEN",
    images: [{ url: "/images/gloves-category.jpg", isPrimary: true }],
    inventory: {
      totalStock: 50,
      variants: [
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
      ],
    },
    specifications: [
      { key: "Material", value: "Genuine Leather" },
      { key: "Weight", value: "4oz" },
    ],
    display: {
      featured: true,
      trending: true,
      championGear: true,
      newArrival: true,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "650000000000000000000052",
    productCode: 1002,
    name: "UFC Makhachev Champion Walkout Tee",
    slug: "ufc-makhachev-champion-walkout-tee",
    brandID: mockBrands[0],
    categoryID: mockCategories[1],
    departmentID: mockDepartments[0],
    fighterID: mockFighters[0],
    eventID: mockEvents[0],
    description: "Official Walkout T-Shirt for Lightweight Champion Islam Makhachev.",
    price: 39.99,
    oldPrice: 49.99,
    discountPercentage: 20,
    onSale: true,
    audience: "MEN",
    images: [{ url: "/products/t-shirts/t-shirt1.png", isPrimary: true }],
    inventory: {
      totalStock: 100,
      variants: [
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
      ],
    },
    specifications: [{ key: "Material", value: "100% Premium Cotton" }],
    display: {
      featured: true,
      trending: true,
      championGear: true,
      newArrival: true,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "650000000000000000000053",
    productCode: 1003,
    name: "UFC Legacy Championship Belt Replica",
    slug: "ufc-legacy-championship-belt-replica",
    brandID: mockBrands[0],
    categoryID: mockCategories[2],
    departmentID: mockDepartments[2],
    fighterID: mockFighters[2],
    eventID: mockEvents[0],
    description: "Full-size authentic replica of the official UFC Championship Belt.",
    price: 649.99,
    oldPrice: 699.99,
    discountPercentage: 7,
    onSale: false,
    audience: "UNISEX",
    images: [{ url: "/images/belts-category.jpg", isPrimary: true }],
    inventory: {
      totalStock: 10,
      variants: [{ size: "L", stock: 10 }],
    },
    specifications: [
      { key: "Plating", value: "Gold & Zinc Alloy" },
      { key: "Weight", value: "10 lbs" },
    ],
    display: {
      featured: true,
      trending: true,
      championGear: true,
      newArrival: false,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "650000000000000000000054",
    productCode: 1004,
    name: "Gaethje Highlight Graphic Tee",
    slug: "gaethje-highlight-graphic-tee",
    brandID: mockBrands[0],
    categoryID: mockCategories[1],
    departmentID: mockDepartments[0],
    fighterID: mockFighters[1],
    eventID: mockEvents[0],
    description: "Custom graphic T-shirt honoring 'The Highlight' Justin Gaethje.",
    price: 34.99,
    oldPrice: null,
    discountPercentage: 0,
    onSale: false,
    audience: "MEN",
    images: [{ url: "/products/t-shirts/t-shirt2.png", isPrimary: true }],
    inventory: {
      totalStock: 80,
      variants: [{ size: "L", stock: 80 }],
    },
    specifications: [{ key: "Material", value: "Cotton Blend" }],
    display: {
      featured: true,
      trending: true,
      championGear: false,
      newArrival: true,
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockUser = {
  _id: "650000000000000000000099",
  username: "ufcfan",
  email: "customer@mma.com",
  firstName: "UFC",
  lastName: "Fan",
  phone: "+1 555-0199",
  role: "Customer",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  addresses: []
};

const bcrypt = require("bcryptjs");

const memoryUsers = new Map();
const userPasswordHashes = new Map();

// Default seed passwords
userPasswordHashes.set("customer@mma.com", {
  plainPassword: "password123",
  passwordHash: bcrypt.hashSync("password123", 10)
});
userPasswordHashes.set("admin@mma.com", {
  plainPassword: "admin123",
  passwordHash: bcrypt.hashSync("admin123", 10)
});

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function verifyUserPassword(email, inputPassword) {
  const normEmail = normalizeEmail(email);
  if (!normEmail || !inputPassword) return false;

  const record = userPasswordHashes.get(normEmail);
  if (record) {
    if (record.plainPassword && (inputPassword === record.plainPassword || inputPassword.trim() === record.plainPassword)) {
      return true;
    }
    if (record.passwordHash && bcrypt.compareSync(inputPassword, record.passwordHash)) {
      return true;
    }
    if (record.passwordHash && bcrypt.compareSync(inputPassword.trim(), record.passwordHash)) {
      return true;
    }
  }

  // Fallback defaults if not set in map yet
  if (normEmail === "customer@mma.com") {
    return inputPassword === "password123" || inputPassword.trim() === "password123";
  }
  if (normEmail === "admin@mma.com") {
    return inputPassword === "admin123" || inputPassword.trim() === "admin123";
  }

  return false;
}

function setStoredUserPassword(email, newPasswordHash, newPlainPassword) {
  const normEmail = normalizeEmail(email);
  if (!normEmail) return;
  userPasswordHashes.set(normEmail, {
    passwordHash: newPasswordHash || bcrypt.hashSync(newPlainPassword || "", 10),
    plainPassword: newPlainPassword || ""
  });
}

function getFallbackUser(email) {
  const normEmail = normalizeEmail(email);
  if (memoryUsers.has(normEmail)) {
    return memoryUsers.get(normEmail);
  }
  if (normEmail === "customer@mma.com") {
    return mockUser;
  }
  if (normEmail === "admin@mma.com") {
    return {
      ...mockUser,
      _id: "650000000000000000000088",
      username: "adminuser",
      email: "admin@mma.com",
      firstName: "Admin",
      lastName: "User",
      role: "Admin"
    };
  }
  return null;
}

function registerFallbackUser(userData) {
  const normEmail = normalizeEmail(userData.email);
  const userObj = {
    _id: "650000000000" + Date.now().toString().slice(-12),
    username: (userData.username || "").trim().toLowerCase(),
    email: normEmail,
    firstName: (userData.firstName || "").trim(),
    lastName: (userData.lastName || "").trim(),
    phone: userData.phone || "",
    role: userData.role || "Customer",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    addresses: []
  };
  memoryUsers.set(normEmail, userObj);
  if (userData.password) {
    setStoredUserPassword(normEmail, bcrypt.hashSync(userData.password, 10), userData.password);
  }
  return userObj;
}

const mockGiftCards = [
  { _id: 'gc1', code: 'GIFT-25', amount: 25, isActive: true, createdAt: new Date() },
  { _id: 'gc2', code: 'GIFT-50', amount: 50, isActive: true, createdAt: new Date() },
  { _id: 'gc3', code: 'GIFT-100', amount: 100, isActive: true, createdAt: new Date() },
  { _id: 'gc4', code: 'MMA25', amount: 25, isActive: true, createdAt: new Date() },
  { _id: 'gc5', code: 'MMA50', amount: 50, isActive: true, createdAt: new Date() },
  { _id: 'gc6', code: 'MMA100', amount: 100, isActive: true, createdAt: new Date() }
];

function addFallbackGiftCard(cardData) {
  const card = {
    _id: 'gc_' + Date.now(),
    code: (cardData.code || '').toUpperCase().trim(),
    amount: Number(cardData.amount) || 0,
    expirationDate: cardData.expirationDate ? new Date(cardData.expirationDate) : null,
    isActive: true,
    recipientEmail: cardData.recipientEmail || '',
    recipientName: cardData.recipientName || '',
    senderName: cardData.senderName || '',
    message: cardData.message || '',
    createdAt: new Date()
  };
  mockGiftCards.unshift(card);
  return card;
}

function getFallbackGiftCard(code) {
  const norm = (code || '').toUpperCase().trim();
  return mockGiftCards.find(g => g.code === norm);
}

module.exports = {
  mockBrands,
  mockDepartments,
  mockCategories,
  mockFighters,
  mockEvents,
  mockProducts,
  mockUser,
  mockGiftCards,
  addFallbackGiftCard,
  getFallbackGiftCard,
  memoryUsers,
  userPasswordHashes,
  verifyUserPassword,
  setStoredUserPassword,
  getFallbackUser,
  registerFallbackUser
};
