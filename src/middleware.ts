export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    // Protect all routes under (dashboard) group
    // Skip auth routes, api/auth, static files, and public pages
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password).*)",
  ],
};
