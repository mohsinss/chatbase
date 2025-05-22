import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateRandomCode(length = 6) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(0) + ' KB';
  const mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(0) + ' MB';
  const gb = mb / 1024;
  return gb.toFixed(2) + ' GB';
}

export function convertToJSON(obj){
  return JSON.parse(JSON.stringify(obj));
}
