# BRIDGE

Ứng dụng web giúp người lao động Việt Nam tại Úc hiểu quyền lợi làm việc của mình,
tự ghi lại giờ làm, đối chiếu lương với bảng lương ngành, và kết nối với tổ chức
hỗ trợ khi cần.

Làm cho **UAVS Hackathon 2026**, đề bài của **Reclaim Migrant Workers Centre NSW**:
*Know Your Rights — A Safe Bridge for Vietnamese Migrant Workers*.

Demo: https://bridge-beta-two.vercel.app

---

## Vấn đề và cách tiếp cận

Đề bài đưa ba con số. Cả ba đều được trả lời bằng một màn hình cụ thể trong app.

| Con số từ đề bài | App trả lời ở đâu |
|---|---|
| 38% không dám tìm hỗ trợ vì sợ ảnh hưởng visa | Tin đầu tiên ở Trang chủ: *Liên hệ Fair Work không ảnh hưởng đến visa của bạn* |
| 62% người bị trả thiếu lại tưởng chính mình phạm luật | Câu ở màn kết quả: *Nhận lương thấp hơn quy định không phải lỗi của bạn* |
| Chỉ 25% người Việt tạm trú nhận đủ mức lương casual tối thiểu | Màn Kiểm tra công việc và khối đối chiếu lương tuần ở màn Lịch làm việc |

### Ba quyết định định hình cả sản phẩm

**1. So với bảng lương ngành, không so với lương tối thiểu quốc gia.**
Mỗi ngành ở Úc có một award riêng do Fair Work Commission quy định. So lương casual
ngành nhà hàng với mức tối thiểu quốc gia sẽ báo "ổn" cho một người thật ra đang bị
trả thiếu vài đô một giờ. Đó là lỗi tệ nhất app này có thể mắc, nên toàn bộ phần
tính lương nằm trong `lib/luong.ts` và luôn đối chiếu theo award của ngành cộng hình
thức làm việc.

**2. Thiếu dữ liệu thì nói là thiếu, không đoán.**
Người dùng chọn "Tôi chưa chắc chắn" ở phần ngành nghề thì app trả về trạng thái
`thieu_thong_tin` và chuyển sang RMWC, chứ không đưa ra con số. Người không biết mình
làm ngành gì, giữ visa gì là nhóm dễ bị bóc lột nhất, không được chặn họ ở bước đầu
và cũng không được đoán bừa cho họ.

**3. Không tài khoản, không server, không thu thập gì.**
Không có đăng nhập, không có email, không có số điện thoại. Mọi thứ người dùng nhập
nằm trong `localStorage` trên máy họ. Màn Hồ sơ có nút xoá sạch, xoá thật. Nhóm người
dùng này sợ nhất là thông tin của mình bị dùng để chống lại mình, nên đây là quyết
định về niềm tin chứ không phải về kỹ thuật.

---

## Tính năng

**Ghi chép ca làm** (`/lich-lam`, `/ca-lam`, `/cong-viec`)
Người dùng thêm nhiều nơi làm việc, ghi từng ca với giờ vào, giờ ra, thời gian nghỉ
không lương, tình trạng thanh toán và có hay không có phiếu lương. App cộng giờ cả
tuần và đối chiếu với bảng lương ngành.

Vì sao phần này quan trọng: **Fair Work Act 2009 (Cth) mục 557C** quy định khi chủ
không giữ hồ sơ giờ làm và không phát phiếu lương, gánh nặng chứng minh chuyển sang
chủ. Lúc đó ghi chép của chính người lao động trở thành thứ có sức nặng. App không
đi kiện thay ai, app giúp người ta có cái để cầm đi hỏi.

**Kiểm tra công việc** (`/kiem-tra`)
Nhập nhanh thông tin một công việc, ra kết quả ba mức: ổn, nên xem lại, đáng lo. Kèm
con số chênh lệch mỗi giờ và mỗi tuần, các dấu hiệu cần lưu ý, và việc nên làm tiếp.

**Bản tóm tắt gửi RMWC** (`/tom-tat`)
Đề bài ghi nguyên văn trong phần Safe Referral Pathways: *"With user consent, generate
a structured summary with the main concern, dates, evidence, preferred language and
assistance type requested."* Màn này có đủ năm phần đó. Ba chi tiết đáng chú ý:

- Chưa tick ô đồng ý thì nút tạo còn mờ. Chữ *with user consent* được làm đúng nghĩa.
- Xuất ra được cả tiếng Việt và tiếng Anh. Người lao động viết tiếng Việt dễ hơn, cán
  bộ tiếp nhận thì không phải ai cũng đọc được tiếng Việt.
