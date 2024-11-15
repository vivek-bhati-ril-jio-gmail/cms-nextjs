// pages/api/plugins/index.js

import { Plugin } from '../../../models/Plugin'; // Import the Plugin model

// GET all plugins
export const getPlugins = async (req, res) => {
  try {
    const plugins = await Plugin.findAll();
    res.status(200).json(plugins);
  } catch (error) {
    console.error('Error fetching plugins:', error);
    res.status(500).json({ error: 'Failed to fetch plugins' });
  }
};

// POST a new plugin
export const createPlugin = async (req, res) => {
  const { name, description, version, isActive } = req.body;
  try {
    const plugin = await Plugin.create({
      name,
      description,
      version,
      isActive,
    });
    res.status(201).json(plugin);
  } catch (error) {
    console.error('Error creating plugin:', error);
    res.status(500).json({ error: 'Failed to create plugin' });
  }
};

// PUT to toggle plugin activation
export const togglePlugin = async (req, res) => {
  const { id } = req.query;
  const { isActive } = req.body;

  try {
    const plugin = await Plugin.findByPk(id);
    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }
    plugin.isActive = isActive;
    await plugin.save();
    res.status(200).json(plugin);
  } catch (error) {
    console.error('Error updating plugin:', error);
    res.status(500).json({ error: 'Failed to update plugin' });
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getPlugins(req, res);
  } else if (req.method === 'POST') {
    return createPlugin(req, res);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
