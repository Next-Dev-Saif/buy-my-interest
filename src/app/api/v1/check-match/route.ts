import { NextResponse } from "next/server";
import { adminDb } from "@/config/firebase-admin";

/**
 * API Route for n8n to check if a match already exists.
 * Method: GET
 * Headers: X-API-KEY: your_secret_key
 * Query Params: userEmail, sourceUrl
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");
    const sourceUrl = searchParams.get("sourceUrl");
    const apiKey = request.headers.get("X-API-KEY");

    // 1. Validate API Key
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userEmail || !sourceUrl) {
      return NextResponse.json(
        { error: "userEmail and sourceUrl are required" },
        { status: 400 },
      );
    }

    // 2. Generate resultId (consistent with update-matches)
    const uniqueKey = `${userEmail}_${sourceUrl}`;
    const resultId = Buffer.from(uniqueKey)
      .toString("base64")
      .replace(/[/+=]/g, "_");

    // 3. Check if document exists
    const resultRef = adminDb.collection("search_results").doc(resultId);
    const doc = await resultRef.get();

    if (doc.exists) {
      const data = doc.data();
      // Check if it belongs to the same user
      if (data?.userId === userEmail) {
        return NextResponse.json({
          exists: true,
          message: "Match already exists for this user",
        });
      }
    }

    return NextResponse.json({
      exists: false,
      message: "Match does not exist",
      link: sourceUrl,
    });
  } catch (error: any) {
    console.error("API Error (check-match):", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
