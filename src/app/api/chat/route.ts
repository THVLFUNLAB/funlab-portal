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
    
    // @ts-ignore - Bypass TS compiler checking if ai packages are temporarily out-of-sync
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Lỗi API Route:", error);
    return new Response(error.message || "Lỗi máy chủ", { status: 500 });
  }
}
