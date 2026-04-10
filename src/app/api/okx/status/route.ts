import { NextResponse } from "next/server";
import { hasOkxCredentials } from "@/lib/env";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      hasCredentials: hasOkxCredentials(),
    },
    { status: 200 },
  );
}
