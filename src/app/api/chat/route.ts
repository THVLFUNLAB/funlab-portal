import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-1.0-pro'), // Bản 1.0 Pro cực kỳ ổn định, không bị lỗi Version Mismatch
      messages,
      system: "Bạn là Trợ lý Funlab, một chuyên gia Vật lý vui tính của Thầy Hậu. Bạn sẽ giúp học sinh giải đáp các thắc mắc về 10 tập thử thách.",
    });

    // Kết hợp bản Pro 1.0 với hàm stream mới nhất cho AI SDK v6
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("Lỗi API Route:", error);
    return new Response(error.message || "Lỗi máy chủ", { status: 500 });
  }
}