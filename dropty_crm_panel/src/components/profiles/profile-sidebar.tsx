"use client";

import { User, Lock, Bell, Check, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState,useEffect } from "react";
import Modal from "../ui/modal";
import ImageUploadModal from "./ImageUploadModal";

import { getProfileImageAction } from "@/app/(protected)/dashboard/profile/actions";


interface ProfileSidebarProps {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  isActive: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onImageUpload?: (file: File) => void;
  statusToggle?: React.ReactNode;
  statusTitle?: string;
  statusDescription?: string;
}

export function ProfileSidebar({
  name,
  email,
  role,
  avatarUrl,
  isActive,
  activeTab,
  onTabChange,
  onImageUpload,
  statusToggle,
  statusTitle,
  statusDescription,
}: ProfileSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onImageUpload?.(file);
    setIsModalOpen(false);
  };
  useEffect(() => {
  async function loadImage() {
    if (!avatarUrl) return;

    const fileName = avatarUrl.split("/").pop()?.split("?")[0];

    if (!fileName) return;

    const result = await getProfileImageAction(fileName);

    if (result.success) {
      setImageSrc(
        `data:${result.contentType};base64,${result.imageBase64}`
      );
    }
  }

  loadImage();
}, [avatarUrl]);


  const navItems = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Lock },
    // { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* PROFILE SUMMARY CARD */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative group">
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-zinc-100 bg-zinc-50 overflow-hidden cursor-pointer hover:opacity-90 transition shadow-sm"
            >
             {preview || imageSrc ? (
  <img
    src={preview ?? imageSrc ?? ""}
    alt="Avatar"
    className="h-full w-full object-cover"
  />
) : (
  <User className="h-10 w-10 text-zinc-400" />
)}

            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-white shadow-md hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-3 w-3" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {name}
            </h3>
            <p className="text-sm text-zinc-500">{email}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary uppercase tracking-wide">
              {role}
            </span>
            {isActive ? (
               <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                 <Check className="h-3 w-3" /> Verified
               </span>
            ) : (
               <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 border border-red-200">
                 <X className="h-3 w-3" /> Unverified
               </span>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* STATUS TOGGLE (OPTIONAL) */}
      {statusToggle && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              {statusTitle && (
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {statusTitle}
                </p>
              )}
              {statusDescription && (
                <p className="text-xs text-zinc-500">
                  {statusDescription}
                </p>
              )}
            </div>
            {statusToggle}
          </div>
        </div>
      )}

       {/* IMAGE UPLOAD MODAL */}
       {/* <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Profile Image"
      >
        <div className="space-y-4">
          <div className="relative flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div className="text-center">
              <Camera className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
              <p className="text-sm text-zinc-600 font-medium">Click to upload</p>
              <p className="text-xs text-zinc-400">SVG, PNG, JPG or GIF</p>
            </div>
          </div>
        </div>
      </Modal> */}
      {/* IMAGE UPLOAD MODAL */}
<Modal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Update Profile Image"
>
  <ImageUploadModal
    preview={preview}
    setPreview={setPreview}
    onClose={() => setIsModalOpen(false)}
  />
</Modal>



    </div>
  );
}
