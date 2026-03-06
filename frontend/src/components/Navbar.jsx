import React from "react";
import { User, Code, LogOut, BookOpen, LayoutGrid, Trophy } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full py-4">
      <div className="flex w-full justify-between mx-auto max-w-7xl bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 px-4 md:px-6 py-3 rounded-2xl">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <img
              src="/leetlab.svg"
              alt="LeetLab Logo"
              className="h-12 w-12 bg-primary/20 text-primary border-none p-2 rounded-full transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg md:text-xl font-extrabold tracking-tight text-white hidden sm:block">
            Leet<span className="text-primary">Lab</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {/* Problems (Home) */}
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isActive("/")
                ? "bg-primary/20 text-primary"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Problems
          </Link>

          {/* Contest (Optional - for future) */}
          

          {/* Playlists */}
          <Link
            to="/playlist"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isActive("/playlist")
                ? "bg-primary/20 text-primary"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Playlists
          </Link>
        </div>

        {/* Right Section: User Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <div className="md:hidden dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 space-y-1"
            >
              <li>
                <Link
                  to="/"
                  className={isActive("/") ? "text-primary font-semibold" : ""}
                >
                  <LayoutGrid className="w-4 h-4" /> Problems
                </Link>
              </li>
              <li>
                <Link
                  to="/playlist"
                  className={
                    isActive("/playlist") ? "text-primary font-semibold" : ""
                  }
                >
                  <BookOpen className="w-4 h-4" /> Playlists
                </Link>
              </li>
              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className={
                      isActive("/add-problem")
                        ? "text-primary font-semibold"
                        : ""
                    }
                  >
                    <Code className="w-4 h-4" /> Add Problem
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* User Dropdown */}
          {authUser ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all">
                  <img
                    src={
                      authUser?.image ||
                      `https://api.dicebear.com/9.x/pixel-art/svg?seed=${authUser?.name || "User"}`
                    }
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-56 space-y-1"
              >
                {/* User Info Header */}
                <li className="px-3 py-2">
                  <p className="text-sm font-semibold text-base-content">
                    {authUser?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {authUser?.email}
                  </p>
                  {authUser?.role === "ADMIN" && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                      ADMIN
                    </span>
                  )}
                </li>
                <li>
                  <hr className="border-gray-200/10" />
                </li>

                {/* Profile Link */}
                <li>
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 ${isActive("/profile") ? "text-primary font-semibold" : ""}`}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                </li>

                {/* Admin Option */}
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className={`flex items-center gap-2 ${isActive("/add-problem") ? "text-primary font-semibold" : ""}`}
                    >
                      <Code className="w-4 h-4" />
                      Add Problem
                    </Link>
                  </li>
                )}

                {/* Playlists Link */}
                <li>
                  <Link
                    to="/playlist"
                    className={`flex items-center gap-2 ${isActive("/playlist") ? "text-primary font-semibold" : ""}`}
                  >
                    <BookOpen className="w-4 h-4" />
                    My Playlists
                  </Link>
                </li>

                <li>
                  <hr className="border-gray-200/10" />
                </li>

                {/* Logout */}
                <li>
                  <LogoutButton className="w-full flex items-center gap-2 text-error hover:bg-error/10">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>
          ) : (
            /* Guest User: Show Login/Signup */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-ghost btn-sm text-white hover:bg-white/10"
              >
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
