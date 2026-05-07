/**
 * app/api/drive/create-folder/route.js
 *
 * POST /api/drive/create-folder
 * Creates a sub-folder in the MTV Applications Drive folder.
 * Called first so we have a folderId before uploading files directly.
 *
 * Body: { folderName }
 * Returns: { folderId }
 */

import { NextResponse } from "next/server";
import { google } from "googleapis";

function getDriveClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "urn:ietf:wg:oauth:2.0:oob",
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return google.drive({ version: "v3", auth: oauth2Client });
}

export async function POST(request) {
  try {
    const { folderName } = await request.json();

    if (!folderName) {
      return NextResponse.json(
        { success: false, error: "folderName is required" },
        { status: 400 },
      );
    }

    const parentId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!parentId) {
      throw new Error(
        "Missing GOOGLE_DRIVE_FOLDER_ID in environment variables.",
      );
    }

    const drive = getDriveClient();
    const res = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentId],
      },
      fields: "id",
    });

    return NextResponse.json({ success: true, folderId: res.data.id });
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create folder" },
      { status: 500 },
    );
  }
}
