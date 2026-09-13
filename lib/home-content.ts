/**
 * Bốn bản tin cho carousel ở màn Home, nguồn Fair Work Ombudsman.
 * Lấy từ mục 3 của claude/noi-dung-man-hinh.md.
 *
 * Tin đầu tiên LUÔN là tin về visa — đó là câu trả lời trực tiếp cho nỗi sợ
 * lớn nhất của người dùng (theo mục 7 của claude/de-bai-rmwc-doi-chieu.md,
 * 38% người lao động không dám tìm hỗ trợ vì sợ ảnh hưởng visa).
 * Đừng đổi thứ tự mảng này.
 */

export type BanTin = {
  id: string;
  noiDung: string;
};

export const NGUON_BAN_TIN = "Fair Work Ombudsman";

export const BAN_TIN_NGUOI_LAO_DONG: BanTin[] = [
  {
    id: "visa-khong-anh-huong",
    noiDung:
      "Liên hệ Fair Work không ảnh hưởng đến visa của bạn. Chủ không có quyền huỷ visa.",
  },
  {
    id: "phat-tra-thieu-luong",
    noiDung:
      "Chủ cố ý trả thiếu lương có thể đối mặt án tù hoặc phạt tiền lớn theo luật.",
  },
  {
    id: "quyen-nhan-phieu-luong",
    noiDung:
      "Bạn có quyền được nhận phiếu lương trong vòng 1 ngày làm việc sau khi được trả lương.",
  },
  {
    id: "thu-viec-khong-luong",
    noiDung:
      "Làm thử việc không lương chỉ hợp pháp trong thời gian rất ngắn để đánh giá tay nghề.",
  },
];
