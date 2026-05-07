/**
 * app/api/generate-ref-number/route.js
 *
 * POST /api/generate-ref-number
 *
 * Generates the next sequential MTV reference number: MTV-YYYY-XXXXXX
 * Persists a per-year counter in the "RefNumber_Counter" Google Sheet tab.
 *
 * Sheet structure (auto-created if absent):
 *   Header row  →  year | next_sequence
 *   Data row    →  2026 | 3            (means MTV-2026-000003 was last issued)
 *
 * Root bug that caused duplicates:
 *   The old code called appendRow() on first use WITHOUT first writing a
 *   header row. On the second call, readSheet() treated that data row as
 *   the header and returned an empty array, so lastSequence was always 0
 *   and every call produced MTV-YYYY-000001.
 *
 * Fix:
 *   Always call ensureHeaders() before reading so the header row is
 *   guaranteed to exist. Then read → increment → write in one clear flow.
 */

import { NextResponse } from "next/server";
import { readSheet, appendRow, ensureHeaders } from "@/lib/googleSheets";
import { google } from "googleapis";

// ── Sheets client ─────────────────────────────────────────────────────────────
function getSheetsClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "urn:ietf:wg:oauth:2.0:oob",
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return google.sheets({ version: "v4", auth: oauth2Client });
}

function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEET_ID?.trim();
  if (!id) throw new Error("Missing GOOGLE_SHEET_ID in environment variables.");
  return id;
}

const COUNTER_SHEET = "RefNumber_Counter";
const COUNTER_HEADERS = ["year", "next_sequence"];

// ── Core counter logic ────────────────────────────────────────────────────────
/**
 * Reads the current counter for `year`, increments it, writes it back, and
 * returns the new sequence number (1-based integer).
 *
 * Guarantees:
 *  - Header row is written before any data is read.
 *  - The data row is updated in-place after the first call (no accumulation
 *    of duplicate rows for the same year).
 */
async function getNextSequence(year) {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  // Step 1: Guarantee the header row exists.
  // ensureHeaders() is a no-op when headers already match — safe to call every time.
  await ensureHeaders(COUNTER_SHEET, COUNTER_HEADERS);

  // Step 2: Read existing data rows (header row is skipped by readSheet).
  const rows = await readSheet(COUNTER_SHEET);

  // Step 3: Look for a row belonging to the current year.
  const yearStr = String(year);
  const rowIndex = rows.findIndex(
    (r) => String(r.year ?? "").trim() === yearStr,
  );

  if (rowIndex === -1) {
    // ── First reference number for this year ──────────────────────────────
    // Append a new data row with sequence = 1.
    await appendRow(COUNTER_SHEET, [year, 1]);
    return 1;
  }

  // ── Subsequent reference numbers ─────────────────────────────────────────
  const lastSequence = parseInt(rows[rowIndex].next_sequence ?? "0", 10) || 0;
  const nextSequence = lastSequence + 1;

  // Sheet row number: +1 because readSheet skips the header, +1 for 1-based index.
  const sheetRowNumber = rowIndex + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${COUNTER_SHEET}!A${sheetRowNumber}:B${sheetRowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[year, nextSequence]],
    },
  });

  return nextSequence;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST() {
  try {
    const year = new Date().getFullYear();

    const sequence = await getNextSequence(year);
    const paddedSequence = String(sequence).padStart(6, "0");
    const refNumber = `MTV-${year}-${paddedSequence}`;

    return NextResponse.json({ success: true, refNumber }, { status: 200 });
  } catch (error) {
    console.error("Generate ref number error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate reference number",
      },
      { status: 500 },
    );
  }
}
