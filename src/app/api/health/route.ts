import { NextResponse } from "next/server";
import { hasOkxCredentials } from "@/lib/env";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "okx-preflight",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV ?? "development",
      hasOkxCredentials: hasOkxCredentials(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
    { status: 200 },
  );
}
