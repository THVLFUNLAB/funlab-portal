// Tắt console.log/warn/debug trong production để không lộ thông tin nội bộ
// Import file này trong layout.tsx root hoặc instrumentation.ts
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  const noop = () => {};
  // Giữ lại console.error để theo dõi lỗi thực sự
  window.console.log   = noop;
  window.console.warn  = noop;
  window.console.debug = noop;
  window.console.info  = noop;
}
