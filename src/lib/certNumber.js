/**
 * lib/certNumber.js
 * Generates GHP certificate numbers with format: GHP-YYYY-XXXXX
 */

export function generateCertNumber() {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `GHP-${year}-${random}`;
}

export function validateCertNumber(certNumber) {
  const pattern = /^GHP-\d{4}-\d{5}$/;
  return pattern.test(certNumber);
}
