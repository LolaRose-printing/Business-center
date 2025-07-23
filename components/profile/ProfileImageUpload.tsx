"use client";

import { useState, useRef } from "react";

export default function ProfileImageUpload({ currentPhotoUrl }: { currentPhotoUrl?: string }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPhotoUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePicture", file);

    setUploading(true);
    try {
      const res = await fetch("/api/user/upload-profile-picture", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        alert("Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="profile-image-upload">
      <img
        src={preview || "/assets/images/avatar-placeholder.png"}
        alt="Profile picture"
        className="w-24 h-24 rounded-full object-cover"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded"
      >
        {uploading ? "Uploading..." : "Change Profile Picture"}
      </button>
    </div>
  );
}
