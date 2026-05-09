
"use client";

import { useState } from "react"; // ✅ added
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Pencil, User } from "lucide-react";
import Modal from "../ui/modal";
interface ProfileCardProps {
  name: string;
  email: string;
  id?: number | string;
  isActive?: boolean;
  onToggleStatus?: (next: boolean) => void;
  disableToggle?: boolean;
  loading?: boolean;

  imageUrl?: string; // ✅ added
  onImageUpload?: (file: File) => void; // ✅ added
}

export function ProfileCard({
  id,
  name,
  email,
  isActive = false,
  onToggleStatus,
  disableToggle = false,
  loading = false,
  imageUrl, // ✅ added
  onImageUpload, // ✅ added
}: ProfileCardProps) {

  // ✅ added
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleToggle = () => {
    if (disableToggle || loading) return;
    onToggleStatus?.(!isActive);
  };

  // ✅ added
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onImageUpload?.(file);
  };

  const truncateByChars = (text: string, maxChars = 20) => {
    if (!text) return "";
    return text.length > maxChars
      ? text.slice(0, maxChars) + "…"
      : text;
  };

  return (
    <>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-3">
            {/* AVATAR */}
            <div
              onClick={() => setIsModalOpen(true)} // ✅ added
              className="mx-auto flex h-[90px] w-[90px] items-center justify-center rounded-full border bg-muted overflow-hidden cursor-pointer hover:opacity-80 transition"
            >
              {imageUrl || preview ? ( // ✅ added
                <img
                  src={preview || imageUrl}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-zinc-500" />
              )}
            </div>

            {/* NAME + ID + EMAIL */}
            <div>
              <p className="text-base font-semibold text-zinc-900 mx-auto flex items-center justify-center gap-1">
                <span title={name}>
                  {truncateByChars(name, 13)}
                </span>

                {id && (
                  <span className="text-sm font-normal text-zinc-900 whitespace-nowrap">
                    (ID: {id})
                  </span>
                )}
              </p>

              <p className="text-sm text-zinc-600">{email}</p>
            </div>

            {/* STATUS */}
            <div className="flex items-center justify-center gap-2">
              {isActive ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-3 py-1 text-xs font-medium text-emerald-700">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500 px-3 py-1 text-xs font-medium text-red-600">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
                    <X className="h-3 w-3 text-white" />
                  </span>
                  Unverified
                </span>
              )}

              {onToggleStatus && !disableToggle && (
                <button
                  onClick={handleToggle}
                  disabled={loading}
                  title={isActive ? "Mark as Unverified" : "Mark as Verified"}
                  className="flex h-6 w-6 items-center justify-center rounded-md
                           text-blue-600 transition
                           hover:bg-blue-50
                           disabled:cursor-not-allowed
                           disabled:opacity-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-md bg-muted/50 px-4 py-2
                     text-xs font-semibold uppercase tracking-wide
                     text-zinc-700 hover:bg-muted"
          >
            Personal Information
          </button>
        </CardContent>
      </Card>

      {/* ✅ IMAGE UPLOAD MODAL (added) */}
      <Modal
       open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Profile Image"
      
        enableImageUpload={true}
          onImageUpload={(file) => {
    setPreview(URL.createObjectURL(file));
    onImageUpload?.(file); // optional if backend later
  }}
      >
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />

          <button
            onClick={() => setIsModalOpen(false)}
            className="w-full rounded-md bg-blue-600 py-2 text-white"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  );
}
