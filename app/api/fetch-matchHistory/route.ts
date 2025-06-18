import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const puuid = searchParams.get("puuid");
  const region = searchParams.get("region") || "europe";
  const start = searchParams.get("start");
  const count = searchParams.get("count");

  try {
    const riotApiKey = process.env.RIOT_API_KEY;
    if (!riotApiKey) throw new Error("RIOT_API_KEY is not set");

    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${start}&${count}`,
      {
        headers: {
          "X-Riot-Token": riotApiKey,
        },
      }
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
