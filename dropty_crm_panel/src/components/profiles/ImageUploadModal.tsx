// // "use client";

// // import { useState } from "react";
// // import { Camera, Loader2 } from "lucide-react";
// // import { uploadProfileImageAction ,updateProfileAvatarAction } from "@/app/(protected)/dashboard/profile/actions";

// // interface ImageUploadModalProps {
// //   preview: string | null;
// //   setPreview: React.Dispatch<React.SetStateAction<string | null>>;
// //   onClose: () => void;
// //   onUpload?: (file: File) => Promise<void>;   // for first API
// //   onSave?: () => Promise<void>;               // for second API
// // }

// // export default function ImageUploadModal({
// //   preview,
// //   setPreview,
// //   onClose,
// //   onUpload,
// //   onSave,
// // }: ImageUploadModalProps) {

// //   const [isSaving, setIsSaving] = useState(false);

// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);

// // const [isUploaded, setIsUploaded] = useState(false);
// // const [isUploading, setIsUploading] = useState(false);
// // const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

// //   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     setSelectedFile(file);
// //     setPreview(URL.createObjectURL(file));
// //     setIsUploaded(false);
// //   };

// // const handleUpload = async () => {
// //   if (!selectedFile) return;

// //   try {
// //     setIsUploading(true);

// //     const formData = new FormData();
// //     formData.append("file", selectedFile);

// //     const result = await uploadProfileImageAction(formData);

// //     if (!result.success) {
// //       throw new Error(result.message);
// //     }

// //    if (result.success && result.fileName) {
// //   console.log("Uploaded filename:", result.fileName);

// //   setUploadedFileName(result.fileName);
// //   setIsUploaded(true);
// // } else {
// //   throw new Error("Invalid upload response");
// // }

// //   } catch (error: any) {
// //     console.error("Upload failed:", error.message);
// //   } finally {
// //     setIsUploading(false);
// //   }
// // };

// // const handleSave = async () => {
// //   if (!uploadedFileName) return;

// //   try {
// //     setIsSaving(true);

// //     const result = await updateProfileAvatarAction(
// //       uploadedFileName
// //     );

// //     if (!result.success) {
// //       throw new Error(result.message);
// //     }

// //     console.log("✅ Avatar updated");

// //     onClose();

// //   } catch (error: any) {
// //     console.error("Save failed:", error.message);
// //   } finally {
// //     setIsSaving(false);
// //   }
// // };

// //   return (
// //     <div className="space-y-6">
// //       {/* Preview Section */}
// //       <div className="flex justify-center">
// //         <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-zinc-200 bg-zinc-100 shadow-sm">
// //           {preview ? (
// //             <img
// //               src={preview}
// //               alt="Preview"
// //               className="h-full w-full object-cover"
// //             />
// //           ) : (
// //             <div className="flex h-full w-full items-center justify-center text-zinc-400 text-sm">
// //               No Image
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* File Select Area */}
// //       <div className="relative flex h-36 w-full items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors">
// //         <input
// //           type="file"
// //           accept="image/*"
// //           onChange={handleFileSelect}
// //           className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
// //         />
// //         <div className="text-center">
// //           <Camera className="mx-auto h-6 w-6 text-zinc-400 mb-2" />
// //           <p className="text-sm font-medium text-zinc-700">
// //             Click to select image
// //           </p>
// //           <p className="text-xs text-zinc-400">PNG, JPG, JPEG, GIF</p>
// //         </div>
// //       </div>

// //       {/* Buttons */}
// //       <div className="flex justify-end gap-3 pt-2">
// //         <button
// //           onClick={onClose}
// //           className="px-4 py-2 rounded-md text-sm border border-zinc-300 hover:bg-zinc-100 transition"
// //         >
// //           Cancel
// //         </button>

// //         <button
// //           onClick={handleUpload}
// //           disabled={!selectedFile || isUploading}
// //           className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
// //         >
// //           {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
// //           Upload
// //         </button>

// //         <button
// //           onClick={handleSave}
// //           disabled={!isUploaded || isSaving}
// //           className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
// //         >
// //           {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
// //           Save
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import { useState, useRef } from "react";
// import {
//   Loader2,
//   CloudUpload,
//   CheckCircle2,
//   ImageIcon,
//   X,
// } from "lucide-react";
// import {
//   uploadProfileImageAction,
//   updateProfileAvatarAction,
// } from "@/app/(protected)/dashboard/profile/actions";

