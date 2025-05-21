import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

// Format currency with Indian Rupee format
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Format percentage values
export function formatPercentage(value: number): string {
  const isPositive = value >= 0;
  return `${isPositive ? '+' : ''}${value.toFixed(2)}%`;
}

// Get persona emoji based on risk level
export function getPersonaEmoji(persona: string): string {
  switch (persona.toLowerCase()) {
    case 'owl':
      return '🦉';
    case 'fox':
      return '🦊';
    case 'shark':
      return '🦈';
    default:
      return '🦊';
  }
}

// Get persona color based on risk level
export function getPersonaColor(persona: string): string {
  switch (persona.toLowerCase()) {
    case 'owl':
      return 'blue';
    case 'fox':
      return 'yellow';
    case 'shark':
      return 'red';
    default:
      return 'yellow';
  }
}

// Create truncated username for display
export function formatUsername(username: string): string {
  if (!username) return '';
  
  // Ensure username has @ prefix
  if (!username.startsWith('@')) {
    return `@${username}`;
  }
  
  return username;
}

// Time ago formatter
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return past.toLocaleDateString();
}
