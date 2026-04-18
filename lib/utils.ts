import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const isNightly = false
const isLocal = true
export const API_URL = (isLocal) ? "http://localhost:2876" : (isNightly) ? "https://nightlyserver.trophycase.org" : "https://server.trophycase.org"