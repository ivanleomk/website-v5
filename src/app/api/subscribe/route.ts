import { NextResponse } from "next/server";

const SIGNUP_URL = "https://workingnotes.net/sign-up";
const ALLOWED_ORIGINS = [
  "https://ivanleo.com",
  "https://www.ivanleo.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function requestOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function corsHeaders(origin: string | null) {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function rejectOrigin(origin: string | null) {
  return NextResponse.json(
    { error: "Forbidden." },
    { status: 403, headers: corsHeaders(origin) }
  );
}

export async function OPTIONS(request: Request) {
  const origin = requestOrigin(request);
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return rejectOrigin(origin);
  }

  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: Request) {
  const origin = requestOrigin(request);
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return rejectOrigin(origin);
  }

  const headers = corsHeaders(origin);
  const secret = process.env.SIGNUP_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Signup is not configured." },
      { status: 500, headers }
    );
  }

  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400, headers }
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400, headers }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signup-key": secret,
      },
      body: JSON.stringify({
        email,
        source: "ivanleo.com",
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Network error. Please try again." },
      { status: 502, headers }
    );
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502, headers }
    );
  }

  return NextResponse.json(data, { status: upstream.status, headers });
}
