export default function TuyenThanhVienLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body style={{ margin: 0, padding: 0, background: '#030712' }}>
        {children}
      </body>
    </html>
  );
}
