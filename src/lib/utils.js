import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  if (amount >= 1000000) {
    return (amount / 1000000).toLocaleString('vi-VN') + ' Tr';
  } else if (amount >= 1000) {
    return (amount / 1000).toLocaleString('vi-VN') + 'K';
  }
  return amount.toLocaleString('vi-VN') + ' ₫';
}
