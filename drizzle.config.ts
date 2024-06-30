import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "sqlite", // "postgresql" | "mysql"
    driver: "turso",
    schema:"./src/schema.ts"
})