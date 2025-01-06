import * as auth from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  if (!event.locals.session) {
    error(400, "user is not logged in.");
  }
  await auth.invalidateSession(event.locals.session.id);
  auth.deleteSessionTokenCookie(event);
  return new Response("Success");
};
