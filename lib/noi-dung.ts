/**
 * Nội dung chữ của các màn: bản tin, bài học, gợi ý chat, danh bạ hỗ trợ.
 * Tách riêng khỏi giao diện để sửa chữ không phải mở file React.
 */

/* ---------- Bản tin người lao động (Home) ---------- */
export type BanTin = { nguon: string; tieuDe: string };

// Tin số 1 để đầu tiên: trả lời thẳng nỗi sợ lớn nhất của người dùng.
// Đề bài RMWC cho biết 38% không dám tìm hỗ trợ vì sợ ảnh hưởng visa.
export const BAN_TIN: BanTin[] = [
  {
    nguon: "Fair Work Ombudsman",
    tieuDe:
      "Liên hệ Fair Work không ảnh hưởng đến visa của bạn. Chủ không có quyền huỷ visa",
  },
  {
    nguon: "Fair Work Ombudsman",
    tieuDe:
      "Chủ cố ý trả thiếu lương có thể đối mặt án tù hoặc phạt tiền theo luật pháp",
  },
  {
    nguon: "Fair Work Ombudsman",
    tieuDe:
      "Bạn có quyền nhận phiếu lương trong vòng 1 ngày làm việc sau khi được trả lương",
  },
  {
    nguon: "Fair Work Ombudsman",
    tieuDe:
      "Làm thử việc không lương chỉ hợp pháp trong thời gian rất ngắn để đánh giá tay nghề",
  },
];

/* ---------- 6 bài học (màn Tìm hiểu quyền lợi) ---------- */
export type BaiHoc = {
  id: string;
  ten: string;
  phut: number;
  mau: string; // class nền, lấy từ bảng màu pastel trong globals.css
  cao: string; // chiều cao card, để xếp so le như bản Figma
};

export const BAI_HOC: BaiHoc[] = [
  { id: "luong-payslip", ten: "Lương và Payslip", phut: 3, mau: "bg-lesson-coral/50", cao: "h-44" },
  { id: "casual-part-full", ten: "Casual, Part-time, Full-time khác gì nhau?", phut: 5, mau: "bg-lesson-mint", cao: "h-36" },
  { id: "cuoi-tuan-ngay-le", ten: "Làm cuối tuần và ngày lễ", phut: 2, mau: "bg-lesson-blue/40", cao: "h-40" },
  { id: "thu-viec-khau-tru", ten: "Thử việc và khấu trừ lương", phut: 4, mau: "bg-lesson-coral", cao: "h-48" },
  { id: "an-toan", ten: "An toàn nơi làm việc", phut: 2, mau: "bg-amber-100", cao: "h-40" },
  { id: "visa", ten: "Visa", phut: 4, mau: "bg-violet-100", cao: "h-36" },
];

/* ---------- 4 card gợi ý ở màn Trợ lý AI ---------- */
export const GOI_Y_CHAT: string[] = [
  "Tôi muốn tìm hiểu nhanh về văn hoá làm việc tại Úc",
  "Làm sao để nhận biết công việc phù hợp với bạn",
  "Liệu tôi có dấu hiệu bị bóc lột lao động không",
  "Tôi muốn tự kiểm tra sự hiểu biết về quyền và nghĩa vụ lao động",
];

/* ---------- Danh bạ hỗ trợ ----------
   Đề bài yêu cầu "explain the roles of RMWC, unions, Fair Work Ombudsman,
   community legal centres and migration services" — nên mỗi tổ chức phải nói
   rõ họ giúp được gì, không chỉ số điện thoại. */
export type ToChuc = {
  ten: string;
  tiengViet: string;
  lienHe: string;
  href?: string;
  giupGi: string;
};

export const DANH_BA: ToChuc[] = [
  {
    ten: "RMWC NSW",
    tiengViet: "Có nhân viên nói tiếng Việt",
    lienHe: "migrants.org.au",
    href: "https://migrants.org.au",
    giupGi:
      "Trung tâm do chính người lao động di cư vận hành. Tư vấn pháp lý miễn phí và bảo mật, hỗ trợ khi bị trả thiếu lương, bị đối xử không công bằng hoặc bị doạ về visa.",
  },
  {
    ten: "Fair Work Ombudsman",
    tiengViet: "Có tài liệu tiếng Việt",
    lienHe: "13 13 94",
    href: "tel:131394",
    giupGi:
      "Cơ quan nhà nước về quyền lợi lao động. Nhận khiếu nại về lương và điều kiện làm việc, có form báo cáo ẩn danh bằng tiếng Việt. Liên hệ họ không ảnh hưởng đến visa của bạn.",
  },
  {
    ten: "Dịch vụ Thông dịch TIS National",
    tiengViet: "Có phiên dịch tiếng Việt",
    lienHe: "131 450",
    href: "tel:131450",
    giupGi:
      "Gọi số này trước, nói bạn cần tiếng Việt, họ sẽ nối máy và dịch giúp khi bạn gọi cho Fair Work hoặc cơ quan khác. Miễn phí.",
  },
  {
    ten: "SafeWork NSW",
    tiengViet: "Không có tiếng Việt, dùng TIS 131 450",
    lienHe: "13 10 50",
    href: "tel:131050",
    giupGi:
      "Cơ quan về an toàn lao động của bang NSW. Báo tai nạn tại nơi làm việc, nơi làm việc không an toàn, hoặc khi không được cấp đồ bảo hộ.",
  },
];
