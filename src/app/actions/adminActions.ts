"use server"

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

function extractYoutubeId(urlOrId: string): string {
    if (!urlOrId) return '';
    const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
    return match ? match[1] : urlOrId;
}

export async function updateEpisodeData(id: number, yt: string, canvas: string) {
    try {
        const filePath = path.join(process.cwd(), 'src/data/episodes.ts');
        if (!fs.existsSync(filePath)) {
            return { success: false, error: "File src/data/episodes.ts không tồn tại" };
        }
        
        let content = fs.readFileSync(filePath, 'utf-8');
        
        const searchString = `id: ${id},`;
        const parts = content.split(searchString);
        
        if (parts.length > 1) {
            let block = parts[1];
            
            // Thay thế youtubeId
            if (yt) {
                const finalYtId = extractYoutubeId(yt);
                block = block.replace(/youtubeId:\s*['"][^'"]*['"]/, `youtubeId: "${finalYtId}"`);
            }
            
            // Thay thế canvasUrl
            if (canvas) {
                if (block.includes('canvasUrl:')) {
                    block = block.replace(/canvasUrl:\s*['"][^'"]*['"]/, `canvasUrl: "${canvas}"`);
                } else {
                    // Chèn canvasUrl vào trước array quizList
                    block = block.replace(/quizList:/, `canvasUrl: "${canvas}",\n    quizList:`);
                }
            }
            
            parts[1] = block;
            fs.writeFileSync(filePath, parts.join(searchString), 'utf-8');
            revalidatePath('/', 'layout');
            return { success: true };
        }
        
        return { success: false, error: "Không tìm thấy metadata tập khớp chuẩn để cập nhật" };
    } catch(err: any) {
        return { success: false, error: err.message };
    }
}
