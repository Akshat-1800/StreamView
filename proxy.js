// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/api/videos(.*)",
// ]);

// export default clerkMiddleware((auth, request) => {
  // const { userId } = auth();
  // const { pathname } = request.nextUrl;

  // if(userId && pathname === "/") {
  //   return NextResponse.redirect(
  //     new URL("/dashboard", request.url)
  //   );
  // }

  // ❗ Only protect private routes
  // if (!userId && !isPublicRoute(request)) {
  //   return NextResponse.redirect(
  //     new URL("/sign-in", request.url)
  //   );
  // }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!_next|.*\\..*).*)"],
// };




import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // "/api/videos(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // const { userId } = auth();
//   const { pathname } = request.nextUrl;
// if (userId && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
//     return NextResponse.redirect(
//       new URL("/dashboard", request.url)
//     );
//   }
  // if (!userId && !isPublicRoute(request)) {
  //   return NextResponse.redirect(
  //     new URL("/sign-in", request.url)
  //   );
  // }
  if(!isPublicRoute(request))await auth.protect()

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
