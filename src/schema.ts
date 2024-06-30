import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable("urls", {
    id: integer("id").primaryKey(),
    url: text("url").notNull(),
    desc: text("desc").notNull(),
    created_at: text("created_at").notNull(),
    perm: integer("perm").notNull(),
});

