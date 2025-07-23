"use client";

import { useState, useEffect, useRef } from "react";
import { navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

// ✅ Full real auth hook with refresh
export const useAuth = () => {
  const [user, setUser] = useState<{ name: string; avatarUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser({
            name: data.user.name,
            avatarUrl: data.user.avatarUrl || "/assets/images/avatar-placeholder.png",
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    refresh: fetchUser, // ✅ used by Profile upload
    logout: () => {
      setUser(null);
      window.location.href = "/sign-in";
    },
  };
};

const UserDropdown = ({
  user,
  onLogout,
}: {
  user: { name: string; avatarUrl?: string };
  onLogout: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 focus:outline-none p-4 w-full text-left"
        aria-label="User menu"
        type="button"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
            {user.name.charAt(0)}
          </div>
        )}
        <span className="text-dark-700">{user.name}</span>
      </button>

      {open && (
        <div className="absolute left-full top-0 ml-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            type="button"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <aside className="sidebar flex items-center justify-center p-4">
        <p>Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="sidebar-logo">
          <Image src="/assets/images/logo.png" alt="logo" width={180} height={28} />
        </Link>

        <nav className="sidebar-nav">
          {isAuthenticated && user ? (
            <>
              <ul className="sidebar-nav_elements">
                {navLinks.slice(0, 6).map((link) => {
                  const isActive = link.route === pathname;
                  return (
                    <li
                      key={link.route}
                      className={`sidebar-nav_element group ${
                        isActive ? "bg-purple-gradient text-white" : "text-gray-700"
                      }`}
                    >
                      <Link className="sidebar-link" href={link.route}>
                        <Image
                          src={link.icon}
                          alt={link.label}
                          width={24}
                          height={24}
                          className={`${isActive ? "brightness-200" : ""}`}
                        />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <ul className="sidebar-nav_elements">
                {navLinks.slice(6).map((link) => {
                  const isActive = link.route === pathname;
                  return (
                    <li
                      key={link.route}
                      className={`sidebar-nav_element group ${
                        isActive ? "bg-purple-gradient text-white" : "text-gray-700"
                      }`}
                    >
                      <Link className="sidebar-link" href={link.route}>
                        <Image
                          src={link.icon}
                          alt={link.label}
                          width={24}
                          height={24}
                          className={`${isActive ? "brightness-200" : ""}`}
                        />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                <li className="flex-center cursor-pointer gap-2 p-4">
                  <UserDropdown user={user} onLogout={logout} />
                </li>
              </ul>
            </>
          ) : (
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
