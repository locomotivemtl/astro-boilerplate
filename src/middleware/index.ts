import { defineMiddleware } from "astro:middleware";

import {
    BASIC_AUTH_ENABLED,
    BASIC_AUTH_USERNAME,
    BASIC_AUTH_PASSWORD,
} from 'astro:env/server';

// This middleware checks for basic auth
export const onRequest = defineMiddleware(async (context, next) => {
    // If basic auth is disabled or we are in development mode, skip this middleware
    if(!BASIC_AUTH_ENABLED || import.meta.env.DEV) {
        return next();
    }

    // Get the Authorization header from the request
    const authHeader = context.request.headers.get('Authorization');

    if (!authHeader) {
        // If no Authorization header, return a 401 response
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="User Visible Realm", charset="UTF-8"',
            },
        });
    }

    // Basic authentication: Basic <base64(username:password)>
    const [scheme, encoded] = authHeader.split(' ');

    if (scheme !== 'Basic' || !encoded) {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="User Visible Realm", charset="UTF-8"',
            },
        });
    }

    // Decode base64 username:password
    const decoded = atob(encoded);
    const [username, password] = decoded.split(':');

    const validUsername = BASIC_AUTH_USERNAME;
    const validPassword = BASIC_AUTH_PASSWORD;

    if (username !== validUsername || password !== validPassword) {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="User Visible Realm", charset="UTF-8"',
            },
        });
    }

    // If authentication is successful, proceed to the next middleware or route
    return next();
});
