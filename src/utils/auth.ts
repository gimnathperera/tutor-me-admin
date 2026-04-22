import { Tokens } from "@/types/auth-types";
import {
  getLocalStorageItem,
  LocalStorageKey,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "./local-storage";
import { env } from "@/configs/env";
import { Endpoints } from "@/store/api/endpoints";

/**
 * Returns true if the given ISO date string is in the past (i.e. expired).
 */
export const isTokenExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt).getTime() < Date.now();
};

/**
 * Returns true when the stored refresh token exists and has NOT yet expired.
 * This is the primary guard for whether the user is still authenticated.
 */
export const isSessionValid = (): boolean => {
  const tokens = getLocalStorageItem<Tokens>(LocalStorageKey.TOKENS);
  if (!tokens?.refresh?.token || !tokens?.refresh?.expires) {
    return false;
  }
  return !isTokenExpired(tokens.refresh.expires);
};

export const handleForceLogout = () => {
  removeLocalStorageItem(LocalStorageKey.USER_DATA);
  removeLocalStorageItem(LocalStorageKey.TOKENS);
  localStorage.clear();
  window.location.href = "/signin";
};

export const getAccessToken = (): string | null => {
  const storedToken = getLocalStorageItem<Tokens>(LocalStorageKey.TOKENS);
  return storedToken?.access?.token || null;
};

export const getAdminId = (): string | null => {
  const userData = getLocalStorageItem<{ id?: string | number }>(
    LocalStorageKey.USER_DATA,
  );
  return userData?.id ? String(userData.id) : null;
};

export const handleRefreshTokenProcess = async (): Promise<boolean> => {
  const storedToken = getLocalStorageItem<Tokens>(LocalStorageKey.TOKENS);
  const refreshToken = storedToken?.refresh?.token;

  if (!refreshToken) {
    console.warn("No refresh token available.");
    return false;
  }

  try {
    const response = await fetch(
      `${env.urls.apiUrl}${Endpoints.RefreshToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (response.ok) {
      const newTokens = await response.json();
      setLocalStorageItem(LocalStorageKey.TOKENS, newTokens);
      console.log("Token refreshed successfully.");
      return true;
    } else {
      console.error("Failed to refresh token.");
      return false;
    }
  } catch (error) {
    console.error("Error while refreshing token:", error);
    return false;
  }
};
