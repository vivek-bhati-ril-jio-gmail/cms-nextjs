import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import cookie from 'cookie';

// Middleware function
export async function middleware(req) {
    // Parse cookies from request headers
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.auth_token; // Get the JWT token from cookies
    console.log(1345647893);
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store');  // Disable caching

    // If no token is found, deny access
    if (!token) {
        return new NextResponse(
            JSON.stringify({ msg: 'No token, authorization denied' }),
            { status: 401 }
        );
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user data to the request object (`req.user`)
        req.user = decoded.userData;  // Store user data from the decoded JWT
        return NextResponse.next();  // Proceed with the request, allow access to the next handler or route
    } catch (err) {
        // If the token verification fails (e.g., expired or invalid), deny access
        return new NextResponse(
            JSON.stringify({ msg: 'Token is invalid or expired' }),
            { status: 401 }
        );
    }
}

// This config ensures the middleware runs only on specific routes
export const config = {
    matcher: ['/api/*'],  // Apply middleware only for API routes or specific pages
};