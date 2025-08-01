"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

// ✅ Mock auth hook — adjust to your real one!
const useAuth = () => {
  const [user, setUser] = useState<{ name: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser({
        name: "Jane Doe",
        avatarUrl: "/assets/images/avatar-placeholder.png",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
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
        className="flex items-center gap-2 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
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
        <span className="hidden md:inline text-dark-700">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
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

const MobileNav = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image src="/assets/images/logo.png" alt="logo" width={180} height={28} />
      </Link>

      <nav className="flex gap-2 items-center">
        {isAuthenticated && user ? (
          <>
            <UserDropdown user={user} onLogout={logout} />

            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Open menu">
                  <Image
                    src="/assets/icons/menu.svg"
                    alt="menu"
                    width={32}
                    height={32}
                    className="cursor-pointer"
                  />
                </button>
              </SheetTrigger>
              <SheetContent className="sheet-content sm:w-64">
                <>
                  <Image src="/assets/images/logo.png" alt="logo" width={152} height={23} />

                  <ul className="header-nav_elements mt-4">
                    {navLinks.map((link) => {
                      const isActive = link.route === pathname;

                      return (
                        <li
                          key={link.route}
                          className={`${
                            isActive ? "gradient-text" : ""
                          } p-18 flex whitespace-nowrap text-dark-700`}
                        >
                          <Link
                            className="sidebar-link cursor-pointer flex items-center gap-2"
                            href={link.route || "/"} // ✅ fallback to "/" to fix TS error
                            onClick={() => {
                              // Optional: Close sheet after nav
                            }}
                          >
                            <Image src={link.icon} alt={link.label} width={24} height={24} />
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in">Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
};

export default MobileNav;
