import React, { useState } from 'react';
import './categoryChips.css';

const CategoryChips = ({ categories = [], onSelectCategory, selectedCategory }) => {

    // Função auxiliar para encontrar a contagem correta independentemente do nome da propriedade na API
    const getCount = (cat) => {
        // Verifica várias possibilidades de nomes de campos que o backend possa estar enviando
        const count = cat.products_count || cat.auctions_count || cat.active_auctions_count || cat.count;
        // Converte para inteiro para garantir que não exiba "undefined" ou null
        return parseInt(count, 10) || 0;
    };

    return (
        <div className="chips-row">
            <button
                onClick={() => onSelectCategory(null)}
                className={`chip ${!selectedCategory ? 'active' : ''}`}
            >
                <span className="chip-emoji">✨</span>
                <span className="chip-name">Todos</span>
            </button>

            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                    {cat.icon && <span className="chip-emoji">{cat.icon}</span>}
                    <span className="chip-name">{cat.name}</span>
                    {/* Usa a função auxiliar para exibir a contagem */}
                    <span className="chip-count">{getCount(cat)}</span>
                </button>
            ))}
        </div>
    );
};

export default CategoryChips;