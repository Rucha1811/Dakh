import { useMemo } from 'react';

const CATEGORY_EMOJI: Record<string, string> = {
  'Handicrafts': '🏺',
  'Textiles': '🧶',
  'Food Products': '🍛',
  'Art & Paintings': '🎨',
  'Jewellery': '💎',
  'Home Decor': '🏠',
  'Eco-Friendly': '🌿',
  'Leather': '👜',
  'Metal Work': '⚒️',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Handicrafts': 'from-amber-100 to-orange-100',
  'Textiles': 'from-purple-100 to-pink-100',
  'Food Products': 'from-yellow-100 to-red-100',
  'Art & Paintings': 'from-blue-100 to-indigo-100',
  'Jewellery': 'from-yellow-100 to-amber-100',
  'Home Decor': 'from-green-100 to-teal-100',
  'Eco-Friendly': 'from-emerald-100 to-green-100',
  'Leather': 'from-amber-100 to-yellow-100',
  'Metal Work': 'from-gray-100 to-slate-200',
};

interface Props {
  category?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProductImage({ category, name, size = 'md', className = '' }: Props) {
  const emoji = CATEGORY_EMOJI[category ?? ''] ?? '📦';
  const gradient = CATEGORY_COLORS[category ?? ''] ?? 'from-gray-100 to-gray-200';
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-32 h-32 text-5xl',
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 ${className}`} title={name}>
      <span role="img" aria-label={category}>{emoji}</span>
    </div>
  );
}
