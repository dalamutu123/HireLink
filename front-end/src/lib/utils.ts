export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatSalary(salary?: string | null): string {
  if (!salary || salary.trim() === "") return "Competitive";
  
  const trimmed = salary.trim();
  // Check if it already has a currency symbol as first character
  const hasCurrency = /^[^a-zA-Z0-9\s]/.test(trimmed) || /USD|EUR|GBP|NGN/i.test(trimmed);
  
  if (!hasCurrency) {
    // Check if it's a number, maybe with commas or k (e.g. 50k, 50,000, 50000)
    // We'll just prefix ₦
    return `₦${trimmed}`;
  }
  return trimmed;
}
