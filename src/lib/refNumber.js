/**
 * refNumber.js
 *
 * Sequential reference number generation in format: MTV-YYYY-XXXXXX
 * Where XXXXXX is a zero-padded sequential counter starting from 000001
 *
 * Note: This file is for validation only. Sequential generation is handled
 * by /api/generate-ref-number endpoint which manages the counter in Google Sheets.
 */

export function validateRefNumber(refNumber) {
  const pattern = /^MTV-\d{4}-\d{6}$/;
  return pattern.test(refNumber);
}

/**
 * Generate next sequential refNumber for the current year.
 * This is a helper that should be called from the server endpoint.
 * @param {number} lastSequence - The last sequence number for this year
 * @returns {string} Next reference number in format MTV-YYYY-XXXXXX
 */
export function generateSequentialRefNumber(lastSequence = 0) {
  const year = new Date().getFullYear();
  const nextSequence = lastSequence + 1;
  const paddedSequence = String(nextSequence).padStart(6, "0");
  return `MTV-${year}-${paddedSequence}`;
}
