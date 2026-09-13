"use client";

/**
 * Màn Công việc của tôi — đường dẫn "/cong-viec"
 * Dựng theo bản UI 05 của anh Nguyễn: danh sách công việc, thêm nơi làm việc,
 * chi tiết từng nơi.
 *
 * Một người có thể làm hai ba chỗ cùng lúc, đó là chuyện bình thường với
 * du học sinh, nên app phải chứa được nhiều công việc chứ không chỉ một.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { HINH_THUC_OPTIONS, NGANH_OPTIONS, timNhan } from "@/lib/onboarding";
import {
  CongViec,
  Kho,
  KHO_RONG,
  docKho,
  ghiKho,
  mauTiepTheo,
  taoId,
} from "@/lib/cong-viec";

export default function CongViecPage() {
  const [kho, setKho] = useState<Kho>(KHO_RONG);
  const [moForm, setMoForm] = useState(false);
  const [sanSang, setSanSang] = useState(false);

  useEffect(() => {
    setKho(docKho());
    setSanSang(true);
  }, []);

  function luu(k: Kho) {
    setKho(k);
    ghiKho(k);
  }

  function themCongViec(cv: CongViec) {
    luu({ ...kho, congViec: [...kho.congViec, cv] });
    setMoForm(false);
  }

  function doiTrangThai(id: string) {
    luu({
      ...kho,
      congViec: kho.congViec.map((c) =>
        c.id === id ? { ...c, dangLam: !c.dangLam } : c
      ),
    });
  }

  const dangLam = kho.congViec.filter((c) => c.dangLam);
  const daNghi = kho.congViec.filter((c) => !c.dangLam);

  return (
    <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
      <Link href="/home" className="self-start text-sm text-brand">
        ‹ Trang chủ
      </Link>

      <p className="eyebrow mt-3">NHIỀU CÔNG VIỆC, MỘT NƠI QUẢN LÝ</p>
      <h1 className="mt-1.5 text-2xl font-bold">Công việc của tôi</h1>
      <p className="mt-1 text-sm text-muted">
        {sanSang
          ? `${dangLam.length} đang làm · ${daNghi.length} đã nghỉ`
          : "Đang mở dữ liệu trên máy bạn"}
      </p>

      {!moForm && (
        <button
          onClick={() => setMoForm(true)}
          className="mt-4 w-full rounded-xl bg-brand py-3.5 text-sm font-semibold text-white"
        >
          + Thêm công việc
        </button>
      )}

      {moForm && (
        <FormCongViec
          soDaCo={kho.congViec.length}
          onLuu={themCongViec}
          onHuy={() => setMoForm(false)}
        />
      )}

      {/* ---- Danh sách ---- */}
      <div className="mt-5 flex flex-col gap-3">
        {sanSang && kho.congViec.length === 0 && !moForm && (
          <div className="rounded-2xl bg-surface p-5 text-center">
            <p className="text-sm leading-relaxed text-muted">
              Bạn chưa thêm nơi làm việc nào. Thêm một nơi rồi bắt đầu ghi ca làm,
              app sẽ tự cộng giờ và đối chiếu với bảng lương ngành cho bạn.
            </p>
          </div>
        )}

        {dangLam.map((c) => (
          <TheCongViec key={c.id} cv={c} onDoi={() => doiTrangThai(c.id)} />
        ))}

        {daNghi.length > 0 && (
          <>
            <p className="mt-2 text-xs font-semibold text-muted">Đã nghỉ</p>
            {daNghi.map((c) => (
              <TheCongViec key={c.id} cv={c} onDoi={() => doiTrangThai(c.id)} />
            ))}
          </>
        )}
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
        Thông tin công việc chỉ nằm trên máy của bạn.
        <br />
        Chúng tôi không gửi cho chủ, không gửi cho ai.
      </p>

      <BottomNav />
    </main>
  );
}

/* ==================== Thẻ một công việc ==================== */

