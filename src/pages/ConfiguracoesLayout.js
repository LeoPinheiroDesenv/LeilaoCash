import React from 'react';
import FontSelector from '../components/FontSelector';

const ConfiguracoesLayout = ({ settings, onInputChange }) => {
  const renderColorInput = (setting) => (
    <div className="setting-input-group">
      <div className="color-input-wrapper">
        <input
          type="color"
          value={setting.value || '#000000'}
          onChange={(e) => onInputChange(setting.key, e.target.value)}
          className="color-input"
        />
        <input
          type="text"
          value={setting.value || ''}
          onChange={(e) => onInputChange(setting.key, e.target.value)}
          className="color-text-input"
          placeholder="#000000"
        />
      </div>
      <div className="color-preview" style={{ backgroundColor: setting.value || '#000000' }} />
    </div>
  );

  const renderTextInput = (setting) => (
    <input
      type="text"
      value={setting.value || ''}
      onChange={(e) => onInputChange(setting.key, e.target.value)}
      className="text-input"
      placeholder={setting.description}
    />
  );

  const renderFontInput = (setting) => (
    <FontSelector
      value={setting.value || ''}
      onChange={(value) => onInputChange(setting.key, value)}
      placeholder={setting.description || 'Selecione uma fonte'}
    />
  );

  const themeSettings = settings.theme || [];

  return (
    <div className="settings-grid">
      {themeSettings.map(setting => (
        <div key={setting.key} className="setting-item">
          <div className="setting-header">
            <label className="setting-label">{setting.description || setting.key}</label>
            <span className="setting-key">{setting.key}</span>
          </div>
          {setting.type === 'color' 
            ? renderColorInput(setting) 
            : setting.type === 'font' 
            ? renderFontInput(setting) 
            : renderTextInput(setting)}
        </div>
      ))}
    </div>
  );
};

export default ConfiguracoesLayout;

