import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // clearId
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

//Relations define how tables connect to each other. This enables Drizzle's query API to automatically join related data when using 'with:{relationName:true}'

//User can have many products and many comments
export const userRelations = relations(users, ({ many }) => ({
  product: many(products), //one user -> many products
  comment: many(comments), //one user -> many products
}));

//products belong to one user and can have many many comments
export const productRelations = relations(products, ({ one, many }) => ({
  //'fields' = the foreign key column in THIS table (product.userId)
  //'references'=the primary key column in the RELATED table (users.id)
  user: one(users, { fields: [products.userId], references: [users.id] }),
  comment: many(comments),
}));

//comment belongs to one product and one user
export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
}));
