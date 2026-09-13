"use client";

/**
 * Màn Thêm ca làm — đường dẫn "/ca-lam"
 * Dựng theo bản UI 02 của anh Nguyễn: bước 1 thời gian, bước 2 thanh toán.
 *
 * Đây là màn tạo ra BẰNG CHỨNG. Mỗi ca người dùng ghi lại là một dòng ghi chép
 * có ngày, có giờ, có tình trạng trả tiền. Fair Work Act mục 557C: chủ không giữ
 * hồ sơ thì gánh nặng chứng minh thuộc về chủ, và ghi chép của người lao động
 * lúc đó có sức nặng.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CO_PAYSLIP,
  CaLam,
  HINH_THUC_NHAN,
  Kho,
  KHO_RONG,
  NGHI_PHUT,
  TRANG_THAI_TRA,
  docKho,
  ghiKho,
  gioChu,
  gioCuaCa,
  ngayISO,
  taoId,
} from "@/lib/cong-viec";

export default function CaLamPage() {
  const router = useRouter();
  const [kho, setKho] = useState<Kho>(KHO_RONG);
  const [buoc, setBuoc] = useState<1 | 2>(1);

  // Bước 1
  const [congViecId, setCongViecId] = useState("");
  const [daLam, setDaLam] = useState(true);
  const [ngay, setNgay] = useState(ngayISO(new Date()));
  const [batDau, setBatDau] = useState("09:00");
  const [ketThuc, setKetThuc] = useState("17:00");
  const [nghiPhut, setNghiPhut] = useState(30);
  const [ghiChu, setGhiChu] = useState("");

  // Bước 2
  const [thanhToan, setThanhToan] = useState<CaLam["thanhToan"]>("chua_ghi_nhan");
  const [soTien, setSoTien] = useState("");
  const [ngayNhanTien, setNgayNhanTien] = useState("");
  const [hinhThucNhan, setHinhThucNhan] = useState("");
  const [payslip, setPayslip] = useState("chua_ro");

  useEffect(() => {
    const k = docKho();
    setKho(k);
    const dangLam = k.congViec.find((c) => c.dangLam);
    if (dangLam) setCongViecId(dangLam.id);
  }, []);

  const caTam: CaLam = {
    id: "",
    congViecId,
    ngay,
    batDau,
    ketThuc,
    nghiPhut,
    daLam,
    thanhToan,
    soTien: soTien ? Number(soTien) : null,
    ngayNhanTien,
    hinhThucNhan,
    payslip,
    ghiChu,
  };

  const gio = gioCuaCa(caTam);
  const quaDem = ketThuc <= batDau;

  function luuCa() {
    const k = docKho();
    const moi: CaLam = { ...caTam, id: taoId() };
    ghiKho({ ...k, caLam: [...k.caLam, moi] });
    router.push("/lich-lam");
  }

  /* ---- Chưa có nơi làm việc nào thì phải thêm trước ---- */
  if (kho.congViec.length === 0) {
    return (
      <main className="flex flex-1 flex-col px-5 pb-16 pt-6">
        <Link href="/home" className="self-start text-sm text-brand">
          ‹ Trang chủ
        </Link>
        <h1 className="mt-3 text-xl font-bold">Thêm ca làm</h1>
        <div className="mt-5 rounded-2xl bg-brand-soft p-5">
          <p className="text-sm leading-relaxed">
            Bạn cần thêm nơi làm việc trước đã. Mỗi ca làm phải gắn với một nơi để
            app biết đối chiếu với bảng lương ngành nào.
          </p>
          <Link
            href="/cong-viec"
            className="mt-4 block rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white"
          >
            Thêm nơi làm việc
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-5 pb-16 pt-6">
      <button
        onClick={() => (buoc === 1 ? router.back() : setBuoc(1))}
        className="self-start text-sm text-brand"
      >
        ‹ {buoc === 1 ? "Quay lại" : "Sửa thời gian"}
      </button>

      <h1 className="mt-3 text-xl font-bold">
        {buoc === 1 ? "Thêm ca làm" : "Thông tin thanh toán"}
      </h1>
      <p className="mt-1 text-xs text-muted">Bước {buoc} trên 2</p>

      {buoc === 1 ? (
        <div className="mt-5 flex flex-col gap-4">
          {/* Ca dự kiến hay ca đã làm */}
          <div className="flex rounded-xl bg-surface p-1">
            <NutDoi dang={!daLam} onClick={() => setDaLam(false)}>
              Dự kiến
            </NutDoi>
            <NutDoi dang={daLam} onClick={() => setDaLam(true)}>
              Đã làm
            </NutDoi>
          </div>

          <O nhan="Nơi làm việc">
            <select
              value={congViecId}
              onChange={(e) => setCongViecId(e.target.value)}
              className={oClass}
            >
              {kho.congViec.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ten}
                </option>
              ))}
            </select>
            <Link href="/cong-viec" className="mt-2 inline-block text-xs font-semibold text-brand">
              + Thêm nơi làm việc
            </Link>
          </O>

          <O nhan="Ngày làm">
            <input
              type="date"
              value={ngay}
              onChange={(e) => setNgay(e.target.value)}
              className={oClass}
            />
          </O>

          <div className="flex gap-3">
            <div className="flex-1">
              <O nhan="Bắt đầu">
                <input
                  type="time"
                  value={batDau}
                  onChange={(e) => setBatDau(e.target.value)}
                  className={oClass}
                />
              </O>
            </div>
            <div className="flex-1">
              <O nhan="Kết thúc">
                <input
                  type="time"
                  value={ketThuc}
                  onChange={(e) => setKetThuc(e.target.value)}
                  className={oClass}
                />
              </O>
            </div>
          </div>

          {quaDem && (
            <p className="-mt-1 text-[11px] text-muted">
              Giờ kết thúc sớm hơn giờ bắt đầu nên app hiểu đây là ca qua đêm.
            </p>
          )}

          <O nhan="Nghỉ không lương">
            <select
              value={nghiPhut}
              onChange={(e) => setNghiPhut(Number(e.target.value))}
              className={oClass}
            >
              {NGHI_PHUT.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </O>

          {/* Con số này là thứ người dùng cần nhìn thấy ngay */}
          <div className="rounded-xl bg-brand-soft p-3.5 text-sm font-semibold text-brand">
            Thời gian được tính lương: {gioChu(gio)}
          </div>

          <O nhan="Ghi chú (tuỳ chọn)">
            <textarea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              rows={2}
              placeholder="Ví dụ: làm thêm 1 tiếng cuối ca, chủ nhắn qua tin nhắn"
              className={oClass}
            />
          </O>

          <button
            onClick={() => (daLam ? setBuoc(2) : luuCa())}
            className="mt-1 w-full rounded-xl bg-brand py-4 text-sm font-semibold text-white"
          >
            {daLam ? "Tiếp tục: Thanh toán →" : "Lưu ca dự kiến"}
          </button>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          <div className="rounded-xl bg-surface p-3.5 text-sm">
            <p className="font-semibold">
              {kho.congViec.find((c) => c.id === congViecId)?.ten}
            </p>
            <p className="mt-1 text-xs text-muted">
              {ngay} · {batDau} đến {ketThuc} · {gioChu(gio)}
            </p>
          </div>

          <O nhan="Tình trạng thanh toán">
            <div className="flex flex-col gap-2">
              {TRANG_THAI_TRA.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setThanhToan(o.value as CaLam["thanhToan"])}
                  className={`rounded-xl border px-4 py-3 text-left text-sm ${
                    thanhToan === o.value
                      ? "border-brand bg-brand-soft font-medium"
                      : "border-line bg-surface"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {/* Câu này lấy đúng ý của bản tham khảo, nó đúng và cần thiết */}
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              Chọn Chưa ghi nhận không có nghĩa là bạn chưa được trả. Nó chỉ nghĩa
              là bạn chưa nhập vào đây.
            </p>
          </O>

          {thanhToan === "da_nhan" && (
            <>
              <O nhan="Số tiền đã nhận cho ca này">
                <input
                  type="number"
                  value={soTien}
                  onChange={(e) => setSoTien(e.target.value)}
                  placeholder="AUD"
                  className={oClass}
                />
              </O>
              <O nhan="Ngày nhận tiền">
                <input
                  type="date"
                  value={ngayNhanTien}
                  onChange={(e) => setNgayNhanTien(e.target.value)}
                  className={oClass}
                />
              </O>
              <O nhan="Hình thức nhận">
                <select
                  value={hinhThucNhan}
                  onChange={(e) => setHinhThucNhan(e.target.value)}
                  className={oClass}
                >
                  {HINH_THUC_NHAN.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </O>
            </>
          )}

          <O nhan="Phiếu lương (payslip)">
            <select
              value={payslip}
              onChange={(e) => setPayslip(e.target.value)}
              className={oClass}
            >
              {CO_PAYSLIP.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Chủ phải đưa phiếu lương trong vòng 1 ngày làm việc sau khi trả lương.
            </p>
          </O>

          <div className="rounded-xl bg-surface p-3 text-[11px] leading-relaxed text-muted">
            Thông tin này chưa được đối chiếu với bảng lương ngành. Mở màn Lịch làm
            việc để xem phần đối chiếu của cả tuần.
          </div>

          <button
            onClick={luuCa}
            className="w-full rounded-xl bg-brand py-4 text-sm font-semibold text-white"
          >
            Lưu ca làm
          </button>
        </div>
      )}
    </main>
  );
}

/* ==================== Mảnh giao diện ==================== */

const oClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand";

function O({
  nhan,
  children,
}: {
  nhan: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold">{nhan}</label>
      {children}
    </div>
  );
}

function NutDoi({
  dang,
  onClick,
  children,
}: {
  dang: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${
        dang ? "bg-brand text-white" : "text-muted"
      }`}
    >
      {children}
    </button>
  );
}
