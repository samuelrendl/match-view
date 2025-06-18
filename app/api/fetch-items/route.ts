import {NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const gameVersion = searchParams.get("gameVersion");
  try {
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/item.json`
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
