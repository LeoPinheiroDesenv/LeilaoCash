import React from 'react';
import FontSelector from '../components/FontSelector';

const ConfiguracoesLayout = ({ settings, onInputChange }) => {
  
  const settingDescriptions = {
    // Cores Base
    primary_color: { label: 'Cor Primária', description: 'Botões principais, destaques, links hover.' },
    secondary_color: { label: 'Cor Secundária', description: 'Ícones, bordas de destaque, links.' },
    background_color: { label: 'Cor de Fundo', description: 'Fundo principal do site.' },
    text_color: { label: 'Cor do Texto', description: 'Texto principal e títulos.' },
    
    // Header
    color_header_bg: { label: 'Fundo do Cabeçalho', description: 'Cor de fundo da barra de navegação superior.' },
    color_header_link: { label: 'Links do Menu', description: 'Cor dos links de navegação.' },
    color_header_link_hover: { label: 'Links Hover', description: 'Cor dos links ao passar o mouse.' },
    
    // Hero
    color_hero_bg: { label: 'Fundo Hero', description: 'Cor de fundo da seção principal da home.' },
    color_hero_title: { label: 'Título Hero', description: 'Cor do título principal.' },
    color_hero_subtitle: { label: 'Subtítulo Hero', description: 'Cor do subtítulo.' },
    
    // Cards
    color_card_bg: { label: 'Fundo do Card', description: 'Cor de fundo dos cards de produto.' },
    color_card_border: { label: 'Borda do Card', description: 'Cor da borda dos cards.' },
    color_card_title: { label: 'Título do Produto', description: 'Cor do nome do produto no card.' },
    color_card_price: { label: 'Preço Atual', description: 'Cor do valor do lance atual.' },
    
    // Footer
    color_footer_bg: { label: 'Fundo do Rodapé', description: 'Cor de fundo da seção final do site.' },
    color_footer_text: { label: 'Texto do Rodapé', description: 'Cor do texto descritivo e links.' },
    color_footer_title: { label: 'Títulos do Rodapé', description: 'Cor dos títulos das colunas.' },

    // Fontes
    font_primary: { label: 'Fonte Principal', description: 'Corpo do texto, menus, botões.' },
    font_secondary: { label: 'Fonte Secundária', description: 'Títulos, preços, cronômetros.' },
  };

  const getSettingInfo = (key) => {
    return settingDescriptions[key] || { label: key, description: '' };
  };

  const renderColorInput = (setting) => {
    const info = getSettingInfo(setting.key);
    return (
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
        {info.description && <p className="setting-help-text">{info.description}</p>}
      </div>
    );
  };

  const renderTextInput = (setting) => {
    const info = getSettingInfo(setting.key);
    return (
      <>
        <input
          type="text"
          value={setting.value || ''}
          onChange={(e) => onInputChange(setting.key, e.target.value)}
          className="text-input"
          placeholder={setting.description}
        />
        {info.description && <p className="setting-help-text">{info.description}</p>}
      </>
    );
  };

  const renderFontInput = (setting) => {
    const info = getSettingInfo(setting.key);
    return (
      <>
        <FontSelector
          value={setting.value || ''}
          onChange={(value) => onInputChange(setting.key, value)}
          placeholder={setting.description || 'Selecione uma fonte'}
        />
        {info.description && <p className="setting-help-text">{info.description}</p>}
      </>
    );
  };

  // Combinar configurações do tema e do grupo 'theme' (cores novas)
  const themeSettings = [
      ...(settings.theme || []),
      ...(settings.theme_colors || []) // Assumindo que as novas cores virão aqui ou misturadas em 'theme'
  ];
  
  // Se as novas cores estiverem no grupo 'theme' junto com as antigas, o array acima já resolve.
  // Mas o seeder salvou no grupo 'theme'. O endpoint /settings agrupa por 'group'.
  // Então settings.theme deve conter tudo.

  // Agrupar configurações para exibição
  const groups = {
      base: { title: 'Cores Base', items: [] },
      header: { title: 'Cabeçalho', items: [] },
      hero: { title: 'Seção Hero', items: [] },
      cards: { title: 'Cards de Produto', items: [] },
      footer: { title: 'Rodapé', items: [] },
      fonts: { title: 'Tipografia', items: [] },
      other: { title: 'Outros', items: [] }
  };

  (settings.theme || []).forEach(setting => {
      if (['primary_color', 'secondary_color', 'background_color', 'text_color'].includes(setting.key)) {
          groups.base.items.push(setting);
      } else if (setting.key.startsWith('color_header_')) {
          groups.header.items.push(setting);
      } else if (setting.key.startsWith('color_hero_')) {
          groups.hero.items.push(setting);
      } else if (setting.key.startsWith('color_card_')) {
          groups.cards.items.push(setting);
      } else if (setting.key.startsWith('color_footer_')) {
          groups.footer.items.push(setting);
      } else if (setting.key.startsWith('font_')) {
          groups.fonts.items.push(setting);
      } else {
          groups.other.items.push(setting);
      }
  });

  return (
    <div className="settings-grid-full">
      {Object.entries(groups).map(([key, group]) => {
          if (group.items.length === 0) return null;
          return (
              <div key={key} className="text-subgroup">
                  <h4 className="text-subgroup-title">{group.title}</h4>
                  <div className="settings-grid">
                      {group.items.map(setting => (
                          <div key={setting.key} className="setting-item">
                              <div className="setting-header">
                                  <label className="setting-label">{getSettingInfo(setting.key).label}</label>
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
              </div>
          );
      })}
    </div>
  );
};

export default ConfiguracoesLayout;
