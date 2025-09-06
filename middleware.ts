import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

const isAdminRoute = createRouteMatcher([
    "/accessoires",
    "/accessoires/(.*)", // Utiliser (.*) au lieu de **
    "/choregraphies",
    "/choregraphies/(.*)",
    "/costumes",
    "/costumes/(.*)",
    "/users",
    "/users/(.*)",
    "/saisons",
    "/saisons/(.*)",
    "/tableaux",
    "/tableaux/(.*)",
]);

const isProtectedRoute = createRouteMatcher([
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)",
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();

        const userRole = req.cookies.get("user_role")?.value;
        console.log(isAdminRoute(req));
        if (isAdminRoute(req) && userRole !== "admin") {
            return NextResponse.redirect(new URL("/403", req.url));
        }
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
