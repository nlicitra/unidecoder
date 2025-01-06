import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    age: integer('age'),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull()
});

export const session = pgTable("session", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export const puzzle = pgTable('puzzle', {
    id: text("id").primaryKey(),
    glyphs: text("glyphs").notNull().unique(),
    solution: text("solution").notNull().unique(),
    createdBy: text("created_by").notNull().references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export type Puzzle = typeof puzzle.$inferSelect;

export const puzzleCompletion = pgTable('puzzle_completion', {
    puzzleId: text("puzzle_id").notNull().references(() => puzzle.id),
    completedBy: text("completed_by").notNull().references(() => user.id),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export type PuzzleCompletion = typeof puzzleCompletion.$inferSelect;
