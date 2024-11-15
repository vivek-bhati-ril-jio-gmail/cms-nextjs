// app/admin/config_pages/plugins/page.js

import { useEffect, useState } from 'react';

export default function PluginsAdmin() {
  const [plugins, setPlugins] = useState([]);
  const [newPlugin, setNewPlugin] = useState({ name: '', description: '', version: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPlugins() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/plugins');
        const data = await response.json();
        setPlugins(data);
      } catch (error) {
        console.error("Error fetching plugins:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlugins();
  }, []);

  // Handle plugin toggle (Activate/Deactivate)
  const handlePluginToggle = async (id, isActive) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/plugins/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !isActive }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const updatedPlugin = await response.json();
      setPlugins((prevPlugins) =>
        prevPlugins.map((plugin) => (plugin.id === id ? updatedPlugin : plugin))
      );
    } catch (error) {
      console.error("Error updating plugin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new plugin installation
  const handlePluginInstall = async () => {
    if (!newPlugin.name || !newPlugin.description || !newPlugin.version) {
      alert('All fields are required!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/plugins', {
        method: 'POST',
        body: JSON.stringify(newPlugin),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const installedPlugin = await response.json();
      setPlugins((prevPlugins) => [...prevPlugins, installedPlugin]);
      setNewPlugin({ name: '', description: '', version: '' }); // Reset input fields
    } catch (error) {
      console.error("Error installing plugin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Plugin Management</h1>

      {/* Install Plugin */}
      <div>
        <h2>Install New Plugin</h2>
        <input
          type="text"
          placeholder="Plugin Name"
          value={newPlugin.name}
          onChange={(e) => setNewPlugin({ ...newPlugin, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newPlugin.description}
          onChange={(e) => setNewPlugin({ ...newPlugin, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Version"
          value={newPlugin.version}
          onChange={(e) => setNewPlugin({ ...newPlugin, version: e.target.value })}
        />
        <button onClick={handlePluginInstall} disabled={isLoading}>
          {isLoading ? 'Installing...' : 'Install Plugin'}
        </button>
      </div>

      {/* Installed Plugins */}
      <div>
        <h2>Installed Plugins</h2>
        <ul>
          {plugins.map((plugin) => (
            <li key={plugin.id}>
              <span>{plugin.name}</span>
              <button onClick={() => handlePluginToggle(plugin.id, plugin.isActive)}>
                {plugin.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
