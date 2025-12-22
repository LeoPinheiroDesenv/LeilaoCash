import React, { useState, useEffect, useRef } from 'react';
import './FontSelector.css';

// Lista de fontes populares do Google Fonts
const GOOGLE_FONTS = [
  { name: 'Inter', family: 'Inter', category: 'Sans Serif' },
  { name: 'Roboto', family: 'Roboto', category: 'Sans Serif' },
  { name: 'Open Sans', family: 'Open Sans', category: 'Sans Serif' },
  { name: 'Lato', family: 'Lato', category: 'Sans Serif' },
  { name: 'Montserrat', family: 'Montserrat', category: 'Sans Serif' },
  { name: 'Poppins', family: 'Poppins', category: 'Sans Serif' },
  { name: 'Raleway', family: 'Raleway', category: 'Sans Serif' },
  { name: 'Ubuntu', family: 'Ubuntu', category: 'Sans Serif' },
  { name: 'Nunito', family: 'Nunito', category: 'Sans Serif' },
  { name: 'Source Sans Pro', family: 'Source Sans Pro', category: 'Sans Serif' },
  { name: 'Playfair Display', family: 'Playfair Display', category: 'Serif' },
  { name: 'Merriweather', family: 'Merriweather', category: 'Serif' },
  { name: 'Lora', family: 'Lora', category: 'Serif' },
  { name: 'PT Serif', family: 'PT Serif', category: 'Serif' },
  { name: 'Roboto Slab', family: 'Roboto Slab', category: 'Serif' },
  { name: 'Orbitron', family: 'Orbitron', category: 'Display' },
  { name: 'Bebas Neue', family: 'Bebas Neue', category: 'Display' },
  { name: 'Oswald', family: 'Oswald', category: 'Display' },
  { name: 'Anton', family: 'Anton', category: 'Display' },
  { name: 'Righteous', family: 'Righteous', category: 'Display' },
  { name: 'Dancing Script', family: 'Dancing Script', category: 'Handwriting' },
  { name: 'Pacifico', family: 'Pacifico', category: 'Handwriting' },
  { name: 'Caveat', family: 'Caveat', category: 'Handwriting' },
  { name: 'Satisfy', family: 'Satisfy', category: 'Handwriting' },
  { name: 'Kalam', family: 'Kalam', category: 'Handwriting' },
  { name: 'Fira Code', family: 'Fira Code', category: 'Monospace' },
  { name: 'Roboto Mono', family: 'Roboto Mono', category: 'Monospace' },
  { name: 'Source Code Pro', family: 'Source Code Pro', category: 'Monospace' },
  { name: 'Courier Prime', family: 'Courier Prime', category: 'Monospace' },
  { name: 'Space Mono', family: 'Space Mono', category: 'Monospace' },
];

const FontSelector = ({ value, onChange, placeholder = 'Selecione uma fonte' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filtrar fontes baseado no termo de busca
  const filteredFonts = GOOGLE_FONTS.filter(font =>
    font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    font.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonte selecionada
  const selectedFont = GOOGLE_FONTS.find(font => font.family === value) || null;

  // Carregar fonte do Google Fonts quando selecionada
  useEffect(() => {
    if (value && selectedFont) {
      loadGoogleFont(selectedFont.family);
    }
  }, [value, selectedFont]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para carregar fonte do Google Fonts
  const loadGoogleFont = (fontFamily) => {
    // Verificar se a fonte já foi carregada
    const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(linkId)) {
      return;
    }

    // Criar link para carregar a fonte
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  };

  const handleSelect = (font) => {
    onChange(font.family);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Agrupar fontes por categoria
  const fontsByCategory = filteredFonts.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {});

  return (
    <div className="font-selector" ref={dropdownRef}>
      <div
        className="font-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-selector-value">
          {selectedFont ? (
            <>
              <span className="font-preview" style={{ fontFamily: selectedFont.family }}>
                {selectedFont.name}
              </span>
              <span className="font-category">{selectedFont.category}</span>
            </>
          ) : (
            <span className="font-placeholder">{placeholder}</span>
          )}
        </div>
        <svg
          className={`font-selector-arrow ${isOpen ? 'open' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div className="font-selector-dropdown">
          <div className="font-selector-search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Buscar fonte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-search-input"
              autoFocus
            />
          </div>

          <div className="font-selector-list">
            {Object.keys(fontsByCategory).length === 0 ? (
              <div className="font-selector-empty">
                Nenhuma fonte encontrada
              </div>
            ) : (
              Object.entries(fontsByCategory).map(([category, fonts]) => (
                <div key={category} className="font-category-group">
                  <div className="font-category-header">{category}</div>
                  {fonts.map((font) => (
                    <div
                      key={font.family}
                      className={`font-option ${selectedFont?.family === font.family ? 'selected' : ''}`}
                      onClick={() => handleSelect(font)}
                    >
                      <span className="font-option-name" style={{ fontFamily: font.family }}>
                        {font.name}
                      </span>
                      {selectedFont?.family === font.family && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;

