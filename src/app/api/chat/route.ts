import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
    });
    
    // Theo chuẩn mới nhất của SDK (v5+), DataStream đã bị loại bỏ.
    // Dùng TextStream để đảm bảo tương thích hoàn hảo.
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Lỗi API Route:", error);
    return new Response(error.message || "Lỗi máy chủ", { status: 500 });
  }
}
