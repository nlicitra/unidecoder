import { getPuzzles, getUserPuzzleFeed } from '$lib/server/puzzle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const userId = event.locals.user?.id;
  const puzzles = await (userId ? getUserPuzzleFeed(userId) : getPuzzles());
  return { user: event.locals.user, puzzles };
};

