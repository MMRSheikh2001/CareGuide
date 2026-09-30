import { NextResponse } from "next/server";

export default function proxy(request) {
    const { pathname } = request.nextUrl;
    const hasToken = Boolean(request.cookies.get("token")?.value);
    const isLogin = pathname === "/login";

    if (!hasToken && !isLogin) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (hasToken && isLogin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};