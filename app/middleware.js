import jwt from 'jsonwebtoken';
import Users from '../models/User'; // Ensure this path is correct for your project
import { NextResponse } from 'next/server'; // Import NextResponse

// Middleware function
export async function middleware(req) {
    // Get token from the request headers
    const token = req.headers.get('x-auth-token');

    // If no token, deny access
    if (!token) {
        return new NextResponse(
            JSON.stringify({ msg: 'No token, authorization denied' }),
            { status: 401 }
        );
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from the database based on the decoded user ID
        const user = await Users.findByPk(decoded.id); // Use `findByPk` to fetch the user

        if (!user) {
            return new NextResponse(
                JSON.stringify({ msg: 'User not found' }),
                { status: 401 }
            );
        }

        // Attach user to the request object
        req.user = user;

        // Continue to the next middleware or route handler
        return NextResponse.next(); // Allow the request to continue
    } catch (err) {
        console.error(err);
        return new NextResponse(
            JSON.stringify({ msg: 'Token is not valid' }),
            { status: 401 }
        );
    }
}
