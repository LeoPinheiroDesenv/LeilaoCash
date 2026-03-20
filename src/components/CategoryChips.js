import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './categoryChips.css';

const CategoryChips = ({ categories = [], onSelectCategory, selectedCategory }) => {
    const { t, i18n } = useTranslation();

    // Retorna o nome traduzido da categoria conforme o idioma atual
    const getCategoryName = (cat) => {
        const lang = i18n.language;
        if (lang === 'en' && cat.name_en) return cat.name_en;
        if (lang === 'es' && cat.name_es) return cat.name_es;
        return cat.name;
    };

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
                <span className="chip-name">{t('categories.all', 'Todos')}</span>
            </button>

            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                    {cat.icon && <span className="chip-emoji">{cat.icon}</span>}
                    <span className="chip-name">{getCategoryName(cat)}</span>
                    {/* Usa a função auxiliar para exibir a contagem */}
                    <span className="chip-count">{getCount(cat)}</span>
                </button>
            ))}
        </div>
    );
};

export default CategoryChips;