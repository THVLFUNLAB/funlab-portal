import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Sử dụng định danh model chuẩn nhất để tránh lỗi v1beta trên Vercel
    const result = streamText({
      model: google('gemini-1.5-flash-latest'),
      messages,
      system: "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Bạn sẽ giúp học sinh giải đáp các thắc mắc về 10 tập thử thách của Funlab Challenge. Hãy trả lời bằng tiếng Việt, ngắn gọn và cực kỳ thân thiện.",
    });
    
    // AI SDK v6: Dùng toUIMessageStreamResponse()
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("Lỗi API Route:", error);
    return new Response(error.message || "Lỗi máy chủ", { status: 500 });
  }
}
