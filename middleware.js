import { NextResponse } from "next/server";

export function middleware(req) {
  if (req.headers.has("x-middleware-subrequest"))
    return new Response("Unauthorized", {
      status: 401,
    });

  return NextResponse.next();
}