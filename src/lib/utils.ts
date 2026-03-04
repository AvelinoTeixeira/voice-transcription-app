import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Detecta idioma do browser para pré-selecionar PT ou EN
export function detectBrowserLanguage(): 'pt' | 'en' {
  const lang = navigator.language.toLowerCase()
  return lang.startsWith('pt') ? 'pt' : 'en'
}