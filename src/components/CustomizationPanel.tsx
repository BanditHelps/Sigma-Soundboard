// src/components/CustomizationPanel.tsx
import React from 'react';
import { Theme } from '../types';

interface CustomizationPanelProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ theme, setTheme }) => {
  const handleColorChange = (property: keyof Theme) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme({ ...theme, [property]: e.target.value });
  };

  return (
    <div className="customization-panel">
      <h2>Customize</h2>
      <div>
        <label>
          Background Color:
          <input
            type="color"
            value={theme.backgroundColor}
            onChange={handleColorChange('backgroundColor')}
          />
        </label>
      </div>
      <div>
        <label>
          Button Color:
          <input
            type="color"
            value={theme.buttonColor}
            onChange={handleColorChange('buttonColor')}
          />
        </label>
      </div>
      <div>
        <label>
          Text Color:
          <input
            type="color"
            value={theme.textColor}
            onChange={handleColorChange('textColor')}
          />
        </label>
      </div>
    </div>
  );
};

export default CustomizationPanel;