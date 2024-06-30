import { desc, not } from "drizzle-orm";
import { sqliteTable, text, integer,blob } from "drizzle-orm/sqlite-core";

export const  urls = sqliteTable("urls", {
    id: integer("id").primaryKey(),
    url: text("url").notNull(),
    description: text("description").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    parm: text("parm").notNull(),
})