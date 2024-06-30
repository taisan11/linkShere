import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "./schema";
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
  const result = await db.select().from(todos).all();
  return c.json(result);
});

/**
 * create todo
 */
app.post("/todos", async (c) => {
  const params = await c.req.json<typeof todos.$inferSelect>();
  const db = drizzle(c.env.DB);
  const result = await db
    .insert(todos)
    .values({ title: params.title })
    .execute();
  return c.json(result);
});

/**
 * update todo
 */
app.put("/todos/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "invalid ID" }, 400);
  }

  const params = await c.req.json<typeof todos.$inferSelect>();
  const db = drizzle(c.env.DB);
  const result = await db
    .update(todos)
    .set({ title: params.title, status: params.status })
    .where(eq(todos.id, id));
  return c.json(result);
});

/**
 * delete todo
 */
app.delete("/todos/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "invalid ID" }, 400);
  }

  const db = drizzle(c.env.DB);
  const result = await db.delete(todos).where(eq(todos.id, id));
  return c.json(result);
});

export default app;

