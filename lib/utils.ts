import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: replace this with native crypto.randomUUID()?
// (https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
// requires HTTPS, and is only recently considered widely available
export { v4 as uuid } from "uuid";

export function formatCurrency(
  value: number,
  locale = "en-US",
  currency = "USD"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
