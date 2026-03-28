import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("Thiếu biến môi trường GOOGLE_GENERATIVE_AI_API_KEY trên Vercel");
    }

    // Khởi tạo luồng dữ liệu với Gemini 1.5 Flash
    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system:
        "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Bạn sẽ giúp học sinh giải đáp các thắc mắc về 10 tập thử thách của Funlab Challenge. Hãy trả lời bằng tiếng Việt, ngắn gọn và cực kỳ thân thiện.",
    });

    // Bắt buộc return bằng toDataStreamResponse() cho Vercel AI SDK (useChat)
    return result.toDataStreamResponse({
      headers: {
        'Cache-Control': 'no-cache, no-transform',
      }
    });
  } catch (error: any) {
    // Bắt và in ra console rõ ràng để Runtime Logs Vercel lưu lại
    console.error("Lỗi gọi Gemini:", error);
    
    return new Response(
      error.message || "Lỗi xử lý API Gemini nội bộ", 
      { status: 500 }
    );
  }
}
