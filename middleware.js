import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",                 // landing page
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/videos(.*)",
]);

export default clerkMiddleware((auth, request) => {
  const { userId } = auth();

  // If NOT logged in and trying to access a protected route
  if (!userId && !isPublicRoute(request)) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware({
//   publicRoutes: ["(.*)"], // 👈 EVERYTHING is public
// });

// export const config = {
//   matcher: ["/((?!_next|.*\\..*).*)"],
// };
