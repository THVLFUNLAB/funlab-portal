import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

/**
 * GET /tuyen-thanh-vien
 * Serve trang form tuyển thành viên Funlab từ file HTML tĩnh trong public/
 * Tránh hoàn toàn vấn đề escape trong TypeScript template literal.
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "tuyen-thanh-vien.html");
    const html = readFileSync(filePath, "utf-8");

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[tuyen-thanh-vien] Failed to read HTML file:", err);
    return new NextResponse("Không tìm thấy trang đăng ký.", { status: 500 });
  }
}
