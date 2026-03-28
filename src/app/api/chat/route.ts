import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Sử dụng Unified SDK v6 chuẩn xác nhất
    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Trả lời thân thiện bằng tiếng Việt.",
    });

    // AI SDK v6: Dùng toUIMessageStreamResponse() để đẩy Data Stream cho useChat()
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("Lỗi API Route:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Lỗi máy chủ AI" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}