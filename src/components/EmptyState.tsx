import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-[var(--color-soft-gray)] p-4">
        <Icon className="h-10 w-10 text-[var(--color-primary)]/30" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-[var(--color-primary)]">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-[var(--color-primary)]/50">
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="rounded-lg bg-[var(--color-brand-red)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-red)]/90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
