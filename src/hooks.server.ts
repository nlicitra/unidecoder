import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { ADMIN_LOGIN } from "$env/static/private";

const handleAuth: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url);

	if (url.pathname.startsWith("/admin")) {
		const auth = event.request.headers.get("Authorization");

		if (auth !== `Basic ${btoa(ADMIN_LOGIN)}`) {
			return new Response("Not authorized", {
				status: 401,
				headers: {
					"WWW-Authenticate":
						'Basic realm="User Visible Realm", charset="UTF-8"',
				},
			});
		}
	}


	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;
