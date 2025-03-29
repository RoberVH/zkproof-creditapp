import { clsx, type ClassValue } from "clsx"
import { get } from "http";
import { twMerge } from "tailwind-merge"

import { ZKProofToStore, StoredProofRecord  } from './app-types'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to return current Unix timestamp (in seconds)
export function getUnixDate(): number {
  return Math.floor(Date.now() / 1000)
}

export function getEmployeeStorageKey(employee: string): string {
    const encodedEmployeeName = btoa(employee); 
    return `zkproofs_${encodedEmployeeName}`
}

export function getEmployeeProofs(employee: string): StoredProofRecord[] {
  const storageKey = getEmployeeStorageKey(employee)
  let  storedProofs: StoredProofRecord[]
  const existingData = localStorage.getItem(storageKey)
  storedProofs = existingData ? JSON.parse(existingData) : []
  return storedProofs
}

export function convertUnixDate(unixDate: number): string {
  const date = new Date(unixDate * 1000)
  return date.toLocaleString()
}

export function copyClipboard(text: string): void {
  navigator.clipboard.writeText(text)
}