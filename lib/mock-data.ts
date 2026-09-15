// Mock data used when database is not connected
// Used as a local fallback when PostgreSQL is not configured.

export type Profile = {
  id: string
  email: string
  first_name: string
  last_name: string
  gender: string
  birthdate: string
  city: string
  country: string
  wallet_address: string
  role: "buyer" | "seller"
  avatar_url: string | null
  show_email: boolean
  show_birthdate: boolean
  created_at: string
  updated_at: string
}

export type Shop = {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string
  logo_url: string | null
  banner_url: string | null
  city: string
  country: string
  contact_number: string
  show_contact: boolean
  is_active: boolean
  created_at: string
  owner?: Profile
}

export type Product = {
  id: string
  shop_id: string
  name: string
  slug: string
  description: string
  price_ton: number
  price_usd: number
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  stock: number
  is_active: boolean
  created_at: string
  shop?: Shop
}

export type CartItem = {
  product: Product
  quantity: number
  size: string
  color: string
}

export type Order = {
  id: string
  buyer_id: string
  shop_id: string
  total_ton: number
  total_usd: number
  payment_method: string
  payment_status: string
  tx_hash: string | null
  status: string
  created_at: string
  items: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  size: string
  color: string
  price_ton: number
  product?: Product
}

export type Conversation = {
  id: string
  shop_id: string
  buyer_id: string
  created_at: string
  updated_at: string
  shop?: Shop
  buyer?: Profile
  last_message?: Message
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: Profile
}

// --- Mock Users ---
export const mockUsers: Profile[] = [
  {
    id: "seller-1",
    email: "amir@jorabmoon.com",
    first_name: "Amir",
    last_name: "Tehrani",
    gender: "male",
    birthdate: "1990-05-14",
    city: "Tehran",
    country: "Iran",
    wallet_address: "EQD...seller1",
    role: "seller",
    avatar_url: null,
    show_email: true,
    show_birthdate: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "seller-2",
    email: "sara@sockart.com",
    first_name: "Sara",
    last_name: "Morad",
    gender: "female",
    birthdate: "1993-09-21",
    city: "Istanbul",
    country: "Turkey",
    wallet_address: "EQD...seller2",
    role: "seller",
    avatar_url: null,
    show_email: true,
    show_birthdate: false,
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "buyer-1",
    email: "alex@gmail.com",
    first_name: "Alex",
    last_name: "Chen",
    gender: "male",
    birthdate: "1995-03-12",
    city: "Dubai",
    country: "UAE",
    wallet_address: "EQD...buyer1",
    role: "buyer",
    avatar_url: null,
    show_email: true,
    show_birthdate: true,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
]

// --- Mock Shops ---
export const mockShops: Shop[] = [
  {
    id: "shop-1",
    owner_id: "seller-1",
    name: "Jorab Moon Official",
    slug: "jorab-moon-official",
    description: "The original Jorab Moon store. Artistic socks for creative souls, handcrafted with premium materials and bold designs inspired by contemporary art.",
    logo_url: null,
    banner_url: null,
    city: "Tehran",
    country: "Iran",
    contact_number: "+98 912 345 6789",
    show_contact: true,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    owner: mockUsers[0],
  },
  {
    id: "shop-2",
    owner_id: "seller-2",
    name: "Sock Art Studio",
    slug: "sock-art-studio",
    description: "Premium hand-designed socks from Istanbul. Where Turkish craftsmanship meets modern sock art.",
    logo_url: null,
    banner_url: null,
    city: "Istanbul",
    country: "Turkey",
    contact_number: "+90 555 123 4567",
    show_contact: false,
    is_active: true,
    created_at: "2024-02-15T00:00:00Z",
    owner: mockUsers[1],
  },
]

// --- Mock Products ---
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    shop_id: "shop-1",
    name: "Midnight Pattern",
    slug: "midnight-pattern",
    description: "Elegant black socks with intricate geometric patterns. Premium combed cotton blend for ultimate comfort.",
    price_ton: 2.5,
    price_usd: 24.99,
    images: ["/black-patterned-socks-on-pink-background.jpg"],
    category: "Geometric",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    stock: 50,
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    shop: mockShops[0],
  },
  {
    id: "prod-2",
    shop_id: "shop-1",
    name: "Sunset Orange",
    slug: "sunset-orange",
    description: "Bold orange socks that make a statement. Crafted with breathable fabric for all-day wear.",
    price_ton: 2.3,
    price_usd: 22.99,
    images: ["/vibrant-orange-socks-artistic-photo.jpg"],
    category: "Solid",
    sizes: ["S", "M", "L"],
    colors: ["Orange", "Coral"],
    stock: 35,
    is_active: true,
    created_at: "2024-01-20T00:00:00Z",
    shop: mockShops[0],
  },
  {
    id: "prod-3",
    shop_id: "shop-1",
    name: "Electric Blue",
    slug: "electric-blue",
    description: "Vibrant blue with playful patterns. A conversation starter for your feet.",
    price_ton: 2.5,
    price_usd: 24.99,
    images: ["/bright-blue-patterned-socks-lifestyle.jpg"],
    category: "Patterned",
    sizes: ["M", "L", "XL"],
    colors: ["Blue", "Teal"],
    stock: 42,
    is_active: true,
    created_at: "2024-02-01T00:00:00Z",
    shop: mockShops[0],
  },
  {
    id: "prod-4",
    shop_id: "shop-1",
    name: "Cherry Red",
    slug: "cherry-red",
    description: "Classic red with modern twist. Reinforced heel and toe for durability.",
    price_ton: 2.4,
    price_usd: 23.99,
    images: ["/red-socks-on-colorful-background.jpg"],
    category: "Classic",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Burgundy"],
    stock: 60,
    is_active: true,
    created_at: "2024-02-10T00:00:00Z",
    shop: mockShops[0],
  },
  {
    id: "prod-5",
    shop_id: "shop-2",
    name: "Forest Green",
    slug: "forest-green",
    description: "Nature-inspired green tones from Istanbul. Organic cotton blend.",
    price_ton: 2.5,
    price_usd: 24.99,
    images: ["/green-striped-socks-artistic.jpg"],
    category: "Nature",
    sizes: ["M", "L"],
    colors: ["Green", "Olive"],
    stock: 28,
    is_active: true,
    created_at: "2024-03-01T00:00:00Z",
    shop: mockShops[1],
  },
  {
    id: "prod-6",
    shop_id: "shop-2",
    name: "Lavender Dream",
    slug: "lavender-dream",
    description: "Soft lavender with delicate details. Turkish craftsmanship at its finest.",
    price_ton: 2.6,
    price_usd: 25.99,
    images: ["/purple-lavender-socks-lifestyle-photo.jpg"],
    category: "Delicate",
    sizes: ["S", "M", "L"],
    colors: ["Lavender", "Purple"],
    stock: 20,
    is_active: true,
    created_at: "2024-03-10T00:00:00Z",
    shop: mockShops[1],
  },
  {
    id: "prod-7",
    shop_id: "shop-1",
    name: "Golden Weave",
    slug: "golden-weave",
    description: "Luxurious golden-threaded socks for special occasions. Limited edition.",
    price_ton: 3.5,
    price_usd: 34.99,
    images: ["/colorful-patterned-socks-close-up.jpg"],
    category: "Premium",
    sizes: ["M", "L", "XL"],
    colors: ["Gold", "Cream"],
    stock: 15,
    is_active: true,
    created_at: "2024-04-01T00:00:00Z",
    shop: mockShops[0],
  },
  {
    id: "prod-8",
    shop_id: "shop-2",
    name: "Ocean Wave",
    slug: "ocean-wave",
    description: "Inspired by the Bosphorus waves. Seamless toe construction for extra comfort.",
    price_ton: 2.8,
    price_usd: 27.99,
    images: ["/artistic-socks-on-feet-lifestyle.jpg"],
    category: "Nature",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Aqua"],
    stock: 33,
    is_active: true,
    created_at: "2024-04-15T00:00:00Z",
    shop: mockShops[1],
  },
]

