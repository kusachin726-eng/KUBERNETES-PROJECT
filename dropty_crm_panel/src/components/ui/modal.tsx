"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  onEdit,
  showEdit,
  onImageUpload,
  enableImageUpload = false,
  maxWidth = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  onEdit?: () => void;
  showEdit?: boolean;
  enableImageUpload?: boolean;
  onImageUpload?: (file: File) => void;
  maxWidth?: string;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);

    try {
      console.log("Uploading:", selectedImage);

      onImageUpload?.(selectedImage);

      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-[#f8fafc] rounded-2xl shadow-xl flex flex-col max-h-[85vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-lg font-semibold">{title}</div>

          <div className="flex items-center gap-4">
            {showEdit && (
              <button
                onClick={onEdit}
                title="Edit"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition"
              >
                <Pencil size={14} />
              </button>
            )}

            <button
              onClick={onClose}
              className="text-[26px] leading-none hover:text-red-500"
            >
              ×
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ✅ If Image Upload Enabled */}
          {enableImageUpload ? (
            <div className="flex flex-col items-center gap-6">
              {/* Preview */}
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-full border-4 border-blue-100 shadow-md"
                />
              ) : (
                <div className="flex justify-center">
                  <div className="p-6 bg-white rounded-full shadow-inner border border-slate-200">
                    <div className="w-40 h-40 rounded-full flex items-center justify-center text-slate-400 text-sm">
                      No Image Selected
                    </div>
                  </div>
                </div>
              )}

              {/* File Input */}
              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-2 rounded-lg border border-blue-200 transition">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Upload Button */}
              {preview && (
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-40 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md transition disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              )}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
