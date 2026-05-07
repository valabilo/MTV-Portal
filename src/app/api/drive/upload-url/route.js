/**
 * app/api/drive/upload-url/route.js
 *
 * POST /api/drive/upload-url
 * Returns a Google Drive resumable upload URL so the browser can upload
 * files DIRECTLY to Drive without passing through Vercel — bypassing the
 * 4.5 MB Serverless Function payload limit entirely.
 *
 * Body: { fileName, mimeType, folderId }
 * Returns: { uploadUrl, fileId (temporary placeholder) }
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
    const { fileName, mimeType, folderId, fileSize } = await request.json();

    if (!fileName || !mimeType || !folderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get a fresh access token to pass to the browser for direct upload
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || "urn:ietf:wg:oauth:2.0:oob",
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const { token: accessToken } = await oauth2Client.getAccessToken();

    // Initiate a resumable upload session with Google Drive
    const metadata = {
      name: fileName,
      parents: [folderId],
    };

    const initResponse = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": mimeType,
          ...(fileSize ? { "X-Upload-Content-Length": String(fileSize) } : {}),
        },
        body: JSON.stringify(metadata),
      },
    );

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      throw new Error(`Drive resumable upload init failed: ${errorText}`);
    }

    // Google returns the resumable upload URL in the Location header
    const uploadUrl = initResponse.headers.get("Location");

    if (!uploadUrl) {
      throw new Error("No upload URL returned from Google Drive");
    }

    return NextResponse.json({ success: true, uploadUrl });
  } catch (error) {
    console.error("Upload URL generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate upload URL",
      },
      { status: 500 },
    );
  }
}
