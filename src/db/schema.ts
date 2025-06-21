import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    // TODO : add Banner field
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

const userRelations = relations(users, ({ many }) => ({
    videos: many(videos)
}));

export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => [uniqueIndex("name_idx").on(t.name)]);

const categoryRelations = relations(categories, ({ many }) => ({
    videos: many(videos)
}));

export const videos = pgTable("videos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    descrption: text("description"),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade",
    }).notNull(), // foreign key
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
    reatedAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// join 기능이 제공되는 SQL이라면 relation을 정의하지 않아도 됨 //
export const videoRelations = relations(videos, ({ one }) => ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id]
    })
}));