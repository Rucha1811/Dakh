import clsx from 'clsx';

interface LoadingSkeletonProps {
  type: 'dashboard' | 'table' | 'cards' | 'form';
}

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-md bg-[var(--color-primary)]/10',
        className
      )}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Pulse className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-soft-gray)] bg-white p-5">
            <Pulse className="mb-3 h-4 w-24" />
            <Pulse className="mb-2 h-8 w-16" />
            <Pulse className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-soft-gray)] bg-white p-6">
          <Pulse className="mb-4 h-5 w-32" />
          <Pulse className="h-48 w-full" />
        </div>
        <div className="rounded-xl border border-[var(--color-soft-gray)] bg-white p-6">
          <Pulse className="mb-4 h-5 w-32" />
          <Pulse className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Pulse className="h-8 w-48" />
        <Pulse className="h-10 w-32 rounded-lg" />
      </div>
      <div className="rounded-xl border border-[var(--color-soft-gray)] bg-white">
        <div className="border-b border-[var(--color-soft-gray)] px-6 py-4">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Pulse key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-[var(--color-soft-gray)] px-6 py-4 last:border-b-0"
          >
            <div className="flex gap-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Pulse key={j} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Pulse className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-soft-gray)] bg-white p-5"
          >
            <Pulse className="mb-3 h-32 w-full rounded-lg" />
            <Pulse className="mb-2 h-5 w-3/4" />
            <Pulse className="mb-2 h-4 w-1/2" />
            <div className="mt-4 flex justify-between">
              <Pulse className="h-4 w-16" />
              <Pulse className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Pulse className="h-8 w-48" />
      <div className="rounded-xl border border-[var(--color-soft-gray)] bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Pulse className="h-4 w-24" />
              <Pulse className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Pulse className="h-10 w-24 rounded-lg" />
          <Pulse className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const SKELETONS = {
  dashboard: DashboardSkeleton,
  table: TableSkeleton,
  cards: CardsSkeleton,
  form: FormSkeleton,
} as const;

export default function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  const Component = SKELETONS[type];
  return <Component />;
}
