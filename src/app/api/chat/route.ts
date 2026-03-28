import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // KHÔNG DÙNG await ở đây để giữ nguyên đối tượng Result có chứa các hàm Stream
    const result = streamText({
      model: google('gemini-1.5-flash'), // Chạy bản Flash 1.5
      messages,
      system: "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Trả lời thân thiện bằng tiếng Việt.",
    });

    // Sử dụng hàm chuẩn của SDK v6 (đã kiểm tra có trong type definitions)
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("Lỗi API Route (Unified SDK):", error);
    return new Response(
      JSON.stringify({ error: error.message || "Lỗi giao tiếp với AI" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}