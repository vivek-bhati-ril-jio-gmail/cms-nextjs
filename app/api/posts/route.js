import { NextResponse } from 'next/server'; // Import NextResponse
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

    return NextResponse.json({
      plugins,
      currentPage: page,
      totalPages,
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching plugins:', error);
    return NextResponse.json({
      error: 'Failed to fetch plugins',
    }, {
      status: 500,
    });
  }
}

// Handle POST request for creating a new plugin
export async function POST(req) {
  const { name, description, version, isActive } = await req.json();

  // Check if required fields are provided
  if (!name || !description || !version) {
    return NextResponse.json({
      error: 'Name, description, and version are required',
    }, {
      status: 400,
    });
  }

  try {
    // Create a new plugin
    const plugin = await Plugin.create({
      name,
      description,
      version,
      isActive: isActive || false, // Default to inactive
    });

    return NextResponse.json(plugin, {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating plugin:', error);
    return NextResponse.json({
      error: 'Failed to create plugin',
    }, {
      status: 500,
    });
  }
}

// Handle PUT request for toggling plugin status (activate/deactivate)
export async function PUT(req) {
  const { id } = req.url.split('/').pop(); // Extract plugin ID from URL
  const { isActive } = await req.json();

  try {
    const plugin = await Plugin.findByPk(id);
    if (!plugin) {
      return NextResponse.json({
        error: 'Plugin not found',
      }, {
        status: 404,
      });
    }

    // Toggle the plugin's active status (activate/deactivate)
    plugin.isActive = isActive !== undefined ? isActive : !plugin.isActive;
    await plugin.save();

    return NextResponse.json({
      id: plugin.id,
      name: plugin.name,
      isActive: plugin.isActive,
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating plugin status:', error);
    return NextResponse.json({
      error: 'Failed to update plugin status',
    }, {
      status: 500,
    });
  }
}