function TheCongViec({ cv, onDoi }: { cv: CongViec; onDoi: () => void }) {
  return (
    <section className={`rounded-2xl bg-surface p-4 ${cv.dangLam ? "" : "opacity-60"}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${cv.mau}`} />
        <div className="flex-1">
          <h2 className="text-sm font-bold">{cv.ten}</h2>
          <p className="mt-0.5 text-xs text-muted">
            {cv.viTri || "Chưa ghi vị trí"}
            {cv.hinhThuc && ` · ${timNhan(HINH_THUC_OPTIONS, cv.hinhThuc)}`}
          </p>
          {cv.diaChi && <p className="mt-1 text-xs text-muted">{cv.diaChi}</p>}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            cv.dangLam ? "bg-brand-soft text-brand" : "bg-bg text-muted"
          }`}
        >
          {cv.dangLam ? "Đang làm" : "Đã nghỉ"}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-xs">
        <Dong nhan="Ngành" gt={timNhan(NGANH_OPTIONS, cv.nganh) || "Chưa chọn"} />
        <Dong
          nhan="Mức lương thoả thuận"
          gt={
            cv.luongThoaThuan !== null
              ? `$${cv.luongThoaThuan.toFixed(2)} một giờ`
              : "Chưa nhập"
          }
        />
        <Dong nhan="ABN" gt={cv.abn || "Chưa tra cứu"} />
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          href="/lich-lam"
          className="flex-1 rounded-xl bg-brand-soft py-2.5 text-center text-xs font-semibold text-brand"
        >
          Xem ca làm
        </Link>
        <button
          onClick={onDoi}
          className="flex-1 rounded-xl border border-line py-2.5 text-center text-xs font-semibold"
        >
          {cv.dangLam ? "Đánh dấu đã nghỉ" : "Làm lại ở đây"}
        </button>
      </div>

      {!cv.dangLam && (
        <p className="mt-2 text-[11px] text-muted">
          Các ca và ghi chép cũ vẫn được giữ nguyên.
        </p>
      )}
    </section>
  );
}

function Dong({ nhan, gt }: { nhan: string; gt: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted">{nhan}</span>
      <span className="text-right font-medium">{gt}</span>
    </div>
  );
}

/* ==================== Form thêm công việc ==================== */

function FormCongViec({
  soDaCo,
  onLuu,
  onHuy,
}: {
  soDaCo: number;
  onLuu: (cv: CongViec) => void;
  onHuy: () => void;
}) {
  const [ten, setTen] = useState("");
  const [viTri, setViTri] = useState("");
  const [nganh, setNganh] = useState("");
  const [hinhThuc, setHinhThuc] = useState("");
  const [luong, setLuong] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [abn, setAbn] = useState("");

  function luu() {
    onLuu({
      id: taoId(),
      ten: ten.trim(),
      viTri: viTri.trim(),
      nganh,
      hinhThuc,
      luongThoaThuan: luong ? Number(luong) : null,
      diaChi: diaChi.trim(),
      abn: abn.trim(),
      mau: mauTiepTheo(soDaCo),
      dangLam: true,
    });
  }

  return (
    <section className="mt-4 rounded-2xl bg-surface p-4">
      <h2 className="text-sm font-bold">Thêm nơi làm việc</h2>

      <div className="mt-4 flex flex-col gap-3">
        <O nhan="Tên nơi làm" ghiChu="Tên bạn dùng để nhận biết, không cần tên pháp lý">
          <input
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            placeholder="Ví dụ: Quán cà phê A"
            className={oClass}
          />
        </O>

        <O nhan="Vị trí">
          <input
            value={viTri}
            onChange={(e) => setViTri(e.target.value)}
            placeholder="Ví dụ: Nhân viên phục vụ"
            className={oClass}
          />
        </O>

        <O nhan="Ngành nghề" ghiChu="Dùng để đối chiếu đúng bảng lương ngành">
          <select value={nganh} onChange={(e) => setNganh(e.target.value)} className={oClass}>
            <option value="">Chọn ngành nghề</option>
            {NGANH_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </O>

        <O nhan="Hình thức làm việc">
          <select
            value={hinhThuc}
            onChange={(e) => setHinhThuc(e.target.value)}
            className={oClass}
          >
            <option value="">Chọn hình thức</option>
            {HINH_THUC_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </O>

        <O nhan="Mức lương đã thoả thuận" ghiChu="Theo lời chủ nói với bạn, AUD mỗi giờ">
          <input
            type="number"
            value={luong}
            onChange={(e) => setLuong(e.target.value)}
            placeholder="Ví dụ: 22"
            className={oClass}
          />
        </O>

        <O nhan="Địa chỉ làm việc (tuỳ chọn)">
          <input
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            placeholder="Suburb, bang, postcode"
            className={oClass}
          />
        </O>

        {/* ABN: chỉ mở trang tra cứu, KHÔNG tự khẳng định gì.
            ABN đang hoạt động không chứng minh công ty trả lương đúng. */}
        <O nhan="ABN của nhà tuyển dụng (tuỳ chọn)">
          <input
            value={abn}
            onChange={(e) => setAbn(e.target.value)}
            placeholder="Nhập nếu bạn biết"
            className={oClass}
          />
          <a
            href="https://abr.business.gov.au/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs font-semibold text-brand"
          >
            Tra cứu tại ABN Lookup ↗
          </a>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            ABN đang hoạt động không xác nhận công ty trả lương đúng. Đây chỉ là
            thông tin đăng ký công khai.
          </p>
        </O>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={luu}
          disabled={!ten.trim()}
          className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Lưu nơi làm việc
        </button>
        <button
          onClick={onHuy}
          className="rounded-xl border border-line px-5 py-3 text-sm font-semibold"
        >
          Huỷ
        </button>
      </div>
    </section>
  );
}

const oClass =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-brand";

function O({
  nhan,
  ghiChu,
  children,
}: {
  nhan: string;
  ghiChu?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold">{nhan}</label>
      {children}
      {ghiChu && <p className="mt-1 text-[11px] text-muted">{ghiChu}</p>}
    </div>
  );
}
