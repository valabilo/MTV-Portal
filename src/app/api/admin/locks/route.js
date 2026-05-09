import { NextResponse } from "next/server";
import { getDashboardSessionFromRequest } from "@/lib/dashboardAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LOCK_TTL_MS = 45 * 1000;
const locks = globalThis.__mtvDashboardLocks ?? new Map();
globalThis.__mtvDashboardLocks = locks;

function cleanExpiredLocks() {
  const now = Date.now();
  locks.forEach((lock, reference) => {
    if (now - lock.updatedAt > LOCK_TTL_MS) locks.delete(reference);
  });
}

function authSession(request) {
  const session = getDashboardSessionFromRequest(request);
  if (!session) {
    return {
      error: NextResponse.json(
        { success: false, error: "Dashboard login required." },
        { status: 401 },
      ),
    };
  }

  return { session };
}

function lockPayload(lock, session) {
  if (!lock) return null;

  return {
    reference: lock.reference,
    owner: lock.owner,
    isMine: lock.sessionId === session.sessionId,
    updatedAt: new Date(lock.updatedAt).toISOString(),
  };
}

export async function GET(request) {
  const { session, error } = authSession(request);
  if (error) return error;

  cleanExpiredLocks();

  const { searchParams } = new URL(request.url);
  const reference = String(searchParams.get("reference") || "").trim();

  if (reference) {
    return NextResponse.json({
      success: true,
      lock: lockPayload(locks.get(reference), session),
    });
  }

  return NextResponse.json({
    success: true,
    locks: Array.from(locks.values()).map((lock) => lockPayload(lock, session)),
  });
}

export async function POST(request) {
  const { session, error } = authSession(request);
  if (error) return error;

  cleanExpiredLocks();

  const body = await request.json();
  const reference = String(body.reference || "").trim();

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "Reference is required." },
      { status: 400 },
    );
  }

  const current = locks.get(reference);
  if (current && current.sessionId !== session.sessionId) {
    return NextResponse.json({
      success: true,
      lockedByOther: true,
      lock: lockPayload(current, session),
    });
  }

  const lock = {
    reference,
    owner: session.username,
    sessionId: session.sessionId,
    updatedAt: Date.now(),
  };

  locks.set(reference, lock);

  return NextResponse.json({
    success: true,
    lockedByOther: false,
    lock: lockPayload(lock, session),
  });
}

export async function DELETE(request) {
  const { session, error } = authSession(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const reference = String(searchParams.get("reference") || "").trim();

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "Reference is required." },
      { status: 400 },
    );
  }

  const current = locks.get(reference);
  if (current?.sessionId === session.sessionId) locks.delete(reference);

  return NextResponse.json({ success: true });
}
