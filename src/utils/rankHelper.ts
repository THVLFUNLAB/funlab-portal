/**
 * Tính toán Huy hiệu và Số sao dựa trên tổng điểm (real-time)
 * Logic theo yêu cầu:
 * - 0 - 49 điểm: Chưa có huy hiệu. Sao = floor(points / 20)
 * - 50 - 150 điểm: Huy hiệu "Nhà Thám Hiểm Sơ Cấp". Sao = floor((points - 50) / 20). (150đ = 5 sao)
 * - 151 - 300 điểm: Huy hiệu "Kỹ Sư Sáng Tạo". Sao = floor((points - 151) / 30)
 * - 301 điểm trở lên: Huy hiệu "Chuyên Gia Funlab". Sao = 5 (Capped)
 */
export function calculateRank(totalPoints: number) {
  let badge = "Chưa có huy hiệu";
  let stars = 0;

  if (totalPoints >= 0 && totalPoints <= 49) {
    badge = "Chưa có huy hiệu";
    stars = Math.floor(totalPoints / 20);
  } else if (totalPoints >= 50 && totalPoints <= 150) {
    badge = "Nhà Thám Hiểm Sơ Cấp";
    stars = Math.floor((totalPoints - 50) / 20);
  } else if (totalPoints >= 151 && totalPoints <= 300) {
    badge = "Kỹ Sư Sáng Tạo";
    stars = Math.floor((totalPoints - 151) / 30);
  } else if (totalPoints > 300) {
    badge = "Chuyên Gia Funlab";
    stars = 5; // Có thể tùy chỉnh logic sao cho chuyên gia
  }

  // Đảm bảo không quá 5 sao (trừ khi yêu cầu khác)
  // Trong logic trên, 150đ -> (150-50)/20 = 5 sao.
  // 300đ -> (300-151)/30 = 4.96 -> 4 sao. 
  // Để đồng nhất, ta có thể giới hạn stars trong khoảng [0, 5]
  stars = Math.min(Math.max(stars, 0), 5);

  return { badge, stars };
}
