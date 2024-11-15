// app/admin/config_pages/plugins/page.js

import { useEffect, useState } from 'react';

export default function PluginsAdmin() {
  const [plugins, setPlugins] = useState([]);
  const [newPlugin, setNewPlugin] = useState({ name: '', description: '', version: '' });
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

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

  // Toggle plugin activation status
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

  // Install a new plugin
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

      {/* New Plugin Installation Form */}
      <div>
        <h2>Install New Plugin</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Plugin Name"
            value={newPlugin.name}
            onChange={(e) => setNewPlugin({ ...newPlugin, name: e.target.value })}
            className="plugin-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Description"
            value={newPlugin.description}
            onChange={(e) => setNewPlugin({ ...newPlugin, description: e.target.value })}
            className="plugin-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Version"
            value={newPlugin.version}
            onChange={(e) => setNewPlugin({ ...newPlugin, version: e.target.value })}
            className="plugin-input"
          />
        </div>
        <button onClick={handlePluginInstall} disabled={isLoading}>
          {isLoading ? 'Installing...' : 'Install Plugin'}
        </button>
      </div>

      {/* Installed Plugins List */}
      <div>
        <h2>Installed Plugins</h2>
        {isLoading && <p>Loading plugins...</p>}
        {!isLoading && plugins.length === 0 && <p>No plugins installed.</p>}
        {!isLoading && plugins.length > 0 && (
          <ul>
            {plugins.map((plugin) => (
              <li key={plugin.id}>
                <div className="plugin-item">
                  <span>{plugin.name}</span>
                  <button onClick={() => handlePluginToggle(plugin.id, plugin.isActive)}>
                    {plugin.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
