# Data Schema Design for FPT Car Renting System
*Architecture: Microservices (Database-per-Service)*

Dựa trên toàn bộ giao diện (UI) và tính năng đã được xây dựng từ phía Frontend (Admin Portal & User Portal), dưới đây là đề xuất thiết kế Schema cho Backend. Để tối ưu kiến trúc Microservices, dữ liệu được phân chia theo các Domain/Service độc lập.

---

## 1. User Identity & Profile Service
*Quản lý thông tin tài khoản, xác thực, phân quyền và hồ sơ khách hàng.*

### `User` Table / Collection
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `passwordHash`: String
- `fullName`: String
- `phone`: String
- `cccd`: String (Căn cước công dân - Yêu cầu bắt buộc để thuê xe)
- `address`: String (Địa chỉ liên hệ)
- `avatarUrl`: String (Nullable)
- `status`: Enum (`ACTIVE`, `LOCKED`)
- `role`: Enum (`CUSTOMER`, `ADMIN`)
- `adminNote`: String (Nullable - Ghi chú nội bộ / Lý do khóa tài khoản bởi Admin)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `deletedAt`: Timestamp (Nullable - Phục vụ Soft Delete)

---

## 2. Catalog (Car Inventory) Service
*Quản lý thông tin xe, hình ảnh, tính năng và trạng thái bảo trì hiện tại.*

### `Car` Table / Collection
- `id`: UUID (Primary Key)
- `name`: String (VD: "Mercedes-Benz GLE")
- `brandId`: UUID (Foreign Key -> Bảng Brand)
- `locationId`: UUID (Foreign Key -> Bảng Location - Vị trí/bãi đậu xe hiện tại)
- `type`: Enum (`SEDAN`, `SUV`, `MPV`, `LUXURY`)
- `pricePerDay`: Decimal (Giá thuê 1 ngày)
- `seats`: Integer (Số chỗ ngồi)
- `transmission`: Enum (`AUTO`, `MANUAL`)
- `fuelType`: Enum (`GASOLINE`, `DIESEL`, `ELECTRIC`)
- `fuelConsumption`: String (VD: "7.5 L/100km")
- `licensePlate`: String (Biển số xe, Unique)
- `status`: Enum (`AVAILABLE`, `LOCKED_PENDING`, `RENTED`, `MAINTENANCE`)
- `description`: Text (Mô tả chi tiết xe)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `deletedAt`: Timestamp (Nullable - Phục vụ Soft Delete)

### `CarImage` Table / Collection
- `id`: UUID
- `carId`: UUID (Foreign Key)
- `imageUrl`: String (URL từ S3 hoặc Cloudinary)
- `isPrimary`: Boolean (Đánh dấu ảnh thumbnail chính)

### `CarFeature` Table / Collection
- `carId`: UUID (Foreign Key)
- `featureName`: String (VD: "Bluetooth", "Cửa sổ trời", "Camera 360", "Bản đồ")

### `Brand` Table / Collection (Danh mục Hãng xe)
- `id`: UUID
- `name`: String (VD: "VinFast", "Mazda")
- `logoUrl`: String (Nullable)

### `Location` Table / Collection (Cơ sở / Bãi đậu xe)
- `id`: UUID
- `name`: String (VD: "Chi nhánh Cầu Giấy")
- `city`: String (VD: "Hà Nội" - Dùng để user search "Pick-up Location")
- `address`: String (VD: "123 Đường Láng, Đống Đa, Hà Nội")

---

## 3. Booking & Order Service
*Quản lý vòng đời đơn đặt xe, địa điểm giao nhận và trạng thái chuyến đi.*

### `Booking` Table / Collection
- `id`: String / UUID (Primary Key, VD mã: "FPT-1001")
- `userId`: UUID (Reference -> User Service)
- `carId`: UUID (Reference -> Catalog Service)
- `startDate`: Timestamp (Thời gian nhận xe)
- `endDate`: Timestamp (Thời gian trả xe)
- `pickupLocation`: String (Địa điểm nhận xe, VD: "123 Đường Láng, HN")
- `dropoffLocation`: String (Địa điểm trả xe)
- `totalAmount`: Decimal (Tổng tiền thuê)
- `depositAmount`: Decimal (Tiền cọc yêu cầu)
- `paymentMethod`: Enum (`TRANSFER`, `CASH`, `CREDIT_CARD`)
- `bookingStatus`: Enum (`INITIATED`, `CONFIRMED`, `APPROVED`, `ACTIVE`, `COMPLETED`, `CANCELLED`, `CANCELLED_DUE_TO_CAR`, `CANCELLED_DUE_TO_CUSTOMER`)
- `paymentStatus`: Enum (`UNPAID`, `PARTIALLY_PAID`, `FULLY_PAID`, `REFUNDED`)
- `renterName`: String (Snapshot: Tên người thuê tại thời điểm đặt)
- `renterPhone`: String (Snapshot: SĐT tại thời điểm đặt)
- `renterCCCD`: String (Snapshot: CCCD tại thời điểm đặt)
- `adminNote`: Text (Ghi chú nội bộ của Admin duyệt đơn)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### `Booking_Saga_Log` Table / Collection (Saga Orchestrator Log)
- `id`: UUID (Primary Key)
- `bookingId`: String (Reference -> Booking Table)
- `currentStep`: Enum (`RESERVE_CAR`, `CHECK_CUSTOMER_LIMIT`, `COMPLETE`)
- `sagaStatus`: Enum (`STARTED`, `COMPLETED`, `ABORTED`, `ROLLING_BACK`, `ROLLED_BACK`)
- `errorMessage`: String (Nullable - Lý do thất bại để hiển thị lên Admin Dashboard)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### Cấu trúc luồng Saga Pattern (Dành cho Booking)
**A. Luồng thành công (Happy Path):**
1. `renting-service`: Tạo bản ghi `Booking` với status = `INITIATED`. Ghi log `Saga_Log` = `STARTED`.
2. `car-service`: Nhận yêu cầu khóa xe -> Kiểm tra xe rảnh không -> Đổi status xe thành `LOCKED_PENDING`. Trả về `OK`.
3. `customer-service`: Nhận yêu cầu kiểm tra khách hàng -> Khách không bị khóa tài khoản -> Trả về `OK`.
4. `renting-service`: Nhận kết quả `OK` từ 2 service kia -> Đổi status Booking thành `CONFIRMED`. Bắn lệnh chốt đơn sang `car-service` đổi thành `RENTED`. Cập nhật `Saga_Log` = `COMPLETED`.

