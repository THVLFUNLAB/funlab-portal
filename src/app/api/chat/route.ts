import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = 'nodejs'; 
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("[Backend] Bắt đầu nhận Request...");
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[Backend] CRITICAL ERROR: Thiếu API KEY");
      return new Response(JSON.stringify({ text: "Lỗi Gemini: Thiếu Env Key" }), { status: 500 });
    }

    console.log(`[Backend] Gọi model gemini-1.5-flash với ${messages.length} tin nhắn...`);

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system:
        "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Bạn sẽ giúp học sinh giải đáp các thắc mắc về 10 tập thử thách của Funlab Challenge. Hãy trả lời bằng tiếng Việt, ngắn gọn và cực kỳ thân thiện.",
      onError: ({ error }) => {
        console.error("============= [Backend] LỖI TRONG QUÁ TRÌNH STREAM =============");
        console.error(error);
        console.error("================================================================");
      }
    });

    console.log("[Backend] Kết nối Gemini thành công, đang đẩy Stream về Client...");
    // Hàm này được hỗ trợ chuẩn trong ai v4.x mới nhất
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("============= [Backend] LỖI GỌI GEMINI (ĐỒNG BỘ) =============");
    console.error(error);
    console.error("==============================================================");
    return new Response(
      "Lỗi gọi Gemini: " + (error?.message || "Hết hạn ngạch / Sai cấu hình Vercel"), 
      { status: 500 }
    );
  }
}
