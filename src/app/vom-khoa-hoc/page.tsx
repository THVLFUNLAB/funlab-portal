// [FIX P-05] Bật lại Vòm Khoa Học — xóa redirect, tích hợp components có sẵn
import type { Metadata } from "next";
import HeroSection from "./(components)/HeroSection";
import CategoryGrid from "./(components)/CategoryGrid";

export const metadata: Metadata = {
  title: "Vòm Khoa Học | Funlab",
  description: "Khám phá không gian tri thức của CLB Khoa Học Việt Anh 2 — thí nghiệm, vật lý, hóa học và nhiều hơn nữa.",
};

export default function ScienceDomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
    </>
  );
}
