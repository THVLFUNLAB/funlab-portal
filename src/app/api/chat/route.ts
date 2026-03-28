import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    console.log("[/api/chat] Received messages:", JSON.stringify(messages?.slice(-1)));

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[/api/chat] Missing GOOGLE_GENERATIVE_AI_API_KEY");
      return NextResponse.json(
        { error: "API key chưa được cấu hình." },
        { status: 500 }
      );
    }

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system:
        "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Bạn sẽ giúp học sinh giải đáp các thắc mắc về 10 tập thử thách của Funlab Challenge một cách dễ hiểu nhất. Hãy trả lời bằng tiếng Việt, ngắn gọn và thân thiện.",
      onFinish: ({ text, usage }) => {
        console.log("[/api/chat] Stream finished. Text length:", text.length, "Usage:", usage);
      },
    });

    console.log("[/api/chat] Streaming response...");
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("[/api/chat] Error:", error);
    return NextResponse.json(
      { error: "Hệ thống đang bận. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
