import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import safeStorage from "./storage";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getUserAvatar(user) {
  if (!user) return "";
  if (user.avatarUrl) return user.avatarUrl;
  const meta = safeStorage.getJSON(`profile_meta_${user.id}`, null);
  return meta?.avatarUrl || "";
}