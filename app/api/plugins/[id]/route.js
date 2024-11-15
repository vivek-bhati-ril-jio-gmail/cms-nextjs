// app/api/plugins/[id]/route.js

import { getPluginById, togglePlugin } from '../../lib/plugins';

export async function PUT({ params, request }) {
  const { id } = params;
  const { isActive } = await request.json();

  try {
    const plugin = await togglePlugin(id, isActive);
    return new Response(JSON.stringify(plugin), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to toggle plugin' }), { status: 500 });
  }
}
