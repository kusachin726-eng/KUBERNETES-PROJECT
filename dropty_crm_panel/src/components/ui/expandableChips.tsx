"use client";

import { useState } from "react";

type Props = {
  items: (string | number)[];
  maxVisible?: number; // default = 3
  className?: string;
};

export function ExpandableChips({
  items,
  maxVisible = 3,
  className = "",
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = items.slice(0, maxVisible);
  const remainingItems = items.slice(maxVisible);

  return (
    <div className={`w-[220px] ${className}`}>
      <div className="flex flex-wrap items-center gap-1 justify-center">
        {/* Visible items */}
        {visibleItems.map((item, index) => (
          <span
            key={index}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
          >
            {item}
          </span>
        ))}

        {/* Remaining items when expanded */}
        {expanded &&
          remainingItems.map((item, index) => (
            <span
              key={index}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
            >
              {item}
            </span>
          ))}

        {/* Toggle button */}
        {remainingItems.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-200"
          >
            {expanded ? "Show less" : `+${remainingItems.length}`}
          </button>
        )}
      </div>
    </div>
  );
}