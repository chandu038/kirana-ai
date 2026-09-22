import { getUser } from "@/lib/api";

const keyFor = () => `avatarSeed:${getUser()?.id ?? "guest"}`;

export const newAvatarSeed = () => Math.floor(Math.random() * 1e9);

// each account keeps its own random avatar
export function loadAvatarSeed() {
  const saved = localStorage.getItem(keyFor());
  if (saved) return Number(saved);
  const seed = newAvatarSeed();
  localStorage.setItem(keyFor(), String(seed));
  return seed;
}

export const saveAvatarSeed = (seed) => localStorage.setItem(keyFor(), String(seed));