"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context";
import { useFetchUserByIdQuery } from "@/store/api/splits/users";
import { SignOutConfirmationModal } from "../shared/SignOutConfirmationModal";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const { user: authUser, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const { data: fullUser } = useFetchUserByIdQuery(authUser?.id ?? "", {
    skip: !authUser?.id,
  });

  const user = fullUser ??
    authUser ?? {
      name: "Guest",
      email: "guest@example.com",
      avatar: "/images/user/user.png",
    };

  useEffect(() => {
    setIsImageError(false);
  }, [user?.avatar]);

  const avatarSrc =
    isImageError || !user.avatar ? "/images/user/user.png" : user.avatar;

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleSignOutClick = () => {
    closeDropdown();
    setIsModalOpen(true);
  };

  const handleSignOutConfirm = () => {
    logout();
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src={avatarSrc}
            alt="User"
            className="h-full w-full object-cover"
            onError={() => setIsImageError(true)}
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user.name}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user.name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              User profile
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleSignOutClick}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Sign out
        </button>
      </Dropdown>

      <SignOutConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSignOutConfirm}
      />
    </div>
  );
}
