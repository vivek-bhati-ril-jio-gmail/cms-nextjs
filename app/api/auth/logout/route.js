export const runtime = 'nodejs';
export async function POST(req) {
  // You can clear cookies on the client-side to "log out" the user
  return new Response(JSON.stringify({ msg: 'Successfully logged out' }), { status: 200 });
}