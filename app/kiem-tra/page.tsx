"use client";

/**
 * Màn Kiểm tra Công việc hiện tại — đường dẫn "/kiem-tra"
 * Đây là màn quan trọng nhất: màn duy nhất cho ra con số cụ thể.
 *
 * Hai trạng thái trong cùng một trang: form nhập, và kết quả.
 * Ba trường đầu điền sẵn từ onboarding, người dùng vẫn sửa được.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import {
  docOnboarding,
  NGANH_OPTIONS,
  HINH_THUC_OPTIONS,
} from "@/lib/onboarding";
import {
  danhGia,
  KetQua,
  NGAY_TRONG_TUAN,
  HINH_THUC_TRA,
  PHIEU_LUONG,
} from "@/lib/luong";
import { luuKiemTra } from "@/lib/tom-tat";

export default function KiemTraPage() {
  const [nganh, setNganh] = useState("");
  const [viTri, setViTri] = useState("");
  const [hinhThuc, setHinhThuc] = useState("");
  const [luong, setLuong] = useState("");
  const [gio, setGio] = useState("");
  const [ngayLam, setNgayLam] = useState<string[]>([]);
  const [hinhThucTra, setHinhThucTra] = useState("chuyen_khoan");
  const [phieuLuong, setPhieuLuong] = useState("");
  const [ketQua, setKetQua] = useState<KetQua | null>(null);

  // Điền sẵn từ hồ sơ onboarding đã lưu trên máy
  useEffect(() => {
    const d = docOnboarding();
    if (d) {
      setNganh(d.nganh);
      setHinhThuc(d.hinh_thuc);
    }
  }, []);

  function doiNgay(v: string) {
    setNgayLam((cu) =>
      cu.includes(v) ? cu.filter((x) => x !== v) : [...cu, v]
    );
  }

  function danhGiaNgay() {
    const kq = danhGia({
      nganh,
      hinhThuc,
      luongMoiGio: luong ? Number(luong) : null,
      gioMoiTuan: gio ? Number(gio) : null,
      ngayLam,
      hinhThucTra,
      phieuLuong,
    });
    setKetQua(kq);

    // Lưu lại trên máy để màn Bản tóm tắt gửi RMWC điền sẵn phần đối chiếu
    // lương, người dùng không phải khai lại lần hai.
    luuKiemTra({
      ketQua: kq,
      nganh,
      hinhThuc,
      viTri,
      gioMoiTuan: gio ? Number(gio) : null,
      phieuLuong,
      hinhThucTra,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (ketQua) {
    return <ManKetQua ketQua={ketQua} quayLai={() => setKetQua(null)} />;
  }

  return (
    <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
      <p className="eyebrow">HIỂU RÕ TRƯỚC KHI QUYẾT ĐỊNH</p>
      <h1 className="mt-1.5 text-2xl font-bold">Kiểm tra công việc</h1>
      <p className="mt-1 text-sm text-muted">
        Điền nhanh thông tin để đánh giá tình huống công việc của bạn
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <Truong nhan="Ngành nghề" ghiChu={nganh ? "đã lấy từ hồ sơ của bạn" : undefined}>
          <select
            value={nganh}
            onChange={(e) => setNganh(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          >
            <option value="">Ngành nghề theo chức danh/lĩnh vực/từ khóa</option>
            {NGANH_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Truong>

        <Truong nhan="Vị trí công việc (Tùy chọn)">
          <input
            value={viTri}
            onChange={(e) => setViTri(e.target.value)}
            placeholder="Ví dụ: Bồi bàn, thu ngân..."
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </Truong>

        <Truong nhan="Hình thức làm việc" ghiChu={hinhThuc ? "đã lấy từ hồ sơ của bạn" : undefined}>
          <select
            value={hinhThuc}
            onChange={(e) => setHinhThuc(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          >
            <option value="">Chọn hình thức làm việc</option>
            {HINH_THUC_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Truong>

        <Truong nhan="Mức lương theo Giờ">
          <input
            type="number"
            value={luong}
            onChange={(e) => setLuong(e.target.value)}
            placeholder="Ví dụ: 20"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </Truong>

        <Truong nhan="Tổng số giờ làm việc mỗi tuần">
          <input
            type="number"
            value={gio}
            onChange={(e) => setGio(e.target.value)}
            placeholder="Ví dụ: 20"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </Truong>

        <Truong nhan="Những ngày bạn thường làm">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {NGAY_TRONG_TUAN.map((n) => {
              const chon = ngayLam.includes(n.value);
              return (
                <button
                  key={n.value}
                  onClick={() => doiNgay(n.value)}
                  className={`pb-1 text-sm ${
                    chon
                      ? "border-b-2 border-brand font-semibold text-text"
                      : "text-muted"
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        </Truong>

        <Truong nhan="Hình thức nhận lương">
          <select
            value={hinhThucTra}
            onChange={(e) => setHinhThucTra(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          >
            {HINH_THUC_TRA.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Truong>

        {/* Trường này bản Figma chưa có. Thêm vào vì mục 557C Fair Work Act:
            chủ không lưu hồ sơ, không phát phiếu lương thì gánh nặng chứng minh
            chuyển sang chủ. Đây là lập luận mạnh nhất của cả bài. */}
        <Truong nhan="Bạn có nhận được phiếu lương (payslip) không">
          <div className="flex flex-col gap-2">
            {PHIEU_LUONG.map((o) => (
              <button
                key={o.value}
                onClick={() => setPhieuLuong(o.value)}
                className={`rounded-xl border px-4 py-3 text-left text-sm ${
                  phieuLuong === o.value
                    ? "border-brand bg-brand-soft"
                    : "border-line bg-surface"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Truong>
      </div>

      <button
        onClick={danhGiaNgay}
        disabled={!luong}
        className="mt-7 w-full rounded-xl bg-brand py-4 text-sm font-semibold text-white disabled:opacity-40"
      >
        Đánh giá
      </button>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
        Thông tin bạn nhập chỉ nằm trên máy của bạn.
        <br />
        Chúng tôi không lưu và không gửi cho ai.
      </p>

      <BottomNav />
    </main>
  );
}

function Truong({
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
      <label className="mb-1.5 block text-sm font-medium">
        {nhan}
        {ghiChu && (
          <span className="ml-1 text-xs font-normal italic text-muted">
            · {ghiChu}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

/* ==================== MÀN KẾT QUẢ ==================== */

function ManKetQua({
  ketQua,
  quayLai,
}: {
  ketQua: KetQua;
  quayLai: () => void;
}) {
  // Trạng thái thiếu thông tin: KHÔNG ĐOÁN, chuyển sang RMWC.
  if (ketQua.muc === "thieu_thong_tin") {
    return (
      <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
        <button onClick={quayLai} className="text-sm text-brand">
          ‹ Sửa thông tin
        </button>
        <div className="mt-5 rounded-2xl bg-brand-soft p-5">
          <h1 className="text-lg font-bold text-brand">{ketQua.tieuDe}</h1>
          <p className="mt-3 text-sm leading-relaxed">
            Chúng tôi cần biết thêm về ngành nghề và hình thức làm việc của bạn
            để so sánh chính xác với bảng lương ngành. Bạn có thể liên hệ RMWC
            để được hỗ trợ miễn phí và bảo mật.
          </p>
          <Link
            href="/ho-tro"
            className="mt-4 block rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white"
          >
            Liên hệ tới cán bộ RMWC để hỗ trợ
          </Link>
          <Link
            href="/tom-tat"
            className="mt-2 block rounded-xl bg-surface py-3 text-center text-sm font-semibold text-brand"
          >
            Tạo bản tóm tắt để gửi RMWC
          </Link>
        </div>
        <BottomNav />
      </main>
    );
  }

  const nen =
    ketQua.muc === "dang_lo"
      ? "bg-danger-card"
      : ketQua.muc === "xem_lai"
        ? "bg-warn-card"
        : "bg-lesson-green";
  const chuTieuDe = ketQua.muc === "dang_lo" ? "text-danger" : "text-text";
  const biTraThieu = (ketQua.chenhMoiGio ?? 0) > 0;

  return (
    <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
      <button onClick={quayLai} className="text-sm text-brand">
        ‹ Sửa thông tin
      </button>

      <div className={`mt-4 rounded-2xl ${nen} p-4`}>
        <h1 className={`text-lg font-bold leading-snug ${chuTieuDe}`}>
          {ketQua.tieuDe}
        </h1>

        {/* Câu trấn an. Đề bài cho biết 62% du học sinh bị trả thiếu lại tưởng
            chính mình đã phạm luật. Đây là câu trả lời trực tiếp cho con số đó. */}
        {biTraThieu && (
          <p className="mt-3 rounded-xl bg-surface/85 p-3 text-sm leading-relaxed">
            Nhận lương thấp hơn quy định <b>không phải lỗi của bạn</b> và không
            khiến bạn phạm luật. Trách nhiệm trả đúng lương thuộc về chủ.
          </p>
        )}

        <div className="mt-3 flex flex-col gap-3">
          <Khoi tieuDe="So sánh lương">
            <p>
              Bảng lương ngành (award) cho hình thức làm việc của bạn là{" "}
              <b>${ketQua.mucAward?.toFixed(2)} một giờ</b>.
            </p>
            <p className="mt-1">
              Bạn đang được trả <b>${ketQua.mucDangNhan?.toFixed(2)} một giờ</b>.
            </p>
            {biTraThieu && (
              <p className="mt-2 rounded-lg bg-bg p-2.5">
                Chênh khoảng <b>${ketQua.chenhMoiGio?.toFixed(2)} mỗi giờ</b>
                {ketQua.chenhMoiTuan ? (
                  <>
                    , tức khoảng <b>${ketQua.chenhMoiTuan.toFixed(0)} một tuần</b>
                  </>
                ) : null}
                , nếu ghi chép của bạn chính xác.
              </p>
            )}
            <p className="mt-2 text-xs text-muted">
              Mỗi ngành ở Úc có bảng lương riêng do Fair Work Commission quy
              định, gọi là award. Lương của bạn theo bảng lương ngành bạn làm,
              không phải theo mức tối thiểu chung.
            </p>
          </Khoi>

          {ketQua.dauHieu.length > 0 && (
            <Khoi tieuDe="Những điểm nên lưu ý">
              <ul className="ml-4 list-disc space-y-1.5">
                {ketQua.dauHieu.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </Khoi>
          )}

          <Khoi tieuDe="Bạn có thể làm gì">
            <p>
              Nhắn tin cho chủ xin phiếu lương (payslip). Đây vừa là quyền của
              bạn, vừa tạo ra một bản ghi bằng chữ.
            </p>
          </Khoi>

          <Khoi tieuDe="Bạn nên giữ lại minh chứng gì">
            <p>
              Tin nhắn trao đổi về lương, phiếu lương nếu có, và ghi chép giờ làm
              mỗi ca.
            </p>
          </Khoi>

          <Link
            href="/ho-tro"
            className="rounded-xl bg-brand py-3.5 text-center text-sm font-semibold text-white"
          >
            Liên hệ tới cán bộ RMWC để hỗ trợ
          </Link>

          {/* Lối sang Bản tóm tắt. Kết quả vừa tính đã được lưu nên bản tóm tắt
              tự có phần đối chiếu lương, người dùng không phải khai lại. */}
          <Link
            href="/tom-tat"
            className="rounded-xl bg-surface py-3.5 text-center text-sm font-semibold text-brand"
          >
            Tạo bản tóm tắt để gửi RMWC
          </Link>
        </div>
      </div>

      {/* Dòng miễn trừ pháp lý. Đề bài để "providing legal advice" trong
          OUT OF SCOPE, nên app phải nói rõ mình chỉ đưa thông tin. */}
      <p className="mt-4 rounded-xl bg-surface p-3 text-[11px] leading-relaxed text-muted">
        Đây là thông tin tham khảo, không phải tư vấn pháp lý. Mức lương chính
        xác còn phụ thuộc vào award và bậc lương cụ thể. Hãy liên hệ RMWC hoặc
        Fair Work Ombudsman để được xác nhận.
      </p>

      <BottomNav />
    </main>
  );
}

function Khoi({
  tieuDe,
  children,
}: {
  tieuDe: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-surface p-4">
      <h2 className="text-sm font-bold">{tieuDe}</h2>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
