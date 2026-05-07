/**
 * lib/validators.js
 * Form validation utilities
 */

export function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function validatePhoneNumber(phone) {
  // Philippine phone format
  const pattern = /^(\+63|0)?9\d{9}$/;
  return pattern.test(phone.replace(/\D/g, ""));
}

export function validatePlateNumber(plate) {
  // Flexible plate validation - allows various formats
  // Trim and convert to uppercase for consistent validation
  const plate_clean = String(plate || "")
    .trim()
    .toUpperCase()
    .replace(/\s/g, ""); // Remove all whitespace

  // Accept plates between 4-10 characters (after removing spaces)
  // Allows formats like: ABC1234, ABC 1234, ABC-1234, etc.
  return plate_clean.length >= 4 && plate_clean.length <= 10;
}

export function validateYear(year) {
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  return yearNum >= 1950 && yearNum <= currentYear + 1;
}

export function validateCapacity(capacity) {
  const cap = parseFloat(capacity);
  return cap > 0 && cap <= 50000;
}

export function validateAddress(address) {
  return Boolean(address && address.trim());
}

export function validateName(name) {
  return name && name.trim().length >= 2;
}
