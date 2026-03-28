import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Khởi tạo Google AI bằng Key chính chủ
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Lấy tin nhắn cuối cùng để làm Prompt
    const lastMessage = messages[messages.length - 1];
    
    // Sử dụng bản Flash 1.5 qua SDK chính thức (Đảm bảo không bị lỗi 404 Model)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: "Bạn là Trợ lý Funlab, chuyên gia Vật lý vui tính. Bạn giúp học sinh giải đáp thắc mắc về 10 tập thử thách của Funlab Challenge. Trả lời ngắn gọn, thân thiện bằng tiếng Việt.",
    });

    // Chuyển đổi format tin nhắn cho Gemini
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Bắt đầu luồng Stream
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    // Chuyển đổi sang chuẩn Stream của Vercel AI SDK để useChat nhận diện được
    const stream = GoogleGenerativeAIStream(result);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error("Lỗi API Route (Official SDK):", error);
    return new Response(error.message || "Lỗi máy chủ AI", { status: 500 });
  }
}