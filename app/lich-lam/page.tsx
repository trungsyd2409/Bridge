"use client";

/**
 * Màn Lịch làm việc — đường dẫn "/lich-lam"
 * Dựng theo bản UI 01 của anh Nguyễn: tổng kết tuần, dải 7 ngày, chi tiết ca.
 *
 * Phần app này làm thêm so với bản thiết kế: KHỐI ĐỐI CHIẾU LƯƠNG CẢ TUẦN ở
 * cuối màn. Ghi giờ mà không đối chiếu thì mới chỉ là cuốn sổ. Đối chiếu với
 * bảng lương ngành mới trả lời được câu người ta thật sự muốn hỏi.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import {
  CaLam,
  Kho,
  KHO_RONG,
  TEN_THU,
  cacNgayTrongTuan,
  docKho,
  gioChu,
  gioCuaCa,
  ngayGon,
  ngayISO,
  timCongViec,
  tongKetTuan,
} from "@/lib/cong-viec";

export default function LichLamPage() {
  const [kho, setKho] = useState<Kho>(KHO_RONG);
  const [moc, setMoc] = useState(new Date()); // ngày bất kỳ trong tuần đang xem
  const [ngayChon, setNgayChon] = useState(ngayISO(new Date()));
  const [sanSang, setSanSang] = useState(false);

  useEffect(() => {
    setKho(docKho());
    setSanSang(true);
  }, []);

  const ngayTuan = cacNgayTrongTuan(moc);
  const tk = tongKetTuan(kho, ngayTuan);
  const caTrongNgay = kho.caLam
    .filter((c) => c.ngay === ngayChon)
    .sort((a, b) => a.batDau.localeCompare(b.batDau));

  function doiTuan(huong: -1 | 1) {
    const x = new Date(moc);
    x.setDate(x.getDate() + huong * 7);
    setMoc(x);
    setNgayChon(cacNgayTrongTuan(x)[0]);
  }

  const tuanNay = ngayTuan.includes(ngayISO(new Date()));

  return (
    <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
      <Link href="/home" className="self-start text-sm text-brand">
        ‹ Trang chủ
      </Link>

      <p className="eyebrow mt-3">GHI LẠI ĐỂ CÓ BẰNG CHỨNG</p>
      <h1 className="mt-1.5 text-2xl font-bold">Lịch làm việc</h1>
      <p className="mt-1 text-sm text-muted">
        Lên lịch, ghi giờ thực tế và theo dõi thanh toán.
      </p>

      {/* ---- Tổng kết tuần ---- */}
      <section className="mt-5 rounded-2xl bg-surface p-4">
        <div className="flex items-center gap-4">
          <VongTron gio={tk.gioDaGhi} tong={tk.gioXepLich} />
          <div className="flex-1">
            <p className="text-2xl font-bold leading-none">{lamTron(tk.gioXepLich)} giờ</p>
            <p className="mt-1 text-xs text-muted">đã xếp lịch</p>
            <div className="mt-3 flex gap-4 text-center">
              <So so={tk.soCaDaLam} nhan="ca đã làm" />
              <So so={tk.soCaSapToi} nhan="ca sắp tới" />
              <So so={tk.soNoiLamViec} nhan="nơi làm" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Chuyển tuần ---- */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => doiTuan(-1)}
          aria-label="Tuần trước"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-brand"
        >
          ‹
        </button>
        <p className="text-sm font-semibold">
          {tuanNay ? "Tuần này" : `${ngayGon(ngayTuan[0])} đến ${ngayGon(ngayTuan[6])}`}
        </p>
        <button
          onClick={() => doiTuan(1)}
          aria-label="Tuần sau"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-brand"
        >
          ›
        </button>
      </div>

      {/* ---- Dải 7 ngày ---- */}
      <div className="mt-3 flex gap-1.5">
        {ngayTuan.map((d, i) => {
          const co = kho.caLam.filter((c) => c.ngay === d);
          const chon = d === ngayChon;
          return (
            <button
              key={d}
              onClick={() => setNgayChon(d)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 ${
                chon ? "bg-brand text-white" : "bg-surface"
              }`}
            >
              <span className="text-[11px] font-semibold">{TEN_THU[i]}</span>
              <span className={`text-xs ${chon ? "" : "text-muted"}`}>
                {Number(d.split("-")[2])}
              </span>
              <span className="flex h-1.5 items-center gap-0.5">
                {co.slice(0, 3).map((c) => (
                  <span
                    key={c.id}
                    className={`h-1.5 w-1.5 rounded-full ${
                      chon ? "bg-white" : c.daLam ? "bg-emerald-500" : "bg-brand"
                    }`}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- Ca trong ngày đã chọn ---- */}
      <div className="mt-4 flex flex-col gap-3">
        {sanSang && caTrongNgay.length === 0 && (
          <div className="rounded-2xl bg-surface p-5 text-center text-sm leading-relaxed text-muted">
            Ngày này chưa có ca nào.
          </div>
        )}

        {caTrongNgay.map((ca) => (
          <TheCa key={ca.id} ca={ca} kho={kho} />
        ))}
      </div>

      <Link
        href="/ca-lam"
        className="mt-4 block rounded-xl bg-brand py-3.5 text-center text-sm font-semibold text-white"
      >
        + Thêm ca làm
      </Link>

      {/* ---- Đối chiếu lương cả tuần ---- */}
      {tk.soCaDaLam > 0 && <DoiChieuTuan tk={tk} />}

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
        Ghi chép của bạn nằm trên máy bạn. Bạn có thể đưa vào Bản tóm tắt gửi RMWC
        khi cần nhờ hỗ trợ.
      </p>

      <BottomNav />
    </main>
  );
}

/* ==================== Khối đối chiếu lương tuần ==================== */

function DoiChieuTuan({ tk }: { tk: ReturnType<typeof tongKetTuan> }) {
  // Thiếu dữ liệu award thì nói thẳng là thiếu, KHÔNG đoán.
  if (tk.tienTheoAward === null) {
    return (
      <section className="mt-5 rounded-2xl bg-brand-soft p-4">
        <h2 className="text-sm font-bold text-brand">Chưa đối chiếu được lương tuần này</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Chúng tôi cần biết ngành nghề và hình thức làm việc của
          {" "}
          {tk.thieuAward.join(", ")} để so với đúng bảng lương ngành. Bạn bổ sung ở
          màn Công việc của tôi, hoặc liên hệ RMWC để được kiểm tra giúp.
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/cong-viec"
            className="flex-1 rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white"
          >
            Bổ sung thông tin
          </Link>
          <Link
            href="/ho-tro"
            className="flex-1 rounded-xl bg-surface py-3 text-center text-sm font-semibold text-brand"
          >
            Liên hệ RMWC
          </Link>
        </div>
      </section>
    );
  }

  const daNhan = tk.tienDaGhiNhan;
  const chenh = Math.round((tk.tienTheoAward - daNhan) * 100) / 100;
  const coGhiTien = daNhan > 0;
  const thieu = coGhiTien && chenh > 1;

  return (
    <section
      className={`mt-5 rounded-2xl p-4 ${thieu ? "bg-danger-card" : "bg-lesson-green"}`}
    >
      <h2 className="text-sm font-bold">Đối chiếu lương tuần này</h2>

      <div className="mt-3 flex flex-col gap-2 rounded-xl bg-surface/85 p-3 text-sm">
        <Hang
          nhan={`${lamTron(tk.gioDaGhi)} giờ đã ghi nhận, theo bảng lương ngành`}
          gt={`$${tk.tienTheoAward.toFixed(2)}`}
        />
        {tk.tienTheoThoaThuan !== null && (
          <Hang
            nhan="Theo mức chủ đã thoả thuận"
            gt={`$${tk.tienTheoThoaThuan.toFixed(2)}`}
          />
        )}
        <Hang
          nhan="Bạn ghi nhận đã nhận"
          gt={coGhiTien ? `$${daNhan.toFixed(2)}` : "chưa nhập"}
        />
      </div>

      {thieu && (
        <>
          <p className="mt-3 text-sm font-bold text-danger">
            Chênh khoảng ${chenh.toFixed(2)} trong tuần này.
          </p>
          <p className="mt-2 rounded-xl bg-surface/85 p-3 text-sm leading-relaxed">
            Nhận lương thấp hơn quy định <b>không phải lỗi của bạn</b> và không khiến
            bạn phạm luật. Trách nhiệm trả đúng lương thuộc về chủ.
          </p>
        </>
      )}

      {!coGhiTien && (
        <p className="mt-3 text-sm leading-relaxed">
          Bạn chưa nhập số tiền thực nhận cho ca nào trong tuần. Nhập vào thì app sẽ
          so được bạn nhận đủ hay còn thiếu.
        </p>
      )}

      <Link
        href="/tom-tat"
        className="mt-3 block rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white"
      >
        Đưa ghi chép này vào bản tóm tắt gửi RMWC
      </Link>

      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Đây là thông tin tham khảo, không phải tư vấn pháp lý. Con số tính từ ghi
        chép của bạn và bảng lương ngành lưu sẵn trong app. Bậc lương cụ thể còn phụ
        thuộc tuổi, nhiệm vụ và ngày giờ làm.
      </p>
    </section>
  );
}

function Hang({ nhan, gt }: { nhan: string; gt: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted">{nhan}</span>
      <span className="shrink-0 font-semibold">{gt}</span>
    </div>
  );
}

/* ==================== Thẻ một ca ==================== */

function TheCa({ ca, kho }: { ca: CaLam; kho: Kho }) {
  const cv = timCongViec(kho, ca.congViecId);
  const gio = gioCuaCa(ca);

  return (
    <section
      className={`rounded-2xl p-4 ${
        ca.daLam ? "bg-lesson-green" : "border border-dashed border-brand bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${cv?.mau ?? "bg-brand"}`} />
          <div>
            <p className="text-sm font-bold">{cv?.ten ?? "Nơi làm đã xoá"}</p>
            <p className="mt-0.5 text-xs text-muted">
              {ca.batDau} đến {ca.ketThuc} · {gioChu(gio)}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            ca.daLam ? "bg-surface text-muted" : "bg-brand-soft text-brand"
          }`}
        >
          {ca.daLam ? "Ca đã ghi" : "Ca dự kiến"}
        </span>
      </div>

      {ca.nghiPhut > 0 && (
        <p className="mt-2 text-xs text-muted">Nghỉ không lương {ca.nghiPhut} phút</p>
      )}

      {ca.daLam && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          <Nhan
            chu={
              ca.thanhToan === "da_nhan"
                ? `Đã nhận${ca.soTien !== null ? ` $${ca.soTien.toFixed(2)}` : ""}`
                : ca.thanhToan === "chua_nhan"
                  ? "Chưa được trả"
                  : "Chưa nhập thanh toán"
            }
            canhBao={ca.thanhToan === "chua_nhan"}
          />
          {ca.payslip === "khong" && <Nhan chu="Không có payslip" canhBao />}
        </div>
      )}

      {ca.ghiChu && <p className="mt-2 text-xs leading-relaxed">{ca.ghiChu}</p>}
    </section>
  );
}

function Nhan({ chu, canhBao }: { chu: string; canhBao?: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        canhBao ? "bg-danger-soft text-danger" : "bg-surface text-muted"
      }`}
    >
      {chu}
    </span>
  );
}

/* ==================== Vòng tròn giờ ==================== */

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
        <span className="mt-0.5 text-[9px] leading-none text-muted">đã ghi</span>
      </div>
    </div>
  );
}

function So({ so, nhan }: { so: number; nhan: string }) {
  return (
    <div>
      <p className="text-base font-bold leading-none">{so}</p>
      <p className="mt-1 text-[10px] leading-tight text-muted">{nhan}</p>
    </div>
  );
}

/** 22.5 thành "22,5" theo cách viết số của tiếng Việt */
function lamTron(n: number): string {
  return (Math.round(n * 10) / 10).toString().replace(".", ",");
}
