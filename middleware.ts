import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PATHS = ["/profil", "/bildirimler"];
const ADMIN_PATHS = ["/admin"];
const AUTH_PATHS = ["/giris", "/kayit"];
const MUTATING_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return !origin;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (MUTATING_METHODS.has(request.method) && !isValidOrigin(request)) {
    return new NextResponse(null, { status: 403 });
  }

  const { response, user, supabase } = await updateSession(request);

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if ((isProtected || isAdmin) && !user) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && user && supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAuth && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
