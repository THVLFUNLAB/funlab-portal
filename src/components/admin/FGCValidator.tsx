'use client';

// ================================================================
// FGC Validator — Kiểm tra file game theo chuẩn FGC v1.0
// Hiển thị checklist real-time trong Admin Dashboard
// ================================================================

interface ValidationResult {
  id: string;
  label: string;
  pass: boolean;
  severity: 'error' | 'warning' | 'info';
  hint?: string;
}

interface FGCValidatorProps {
  code: string;
  onAutoFix?: (fixedCode: string) => void;
}

function validateFGC(code: string): ValidationResult[] {
  const trimmed = code.trim();

  return [
    // ── CẤM TUYỆT ĐỐI ──
    {
      id: 'no-import',
      label: 'Không có import statement',
      pass: !/^\s*import\s/m.test(trimmed),
      severity: 'error',
      hint: 'Xóa tất cả dòng `import ... from ...`',
    },
    {
      id: 'no-export',
      label: 'Không có export statement',
      pass: !/\bexport\s/m.test(trimmed),
      severity: 'error',
      hint: 'Xóa `export default`, `export function`, `export { }`',
    },
    {
      id: 'no-use-client',
      label: "Không có 'use client'",
      pass: !/'use client'|"use client"/.test(trimmed),
      severity: 'error',
      hint: "Xóa dòng 'use client'; ở đầu file",
    },
    {
      id: 'no-framer',
      label: 'Không dùng framer-motion',
      pass: !/framer-motion/.test(trimmed),
      severity: 'error',
      hint: 'Thay animation bằng CSS transitions. Xóa motion., AnimatePresence',
    },
    {
      id: 'no-next-image',
      label: 'Không dùng next/image',
      pass: !/next\/image/.test(trimmed),
      severity: 'error',
      hint: 'Thay <Image> bằng <img> thông thường',
    },
    {
      id: 'no-next-link',
      label: 'Không dùng next/link',
      pass: !/next\/link/.test(trimmed),
      severity: 'error',
      hint: 'Thay <Link> bằng <a> thông thường',
    },

    // ── BẮT BUỘC CÓ ──
    {
      id: 'has-game-fn',
      label: 'Có function Game({ onGameComplete })',
      pass: /function\s+Game\s*\(/.test(trimmed),
      severity: 'error',
      hint: 'Component chính phải tên là Game: `function Game({ onGameComplete }) {`',
    },
    {
      id: 'has-return-game',
      label: 'Kết thúc bằng return Game;',
      pass: /return\s+Game\s*;?\s*$/.test(trimmed),
      severity: 'error',
      hint: 'Thêm dòng cuối: `return Game;`',
    },
    {
      id: 'has-oncomplete',
      label: 'Gọi onGameComplete() khi xong',
      pass: /onGameComplete\s*\(/.test(trimmed),
      severity: 'error',
      hint: 'Gọi: onGameComplete({ score, timeInSeconds, level, answersLog })',
    },

    // ── KHUYẾN NGHỊ ──
    {
      id: 'score-limit',
      label: 'Điểm tối đa ≤ 50',
      pass: !/maxScore\s*[:=]\s*[6-9]\d|maxScore\s*[:=]\s*\d{3,}/.test(trimmed),
      severity: 'warning',
      hint: 'Điểm game tối đa là 50. Dùng Math.min(score, 50) khi submit',
    },
    {
      id: 'has-fgc-header',
      label: 'Có FGC header comment',
      pass: /\[FGC\]/.test(trimmed),
      severity: 'info',
      hint: 'Khuyến nghị thêm: // [FGC] Tên Game - Tập X - FGC v1.0',
    },
    {
      id: 'answers-log',
      label: 'answersLog có định dạng đúng',
      pass: /answersLog/.test(trimmed),
      severity: 'warning',
      hint: 'answersLog phải là Array<{ qId: string, isCorrect: boolean }>',
    },
  ];
}

function autoFixCode(code: string): string {
  let fixed = code;

  // Xóa 'use client'
  fixed = fixed.replace(/^\s*['"]use client['"]\s*;?\s*$/gm, '');

  // Xóa multi-line imports
  let prev = '';
  while (prev !== fixed) {
    prev = fixed;
    fixed = fixed.replace(/import\s+type\s*\{[\s\S]*?\}\s*from\s*['"][^'"]*['"]\s*;?/g, '');
    fixed = fixed.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]*['"]\s*;?/g, '');
    fixed = fixed.replace(/import\s+\w+\s+from\s*['"][^'"]*['"]\s*;?/g, '');
    fixed = fixed.replace(/import\s*\*\s*as\s+\w+\s+from\s*['"][^'"]*['"]\s*;?/g, '');
    fixed = fixed.replace(/import\s*['"][^'"]*['"]\s*;?/g, '');
  }

  // Xóa exports
  fixed = fixed.replace(/\bexport\s+default\s+(function|class)\b/g, '$1');
  fixed = fixed.replace(/\bexport\s+(function|class|const|let|var)\b/g, '$1');
  fixed = fixed.replace(/\bexport\s+default\s+\w+\s*;/g, '');
  fixed = fixed.replace(/\bexport\s*\{[^}]*\}\s*(?:from\s*['"][^'"]*['"])?\s*;?/g, '');
  fixed = fixed.replace(/\bexport\s+/g, '');

  // Đổi tên component thành Game nếu cần
  const exportDefaultMatch = fixed.match(/function\s+(\w+)\s*\(\s*\{[^}]*onGameComplete[^}]*\}\s*\)/);
  if (exportDefaultMatch && exportDefaultMatch[1] !== 'Game') {
    const oldName = exportDefaultMatch[1];
    fixed = fixed.replace(new RegExp(`\\bfunction\\s+${oldName}\\b`, 'g'), 'function Game');
  }

  // Thêm return Game; nếu chưa có
  const trimmed = fixed.trimEnd();
  if (!/return\s+Game\s*;?\s*$/.test(trimmed)) {
    fixed = fixed.trimEnd() + '\n\nreturn Game;\n';
  }

  // Xóa blank lines thừa (>3 liên tiếp)
  fixed = fixed.replace(/\n{4,}/g, '\n\n\n');

  return fixed.trim();
}

export default function FGCValidator({ code, onAutoFix }: FGCValidatorProps) {
  const results = validateFGC(code);
  const errors = results.filter(r => !r.pass && r.severity === 'error');
  const warnings = results.filter(r => !r.pass && r.severity === 'warning');
  const infos = results.filter(r => !r.pass && r.severity === 'info');
  const passed = results.filter(r => r.pass);

  const isValid = errors.length === 0;
  const hasCode = code.trim().length > 0;

  const handleAutoFix = () => {
    if (onAutoFix) {
      onAutoFix(autoFixCode(code));
    }
  };

  if (!hasCode) return null;

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${
      isValid 
        ? 'border-green-500/30 bg-green-950/20' 
        : 'border-red-500/30 bg-red-950/20'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black uppercase tracking-widest ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {isValid ? '✅ FGC VALID' : `❌ ${errors.length} LỖI CHUẨN FGC`}
          </span>
          {warnings.length > 0 && (
            <span className="text-xs font-bold text-amber-400">· {warnings.length} cảnh báo</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">FGC Spec v1.0</span>
          {!isValid && onAutoFix && (
            <button
              onClick={handleAutoFix}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-colors"
              title="Tự động sửa các lỗi phổ biến"
            >
              ⚡ AUTO-FIX
            </button>
          )}
        </div>
      </div>

      {/* Error items */}
      {errors.length > 0 && (
        <div className="space-y-1.5">
          {errors.map(r => (
            <div key={r.id} className="flex items-start gap-2 text-xs">
              <span className="text-red-400 mt-0.5 shrink-0">✗</span>
              <div>
                <span className="font-bold text-red-300">{r.label}</span>
                {r.hint && <span className="text-red-400/70 ml-2">— {r.hint}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning items */}
      {warnings.length > 0 && (
        <div className="space-y-1.5">
          {warnings.map(r => (
            <div key={r.id} className="flex items-start gap-2 text-xs">
              <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
              <div>
                <span className="font-bold text-amber-300">{r.label}</span>
                {r.hint && <span className="text-amber-400/70 ml-2">— {r.hint}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Passed items (collapsed) */}
      {isValid && (
        <div className="grid grid-cols-2 gap-1">
          {passed.slice(0, 6).map(r => (
            <div key={r.id} className="flex items-center gap-1.5 text-[11px] text-green-400/80">
              <span>✓</span> {r.label}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      {infos.length > 0 && isValid && (
        <div className="border-t border-white/5 pt-2 space-y-1">
          {infos.map(r => (
            <div key={r.id} className="flex items-start gap-2 text-[11px] text-slate-500">
              <span className="shrink-0">ℹ</span>
              <span>{r.hint}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
