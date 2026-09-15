import {
  mockProducts, mockShops, mockUsers, mockConversations, mockMessages, mockOrders,
  type Product, type Shop, type Profile, type Conversation, type Message, type Order,
} from "./mock-data"
import { db } from "./postgres"

const fallback = <T,>(value: T) => value

export async function getProducts(category?: string): Promise<Product[]> {
  if (!db) return fallback(category ? mockProducts.filter((p) => p.category === category) : mockProducts)
  const rows = await db`
    select p.*, row_to_json(s) as shop from products p
    left join shops s on s.id = p.shop_id
    where p.is_active = true ${category ? db`and p.category = ${category}` : db``}
    order by p.created_at desc
  `
  return rows as unknown as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!db) return mockProducts.find((p) => p.slug === slug) || null
  const rows = await db`select p.*, row_to_json(s) as shop from products p left join shops s on s.id = p.shop_id where p.slug = ${slug} limit 1`
  return (rows[0] as Product) || null
}

export async function getProductsByShop(shopId: string): Promise<Product[]> {
  if (!db) return mockProducts.filter((p) => p.shop_id === shopId)
  return await db`select p.*, row_to_json(s) as shop from products p left join shops s on s.id = p.shop_id where p.shop_id = ${shopId} and p.is_active = true order by p.created_at desc` as unknown as Product[]
}

export async function getShops(): Promise<Shop[]> {
  if (!db) return mockShops
  return await db`select s.*, s.shop_name as name, coalesce(s.location, '') as city, '' as country from shops s where s.is_active = true order by s.created_at desc` as unknown as Shop[]
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  if (!db) return mockShops.find((s) => s.slug === slug) || null
  const rows = await db`select s.*, s.shop_name as name, coalesce(s.location, '') as city, '' as country from shops s where s.slug = ${slug} limit 1`
  return (rows[0] as Shop) || null
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!db) return mockUsers.find((u) => u.id === userId) || null
  const rows = await db`select id, email, first_name, last_name, gender, birthdate, city, country, wallet_address, role, avatar_url, show_email, show_birthdate, created_at, updated_at from users where id = ${userId} limit 1`
  return (rows[0] as Profile) || null
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  if (!db) return mockConversations.filter((c) => c.buyer_id === userId || mockShops.find((s) => s.id === c.shop_id)?.owner_id === userId)
  return await db`
    select c.*, row_to_json(s) as shop, row_to_json(b) as buyer
    from conversations c join shops s on s.id = c.shop_id join users b on b.id = c.buyer_id
    where c.buyer_id = ${userId} or s.owner_id = ${userId} order by c.updated_at desc
  ` as unknown as Conversation[]
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (!db) return mockMessages.filter((m) => m.conversation_id === conversationId)
  return await db`select m.*, row_to_json(u) as sender from messages m join users u on u.id = m.sender_id where m.conversation_id = ${conversationId} order by m.created_at asc` as unknown as Message[]
}

export async function getOrders(userId: string): Promise<Order[]> {
  if (!db) return mockOrders.filter((o) => o.buyer_id === userId)
  return await db`select o.*, coalesce(json_agg(oi) filter (where oi.id is not null), '[]') as items from orders o left join order_items oi on oi.order_id = o.id where o.buyer_id = ${userId} group by o.id order by o.created_at desc` as unknown as Order[]
}

export async function getShopOrders(shopId: string): Promise<Order[]> {
  if (!db) return mockOrders.filter((o) => o.shop_id === shopId)
  return await db`select o.*, coalesce(json_agg(oi) filter (where oi.id is not null), '[]') as items from orders o left join order_items oi on oi.order_id = o.id where o.shop_id = ${shopId} group by o.id order by o.created_at desc` as unknown as Order[]
}


