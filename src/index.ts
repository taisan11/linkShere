import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { urls } from "./schema";
import { eq } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.text("Hello Hono!"));

/**
 * todos
 */
app.get("/todos", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(urls).all();
  return c.json(result);
});