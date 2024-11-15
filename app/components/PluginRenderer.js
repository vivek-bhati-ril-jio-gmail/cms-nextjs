// app/components/PluginRenderer.js

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

export default function PluginRenderer({ plugin }) {
  const [PluginComponent, setPluginComponent] = useState(null);

  useEffect(() => {
    if (plugin.isActive) {
      // Dynamically import the plugin's component (e.g., ImageSliderPlugin)
      if (plugin.name === 'Image Slider') {
        import('./plugins/imageSliderPlugin')
          .then((mod) => setPluginComponent(() => mod.default))
          .catch((error) => console.error('Error loading Image Slider Plugin:', error));
      }
    }
  }, [plugin]);

  if (!plugin.isActive || !PluginComponent) {
    return null;
  }

  return <PluginComponent />;
}
