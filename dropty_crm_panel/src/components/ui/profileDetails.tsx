"use client";

import React from "react";

type DetailField = {
  label: string;
  value?: string | null;
};

interface EntityDetailsCardProps {
  /** Page title like "Crew Details", "Staff Details" */
  title: string;

  /** Main name shown in header */
  name?: string;

  /** Subtitle like "Rider ID: 164" */
  subtitle?: string;

  /** Initials shown in avatar circle */
  initials?: string;

  /** Grid fields */
  fields: DetailField[];

  /** Optional footer (status toggle etc.) */
  footer?: React.ReactNode;
}

export default function ProfileDetails({
  title,
  name,
  subtitle,
  initials,
  fields,
  footer,
}: EntityDetailsCardProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {/* TOP CARD HEADER */}
        <div className="flex items-center gap-4 border-b border-zinc-200 p-5 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 text-lg font-bold dark:bg-zinc-800">
            {initials || "N/A"}
          </div>

          <div className="flex-1">
            {name && (
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {name}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-zinc-500">{subtitle}</p>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          {fields.map((field, index) => (
            <DetailItem
              key={index}
              label={field.label}
              value={field.value}
            />
          ))}
        </div>

        {/* FOOTER */}
        {footer && (
          <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50/30 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-500">{label}</span>
      <span className="text-sm font-semibold text-zinc-900 capitalize">
        {value || "N/A"}
      </span>
    </div>
  );
}
