import { useState, useEffect } from 'react';

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  'Handicrafts': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
  'Textiles': 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80',
  'Home Decor': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
  'Food Products': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
  'Jewellery': 'https://images.unsplash.com/photo-1611591475155-426c623c2807?w=800&auto=format&fit=crop&q=80',
  'Eco-Friendly Products': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
  'Traditional Products': 'https://images.unsplash.com/photo-1607006314144-4828b8cf4505?w=800&auto=format&fit=crop&q=80',
  'Art': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
  'Fashion Accessories': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Handicrafts': 'from-amber-700 via-orange-600 to-red-700',
  'Textiles': 'from-purple-800 via-indigo-700 to-blue-800',
  'Home Decor': 'from-emerald-700 via-teal-700 to-cyan-800',
  'Food Products': 'from-amber-600 via-yellow-600 to-orange-700',
  'Jewellery': 'from-cyan-700 via-teal-800 to-blue-900',
  'Eco-Friendly Products': 'from-green-700 via-emerald-600 to-lime-700',
  'Traditional Products': 'from-rose-800 via-pink-700 to-purple-900',
  'Art': 'from-orange-700 via-amber-600 to-rose-700',
  'Fashion Accessories': 'from-indigo-800 via-purple-700 to-pink-800',
};

const CATEGORY_EMOJI: Record<string, string> = {
  'Handicrafts': '🏺',
  'Textiles': '🧶',
  'Food Products': '🍛',
  'Art': '🎨',
  'Art & Paintings': '🎨',
  'Jewellery': '💎',
  'Home Decor': '🏠',
  'Eco-Friendly Products': '🌿',
  'Traditional Products': '🪔',
  'Fashion Accessories': '👜',
};

interface Props {
  src?: string;
  category?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export default function ProductImage({
  src,
  category,
  name,
  size = 'md',
  className = '',
}: Props) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const fallbackUrl =
    (category ? CATEGORY_DEFAULT_IMAGES[category] : undefined) ||
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80';

  const initialUrl = src && src.startsWith('http') ? src : fallbackUrl;
  const emoji = CATEGORY_EMOJI[category ?? ''] ?? '📦';
  const gradient = CATEGORY_GRADIENTS[category ?? ''] ?? 'from-slate-700 via-slate-800 to-slate-900';

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    full: 'w-full h-full',
  };

  if (hasError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white flex-shrink-0 shadow-inner relative overflow-hidden ${className}`}
        title={name}
      >
        <span className={size === 'full' || size === 'lg' ? 'text-4xl' : 'text-xl'}>{emoji}</span>
        {(size === 'full' || size === 'lg') && category && (
          <span className="text-[11px] font-semibold tracking-wide uppercase mt-1 opacity-90">{category}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 relative ${className}`}
      title={name}
    >
      <img
        src={initialUrl}
        alt={name || 'Product'}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
