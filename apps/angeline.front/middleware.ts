import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher(["/admin(.*)"]);
const isSignInRoute = createRouteMatcher(["/signIn(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isSignInRoute(req) && userId) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (isPrivateRoute(req)) {
    await auth.protect();
  }

  // Ajouter des headers de sécurité et de performance pour le SEO
  const response = NextResponse.next();

  // Headers de sécurité
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Headers de performance
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Optimisations de cache pour les images (Next.js gère déjà beaucoup)
  if (req.nextUrl.pathname.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/)) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  // Headers pour les ressources statiques
  if (req.nextUrl.pathname.startsWith("/_next/static/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
