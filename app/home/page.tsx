"use client";

/**
 * Màn Trang chủ — đường dẫn "/home"
 * Dựng lại theo bản UI 03 của anh Nguyễn: lời chào, tổng kết tuần, ca sắp tới,
 * thẻ Kiểm tra công việc, hai thẻ nhỏ, bản tin, thanh nav.
 *
 * Giữ lại từ bản cũ: badge đỏ trợ giúp và carousel bản tin. Tin đầu tiên trả lời
 * thẳng nỗi sợ lớn nhất, đề bài cho biết 38% không dám tìm hỗ trợ vì sợ visa.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { BAN_TIN } from "@/lib/noi-dung";
import { docOnboarding } from "@/lib/onboarding";
import {
  Kho,
  KHO_RONG,
  cacNgayTrongTuan,
  caSapToi,
  docKho,
  gioChu,
  gioCuaCa,
  ngayGon,
  timCongViec,
  tongKetTuan,
} from "@/lib/cong-viec";

export default function HomePage() {
  const [ten, setTen] = useState("");
  const [tin, setTin] = useState(0);
  const [kho, setKho] = useState<Kho>(KHO_RONG);

  // localStorage chỉ có trên trình duyệt nên phải đọc trong useEffect,
  // đọc thẳng lúc render sẽ lệch giữa server và client.
  useEffect(() => {
    setTen(docOnboarding()?.ten ?? "");
    setKho(docKho());
  }, []);

  // Carousel tự đổi tin sau mỗi 6 giây
  useEffect(() => {
    const t = setInterval(() => setTin((i) => (i + 1) % BAN_TIN.length), 6000);
    return () => clearInterval(t);
  }, []);

  const tk = tongKetTuan(kho, cacNgayTrongTuan(new Date()));
  const ca = caSapToi(kho);
  const coDuLieu = kho.caLam.length > 0;

  return (
    <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
      {/* ---- Lời chào ---- */}
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow">CÙNG BẠN LÀM VIỆC TỰ TIN</p>
          <h1 className="mt-1.5 text-2xl font-bold">
            {ten ? `Chào ${ten},` : "Chào bạn,"}
          </h1>
          <p className="mt-1 text-sm text-muted">Hôm nay bạn muốn bắt đầu từ đâu?</p>
        </div>
        <Link
          href="/ho-so"
          aria-label="Hồ sơ"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
        >
          {ten ? ten.trim().charAt(0).toUpperCase() : "B"}
        </Link>
      </div>

      {/* ---- Badge trợ giúp khẩn ---- */}
      <Link
        href="/ho-tro"
        className="mt-4 self-start rounded-full bg-danger-soft px-4 py-2 text-xs font-bold text-danger"
      >
        LIÊN HỆ TRỢ GIÚP NGAY
      </Link>

      {/* ---- Tuần này của bạn ---- */}
      <section className="mt-4 rounded-2xl bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Tuần này của bạn</h2>
          <Link href="/lich-lam" className="text-xs font-semibold text-brand">
            Xem lịch ›
          </Link>
        </div>

        {coDuLieu ? (
          <div className="mt-3 flex items-center gap-4">
            <VongTron gio={tk.gioDaGhi} tong={tk.gioXepLich} />
            <div>
              <p className="text-sm">
                <b>{lamTron(tk.gioXepLich)} giờ</b> đã xếp lịch
              </p>
              <p className="mt-1 text-sm text-muted">
                {tk.soCaDaLam} ca đã làm · {tk.soNoiLamViec} nơi làm việc
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Ghi lại ca làm của bạn, app sẽ tự cộng giờ và đối chiếu với bảng lương
            ngành. Ghi chép của chính bạn là thứ có sức nặng khi cần nhờ hỗ trợ.
          </p>
        )}

        <Link
          href="/ca-lam"
          className="mt-3 block rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white"
        >
          + Thêm ca làm
        </Link>
      </section>

      {/* ---- Ca sắp tới ---- */}
      {ca && (
        <section className="mt-3 rounded-2xl bg-surface p-4">
          <h2 className="text-sm font-bold">Ca sắp tới</h2>
          <div className="mt-2 flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                timCongViec(kho, ca.congViecId)?.mau ?? "bg-brand"
              }`}
            />
            <div>
              <p className="text-sm font-semibold">
                {timCongViec(kho, ca.congViecId)?.ten ?? "Nơi làm đã xoá"}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {ngayGon(ca.ngay)} · {ca.batDau} đến {ca.ketThuc} ·{" "}
                {gioChu(gioCuaCa(ca))}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ---- Thẻ lớn Kiểm tra công việc ---- */}
      <Link href="/kiem-tra" className="mt-3 block rounded-2xl bg-brand p-5 text-white">
        <p className="text-base font-bold">Kiểm tra công việc</p>
        <p className="mt-1.5 text-sm opacity-90">
          Tìm hiểu mức lương và điều kiện làm việc của bạn.
        </p>
        <span className="mt-3 inline-block rounded-xl bg-white px-4 py-2 text-xs font-semibold text-brand">
          Bắt đầu kiểm tra →
        </span>
      </Link>

      {/* ---- Hai thẻ nhỏ ---- */}
      <div className="mt-3 flex gap-3">
        <TheNho
          href="/hoc"
          ten="Học quyền lợi"
          mo="Bài học ngắn, dễ hiểu."
        />
        <TheNho
          href="/ho-tro"
          ten="Kết nối hỗ trợ"
          mo="Tìm người có thể giúp bạn."
        />
      </div>

      <div className="mt-3 flex gap-3">
        <TheNho
          href="/cong-viec"
          ten="Công việc của tôi"
          mo="Nhiều công việc, một nơi quản lý."
        />
        <TheNho
          href="/tom-tat"
          ten="Bản tóm tắt gửi RMWC"
          mo="Sắp xếp sự việc để nhờ hỗ trợ."
        />
      </div>

      {/* ---- Bản tin ---- */}
      <section className="mt-4 rounded-2xl bg-brand-soft p-4">
        <p className="text-xs font-bold text-brand">Bản tin người lao động</p>
        <p className="mt-1.5 text-[11px] font-semibold text-muted">
          {BAN_TIN[tin].nguon}
        </p>
        <p className="mt-1.5 min-h-[3rem] text-sm leading-relaxed">
          {BAN_TIN[tin].tieuDe}
        </p>
        <div className="mt-2 flex gap-1.5">
          {BAN_TIN.map((_, i) => (
            <button
              key={i}
              onClick={() => setTin(i)}
              aria-label={`Tin ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === tin ? "w-5 bg-brand" : "w-1.5 bg-brand/30"
              }`}
            />
          ))}
        </div>
      </section>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
        BRIDGE không thu thập email hay số điện thoại của bạn.
        <br />
        Mọi thứ bạn nhập chỉ được lưu trên máy của bạn.
      </p>

      <BottomNav />
    </main>
  );
}

/* ==================== Mảnh giao diện ==================== */

function TheNho({ href, ten, mo }: { href: string; ten: string; mo: string }) {
  return (
    <Link href={href} className="flex flex-1 flex-col rounded-2xl bg-surface p-4">
      <p className="text-sm font-bold">{ten}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{mo}</p>
      <span aria-hidden className="mt-2 text-sm text-brand">
        ›
      </span>
    </Link>
  );
}

function VongTron({ gio, tong }: { gio: number; tong: number }) {
  const phanTram = tong > 0 ? Math.min(gio / tong, 1) : 0;
  const r = 30;
  const chuVi = 2 * Math.PI * r;

  return (
    <div className="relative h-[84px] w-[84px] shrink-0">
      <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
        <circle cx="42" cy="42" r={r} fill="none" stroke="#eaf2ff" strokeWidth="9" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="#006ffd"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${chuVi * phanTram} ${chuVi}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold leading-none">{lamTron(gio)}</span>
        <span className="mt-0.5 text-[9px] leading-none text-muted">giờ đã ghi</span>
      </div>
    </div>
  );
}

function lamTron(n: number): string {
  return (Math.round(n * 10) / 10).toString().replace(".", ",");
}
