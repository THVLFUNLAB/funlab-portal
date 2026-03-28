import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[/api/chat] CRITICAL ERROR: Lỗi thiếu GOOGLE_GENERATIVE_AI_API_KEY trên Vercel. Hãy kiểm tra tab Environment Variables.");
      return new Response(
        "Lệnh thất bại. Thầy Hậu đang bận (Lỗi thiếu API Key, hãy báo admin thêm vào Vercel).", 
        { status: 500 }
      );
    }

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system:
        "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Bạn sẽ giúp học sinh giải đáp các thắc mắc về 10 tập thử thách của Funlab Challenge. Hãy trả lời bằng tiếng Việt, ngắn gọn và cực kỳ thân thiện.",
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    // Vercel Server Runtime Logs
    console.error("============= CHATBOT API CRITICAL ERROR =============");
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("Full Error Object:", JSON.stringify(error, null, 2));
    console.error("======================================================");

    // Trả lỗi Text rõ ràng về cho hook useChat() của Client
    // Vercel AI SDK sẽ lấy String này làm nội dung của `error.message` trên client
    return new Response(
      `Hệ thống trợ lý đang bận cục bộ. Mã lỗi: ${error?.message || '500 Server Error'}. Hãy thử lại sau!`, 
      { status: 500 }
    );
  }
}
