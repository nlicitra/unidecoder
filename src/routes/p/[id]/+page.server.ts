import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { deletePuzzle, getPuzzleById, getPuzzleCompletion, registerPuzzleCompletion } from '$lib/server/puzzle';

export const load: PageServerLoad = async ({ params, locals }) => {
  const puzzle = await getPuzzleById(params.id);

  const userId = locals.user?.id;
  const completion = await (userId ? getPuzzleCompletion(params.id, userId) : null);

  if (puzzle) {
    return {
      puzzle,
      isLoggedIn: Boolean(locals.user),
      isOwned: puzzle.createdBy.id === locals.user?.id,
      completion
    }
  }

  error(404, 'Not found');
};

function validateSolveAttempt(puzzle: Puzzle, attempt: string) {
  return puzzle.solution.toLowerCase() === attempt.toLowerCase();
}

export const actions: Actions = {
  solve: async (event) => {
    const formData = await event.request.formData();
    const id = event.params.id;
    const puzzle = await getPuzzleById(id);
    const attempt = formData.get("answer")!.toString();
    if (!puzzle) return;
    const success = validateSolveAttempt(puzzle, attempt);
    const userId = event.locals.user?.id;
    if (success && userId) {
      await registerPuzzleCompletion(id, userId);
    }
    return { success }
  },
  delete: async (event) => {
    const puzzleId = event.params.id;
    await deletePuzzle(puzzleId);
    redirect(302, "/");
  }
}
