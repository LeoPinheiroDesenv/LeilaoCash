import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './header.css';

const SearchAutocomplete = ({ placeholder, onSearch, minChars = 3 }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]); // Agora armazena objetos [{id, name}]
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Fechar sugestões ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Busca sugestões reais no Backend
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length >= minChars) {
                setIsLoading(true);
                try {
                    // Busca produtos ativos que coincidam com o termo
                    // Usa a rota pública /public/products se disponível, ou /products se o interceptor permitir
                    // Para garantir que funcione sem login, usamos uma rota que sabemos ser pública ou ajustamos o interceptor
                    const response = await api.get(`/products?search=${searchTerm}&per_page=7&is_active=true`);

                    if (response.data.success) {
                        // Lida com resposta paginada ou lista simples
                        const productsList = response.data.data.data || response.data.data || [];

                        // Mapeia para um formato que preserve o ID para navegação
                        const results = productsList.map(p => ({
                            id: p.id,
                            name: p.name || p.title
                        }));

                        setSuggestions(results);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error("Erro ao buscar sugestões:", error);
                    // Se der erro 401, tenta uma rota alternativa pública se existir, ou apenas limpa
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, minChars]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            if (onSearch) onSearch(searchTerm);
            setShowSuggestions(false);
            // Navega para a página de leilões com o termo de busca
            navigate(`/leiloes?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleSuggestionClick = (product) => {
        setSearchTerm(product.name);
        setShowSuggestions(false);

        // Navega direto para a página do produto usando o ID
        navigate(`/produto/${product.slug || product.id}`);

        // Opcional: Avisa o componente pai que uma busca foi feita
        if (onSearch) onSearch(product.name);
    };

    return (
                <div className="search-container" ref={wrapperRef} style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
                    <input
                    type="text"
                    placeholder={placeholder || "Buscar produtos..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.length >= minChars && setShowSuggestions(true)}
                    autoComplete="on"
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
                    {suggestions.map((item) => (
                        <li style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            color: '#475569'
                        }}
                            key={item.id}
                            onClick={() => handleSuggestionClick(item)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchAutocomplete;