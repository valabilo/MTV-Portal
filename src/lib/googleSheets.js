import { google } from "googleapis";

// ── Auth ──────────────────────────────────────────────────────────
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

  if (spreadsheetId.startsWith("http")) {
    throw new Error(
      "GOOGLE_SHEET_ID must be only the spreadsheet ID, not the full Google Sheets URL.",
    );
  }

  return spreadsheetId;
}

// ── Generic helpers ───────────────────────────────────────────────
/**
 * Reads all rows from a sheet tab and returns them as objects.
 * First row = headers (lowercased, spaces → underscores).
 * @param {string} sheetName
 * @returns {Promise<Record<string, string>[]>}
 */
export async function readSheet(sheetName) {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: sheetName,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map((header) =>
    String(header).trim().toLowerCase().replace(/\s+/g, "_"),
  );

  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ?? "";
    });
    return obj;
  });
}

/**
 * Appends a single row to a sheet tab.
 * @param {string} sheetName
 * @param {string[]} rowData
 */
export async function appendRow(sheetName, rowData) {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowData],
    },
  });
}

// ── Domain-specific helpers ───────────────────────────────────────
export async function getAccreditedList() {
  return readSheet("Accredited");
}

export async function getBannedList() {
  return readSheet("Banned");
}

/**
 * Saves a completed GHP certificate record.
 * Sheet tab name: GHP_Completions
 * Columns: cert_number | timestamp | name | email | score | pct | issued_date
 */
export async function saveGHPCompletion(data) {
  return appendRow("GHP_Completions", [
    data.certNumber,
    new Date().toISOString(),
    data.name,
    data.email,
    `${data.score}/${data.total}`,
    `${data.pct}%`,
    data.issuedDate,
  ]);
}

/**
 * Saves a new MTV application.
 * Sheet tab name: Applications
 */
export async function saveApplication(data) {
  return appendRow("Applications", [
    data.refNumber,
    new Date().toISOString(),
    data.firstname,
    data.lastname,
    data.email,
    data.contact,
    data.address,
    data.province ?? "",
    data.plate,
    data.vtype,
    data.vmake,
    data.vmodel,
    data.vyear,
    data.capacity,
    data.bname,
    data.btype,
    data.baddress,
    data.driveFolderId ?? "",
    "Pending",
  ]);
}

/**
 * Saves a contact form message.
 * Sheet tab name: Contacts
 */
export async function saveContactMessage(data) {
  return appendRow("Contacts", [
    new Date().toISOString(),
    data.name,
    data.email,
    data.phone ?? "",
    data.subject,
    data.message,
    "Unread",
  ]);
}
