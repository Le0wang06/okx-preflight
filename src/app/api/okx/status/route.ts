import { NextResponse } from "next/server";
import { getOkxCredentials } from "@/lib/env";

export async function GET() {
  try {
    const credentials = getOkxCredentials();
    return NextResponse.json(
      {
        ok: true,
        hasCredentials: Boolean(credentials),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        hasCredentials: false,
        error: error instanceof Error ? error.message : "Invalid OKX environment configuration.",
      },
      { status: 200 },
    );
  }
}
