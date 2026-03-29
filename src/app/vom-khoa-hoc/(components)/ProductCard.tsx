import React from 'react';
import Link from 'next/link';

export interface ProductData {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  author: string;
  category: string;
  excerpt: string;
}

interface ProductCardProps {
  product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <img 
          src={product.coverImage} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-slate-700/50 rounded-full text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          {product.category}
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {product.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
          {product.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
              {product.author.charAt(0)}
            </div>
            <span className="text-sm font-medium text-slate-300">{product.author}</span>
          </div>
          
          <Link 
            href={`/vom-khoa-hoc/${product.slug}`}
            className="px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-400/10 rounded-lg hover:bg-cyan-400 hover:text-slate-950 transition-colors"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
