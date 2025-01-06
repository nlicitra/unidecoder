
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createPuzzle } from '$lib/server/puzzle';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, '/auth/login');
  }
  return {};
};

export const actions: Actions = {
  create: async (event) => {
    const formData = await event.request.formData();
    const puzzle = formData.get('puzzle');
    const solution = formData.get('solution');

    console.log(event.locals.user, puzzle, solution);
    const userId = event.locals.user?.id;

    if (!userId) {
      fail(400, { error: "Must be logged in to create a puzzle" });
    } else if (!puzzle || !solution) {
      fail(400, { error: "puzzle and solution are required" });
    }

    const puzzleId = await createPuzzle(puzzle!.toString(), solution!.toString(), userId!);

    return redirect(302, `/p/${puzzleId}`);
  },
};
