// app/protected/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Redirigir a /auth/confirm con todos los parámetros
  const params = new URLSearchParams(searchParams);
  return NextResponse.redirect(
    new URL(`/auth/confirm?${params.toString()}`, request.url)
  );
}
