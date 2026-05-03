/**
 * lib/refNumber.js
 * Generates MTV application reference numbers with format: MTV-YYYY-XXXXX
 */

export function generateRefNumber() {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `MTV-${year}-${random}`;
}

export function validateRefNumber(refNumber) {
  const pattern = /^MTV-\d{4}-\d{5}$/;
  return pattern.test(refNumber);
}
