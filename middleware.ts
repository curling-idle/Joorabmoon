import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const protectedPaths = ["/dashboard", "/chat", "/account"]
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  if (isProtected && !request.cookies.has("jm_session")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
