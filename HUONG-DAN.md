# Bot Ads Manager — Tài Liệu Hướng Dẫn Sử Dụng

Website: **adsmanager.store**

Công cụ giúp **tạo và xuất bản quảng cáo Facebook hàng loạt** cho nhiều Page cùng lúc: tự động tạo Chiến dịch (Campaign) → Nhóm quảng cáo (Ad Set) → Quảng cáo (Ad) → bật chạy, thay vì thao tác tay từng cái.

---

## 1. Tool này dùng để làm gì?

- Chạy quảng cáo cho **nhiều Page cùng lúc** (10, 100, 1000 Page).
- Tự **kiểm tra quyền** từng Page / Tài khoản quảng cáo trước khi chạy.
- Tự tạo full luồng: **Campaign → Ad Set → Ad → Publish**.
- Xuất **báo cáo** kết quả: thành công / bị chặn quyền / lỗi.

Phù hợp nhất khi cần **lên số lượng lớn**, tiết kiệm thời gian so với làm thủ công.

> Lưu ý: Tool giúp **lên chiến dịch nhanh**. Hiệu quả quảng cáo (ra đơn, ra tin nhắn) vẫn phụ thuộc **nội dung bài viết, target và ngân sách**.

---

## 2. Nguyên lý hoạt động

```
[Đăng nhập Facebook] 
        ↓
[Lấy quyền / token hợp lệ]
        ↓
[Nhập Ad Account + danh sách Page ID]
        ↓
[Tool kiểm tra quyền từng Page & Ad Account]
        ↓
[Với mỗi Page hợp lệ: tạo Campaign → Ad Set → Ad → Bật chạy]
        ↓
[Xuất báo cáo: Thành công / Bị chặn / Lỗi]
```

Các bước chi tiết:

1. **Kết nối Facebook**: đăng nhập để tool lấy quyền gọi Meta API (Marketing API).
2. **Nhập cấu hình**: 1 Ad Account (dạng `act_...`) + danh sách Page ID + ngân sách.
3. **Kiểm tra quyền (Scan)**: tool kiểm tra token có quyền ghi trên Ad Account và từng Page không.
4. **Chạy full luồng**: với mỗi Page có quyền, tool tạo Campaign + Ad Set + Ad rồi xuất bản.
5. **Báo cáo**: tổng hợp số lượng thành công / bị chặn quyền / lỗi, có thể tải CSV.

---

## 3. Chuẩn bị trước khi chạy

Cần có sẵn:

| Mục | Mô tả | Ví dụ |
|---|---|---|
| **Tài khoản Facebook** | Có quyền quản trị BM/Ad Account | — |
| **Ad Account ID** | Tài khoản quảng cáo, dạng `act_...` | `act_2211411752936621` |
| **Danh sách Page ID** | Mỗi dòng 1 Page | `699313966598051` |
| **Ngân sách/ngày** | Theo đơn vị tài khoản (VND thì nhập theo VND) | `100000` |
| **Bài viết (Post ID)** | Tùy chọn — để trống thì tool tự chọn bài hợp lệ | `123456789_987654321` |

**Yêu cầu quyền (rất quan trọng):**

- Tài khoản của bạn phải có quyền **quản lý chiến dịch** trên Ad Account.
- Page cần chạy phải được **thêm vào Business** và **kết nối với Ad Account** (Connected assets).
- Nếu thiếu quyền, tool sẽ **báo và bỏ qua** Page đó (không thể tự cấp quyền tuyệt đối do chính sách Meta).

---

## 4. Các bước sử dụng

### Bước 1 — Kết nối Facebook
- Bấm **Đăng nhập Facebook** → cấp quyền cho ứng dụng.
- Trạng thái chuyển sang **Đã kết nối Facebook** là được.

### Bước 2 — Nhập cấu hình chạy
- **Ad Account ID**: dán `act_...` (hoặc chỉ số, tool tự thêm `act_`).
- **Objective**: mục tiêu chiến dịch (VD tin nhắn / tương tác).
- **Budget**: ngân sách/ngày áp dụng cho tất cả Page.
- **Danh sách Page ID**: mỗi dòng 1 ID (paste nhiều ID cách nhau bằng dấu cách/phẩy tool sẽ tự tách dòng).

### Bước 3 — Kiểm tra quyền
- Bấm **✓ Check quyền ID**.
- Kết quả sẽ báo Page nào **có quyền**, Page nào **không có quyền**.

### Bước 4 — Xử lý Page thiếu quyền (nếu có)
- Nhập **Business ID** rồi bấm **✚ Thêm quyền vào Business** hoặc **⚙ Auto Fix quyền**.
- Với Page vẫn bị chặn: cần cấp quyền tay trong **Business Settings** (thêm Page vào BM + kết nối Ad Account).

### Bước 5 — Chạy full luồng
- Bấm **▶ Chạy full luồng 1-7**.
- Tool sẽ chạy lần lượt, báo trạng thái từng dòng và tổng kết cuối.

### Bước 6 — Xem báo cáo
- Xem mục **Báo cáo vận hành** hoặc bấm **⤓ Export CSV** để tải lịch sử chạy.

---

## 5. Ý nghĩa các loại ID (tránh nhầm)

| Loại ID | Là gì | Nhận dạng |
|---|---|---|
| **Ad Account ID** | Tài khoản quảng cáo | `act_...` (VD `act_2211411752936621`) |
| **Page ID** | ID trang Facebook | Dãy số (VD `699313966598051`) |
| **Business ID** | ID Business Manager | Lấy trong Business Settings → Business Info |

Cách lấy **Business ID**: vào `business.facebook.com/settings`, xem trong URL đoạn `business_id=...`, hoặc mục **Thông tin doanh nghiệp**.

---

## 6. Các trạng thái báo về khi chạy

- **SUCCESS**: tạo & xuất bản quảng cáo thành công.
- **SKIP_NO_PERMISSION**: Page chưa được cấp quyền vào Business/token → bị bỏ qua.
- **FAILED**: lỗi khác (VD Ad Account không có quyền ghi, sai Page ID...).

Khi gặp lỗi **quyền ghi trên Ad Account/token**, tool sẽ **dừng sớm (fail-fast)** để không mất thời gian chạy hết danh sách.

---

## 7. Câu hỏi thường gặp (FAQ)

**Hỏi: Chạy 1000 Page mà đa số không có quyền thì sao?**
Tool sẽ kiểm tra trước, chỉ chạy Page có quyền, còn lại báo bị chặn. Không cần add tay từng cái, nhưng Page thuộc BM/chủ khác thì chủ sở hữu phải cấp quyền.

**Hỏi: Tool có tự cấp quyền cho mọi Page không?**
Không. Meta không cho phép. Tool chỉ **gửi yêu cầu / thêm quyền** trong phạm vi bạn có quyền. Ngoài phạm vi đó phải cấp tay.

**Hỏi: Vì sao báo "Tài khoản quảng cáo không có quyền ghi"?**
Token đang dùng chưa có quyền quản lý chiến dịch trên Ad Account đó, hoặc đang sai BM/profile. Cần cấp quyền và đăng nhập lại.

**Hỏi: Chạy bất động sản có target theo khu vực dự án được không?**
Được — cần cấu hình khu vực target theo dự án. (Liên hệ người setup để chỉnh vùng target phù hợp từng chiến dịch.)

---

## 8. Liên hệ hỗ trợ

- Website: **adsmanager.store**
- Người setup hỗ trợ cấu hình chiến dịch, cấp quyền và target theo nhu cầu.
