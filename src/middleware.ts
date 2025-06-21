import { clerkMiddleware, createRouteMatcher, getAuth } from '@clerk/nextjs/server';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/studio(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 인증되지 않았으면 401 응답 (리디렉션 아님)
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};