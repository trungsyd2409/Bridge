"use client";

/**
 * Màn Tìm hiểu Luật và Quyền lợi lao động — đường dẫn "/hoc"
 * Header nền brand, dưới là lưới card bài học xếp so le, mỗi card một màu pastel.
 *
 * Ghi chú: hôm nay chỉ dựng lưới card. Trang chi tiết từng bài chưa làm,
 * bấm vào card chưa đi đâu. Đây là màn được cắt đầu tiên nếu thiếu giờ.
 */

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { BAI_HOC } from "@/lib/noi-dung";

export default function HocPage() {
  // Chia 6 card thành 2 cột để xếp so le giống bản Figma
  const cotTrai = BAI_HOC.filter((_, i) => i % 2 === 0);
  const cotPhai = BAI_HOC.filter((_, i) => i % 2 === 1);

  return (
    <main className="flex flex-1 flex-col pb-32">
      {/* ---- Header nền brand ---- */}
      <header className="rounded-b-3xl bg-brand px-5 pb-10 pt-6 text-white">
        <Link href="/home" aria-label="Quay lại" className="inline-block">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <h1 className="mt-4 text-2xl font-bold leading-snug">
          Tìm hiểu Luật và Quyền lợi lao động tại Úc
        </h1>
        <p className="mt-2 text-sm opacity-90">Bài học ngắn từ 2-5 phút</p>
      </header>

      {/* ---- Lưới card bài học, 2 cột so le ---- */}
      <div className="-mt-5 grid grid-cols-2 gap-3 px-5">
        <div className="flex flex-col gap-3">
          {cotTrai.map((b) => (
            <CardBaiHoc key={b.id} ten={b.ten} phut={b.phut} mau={b.mau} cao={b.cao} />
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3">
          {cotPhai.map((b) => (
            <CardBaiHoc key={b.id} ten={b.ten} phut={b.phut} mau={b.mau} cao={b.cao} />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

function CardBaiHoc({
  ten,
  phut,
  mau,
  cao,
}: {
  ten: string;
  phut: number;
  mau: string;
  cao: string;
}) {
  return (
    <div
      className={`${mau} ${cao} flex flex-col justify-center rounded-2xl px-4 text-center`}
    >
      <p className="text-sm font-semibold leading-snug text-text">{ten}</p>
      <p className="mt-2 text-xs text-muted">{phut} phút</p>
    </div>
  );
}
