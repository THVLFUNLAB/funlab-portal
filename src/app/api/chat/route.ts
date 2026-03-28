import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Bạn sẽ giúp học sinh giải đáp các thắc mắc về 10 tập thử thách của Funlab Challenge. Hãy trả lời bằng tiếng Việt, ngắn gọn và cực kỳ thân thiện.",
    });
    
    // AI SDK v6: Dùng toUIMessageStreamResponse() thay cho toDataStreamResponse() đã bị xóa.
    // Lưu ý: Không dùng await trước streamText để khởi động Stream ngay lập tức.
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("Lỗi API Route:", error);
    return new Response(error.message || "Lỗi máy chủ", { status: 500 });
  }
}
