'use client';

import { Category } from '@/lib/types';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

const categories: Array<{ id: string; label: string; color: string }> = [
  { id: 'all', label: 'All', color: 'bg-zinc-600' },
  { id: 'payments', label: 'Payments', color: 'bg-blue-600' },
  { id: 'commerce', label: 'Commerce', color: 'bg-purple-600' },
  { id: 'crypto', label: 'Crypto', color: 'bg-orange-600' },
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === category.id
              ? `${category.color} text-white`
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

export function getCategoryColor(category: Category): string {
  switch (category) {
    case 'payments':
      return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
    case 'commerce':
      return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
    case 'crypto':
      return 'bg-orange-600/20 text-orange-400 border-orange-600/30';
    default:
      return 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30';
  }
}