// --- Mock Conversations ---
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    shop_id: "shop-1",
    buyer_id: "buyer-1",
    created_at: "2024-05-01T10:00:00Z",
    updated_at: "2024-05-01T10:15:00Z",
    shop: mockShops[0],
    buyer: mockUsers[2],
    last_message: {
      id: "msg-3",
      conversation_id: "conv-1",
      sender_id: "seller-1",
      content: "Yes! We accept TON, TonKeeper, and Telegram Stars. I can also accept USD via chat if you prefer.",
      created_at: "2024-05-01T10:15:00Z",
    },
  },
]

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "buyer-1",
    content: "Hi! I love the Midnight Pattern socks. Do you ship to Dubai?",
    created_at: "2024-05-01T10:00:00Z",
    sender: mockUsers[2],
  },
  {
    id: "msg-2",
    conversation_id: "conv-1",
    sender_id: "seller-1",
    content: "Hello Alex! Yes, we ship worldwide. Delivery to Dubai takes about 5-7 business days.",
    created_at: "2024-05-01T10:05:00Z",
    sender: mockUsers[0],
  },
  {
    id: "msg-3",
    conversation_id: "conv-1",
    sender_id: "buyer-1",
    content: "Great! Can I pay with TON crypto?",
    created_at: "2024-05-01T10:10:00Z",
    sender: mockUsers[2],
  },
  {
    id: "msg-4",
    conversation_id: "conv-1",
    sender_id: "seller-1",
    content: "Yes! We accept TON, TonKeeper, and Telegram Stars. I can also accept USD via chat if you prefer.",
    created_at: "2024-05-01T10:15:00Z",
    sender: mockUsers[0],
  },
]

// --- Mock Orders ---
export const mockOrders: Order[] = [
  {
    id: "order-1",
    buyer_id: "buyer-1",
    shop_id: "shop-1",
    total_ton: 4.8,
    total_usd: 47.98,
    payment_method: "tonkeeper",
    payment_status: "completed",
    tx_hash: "0xabc123...def456",
    status: "shipped",
    created_at: "2024-05-02T14:00:00Z",
    items: [
      {
        id: "oi-1",
        order_id: "order-1",
        product_id: "prod-1",
        quantity: 1,
        size: "M",
        color: "Black",
        price_ton: 2.5,
        product: mockProducts[0],
      },
      {
        id: "oi-2",
        order_id: "order-1",
        product_id: "prod-2",
        quantity: 1,
        size: "M",
        color: "Orange",
        price_ton: 2.3,
        product: mockProducts[1],
      },
    ],
  },
]
