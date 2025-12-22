import React from 'react';
import { Link } from 'react-router-dom';
import './categoryChips.css';

const categories = [
  { name: 'Smartphones', count: 45, emoji: '📱', slug: 'smartphones' },
  { name: 'Notebooks', count: 23, emoji: '💻', slug: 'notebooks' },
  { name: 'Games & Consoles', count: 34, emoji: '🎮', slug: 'games' },
  { name: 'Wearables', count: 18, emoji: '⌚', slug: 'wearables' },
  { name: 'Tablets', count: 12, emoji: '📟', slug: 'tablets' },
  { name: 'Áudio', count: 27, emoji: '🎧', slug: 'audio' },
  { name: 'Drones', count: 8, emoji: '🚁', slug: 'drones' },
  { name: 'Câmeras', count: 15, emoji: '📷', slug: 'cameras' }
];

export default function CategoryChips(){
  return (
    <div className="chips-row">
      {categories.map(cat => (
        <Link key={cat.name} to={`/?category=${cat.slug}`} className="chip">
          <span className="chip-emoji">{cat.emoji}</span>
          <span className="chip-name">{cat.name}</span>
          <span className="chip-count">{cat.count}</span>
        </Link>
      ))}
    </div>
  )
}
