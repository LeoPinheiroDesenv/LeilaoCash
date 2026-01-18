import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css'; // Reutilizando estilos do header para consistência

const SearchAutocomplete = ({ placeholder, onSearch, minChars = 3 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fechar sugestões ao clicar fora
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= minChars) {
      // Simulação de busca de sugestões
      // Em produção, isso seria uma chamada à API
      const mockSuggestions = [
        'iPhone 15 Pro Max',
        'PlayStation 5',
        'MacBook Air M2',
        'Samsung Galaxy S24',
        'iPad Pro',
        'Nintendo Switch',
        'Xbox Series X'
      ].filter(item => item.toLowerCase().includes(value.toLowerCase()));
      
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    setShowSuggestions(false);
    navigate(`/leiloes?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setShowSuggestions(false);
    navigate(`/leiloes?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="search-container" ref={wrapperRef} style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
        <input
          type="text"
          placeholder={placeholder || "Buscar..."}
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          style={{ 
            width: '100%', 
            padding: '12px 20px', 
            borderRadius: '50px', 
            border: '1px solid #e2e8f0',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <button 
          type="submit" 
          className="search-button"
          style={{
            position: 'absolute',
            right: '5px',
            top: '5px',
            height: 'calc(100% - 10px)',
            width: '40px',
            borderRadius: '50%',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list" style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          background: 'white',
          borderRadius: '12px',
          marginTop: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          listStyle: 'none',
          padding: '8px 0',
          zIndex: 50,
          border: '1px solid #e2e8f0'
        }}>
          {suggestions.map((suggestion, index) => (
            <li 
              key={index} 
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                color: '#475569'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchAutocomplete;
