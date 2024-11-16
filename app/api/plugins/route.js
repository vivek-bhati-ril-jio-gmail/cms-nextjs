import Plugin from '../../../models/Plugin'; // Import the Plugin model

// Handle GET request for fetching plugins with pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url); // Extract query params
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    // Fetch plugins with pagination
    const plugins = await Plugin.findAll({
      limit,
      offset,
    });

    // Count total plugins to calculate total pages
    const totalPlugins = await Plugin.count();
    const totalPages = Math.ceil(totalPlugins / limit);

    return new Response(
      JSON.stringify({
        plugins,
        currentPage: page,
        totalPages,
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching plugins:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch plugins' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle POST request for creating a new plugin
export async function POST(req) {
  const { name, description, version, isActive } = await req.json();

  // Check if required fields are provided
  if (!name || !description || !version) {
    return new Response(
      JSON.stringify({ error: 'Name, description, and version are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Create a new plugin
    const plugin = await Plugin.create({
      name,
      description,
      version,
      isActive: isActive || false, // Default to inactive
    });

    return new Response(
      JSON.stringify(plugin),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating plugin:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create plugin' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
