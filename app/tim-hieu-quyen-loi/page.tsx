import BottomNav from "@/components/BottomNav";

/**
 * Trang TẠM cho /tim-hieu-quyen-loi — nút "Tìm hiểu quyền lợi người lao động
 * tại Úc" ở Home trỏ tới đây. Thêm trang này để nút đó không bị 404, dù
 * không nằm trong 5 việc được yêu cầu hôm nay.
 *
 * Nội dung thật: lưới 6 bài học so le, màu pastel, theo mục 5.1 của
 * claude/figma-chot.md và mục 7 của claude/noi-dung-man-hinh.md.
 * Đây là màn ưu tiên thấp nhất nếu thiếu thời gian (đã ghi rõ trong
 * noi-dung-man-hinh.md: "màn đầu tiên bị cắt nếu thiếu giờ").
 */
export default function TimHieuQuyenLoiPage() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
            <path d="M8 8h7M8 11.5h5" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-bold text-text">
          Tìm hiểu quyền lợi người lao động
        </h1>
        <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-muted">
          Màn này đang được dựng. Sáu bài học ngắn (Lương và Payslip, Casual
          và Full-time, An toàn nơi làm việc, Visa...) sẽ xếp thành lưới ở
          đây.
        </p>
      </main>

      <BottomNav />
    </>
  );
}
