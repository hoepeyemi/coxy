import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 update-price API called');
    
    const body = await request.json();
    const { tokenId, priceUsd, priceSol } = body;

    if (!tokenId) {
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 }
      );
    }

    if (!priceUsd && !priceSol) {
      return NextResponse.json(
        { error: "At least one price (USD or SOL) is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_ANON_SECRET || ""
    );

    console.log(`🔍 Updating price for token ID: ${tokenId}`);

    // Check if token exists
    const { data: token, error: tokenError } = await supabase
      .from("tokens")
      .select("id, name, symbol")
      .eq("id", parseInt(tokenId))
      .single();

    if (tokenError || !token) {
      console.error("Error: Token not found:", tokenError);
      return NextResponse.json(
        { error: "Token not found" },
        { status: 404 }
      );
    }

    // Insert new price record
    const priceData: any = {
      token_id: parseInt(tokenId),
      trade_at: new Date().toISOString()
    };

    if (priceUsd !== undefined) {
      priceData.price_usd = parseFloat(priceUsd);
    }

    if (priceSol !== undefined) {
      priceData.price_sol = parseFloat(priceSol);
    }

    const { data: price, error: priceError } = await supabase
      .from("prices")
      .insert(priceData)
      .select()
      .single();

    if (priceError) {
      console.error("Error inserting price:", priceError);
      return NextResponse.json(
        { error: "Failed to update price" },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully updated price for ${token.symbol} (ID: ${tokenId})`);
    console.log(`📊 New price: USD ${priceUsd || 'N/A'}, SOL ${priceSol || 'N/A'}`);
    
    return NextResponse.json({
      success: true,
      message: "Price updated successfully",
      data: {
        token: token,
        price: price
      }
    });
  } catch (error) {
    console.error("💥 Error processing update-price request:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}
