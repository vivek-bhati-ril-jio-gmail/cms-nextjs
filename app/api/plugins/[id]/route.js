// pages/api/plugins/[id].js

import { Plugin } from '../../../models'; // Import the Plugin model

// PUT request to toggle plugin active/inactive
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

export default togglePlugin;
