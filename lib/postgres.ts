import postgres from "postgres"

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

export const db = connectionString
  ? postgres(connectionString, {
      max: Number(process.env.POSTGRES_MAX_CONNECTIONS || 10),
      ssl: process.env.POSTGRES_SSL === "disable" ? false : "require",
    })
  : null
