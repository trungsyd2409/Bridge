/**
 * Thanh tiến trình một vạch ngang trên cùng màn onboarding.
 * Phần đã qua màu brand, phần còn lại xám nhạt — đúng mục 2 của figma-chot.
 */
export default function ProgressBar({
  buoc,
  tong,
}: {
  buoc: number; // bước hiện tại, tính từ 1
  tong: number; // tổng số bước
}) {
  const phanTram = Math.round((buoc / tong) * 100);

  return (
    <div
      className="h-1.5 w-full rounded-full bg-line/60"
      role="progressbar"
      aria-valuenow={buoc}
      aria-valuemin={1}
      aria-valuemax={tong}
      aria-label={`Bước ${buoc} trên ${tong}`}
    >
      <div
        className="h-full rounded-full bg-brand transition-all duration-300"
        style={{ width: `${phanTram}%` }}
      />
    </div>
  );
}
