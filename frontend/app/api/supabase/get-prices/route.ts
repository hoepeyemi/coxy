import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tokenId = searchParams.get("tokenId");

    if (!tokenId) {
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_ANON_SECRET || ""
    );

    const { data, error } = await supabase
      .from("prices")
      .select(
        `
        price_usd,
        price_sol,
        trade_at
      `
      )
      .eq("token_id", parseInt(tokenId))
      .order("trade_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch token data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