**B. Luồng thất bại & Bù trừ (Compensating Path):**
1. `renting-service`: Tạo `Booking` status = `INITIATED`.
2. `car-service`: Đổi status xe thành `LOCKED_PENDING`. Trả về `OK`.
3. `customer-service`: Kiểm tra thấy khách hàng đang bị nợ xấu/khóa tài khoản -> Trả về `FAILED`.
4. `renting-service`: Nhận `FAILED` -> Bắt đầu quá trình ROLLBACK:
   - Gọi API hủy khóa xe sang `car-service` để trả xe về `AVAILABLE` (Compensating Transaction).
   - Đổi status `Booking` thành `CANCELLED_DUE_TO_CUSTOMER`.
   - Cập nhật `Saga_Log` = `ROLLED_BACK`.

---

## 4. Feedback & Review Service
*Tách biệt service đánh giá để tối ưu query cho trang chi tiết xe.*

### `Review` Table / Collection
- `id`: UUID
- `bookingId`: String (Chỉ ai hoàn thành Booking mới được đánh giá)
- `carId`: UUID (Reference -> Catalog Service)
- `userId`: UUID (Reference -> User Service)
- `rating`: Integer (1 đến 5 sao)
- `comment`: Text (Nội dung đánh giá)
- `createdAt`: Timestamp

---

## 5. Analytics & Reporting Service (CQRS / Read-Model)
*Trong kiến trúc Microservices, Reporting Service sẽ subscribe các sự kiện (Event-Driven) từ Booking Service để tổng hợp dữ liệu, tránh query nặng nề.*

### `MonthlyRevenue_View` (Table tổng hợp)
- `year`: Integer
- `month`: Integer
- `totalRevenue`: Decimal
- `totalBookings`: Integer

### `BrandRevenue_View`
- `brandId`: UUID
- `brandName`: String
- `totalRevenue`: Decimal

### `UserStats_View` (Cho màn hình Quản lý khách hàng)
- `userId`: UUID
- `totalTripsCompleted`: Integer
- `totalSpent`: Decimal

---

## 6. Giải pháp kiến trúc cho tính năng Search (Tìm kiếm xe trống)
*Để xử lý bộ lọc (Location, Start Date, End Date) trên giao diện hệ thống phân tán, cần có cơ chế check chéo giữa `Catalog Service` (Biết xe ở đâu) và `Booking Service` (Biết xe nào đang rảnh).*

**Cách tiếp cận đề xuất (API Composition qua API Gateway):**
1. **Bước 1 (Lọc theo Địa điểm):** API Gateway gọi sang `Catalog Service` (`GET /cars?city={location}`). `Catalog Service` query bảng `Car` kết hợp `Location` và trả về danh sách `carId` của các xe nằm tại địa điểm yêu cầu và có status không phải là `MAINTENANCE`.
2. **Bước 2 (Lọc theo Thời gian):** API Gateway mang danh sách `carId` vừa nhận, kèm theo `startDate` và `endDate`, gọi sang `Booking Service` (`POST /bookings/check-availability`).
3. **Bước 3 (Check trùng lịch):** `Booking Service` query bảng `Booking` để xem trong danh sách `carId` đó, xe nào KHÔNG có bất kỳ đơn hàng nào (`status` = `CONFIRMED`, `ACTIVE`, `APPROVED`) bị giao nhau (overlap) với khoảng thời gian `startDate` - `endDate` của user.
   *(Công thức overlap: `Booking.startDate < User.endDate` VÀ `Booking.endDate > User.startDate`)*
4. **Bước 4:** Trả về danh sách `carId` khả dụng cuối cùng cho Gateway để map dữ liệu gửi về Frontend.

*(Lưu ý: Nếu hệ thống scale lớn hơn, có thể cân nhắc dùng **CQRS + Elasticsearch** làm một `Search Service` riêng biệt, subscribe event từ cả 2 service trên để query cực nhanh chỉ với 1 lần hit database).*