// interface ImageUploadModalProps {
//   preview: string | null;
//   setPreview: React.Dispatch<React.SetStateAction<string | null>>;
//   onClose: () => void;
// }

// export default function ImageUploadModal({
//   preview,
//   setPreview,
//   onClose,
// }: ImageUploadModalProps) {
//   const [isSaving, setIsSaving] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isUploaded, setIsUploaded] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleFileSelect = (file: File) => {
//     setSelectedFile(file);
//     setPreview(URL.createObjectURL(file));
//     setIsUploaded(false);
//     setUploadedFileName(null);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) handleFileSelect(file);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file && file.type.startsWith("image/")) handleFileSelect(file);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;
//     try {
//       setIsUploading(true);
//       const formData = new FormData();
//       formData.append("file", selectedFile);
//       const result = await uploadProfileImageAction(formData);

//       if (!result.success) throw new Error(result.message);

//       if (result.success && result.fileName) {
//         setUploadedFileName(result.fileName);
//         setIsUploaded(true);
//       }
//     } catch (error: any) {
//       console.error("Upload failed:", error.message);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!uploadedFileName) return;
//     try {
//       setIsSaving(true);
//       const result = await updateProfileAvatarAction(uploadedFileName);
//       if (!result.success) throw new Error(result.message);
//       onClose();
//     } catch (error: any) {
//       console.error("Save failed:", error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         .modal-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(15, 23, 42, 0.55);
//           backdrop-filter: blur(6px);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 9999;
//         }

//         .modal-card {
//           background: #ffffff;
//           border-radius: 18px;
//           width: 100%;
//           max-width: 430px;
//           box-shadow:
//             0 0 0 1px rgba(0,0,0,0.04),
//             0 10px 25px rgba(0,0,0,0.08),
//             0 40px 80px rgba(0,0,0,0.12);
//           overflow: hidden;
//         }

//         .modal-header {
//           padding: 20px 24px 16px;
//           border-bottom: 1px solid #f1f5f9;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }

//         .modal-title {
//           font-size: 15px;
//           font-weight: 600;
//           color: #0f172a;
//         }

//         .modal-subtitle {
//           font-size: 12px;
//           color: #64748b;
//         }

//         .close-btn {
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           border: none;
//           background: #f1f5f9;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//         }

//         .modal-body {
//           padding: 24px;
//         }

//         /* Circle Preview */
//         .avatar-ring {
//           position: relative;
//           width: 120px;
//           height: 120px;
//           margin: 0 auto 24px;
//           animation: fadeScale 0.25s ease;
//         }

//         @keyframes fadeScale {
//           from { opacity: 0; transform: scale(0.9); }
//           to { opacity: 1; transform: scale(1); }
//         }

//         .avatar-ring::before {
//           content: '';
//           position: absolute;
//           inset: -4px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa);
//         }

//         .avatar-inner {
//           position: relative;
//           z-index: 1;
//           width: 100%;
//           height: 100%;
//           border-radius: 50%;
//           overflow: hidden;
//           border: 4px solid white;
//           box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
//         }

//         .avatar-inner img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         /* Dropzone */
//         .dropzone {
//           position: relative;
//           border: 1.5px dashed #cbd5e1;
//           border-radius: 14px;
//           background: #f8fafc;
//           padding: 28px 20px;
//           text-align: center;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .dropzone:hover,
//         .dropzone.dragging {
//           border-color: #2563eb;
//           background: #eff6ff;
//         }

//         .dropzone input {
//           display: none;
//         }

//         .dropzone-icon {
//           width: 44px;
//           height: 44px;
//           border-radius: 12px;
//           background: #eff6ff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 14px;
//           color: #2563eb;
//         }

//         .dropzone-title {
//           font-size: 13px;
//           font-weight: 600;
//           color: #0f172a;
//         }

//         .dropzone-hint {
//           font-size: 11px;
//           color: #94a3b8;
//         }

//         .modal-footer {
//           padding: 0 24px 24px;
//           display: flex;
//           gap: 10px;
//           justify-content: flex-end;
//         }

//         .btn {
//           padding: 9px 18px;
//           border-radius: 10px;
//           font-size: 13px;
//           font-weight: 600;
//           cursor: pointer;
//           border: none;
//           transition: all 0.15s ease;
//         }

//         .btn-ghost {
//           background: #f1f5f9;
//           color: #475569;
//         }

//         .btn-upload {
//           background: #e0f2fe;
//           color: #2563eb;
//         }

