import React from 'react';
import HeroSection from './(components)/HeroSection';
import CategoryGrid from './(components)/CategoryGrid';
import ProductCard, { ProductData } from './(components)/ProductCard';

// Dữ liệu giả định (Mock Data)
const MOCK_PRODUCTS: ProductData[] = [
  {
    id: '1',
    slug: 'bi-mat-lo-den',
    title: 'Bí mật của các Lỗ Đen Vũ Trụ',
    coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
    author: 'Nhóm AstroLab',
    category: 'Vũ trụ',
    excerpt: 'Khám phá sự thật về những vùng không gian u tối nhất nơi ngay cả ánh sáng cũng không thể thoát ra. Một hành trình đến rìa của chân trời sự kiện của vũ trụ nguyên thủy.',
  },
  {
    id: '2',
    slug: 'phan-ung-phat-quang',
    title: 'Phản ứng Hóa học Phát quang - Phép màu trong ống nghiệm',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
    author: 'Khối 11 - Hóa',
    category: 'Hóa học',
    excerpt: 'Sự phát quang hóa học là gì? Làm thế nào để tạo ra các dung dịch phát sáng rực rỡ trong bóng tối? Cùng tìm hiểu cấu trúc phân tử đằng sau hiện tượng tuyệt đẹp này.',
  },
  {
    id: '3',
    slug: 'cau-truc-adn',
    title: 'Mô hình Cấu trúc ADN 3D - Lưu trữ Mật mã Sự sống',
    coverImage: 'https://images.unsplash.com/photo-1628595351029-c2bb1ab37476?q=80&w=800&auto=format&fit=crop',
    author: 'Khối 12 - Sinh',
    category: 'Sinh học',
    excerpt: 'Tìm hiểu về chuỗi xoắn kép ADN thông qua mô hình 3D vật lý do học sinh thực hiện. Khám phá cách thiên nhiên đóng gói hàng tỷ thông tin gen nhỏ bé trong một tế bào.',
  },
  {
    id: '4',
    slug: 'vat-ly-luong-tu',
    title: 'Cơ học Lượng tử Tóm tắt cho Học sinh trung học',
    coverImage: 'https://images.unsplash.com/photo-1635316279313-2dfc6ec0150b?q=80&w=800&auto=format&fit=crop',
    author: 'CLB STEM',
    category: 'Vật lý',
    excerpt: 'Bạn đã từng nghe về con mèo của Schrödinger? Bài viết giải thích các khái niệm cơ bản về Cơ học lượng tử một cách dễ hiểu, trực quan và đầy thú vị nhất.',
  },
  {
    id: '5',
    slug: 'vi-sinh-vat',
    title: 'Thế giới Vi sinh vật qua Ống kính Hiển vi',
    coverImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop',
    author: 'Nhóm BioExplorer',
    category: 'Sinh học',
    excerpt: 'Những sinh vật vô hình có tác động như thế nào đến sự sống trên Trái đất? Cùng chiêm ngưỡng những thước phim siêu nhỏ đầy ấn tượng được quan sát từ mẫu nước ao.',
  },
  {
    id: '6',
    slug: 'robot-ai',
    title: 'Ứng dụng thuật toán Cây tìm kiếm trong Chế tạo Robot tự động',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
    author: 'Khối 11 - Tin',
    category: 'Công nghệ',
    excerpt: 'Tổng hợp phân tích về việc kết hợp các thuật toán tìm kiếm đường đi AI để đào tạo cỗ máy di chuyển linh hoạt và hoàn thành nhiệm vụ phức tạp trong mê cung.',
  }
];

export default function VomKhoaHocPage() {
  return (
    <div className="pb-24 pt-4">
      <HeroSection />
      
      <CategoryGrid />
      
      <section className="w-full max-w-7xl mx-auto px-6 pt-10">
        <div className="mb-10 lg:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 inline-block">
            Sản phẩm Nổi bật
          </h2>
          <p className="text-slate-400 mt-3 text-lg">
            Khám phá những dự án sáng tạo và bài viết xuất sắc nhất của học sinh.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
