import { NextRequest, NextResponse } from "next/server";

import { sendMessageToMake } from "@/lib/make";
import { ChatRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<ChatRequest>;
    if (!payload.message || !payload.sessionId) {
      return NextResponse.json(
        { error: "message and sessionId are required." },
        { status: 400 },
      );
    }

    const result = await sendMessageToMake({
      message: payload.message,
      sessionId: payload.sessionId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