//         .btn-save {
//           background: #2563eb;
//           color: white;
//           box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
//         }

//         .btn:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }
//       `}</style>

//       <div
//         className="modal-overlay"
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//       >
//         <div className="modal-card">
//           <div className="modal-header">
//             <div>
//               <div className="modal-title">Update Profile Photo</div>
//               <div className="modal-subtitle">
//                 Upload a new avatar for your profile
//               </div>
//             </div>
//             <button className="close-btn" onClick={onClose}>
//               <X size={14} />
//             </button>
//           </div>

//           <div className="modal-body">
//             {/* Circle appears ONLY after selecting */}
//             {selectedFile && preview && (
//               <div className="avatar-ring">
//                 <div className="avatar-inner">
//                   <img src={preview} alt="Preview" />
//                 </div>
//               </div>
//             )}

//             <div
//               className={`dropzone ${isDragging ? "dragging" : ""}`}
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 setIsDragging(true);
//               }}
//               onDragLeave={() => setIsDragging(false)}
//               onDrop={handleDrop}
//               onClick={() => inputRef.current?.click()}
//             >
//               <input
//                 ref={inputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleInputChange}
//               />
//               <div className="dropzone-icon">
//                 <CloudUpload size={20} />
//               </div>
//               <div className="dropzone-title">
//                 Drag & drop or click to browse
//               </div>
//               <div className="dropzone-hint">
//                 PNG · JPG · JPEG · GIF · WEBP
//               </div>
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button className="btn btn-ghost" onClick={onClose}>
//               Cancel
//             </button>

//             <button
//               className="btn btn-upload"
//               onClick={handleUpload}
//               disabled={!selectedFile || isUploading}
//             >
//               {isUploading ? "Uploading..." : "Upload"}
//             </button>

//             <button
//               className="btn btn-save"
//               onClick={handleSave}
//               disabled={!isUploaded || isSaving}
//             >
//               {isSaving ? "Saving..." : "Save Photo"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import { useState, useRef } from "react";
import { X, Loader2, Check, Camera, ImageIcon } from "lucide-react";
import {
  uploadProfileImageAction,
  updateProfileAvatarAction,
} from "@/app/(protected)/dashboard/profile/actions";

interface ImageUploadModalProps {
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  onClose: () => void;
}

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { n: 1, label: "Select" },
  { n: 2, label: "Upload" },
  { n: 3, label: "Save" },
] as const;

