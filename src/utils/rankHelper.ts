/**
 * Tính toán Huy hiệu và Số sao dựa trên tổng điểm (real-time) cho Funlab 2.0
 * 6 Bậc Rank Khoa Học Sci-Fi:
 * 1. Tân Binh Khám Phá (0 - 99 HP) - 20 HP/sao
 * 2. Nhà Thám Hiểm Sơ Cấp (100 - 249 HP) - 30 HP/sao
 * 3. Kỹ Sư Sáng Tạo (250 - 449 HP) - 40 HP/sao
 * 4. Chuyên Gia Funlab (450 - 699 HP) - 50 HP/sao
 * 5. Đại Sứ Khoa Học (700 - 999 HP) - 60 HP/sao
 * 6. Huyền Thoại STEM (>= 1000 HP) - Max 5 sao
 */

export interface RankInfo {
  id: string;
  badge: string;
  stars: number;
  badgeUrl: string | null;
  color: string;
  shadowColor: string;
}

export function calculateRank(totalPoints: number): RankInfo {
  let badge = "Tân Binh Khám Phá";
  let id = "rookie";
  let stars = 0;
  let badgeUrl: string | null = "/badges/rookie.png";
  let color = "text-slate-400";
  let shadowColor = "drop-shadow-[0_0_15px_rgba(100,116,139,0.6)]";

  if (totalPoints >= 0 && totalPoints <= 99) {
    id = "rookie";
    badge = "Tân Binh Khám Phá";
    stars = Math.floor(totalPoints / 20);
    badgeUrl = "/badges/rookie.png";
    color = "text-slate-400";
    shadowColor = "drop-shadow-[0_0_15px_rgba(100,116,139,0.6)]";
  } else if (totalPoints >= 100 && totalPoints <= 249) {
    id = "explorer";
    badge = "Nhà Thám Hiểm Sơ Cấp";
    stars = Math.floor((totalPoints - 100) / 30);
    badgeUrl = "/badges/explorer.png";
    color = "text-emerald-400";
    shadowColor = "drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]";
  } else if (totalPoints >= 250 && totalPoints <= 449) {
    id = "engineer";
    badge = "Kỹ Sư Sáng Tạo";
    stars = Math.floor((totalPoints - 250) / 40);
    badgeUrl = "/badges/crengineer.png";
    color = "text-blue-400";
    shadowColor = "drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]";
  } else if (totalPoints >= 450 && totalPoints <= 699) {
    id = "master";
    badge = "Chuyên Gia Funlab";
    stars = Math.floor((totalPoints - 450) / 50);
    badgeUrl = "/badges/master.png";
    color = "text-purple-400";
    shadowColor = "drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]";
  } else if (totalPoints >= 700 && totalPoints <= 999) {
    id = "ambassador";
    badge = "Đại Sứ Khoa Học";
    stars = Math.floor((totalPoints - 700) / 60);
    badgeUrl = "/badges/ambassador.png";
    color = "text-amber-500";
    shadowColor = "drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]";
  } else if (totalPoints >= 1000) {
    id = "legend";
    badge = "Huyền Thoại STEM";
    stars = 5;
    badgeUrl = "/badges/legend.png";
    color = "text-red-500";
    shadowColor = "drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]";
  }

  // Đảm bảo không quá 5 sao
  stars = Math.min(Math.max(stars, 0), 5);

  return { id, badge, stars, badgeUrl, color, shadowColor };
}
