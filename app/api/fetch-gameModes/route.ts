import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `https://static.developer.riotgames.com/docs/lol/gameModes.json`
    );

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.status?.message || "Unknown error" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
