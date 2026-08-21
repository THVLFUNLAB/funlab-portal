/**
 * Tính toán Huy hiệu và Số sao dựa trên tổng điểm (real-time) cho Funlab 2026-2027
 * Hệ thống 6 Cấp Độ Huy Hiệu Mới (Tổng điểm tối đa: 2000 điểm):
 * 1. FUNLAB ROOKIE     (1   - 199  đ) - 5 sao, mỗi sao = 40đ
 * 2. FUNLAB EXPLORER   (200 - 499  đ) - 5 sao, mỗi sao = 60đ
 * 3. FUNLAB INNOVATOR  (500 - 799  đ) - 5 sao, mỗi sao = 60đ
 * 4. FUNLAB ENGINEER   (800 - 1199 đ) - 5 sao, mỗi sao = 80đ
 * 5. FUNLAB MASTER     (1200 - 1599đ) - 5 sao, mỗi sao = 80đ
 * 6. FUNLAB LEGEND     (1600+      đ) - 5 sao cố định (Huyền thoại)
 */

export interface RankInfo {
  id: string;
  badge: string;
  badgeEN: string;
  stars: number;
  maxStars: number;
  badgeUrl: string | null;
  color: string;
  shadowColor: string;
  glowColor: string;
  requiredMin: number;
  requiredMax: number | null;
  nextRequired: number | null;
  desc: string;
}

export const RANK_TIERS: Omit<RankInfo, 'stars'>[] = [
  {
    id: "rookie",
    badge: "Tân Binh Funlab",
    badgeEN: "FUNLAB ROOKIE",
    maxStars: 5,
    badgeUrl: "/badge-rookie.png",
    color: "text-amber-400",
    shadowColor: "drop-shadow-[0_0_15px_rgba(251,191,36,0.7)]",
    glowColor: "#f59e0b",
    requiredMin: 1,
    requiredMax: 199,
    nextRequired: 200,
    desc: "Ngọn lửa đam mê khoa học vừa được thắp sáng. Hãy tiếp tục khám phá!"
  },
  {
    id: "explorer",
    badge: "Nhà Thám Hiểm",
    badgeEN: "FUNLAB EXPLORER",
    maxStars: 5,
    badgeUrl: "/badge-explorer.png",
    color: "text-emerald-400",
    shadowColor: "drop-shadow-[0_0_15px_rgba(52,211,153,0.7)]",
    glowColor: "#10b981",
    requiredMin: 200,
    requiredMax: 499,
    nextRequired: 500,
    desc: "Bước vào hành trình khám phá vũ trụ khoa học rộng lớn!"
  },
  {
    id: "innovator",
    badge: "Nhà Cải Mới",
    badgeEN: "FUNLAB INNOVATOR",
    maxStars: 5,
    badgeUrl: "/badge-innovator.png",
    color: "text-cyan-400",
    shadowColor: "drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]",
    glowColor: "#06b6d4",
    requiredMin: 500,
    requiredMax: 799,
    nextRequired: 800,
    desc: "Kết hợp lý thuyết và thực hành – tư duy đột phá đang hình thành!"
  },
  {
    id: "engineer",
    badge: "Kỹ Sư Sáng Tạo",
    badgeEN: "FUNLAB ENGINEER",
    maxStars: 5,
    badgeUrl: "/badge-engineer.png",
    color: "text-blue-400",
    shadowColor: "drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]",
    glowColor: "#3b82f6",
    requiredMin: 800,
    requiredMax: 1199,
    nextRequired: 1200,
    desc: "Chế tạo tương lai bằng tư duy kỹ thuật xuất chúng!"
  },
  {
    id: "master",
    badge: "Chuyên Gia Funlab",
    badgeEN: "FUNLAB MASTER",
    maxStars: 5,
    badgeUrl: "/badge-master.png",
    color: "text-purple-400",
    shadowColor: "drop-shadow-[0_0_20px_rgba(192,132,252,0.8)]",
    glowColor: "#a855f7",
    requiredMin: 1200,
    requiredMax: 1599,
    nextRequired: 1600,
    desc: "Đứng trên đỉnh cao kiến thức – TOP Bảng Vàng toàn trường!"
  },
  {
    id: "legend",
    badge: "Huyền Thoại Funlab",
    badgeEN: "FUNLAB LEGEND",
    maxStars: 5,
    badgeUrl: "/badge-legend.png",
    color: "text-red-400",
    shadowColor: "drop-shadow-[0_0_25px_rgba(248,113,113,0.9)]",
    glowColor: "#ef4444",
    requiredMin: 1600,
    requiredMax: null,
    nextRequired: null,
    desc: "Danh hiệu tối thượng – Huyền thoại khoa học của Funlab!"
  }
];

export function calculateRank(totalPoints: number): RankInfo {
  // Chưa có điểm nào
  if (totalPoints < 1) {
    return {
      ...RANK_TIERS[0],
      stars: 0,
    };
  }

  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    const tier = RANK_TIERS[i];
    if (totalPoints >= tier.requiredMin) {
      let stars = 0;
      if (i === RANK_TIERS.length - 1) {
        // LEGEND: tính sao từ 1600, mỗi 80 điểm = 1 sao
        stars = Math.min(5, Math.floor((totalPoints - tier.requiredMin) / 80) + 1);
      } else {
        const rangeSize = (tier.requiredMax! - tier.requiredMin);
        const pointsIn = totalPoints - tier.requiredMin;
        stars = Math.min(5, Math.floor((pointsIn / rangeSize) * 5) + 1);
      }
      stars = Math.min(Math.max(stars, 1), 5);
      return { ...tier, stars };
    }
  }

  return { ...RANK_TIERS[0], stars: 0 };
}
