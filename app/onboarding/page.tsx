"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProgressBar from "@/components/ProgressBar";
import OptionCard from "@/components/OptionCard";
import SelectField from "@/components/SelectField";

import {
  ONBOARDING_RONG,
  HINH_THUC_OPTIONS,
  KINH_NGHIEM_OPTIONS,
  MUC_TIEU_OPTIONS,
  NGANH_OPTIONS,
  VISA_OPTIONS,
  docOnboarding,
  ghiOnboarding,
  type OnboardingData,
} from "@/lib/onboarding";

const TONG_BUOC = 6;

export default function OnboardingPage() {
  const router = useRouter();

  const [buoc, setBuoc] = useState(1);
  const [data, setData] = useState<OnboardingData>(ONBOARDING_RONG);

  /* Nếu người dùng đã điền dở lần trước thì nạp lại, không bắt điền từ đầu.
     Chạy một lần sau khi trang đã hiện trên trình duyệt, vì localStorage
     chỉ tồn tại ở trình duyệt, không có trên server. */
  useEffect(() => {
    const daLuu = docOnboarding();
    if (daLuu) setData(daLuu);
  }, []);

  /** Sửa một trường và lưu ngay xuống localStorage. */
  function capNhat<K extends keyof OnboardingData>(
    truong: K,
    giaTri: OnboardingData[K],
  ) {
    setData((truoc) => {
      const sau = { ...truoc, [truong]: giaTri };
      ghiOnboarding(sau);
      return sau;
    });
  }

  /** Bước 2 cho chọn nhiều: bấm lần nữa thì bỏ chọn. */
  function baoChonMucTieu(value: string) {
    const dangCo = data.muc_tieu.includes(value);
    const moi = dangCo
      ? data.muc_tieu.filter((v) => v !== value)
      : [...data.muc_tieu, value];
    capNhat("muc_tieu", moi);
  }

  function quayLai() {
    if (buoc === 1) {
      router.push("/"); // ở bước đầu thì back về Splash
      return;
    }
    setBuoc((b) => b - 1);
  }

  /** Dùng chung cho nút "Tiếp theo" và link "Bỏ qua".
      Bỏ qua = đi tiếp mà không đụng vào dữ liệu, nên trường đó giữ nguyên giá trị rỗng. */
  function diTiep() {
    if (buoc < TONG_BUOC) {
      setBuoc((b) => b + 1);
      return;
    }
    // Bước cuối: đánh dấu hoàn thành rồi sang Home
    const xong: OnboardingData = { ...data, hoan_thanh: true };
    ghiOnboarding(xong);
    setData(xong);
    router.push("/home");
  }

  /* Nút "Tiếp theo" chỉ sáng khi bước đó đã có lựa chọn.
     Chưa chọn thì người dùng vẫn đi tiếp được bằng link "Bỏ qua" bên dưới. */
  const daTraLoi: Record<number, boolean> = {
    1: data.ten.trim().length > 0,
    2: data.muc_tieu.length > 0,
    3: data.visa !== "",
    4: data.kinh_nghiem !== "",
    5: data.nganh !== "",
    6: data.hinh_thuc !== "",
  };

  /* Tên hiển thị ở tiêu đề bước 2. Chưa nhập tên thì câu vẫn đọc được tự nhiên. */
  const xungHo = data.ten.trim();

  return (
    <main className="flex flex-1 flex-col px-6 pb-8 pt-6">
      {/* ---- Đầu màn: nút back + thanh tiến trình ---- */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={quayLai}
          aria-label="Quay lại"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition-colors active:bg-brand/20"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12.5 4l-6 6 6 6" />
          </svg>
        </button>

        <ProgressBar buoc={buoc} tong={TONG_BUOC} />

        <span className="shrink-0 text-[13px] font-semibold text-muted">
          {buoc}/{TONG_BUOC}
        </span>
      </div>

      {/* ---- Thân màn: mỗi bước một khối ---- */}
      <div className="mt-8 flex-1">
        {buoc === 1 && (
          <Buoc
            tieuDe="Chúng tôi có thể gọi bạn là"
            phuDe="Bạn có thể bỏ qua bước này nếu không muốn cho biết."
          >
            <input
              type="text"
              value={data.ten}
              onChange={(e) => capNhat("ten", e.target.value)}
              placeholder="Ví dụ: Mai, Huy..."
              aria-label="Tên gọi"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] text-text outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            {/* Dòng này bắt buộc phải có: proposal cam kết không thu thập danh tính */}
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Tên này chỉ được lưu trên máy của bạn. Chúng tôi không nhìn thấy
              và không gửi cho ai.
            </p>
          </Buoc>
        )}

        {buoc === 2 && (
          <Buoc
            tieuDe={xungHo ? `${xungHo}, bạn muốn làm gì?` : "Bạn muốn làm gì?"}
            phuDe="Chọn một hoặc nhiều chủ đề bạn đang quan tâm"
          >
            <div className="flex flex-col gap-3">
              {MUC_TIEU_OPTIONS.map((o) => (
                <OptionCard
                  key={o.value}
                  label={o.label}
                  selected={data.muc_tieu.includes(o.value)}
                  onClick={() => baoChonMucTieu(o.value)}
                />
              ))}
            </div>
          </Buoc>
        )}

        {buoc === 3 && (
          <Buoc
            tieuDe="Bạn đang giữ loại Visa nào?"
            phuDe="Một số điều kiện làm việc sẽ phụ thuộc vào điều kiện Visa của bạn"
          >
            <SelectField
              label="Loại visa"
              value={data.visa}
              onChange={(v) => capNhat("visa", v)}
              options={VISA_OPTIONS}
              placeholder="Chọn loại visa của bạn"
            />
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Không chắc mình đang giữ visa gì? Chọn{" "}
              <span className="font-semibold text-text">Tôi không biết</span> —
              bạn vẫn dùng được ứng dụng bình thường.
            </p>
          </Buoc>
        )}

        {buoc === 4 && (
          <Buoc
            tieuDe="Bạn đã có kinh nghiệm làm việc tại Úc chưa?"
            phuDe="Chọn một lựa chọn gần đúng nhất"
          >
            <div className="flex flex-col gap-3">
              {KINH_NGHIEM_OPTIONS.map((o) => (
                <OptionCard
                  key={o.value}
                  label={o.label}
                  selected={data.kinh_nghiem === o.value}
                  onClick={() => capNhat("kinh_nghiem", o.value)}
                />
              ))}
            </div>
          </Buoc>
        )}

        {buoc === 5 && (
          <Buoc
            tieuDe="Ngành nghề bạn đang quan tâm hoặc đang làm việc là gì?"
            phuDe="Mỗi ngành ở Úc có bảng lương riêng (award) do Fair Work Commission quy định"
          >
            <SelectField
              label="Ngành nghề"
              value={data.nganh}
              onChange={(v) => capNhat("nganh", v)}
              options={NGANH_OPTIONS}
              placeholder="Ngành nghề theo chức danh/lĩnh vực/từ khóa"
            />
          </Buoc>
        )}

        {buoc === 6 && (
          <Buoc
            tieuDe="Hình thức làm việc của bạn"
            phuDe="Mức lương tối thiểu khác nhau giữa các hình thức làm việc"
          >
            <div className="flex flex-col gap-3">
              {HINH_THUC_OPTIONS.map((o) => (
                <OptionCard
                  key={o.value}
                  label={o.label}
                  selected={data.hinh_thuc === o.value}
                  onClick={() => capNhat("hinh_thuc", o.value)}
                />
              ))}
            </div>
          </Buoc>
        )}
      </div>

      {/* ---- Cuối màn: nút Tiếp theo + link Bỏ qua ---- */}
      <div className="pt-6">
        <button
          type="button"
          onClick={diTiep}
          disabled={!daTraLoi[buoc]}
          className="w-full rounded-xl bg-brand py-4 text-[16px] font-bold text-white transition-colors active:bg-brand-dark disabled:bg-line disabled:text-muted"
        >
          {buoc === TONG_BUOC ? "Hoàn tất" : "Tiếp theo"}
        </button>

        <button
          type="button"
          onClick={diTiep}
          className="mt-4 w-full py-1 text-center text-[15px] font-semibold text-muted underline underline-offset-4"
        >
          Bỏ qua
        </button>
      </div>
    </main>
  );
}

/** Khung chung cho mọi bước: tiêu đề, phụ đề, rồi phần nội dung riêng. */
function Buoc({
  tieuDe,
  phuDe,
  children,
}: {
  tieuDe: string;
  phuDe: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-[22px] font-bold leading-snug text-text">{tieuDe}</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{phuDe}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
