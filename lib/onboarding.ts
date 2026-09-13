/**
 * Kiểu dữ liệu + danh sách lựa chọn + đọc/ghi localStorage cho onboarding.
 *
 * Vì sao localStorage: app không có đăng nhập nên không có user ID để gắn dữ liệu.
 * Visa subclass, ngành nghề, hình thức làm việc là dữ liệu nhạy cảm với đúng nhóm
 * người dùng đang sợ lộ thông tin, nên để trên máy người dùng thay vì gửi lên server.
 */

export const STORAGE_KEY = "bridge_onboarding";

export type OnboardingData = {
  ten: string;
  muc_tieu: string[]; // mảng vì bước này cho chọn nhiều
  visa: string;
  kinh_nghiem: string;
  nganh: string;
  hinh_thuc: string;
  hoan_thanh: boolean;
};

/** Giá trị rỗng. Bấm "Bỏ qua" thì trường đó giữ nguyên giá trị rỗng này. */
export const ONBOARDING_RONG: OnboardingData = {
  ten: "",
  muc_tieu: [],
  visa: "",
  kinh_nghiem: "",
  nganh: "",
  hinh_thuc: "",
  hoan_thanh: false,
};

/** Một lựa chọn hiển thị: value là thứ đem đi so sánh, label là chữ người dùng thấy. */
export type LuaChon = {
  value: string;
  label: string;
};

/* ---------- Bước 2: Bạn muốn làm gì? (chọn nhiều) ---------- */
export const MUC_TIEU_OPTIONS: LuaChon[] = [
  { value: "kiem_tra_hien_tai", label: "Kiểm tra công việc hiện tại có công bằng không" },
  { value: "kiem_tra_moi", label: "Kiểm tra công việc mới trước khi đi làm" },
  { value: "tim_hieu_quyen_loi", label: "Tìm hiểu quyền lợi nơi làm việc" },
  { value: "dang_gap_van_de", label: "Tôi đang gặp vấn đề tại nơi làm việc" },
  { value: "can_tu_van", label: "Tôi cần gặp nhân viên tư vấn hỗ trợ" },
  { value: "chua_chac_chan", label: "Tôi chưa chắc chắn" },
];

/* ---------- Bước 3: Visa ----------
   5 lựa chọn đầu là bản Figma. 3 lựa chọn cuối là phần thêm:
   - 417 Working Holiday: đúng nhóm trong bằng chứng Facebook của proposal
   - 485 Tốt nghiệp tạm thời: rất phổ biến với du học sinh vừa ra trường
   - "Tôi không biết": người không biết mình giữ visa gì là nhóm dễ bị bóc lột nhất,
     không được chặn họ ở bước đầu. Chọn mục này thì màn Kiểm tra KHÔNG được đoán. */
export const VISA_OPTIONS: LuaChon[] = [
  { value: "500", label: "Sinh viên/Học sinh (Subclass 500)" },
  { value: "462", label: "Lao động kết hợp kỳ nghỉ (Subclass 462)" },
  { value: "417", label: "Working Holiday (Subclass 417)" },
  { value: "485", label: "Tốt nghiệp tạm thời (Subclass 485)" },
  { value: "482", label: "Tay nghề tạm trú (Subclass 482)" },
  { value: "300", label: "Kết hôn (Subclass 300)" },
  { value: "189_190", label: "Tay nghề định cư (189, 190)" },
  { value: "khong_biet", label: "Tôi không biết" },
];

/* ---------- Bước 4: Kinh nghiệm ---------- */
export const KINH_NGHIEM_OPTIONS: LuaChon[] = [
  { value: "chua_co", label: "Chưa có kinh nghiệm làm việc" },
  { value: "duoi_6_thang", label: "Đã đi làm dưới 6 tháng" },
  { value: "6_12_thang", label: "Đã đi làm từ 6 đến 12 tháng" },
  { value: "tren_1_nam", label: "Đã đi làm hơn 1 năm" },
];

/* ---------- Bước 5: Ngành nghề ----------
   Trường `award` là cầu nối sang màn Kiểm tra công việc.
   3 ngành có mvp: true là phạm vi đã cam kết trong proposal, có snapshot lương. */
export type NganhOption = LuaChon & {
  award: string | null;
  mvp?: boolean;
};

export const NGANH_OPTIONS: NganhOption[] = [
  { value: "nha_hang", label: "Nhà hàng, quán ăn", award: "Restaurant Industry Award", mvp: true },
  { value: "fast_food", label: "Quán cà phê, tiệm bánh, đồ ăn nhanh", award: "Fast Food Industry Award", mvp: true },
  { value: "don_dep", label: "Dọn dẹp, vệ sinh", award: "Cleaning Services Award", mvp: true },
  { value: "khach_san", label: "Khách sạn, quán bar", award: "Hospitality Industry Award" },
  { value: "nail_toc", label: "Làm móng, làm tóc, làm đẹp", award: "Hair and Beauty Award" },
  { value: "ban_le", label: "Bán lẻ, cửa hàng, siêu thị", award: "General Retail Industry Award" },
  { value: "nong_nghiep", label: "Nông nghiệp, hái quả, đóng gói", award: "Horticulture Award" },
  { value: "xay_dung", label: "Xây dựng", award: "Building and Construction Award" },
  { value: "kho_van", label: "Kho bãi, giao hàng", award: "Storage Services Award" },
  { value: "cham_soc", label: "Chăm sóc người già, người khuyết tật", award: "Aged Care Award" },
  { value: "khac", label: "Ngành khác", award: null },
  { value: "khong_biet", label: "Tôi chưa chắc chắn", award: null },
];

/* ---------- Bước 6: Hình thức làm việc ---------- */
export const HINH_THUC_OPTIONS: LuaChon[] = [
  { value: "casual", label: "Thời vụ (Casual)" },
  { value: "part_time", label: "Bán thời gian (Part-time)" },
  { value: "full_time", label: "Toàn thời gian (Full-time)" },
  { value: "hop_dong", label: "Hợp đồng" },
  { value: "khong_ro", label: "Tôi không rõ" },
];

/* ---------- Đọc / ghi localStorage ---------- */

/**
 * Đọc dữ liệu onboarding.
 * Trả về null nếu chưa có hoặc dữ liệu hỏng — nơi gọi tự quyết định làm gì tiếp.
 * Luôn kiểm tra `typeof window` vì Next.js render lần đầu trên server, ở đó không có localStorage.
 */
export function docOnboarding(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingData>;
    // Trộn với object rỗng để thiếu trường nào vẫn có giá trị mặc định, không vỡ UI.
    return { ...ONBOARDING_RONG, ...parsed, muc_tieu: parsed.muc_tieu ?? [] };
  } catch {
    return null;
  }
}

/** Ghi đè toàn bộ object onboarding. */
export function ghiOnboarding(data: OnboardingData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage đầy hoặc bị chặn (chế độ ẩn danh) — không làm app chết,
    // người dùng vẫn đi tiếp được, chỉ là không nhớ lựa chọn.
  }
}

/** Xoá sạch. Để sẵn cho nút "Xoá dữ liệu của tôi" ở màn Hồ sơ — ăn điểm Safety. */
export function xoaOnboarding(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* bỏ qua */
  }
}

/** Tìm nhãn hiển thị từ value đã lưu. Dùng lại ở màn Kiểm tra và Home. */
export function timNhan(options: LuaChon[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? "";
}
