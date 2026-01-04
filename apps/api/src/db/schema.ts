import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const projects = sqliteTable("projects", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    category: text("category").notNull(),
    summary: text("summary").notNull(),
    content_markdown: text("content_markdown").notNull(),
    thumbnail_url: text("thumbnail_url").notNull(),
    external_link: text("external_link"),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
