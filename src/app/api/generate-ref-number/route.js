/**
 * app/api/generate-ref-number/route.js
 *
 * POST /api/generate-ref-number
 * Generates the next sequential reference number in format MTV-YYYY-XXXXXX
 * Manages a counter in Google Sheets to ensure sequential numbering.
 *
 * Sheet tab name: RefNumber_Counter
 * Columns: year | next_sequence
 *
 * Returns: { success: true, refNumber: "MTV-2026-000001" }
 */

import { NextResponse } from "next/server";
import { generateSequentialRefNumber } from "@/lib/refNumber";
import { readSheet, appendRow, ensureHeaders } from "@/lib/googleSheets";
import { google } from "googleapis";

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
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim();
  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID in environment variables.");
  }
  return spreadsheetId;
}

async function getOrCreateCounter(year) {
  try {
    const rows = await readSheet("RefNumber_Counter");

    // Find the row for this year
    const yearRow = rows.find((r) => String(r.year).trim() === String(year));

    if (yearRow) {
      return {
        lastSequence: parseInt(yearRow.next_sequence || "0", 10),
        rowIndex: rows.indexOf(yearRow) + 2, // +2 because sheet has header and is 1-indexed
      };
    }

    // Year not found, return 0 and we'll create a new row
    return { lastSequence: 0, rowIndex: null };
  } catch (error) {
    // Sheet might not exist yet, return 0
    console.warn(
      "RefNumber_Counter sheet not found, will create:",
      error.message,
    );
    return { lastSequence: 0, rowIndex: null };
  }
}

async function updateCounter(year, newSequence, rowIndex) {
  try {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    if (rowIndex) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `RefNumber_Counter!A${rowIndex}:B${rowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[year, newSequence]],
        },
      });
    } else {
      // Create new row - append directly (appendRow will create sheet/headers if needed)
      try {
        await appendRow("RefNumber_Counter", [year, newSequence]);
      } catch (appendError) {
        // If append fails (sheet might not exist), try to ensure headers first
        console.warn(
          "First append to RefNumber_Counter failed, attempting to create headers:",
          appendError.message,
        );
        try {
          await ensureHeaders("RefNumber_Counter", ["year", "next_sequence"]);
          await appendRow("RefNumber_Counter", [year, newSequence]);
        } catch (ensureError) {
          console.warn(
            "Could not ensure headers for RefNumber_Counter:",
            ensureError.message,
          );
          // Continue anyway - the sequential number was already generated
        }
      }
    }
  } catch (error) {
    console.error("Failed to update RefNumber_Counter:", error);
    // Continue anyway - the sequential number was already generated
  }
}

export async function POST(request) {
  try {
    const year = new Date().getFullYear();

    // Get current counter for this year
    const { lastSequence, rowIndex } = await getOrCreateCounter(year);

    // Generate next sequential number
    const refNumber = generateSequentialRefNumber(lastSequence);

    // Update counter in sheet
    const newSequence = lastSequence + 1;
    await updateCounter(year, newSequence, rowIndex);

    return NextResponse.json(
      {
        success: true,
        refNumber,
      },
      { status: 200 },
    );
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