- Loại visa mặc định **không** gửi kèm, người dùng tự bật nếu muốn.

App không gửi bản tóm tắt đi đâu. Người dùng bấm Sao chép rồi tự dán.

**Trợ lý AI** (`/chat`)
Hiện là giao diện với câu trả lời mẫu. Mỗi câu trả lời của trợ lý đều có sẵn dòng
nguồn dẫn và nút Liên hệ RMWC, vì đề bài ghi hai lần rằng nội dung AI về quyền lợi
pháp lý phải có nguồn xác minh và phải chỉ đường tới người thật.

**Tìm hiểu quyền lợi** (`/hoc`), **Danh bạ hỗ trợ** (`/ho-tro`), **Hồ sơ** (`/ho-so`)
Bài học ngắn, danh bạ có giải thích từng tổ chức giúp được gì, và trang quản lý dữ
liệu cá nhân kèm xuất ghi chép ra file CSV.

---

## Chỗ nối API cho phần AI

Trong `app/chat/page.tsx`, hàm `guiCauHoi()`, chỗ có comment:

```
// ============ NỐI API Ở ĐÂY ============
```

Thay `setTimeout` bằng lời gọi thật, trả về đúng kiểu `TinNhan`:

```ts
const res = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ cauHoi: noiDung, hoSo: docOnboarding() }),
});
const data = await res.json();
setTinNhan((cu) => [...cu, { ai: "bot", noiDung: data.traLoi, nguon: data.nguon }]);
```

Trường `nguon` là bắt buộc theo đề bài, không phải tuỳ chọn.

---

## Công nghệ

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, `localStorage`,
triển khai trên Vercel. Không có backend, không có cơ sở dữ liệu.

Màu và font khai báo trong khối `@theme` của `app/globals.css`. Tailwind v4 không
dùng `tailwind.config.js` nữa.

## Chạy tại máy

```bash
npm install
npm run dev
```

Mở http://localhost:3000

---

## Cấu trúc

```
app/
  page.tsx           Splash
  onboarding/        6 bước làm quen, bước nào cũng bỏ qua được
  home/              Trang chủ
  cong-viec/         Công việc của tôi
  lich-lam/          Lịch làm việc và đối chiếu lương tuần
  ca-lam/            Thêm ca làm, 2 bước
  kiem-tra/          Kiểm tra công việc, form và kết quả
  tom-tat/           Bản tóm tắt gửi RMWC
  chat/              Trợ lý AI
  hoc/               Tìm hiểu quyền lợi
  ho-tro/            Danh bạ tổ chức hỗ trợ
  ho-so/             Hồ sơ, xuất ghi chép, xoá dữ liệu
lib/
  onboarding.ts      Lựa chọn và lưu trữ onboarding
  luong.ts           Bảng lương award và logic đánh giá
  cong-viec.ts       Công việc, ca làm, tính giờ, tổng kết tuần
  tom-tat.ts         Sinh bản tóm tắt hai thứ tiếng
  noi-dung.ts        Bản tin, bài học, danh bạ
components/
  BottomNav.tsx
```

---

## Giới hạn của bản demo, nói thẳng

- Bảng lương award đang là **snapshot lưu sẵn cho ba ngành** trong `lib/luong.ts`, chưa
  gọi Modern Awards Pay Database API của Fair Work Commission. Đây là quyết định có
  chủ đích để demo chạy được ngoại tuyến, đã ghi trong proposal vòng 1.
- Phụ cấp cuối tuần, ngày lễ và tăng ca hiện chỉ được nêu như dấu hiệu cần lưu ý, chưa
  tính thành tiền.
- Trợ lý AI chưa nối API thật.
- ABN Lookup hiện chỉ mở trang tra cứu chính thức, app chưa tự lấy kết quả về. ABN
  đang hoạt động không chứng minh công ty trả lương đúng, nên app không khẳng định gì.
- Giao diện hiện chỉ có tiếng Việt. Riêng Bản tóm tắt gửi RMWC xuất được tiếng Anh.

## Phạm vi

BRIDGE đưa **thông tin pháp lý**, không đưa **tư vấn pháp lý**. App không kết luận ai
vi phạm luật, không thay người dùng nộp khiếu nại, và luôn chỉ đường tới RMWC, Fair
Work Ombudsman hoặc tổ chức phù hợp.
