import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// -------------------------------------------------------------------------------------------------
// Create a route matcher that matches all public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

// -------------------------------------------------------------------------------------------------
// Export Clerk middleware as Next.js middleware
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// -------------------------------------------------------------------------------------------------
// Modify Next.js middleware route matcher
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// -------------------------------------------------------------------------------------------------
