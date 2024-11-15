// lib/plugins.js

import { Plugin } from '../models';  // Import the Plugin model

// Get all plugins
export const getAllPlugins = async () => {
  try {
    const plugins = await Plugin.findAll();  // Fetch all plugins from the database
    return plugins;
  } catch (error) {
    console.error('Error fetching plugins:', error);
    throw new Error('Failed to fetch plugins');
  }
};

// Install a new plugin
export const installPlugin = async ({ name, description, version }) => {
  try {
    const newPlugin = await Plugin.create({
      name,
      description,
      version,
      isActive: false,  // New plugins are inactive by default
    });
    return newPlugin;  // Return the newly created plugin
  } catch (error) {
    console.error('Error installing plugin:', error);
    throw new Error('Failed to install plugin');
  }
};

// Toggle plugin active/inactive
export const togglePlugin = async (id, isActive) => {
  try {
    const plugin = await Plugin.findByPk(id);  // Find plugin by primary key (id)
    if (!plugin) {
      throw new Error('Plugin not found');
    }
    plugin.isActive = isActive;  // Update the isActive status
    await plugin.save();  // Save the updated plugin
    return plugin;  // Return the updated plugin
  } catch (error) {
    console.error('Error toggling plugin:', error);
    throw new Error('Failed to toggle plugin');
  }
};
