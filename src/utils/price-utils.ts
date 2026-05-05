/**
 * Utility to parse human-readable price strings into numbers.
 * Handles Indian numbering system (Lakh, Crore) and standard suffixes (K, M).
 */
export const parsePrice = (priceStr: string | number): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;

  let cleaned = priceStr.toLowerCase().replace(/,/g, "").trim();
  
  // Extract numeric part
  const numericMatch = cleaned.match(/[\d.]+/);
  if (!numericMatch) return 0;
  
  const value = parseFloat(numericMatch[0]);
  let multiplier = 1;

  if (cleaned.includes("crore") || cleaned.includes(" cr")) {
    multiplier = 10000000;
  } else if (cleaned.includes("lakh") || cleaned.includes(" lac") || cleaned.includes(" l")) {
    multiplier = 100000;
  } else if (cleaned.includes("thousand") || cleaned.includes(" k")) {
    multiplier = 1000;
  } else if (cleaned.includes(" m")) {
    multiplier = 1000000;
  }

  return value * multiplier;
};

/**
 * Robustly format a price string for display.
 * If it already contains currency symbols or units like Crore/Lakh, it returns it as is.
 * Otherwise, it formats it as a localized Indian Rupee string.
 */
export const formatPrice = (price: string | number): string => {
  if (typeof price === "number") {
    return `Rs. ${price.toLocaleString("en-IN")}`;
  }

  const p = price.toLowerCase();
  
  // If it already looks formatted (has currency or words), keep it but maybe cleanup
  if (
    p.includes("$") || 
    p.includes("rs") || 
    p.includes("crore") || 
    p.includes("cr") || 
    p.includes("lakh") || 
    p.includes("lac") ||
    p.includes("thousand") ||
    p.includes("k")
  ) {
    return price;
  }

  // Otherwise, parse and format
  const numericValue = parseInt(price.replace(/[^0-9]/g, ""));
  if (isNaN(numericValue)) return price;
  
  return `Rs. ${numericValue.toLocaleString("en-IN")}`;
};
