import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received contact form submission:", data);

    // In a real application, you would save this to a database
    // or send it to an email service. For now, we simulate success.

    return NextResponse.json({ success: true, message: "Form submission successful" });
  } catch (error) {
    console.error("Error handling contact submission:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request payload" },
      { status: 400 }
    );
  }
}
