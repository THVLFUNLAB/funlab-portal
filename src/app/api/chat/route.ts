import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-1.5-flash'), // Chạy bản Flash 1.5 mới nhất & mượt nhất
      messages,
      system: "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Bạn sẽ giúp học sinh giải đáp các thắc mắc về 10 tập thử thách của Funlab Challenge. Trả lời ngắn gọn, thân thiện.",
    });

    // AI SDK v4+ / v6: Dùng toUIMessageStreamResponse() để đẩy Data Stream cho useChat() chuẩn xác nhất.
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("Lỗi API Route:", error);
    return new Response(error.message || "Lỗi máy chủ", { status: 500 });
  }
}