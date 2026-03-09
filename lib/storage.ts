"use client";

// ===== お気に入り曲 =====
export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) { favs.splice(idx, 1); } else { favs.unshift(id); }
  localStorage.setItem("favorites", JSON.stringify(favs));
  return idx < 0;
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

// ===== マイ単語帳 =====
export interface SavedWord {
  word: string;
  meaning: string;
  savedAt: number;
}

export function getSavedWords(): SavedWord[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("savedWords") || "[]");
}

export function saveWord(word: string, meaning: string): void {
  const words = getSavedWords();
  if (words.find((w) => w.word === word)) return;
  words.unshift({ word, meaning, savedAt: Date.now() });
  localStorage.setItem("savedWords", JSON.stringify(words));
}

export function removeWord(word: string): void {
  const words = getSavedWords().filter((w) => w.word !== word);
  localStorage.setItem("savedWords", JSON.stringify(words));
}

export function isWordSaved(word: string): boolean {
  return getSavedWords().some((w) => w.word === word);
}