export default function ImageUploadModal({
  preview,
  setPreview,
  onClose,
}: ImageUploadModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const step: Step = isSaving ? 3 : isUploaded ? 2 : selectedFile ? 1 : 0;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setIsUploaded(false);
    setUploadedFileName(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsUploaded(false);
    setUploadedFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      const result = await uploadProfileImageAction(formData);
      if (!result.success) throw new Error(result.message);
      if (result.success && result.fileName) {
        setUploadedFileName(result.fileName);
        setIsUploaded(true);
      }
    } catch (error: any) {
      console.error("Upload failed:", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!uploadedFileName) return;
    try {
      setIsSaving(true);
      const result = await updateProfileAvatarAction(uploadedFileName);
      if (!result.success) throw new Error(result.message);
      onClose();
    } catch (error: any) {
      console.error("Save failed:", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[420px] bg-white rounded-3xl border border-black/[0.07] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* ── HERO ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 pt-8 pb-6 text-center border-b border-slate-100">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-400/10 blur-2xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-black/[0.08] bg-white/70 text-slate-400 backdrop-blur-sm transition-all hover:bg-white hover:text-slate-600"
          >
            <X size={12} strokeWidth={2.5} />
          </button>

          {/* Avatar Stack */}
          <div className="relative mx-auto mb-4 h-24 w-24">
            {/* Ambient glow */}
            <div className="absolute inset-[-8px] animate-spin rounded-full opacity-15 blur-lg [animation-duration:4s] [background:conic-gradient(from_0deg,#3b82f6,#6366f1,#8b5cf6,#3b82f6)]" />

            {/* Dashed spinning ring */}
            <div className="absolute inset-[-3px] animate-spin [animation-duration:8s]">
              <svg viewBox="0 0 110 110" fill="none" className="h-full w-full">
                <circle
                  cx="55"
                  cy="55"
                  r="52"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  opacity="0.35"
                />
              </svg>
            </div>

            {/* Avatar circle */}
            <div className="relative z-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-gradient-to-br from-blue-50 to-blue-100 shadow-[0_4px_20px_rgba(59,130,246,0.2),0_2px_8px_rgba(0,0,0,0.08)]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>

            {/* Camera badge */}
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-0.5 right-0.5 z-20 flex h-[26px] w-[26px] items-center justify-center rounded-full border-[2.5px] border-white bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.4)] transition-all hover:bg-blue-600 hover:scale-110"
            >
              <Camera size={11} color="white" strokeWidth={2.5} />
            </button>
          </div>

          <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
            Update Profile Photo
          </h2>
          <p className="mt-1 text-[12px] text-slate-400">
            Upload a photo to personalize your account
          </p>
        </div>

        {/* ── BODY ── */}
        <div className="flex flex-col gap-3 px-[22px] py-5">
          {/* File selected row */}
          {selectedFile && (
            <div className="flex animate-in fade-in slide-in-from-bottom-2 duration-200 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              {/* File icon */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-500">
                <ImageIcon size={14} />
              </div>

              {/* File info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-slate-800">
                  {selectedFile.name}
                </p>

                {/* Status chip */}
                {isUploaded ? (
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10.5px] font-semibold text-green-700">
                    <Check size={9} strokeWidth={3} />
                    Uploaded
                  </span>
                ) : isUploading ? (
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10.5px] font-semibold text-blue-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                    Uploading…
                  </span>
                ) : (
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-semibold text-amber-800">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                    Ready to upload
                  </span>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={handleRemove}
                className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md text-slate-300 transition-all hover:bg-red-50 hover:text-red-400"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Progress bar */}
          {isUploading && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full animate-[progress_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
            </div>
          )}

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border-[1.5px] border-dashed px-5 py-[22px] transition-all duration-200
              ${
                isDragging
                  ? "border-blue-400 bg-blue-50 shadow-[0_6px_24px_rgba(59,130,246,0.1)] -translate-y-0.5"
                  : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(59,130,246,0.08)]"
              }`}
          >
            {/* Subtle radial highlight */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 [background:radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_60%)]" />

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className="flex items-center gap-3.5">
              {/* Upload icon box */}
              <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border bg-white shadow-sm transition-all duration-200
                ${
                  isDragging
                    ? "border-blue-200 shadow-[0_4px_12px_rgba(59,130,246,0.18)] scale-105"
                    : "border-slate-200 group-hover:border-blue-200 group-hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)] group-hover:scale-105"
                } text-blue-500`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>

              <div>
                <p className="text-[13px] font-semibold tracking-tight text-slate-700">
                  Drop image or{" "}
                  <span className="text-blue-500">browse files</span>
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Supports PNG, JPG, JPEG, WEBP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-[22px] pb-5">
          {/* Step indicators */}
          <div className="mb-4 flex items-center">
            {STEPS.map(({ n, label }, idx) => {
              const isDone = step > n;
              const isActive = step === n;
              return (
                <div
                  key={n}
                  className="relative flex flex-1 flex-col items-center gap-1.5"
                >
                  {/* Connector line */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-[13px] h-[1.5px] w-full transition-colors duration-500
                        ${isDone ? "bg-green-400" : isActive ? "bg-blue-200" : "bg-slate-200"}`}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`relative z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full border-[1.5px] text-[10px] font-bold transition-all duration-300
                      ${
                        isDone
                          ? "border-green-500 bg-green-500 text-white"
                          : isActive
                            ? "border-blue-500 bg-blue-50 text-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                            : "border-slate-200 bg-white text-slate-400"
                      }`}
                  >
                    {isDone ? <Check size={11} strokeWidth={3} /> : n}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-medium tracking-wide transition-colors duration-300
                      ${isDone ? "text-green-500 font-semibold" : isActive ? "text-blue-500 font-semibold" : "text-slate-400"}`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-[12.5px] font-bold text-slate-500 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isUploaded}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-blue-200 bg-blue-50 py-2.5 text-[12.5px] font-bold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isUploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Uploading…
                </>
              ) : (
                "Upload"
              )}
            </button>

            <button
              onClick={handleSave}
              disabled={!isUploaded || isSaving}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-gradient-to-br from-blue-500 to-blue-600 py-2.5 text-[12.5px] font-bold text-white shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_7px_20px_rgba(59,130,246,0.38)] disabled:cursor-not-allowed disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none"
            >
              {isSaving ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Check size={13} strokeWidth={3} /> Save Photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
