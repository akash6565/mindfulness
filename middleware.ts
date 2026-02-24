import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("mm_session")?.value;
  const protectedPath = request.nextUrl.pathname.startsWith("/home");

  if (protectedPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"]
};
