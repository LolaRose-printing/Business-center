"use client";

import React, { useState } from "react";

export default function ProfileImageUpload({
  currentPhotoUrl,
  refreshUser, // ✅ This lets you update Sidebar avatar
}: {
  currentPhotoUrl: string | null | undefined;
  refreshUser: () => void; // ✅ required!
}) {
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/profile/upload", {
      method: "POST",
      body: formData,
    });

    // ✅ After upload, refresh user in Sidebar
    refreshUser();
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <img
          src={previewUrl || "/assets/images/avatar-placeholder.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />

        <label
          htmlFor="file-upload"
          className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 cursor-pointer hover:bg-gray-100 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">Click icon to change photo</p>
    </div>
  );
}
