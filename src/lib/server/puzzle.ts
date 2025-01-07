import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import short from "short-uuid";

function deserialize(dbPuzzle: table.Puzzle, dbUser: table.User): Puzzle {
  return {
    ...dbPuzzle,
    glyphs: dbPuzzle.glyphs.split(","),
    createdBy: { id: dbUser.id, username: dbUser.username },
    createdAt: dbPuzzle.createdAt!
  };
}

export async function getPuzzleById(id: string): Promise<Puzzle | null> {
  const [result] = await db
    .select({
      user: table.user,
      puzzle: table.puzzle,
    })
    .from(table.puzzle)
    .innerJoin(table.user, eq(table.puzzle.createdBy, table.user.id))
    .where(eq(table.puzzle.id, id));

  if (!result) {
    return null;
  }
  const { puzzle, user } = result;

  return deserialize(puzzle, user);
}

export async function getUserPuzzleFeed(userId: string): Promise<Puzzle[]> {
  const results = await db
    .select({
      creator: table.user,
      puzzle: table.puzzle,
      completion: table.puzzleCompletion.completedAt,
    })
    .from(table.puzzle)
    .innerJoin(table.user, eq(table.puzzle.createdBy, table.user.id))
    .leftJoin(table.puzzleCompletion, and(eq(table.puzzleCompletion.completedBy, userId), eq(table.puzzleCompletion.puzzleId, table.puzzle.id)))


  return results.map(({ puzzle, creator, completion }) => ({
    ...deserialize(puzzle, creator),
    completion: completion || undefined,
  }));
}

export async function getUserPuzzles(userId: string): Promise<Puzzle[]> {
  const results = await db
    .select({
      puzzle: table.puzzle,
      user: table.user,
    })
    .from(table.puzzle)
    .innerJoin(table.user, eq(table.puzzle.createdBy, table.user.id))
    .where(eq(table.puzzle.createdBy, userId));

  return results.map(({ puzzle, user }) => deserialize(puzzle, user));
}

interface DBQueryParams {
  offset?: number;
  limit?: number;
}
export async function getPuzzles(params: DBQueryParams = {}): Promise<Puzzle[]> {
  const results = await db
    .select({
      puzzle: table.puzzle,
      user: table.user,
    })
    .from(table.puzzle)
    .innerJoin(table.user, eq(table.puzzle.createdBy, table.user.id))
    .orderBy(table.puzzle.createdAt)
    .limit(params.limit ?? 10)
    .offset(params.offset ?? 0);

  return results.map(({ puzzle, user }) => deserialize(puzzle, user));
}

function splitGlyphs(str: string) {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return [...segmenter.segment(str)].map(segment => segment.segment);
}

export async function createPuzzle(glyphs: string, solution: string, userId: string): Promise<string> {
  const id = short.generate();
  const csvGlyphs = splitGlyphs(glyphs).join(",");
  await db.insert(table.puzzle).values({ id, glyphs: csvGlyphs, solution, createdBy: userId });
  return id;
}

export async function deletePuzzle(puzzleId: string) {
  await db.delete(table.puzzleCompletion).where(eq(table.puzzleCompletion.puzzleId, puzzleId));
  return db.delete(table.puzzle).where(eq(table.puzzle.id, puzzleId));
}

export async function registerPuzzleCompletion(puzzleId: string, userId: string) {
  return db.insert(table.puzzleCompletion).values({ puzzleId, completedBy: userId });
}

export async function getPuzzleCompletion(puzzleId: string, userId: string) {
  const [result] = await db
    .select({
      completion: table.puzzleCompletion.completedAt
    })
    .from(table.puzzleCompletion)
    .where(and(eq(table.puzzleCompletion.puzzleId, puzzleId), eq(table.puzzleCompletion.completedBy, userId)));

  if (!result) {
    return null;
  }
  const { completion } = result;
  return completion;
}
