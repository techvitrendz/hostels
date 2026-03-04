"use client";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="text-neutral-500">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
