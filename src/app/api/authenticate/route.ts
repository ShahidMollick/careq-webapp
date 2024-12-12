import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    return NextResponse.redirect(new URL("/?error=Please%20provide%20both%20email%20and%20password", request.url));
  }

  // role-based redirection
  if (email.includes("doctor@gmail.com")) {
    return NextResponse.redirect(new URL("/doctor", request.url));
  } else if (email.includes("receptionist@gmail.com")) {
    return NextResponse.redirect(new URL("/receptionist", request.url));
  } else if (email.includes("admin@gmail.com")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  } else {
    return NextResponse.redirect(new URL("/?error=Unauthorized%20user", request.url));
  }
}
