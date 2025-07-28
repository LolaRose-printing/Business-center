"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";

import { getUserImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";

type SearchParamProps = {
  searchParams: {
    page?: string;
  };
};

const Profile = ({ searchParams }: SearchParamProps) => {
  const router = useRouter();
  const page = Number(searchParams?.page) || 1;

  // User state to hold and refresh user data
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<any>(null);

  // Extract token from cookies manually or use your auth context
  // Here assuming you have a way to get userId from the client (or from your auth context)
  // You might need to adjust this if you fetch userId on the server side

  const getCurrentUserId = () => {
    // You need to implement a client-side way to get the user ID or token
    // This example assumes token is stored in localStorage or cookie accessible in client
    const token = localStorage.getItem("token");
    if (!token) return null;
    // decode JWT token if needed here or get userId from context
    // For simplicity, returning null here (replace with your logic)
    return null;
  };

  const userId = getCurrentUserId();

  // Redirect if no user
  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId, router]);

  // Fetch user and images
  const fetchData = useCallback(async () => {
    if (!userId) return;

    const fetchedUser = await getUserById(userId);
    if (!fetchedUser) {
      router.push("/sign-in");
      return;
    }
    setUser(fetchedUser);

    const fetchedImages = await getUserImages({ page, userId });
    setImages(fetchedImages);
  }, [userId, page, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh user callback passed to ProfileImageUpload
  const refreshUser = async () => {
    if (!userId) return;
    const refreshedUser = await getUserById(userId);
    setUser(refreshedUser);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header title="Profile" />

      <section className="profile">
        {/* ✅ Profile picture uploader */}
        <ProfileImageUpload
          currentPhotoUrl={user.photo}
          refreshUser={refreshUser}
        />

        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{user.creditBalance}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="photo icon"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{images?.data.length || 0}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        <Collection images={images?.data ?? []} totalPages={images?.totalPages ?? 1} page={page} />
      </section>
    </>
  );
};

export default Profile;
