/**
 * Màn Hỗ trợ — đường dẫn "/ho-tro"
 * Danh bạ các tổ chức, RMWC luôn đứng đầu.
 *
 * Đề bài yêu cầu "explain the roles of RMWC, unions, Fair Work Ombudsman,
 * community legal centres and migration services" — nên mỗi card nói rõ tổ chức
 * đó giúp được gì, không chỉ đưa số điện thoại.
 */

import BottomNav from "@/components/BottomNav";
import { DANH_BA } from "@/lib/noi-dung";

export default function HoTroPage() {
  return (
    <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
      <p className="eyebrow">BẠN KHÔNG PHẢI TỰ XOAY XỞ</p>
      <h1 className="mt-1.5 text-2xl font-bold">Kết nối hỗ trợ</h1>

      {/* Đặt kỳ vọng đúng ngay từ đầu: không đẩy người dùng đi báo cáo ngay */}
      <p className="mt-3 rounded-xl bg-brand-soft p-4 text-sm leading-relaxed text-text">
        Báo cáo không phải lựa chọn đầu tiên. Bạn có thể bắt đầu bằng việc xin
        phiếu lương bằng tin nhắn, hoặc gọi hỏi cho rõ trước khi quyết định làm gì.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {DANH_BA.map((t) => (
          <section key={t.ten} className="rounded-2xl bg-surface p-4">
            <h2 className="text-sm font-bold">{t.ten}</h2>

            <span className="mt-2 inline-block rounded-full bg-lesson-green px-2.5 py-1 text-[11px] font-medium text-text">
              {t.tiengViet}
            </span>

            <p className="mt-3 text-sm leading-relaxed text-muted">{t.giupGi}</p>

            <a
              href={t.href ?? "#"}
              target={t.href?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="mt-3 block rounded-xl bg-brand-soft py-2.5 text-center text-sm font-semibold text-brand"
            >
              {t.lienHe}
            </a>
          </section>
        ))}
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
        BRIDGE đưa thông tin và kết nối bạn với tổ chức hỗ trợ.
        <br />
        Chúng tôi không đưa tư vấn pháp lý và không thay bạn nộp khiếu nại.
      </p>

      <BottomNav />
    </main>
  );
}
