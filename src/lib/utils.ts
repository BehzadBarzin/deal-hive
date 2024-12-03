import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Remove trailing slash from string (used with Zod validation to transform URL inputs)
export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, "");
}
