import { NextResponse } from 'next/server'; // Import NextResponse
import Plugin from '../../../../models/Plugin'; // Import the Plugin model

// Handle GET request for fetching a single plugin by ID
export async function GET(req) {
  const urlParts = req.url.split('/'); // Split the URL by slashes
  const id = urlParts[urlParts.length - 1]; // Get the last value
  
  try {
    // Fetch the plugin by its ID
    const plugin = await Plugin.findByPk(id);
    
    // If plugin not found, return a 404 error
    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }

    // Return the found plugin
    return NextResponse.json(plugin, { status: 200 });
  } catch (error) {
    console.error('Error fetching plugin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plugin' },
      { status: 500 }
    );
  }
}

// Handle PUT request for updating or toggling plugin status (activate/deactivate)
export async function PUT(req) {
  const urlParts = req.url.split('/'); // Split the URL by slashes
  const id = urlParts[urlParts.length - 1]; // Get the last value
  const { isActive } = await req.json(); // Get new status (isActive)

  try {
    const plugin = await Plugin.findByPk(id);
    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }

    // Activate or deactivate the plugin based on isActive value
    if (isActive) {
      await plugin.activate(); // Use activate method to create tables and set active
    } else {
      await plugin.deactivate(); // Use deactivate method to drop tables and set inactive
    }

    return NextResponse.json(plugin, { status: 200 });
  } catch (error) {
    console.error('Error updating plugin status:', error);
    return NextResponse.json(
      { error: 'Failed to update plugin status' },
      { status: 500 }
    );
  }
}
