# Đặc tả Cơ sở dữ liệu (Database Specification) - Dự án AI Mentor

## 1. Bảng `users` (Quản lý tài khoản)
Lưu trữ thông tin đăng nhập và phân quyền của toàn bộ người dùng trong hệ thống.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | Mã người dùng (Khóa chính) |
| `username` | String(50) | Unique, Not Null | Tên đăng nhập |
| `email` | String(100) | Unique, Not Null | Địa chỉ email liên hệ |
| `password_hash` | String(255)| Not Null | Mật khẩu đã được băm (Bcrypt) |
| `role` | String(20) | Not Null | Vai trò: `student`, `teacher`, `admin` |

## 2. Bảng `subjects` (Quản lý môn học)
Lưu trữ danh mục các môn học được hệ thống hỗ trợ giảng dạy.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | Mã môn học (Khóa chính) |
| `name` | String(100) | Not Null | Tên môn học (VD: Lập trình Python) |
| `description` | Text | Nullable | Mô tả tổng quan về môn học |
| `teacher_id` | Integer | FK -> `users.id` | Giảng viên phụ trách môn học |

## 3. Bảng `classes` (Quản lý lớp học phần)
Lưu trữ các lớp học thực tế được mở trong từng học kỳ.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | Mã lớp học (Khóa chính) |
| `subject_id` | Integer | FK -> `subjects.id` | Trỏ về môn học tương ứng |
| `teacher_id` | Integer | FK -> `users.id` | Giảng viên đứng lớp |
| `class_code` | String(20) | Unique, Not Null | Mã lớp học phần (VD: INT3110_1) |
| `semester` | String(20) | Nullable | Học kỳ (VD: 20261) |

## 4. Bảng `class_enrollments` (Quản lý sinh viên trong lớp)
Bảng trung gian thể hiện mối quan hệ nhiều-nhiều giữa sinh viên và lớp học.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `class_id` | Integer | PK, FK -> `classes.id` | Mã lớp học |
| `student_id` | Integer | PK, FK -> `users.id` | Mã sinh viên |
| `enrolled_at` | DateTime | Default: NOW() | Thời gian sinh viên tham gia lớp |

## 5. Bảng `exercises` (Quản lý ngân hàng bài tập)
Lưu trữ nội dung đề bài và cấu trúc code khởi tạo cho code editor.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | Mã bài tập (Khóa chính) |
| `subject_id` | Integer | FK -> `subjects.id` | Phân loại bài tập thuộc môn nào |
| `title` | String(200) | Not Null | Tiêu đề bài toán |
| `description` | Text | Nullable | Nội dung chi tiết đề bài |
| `difficulty` | String(20) | Nullable | Độ khó: `easy`, `medium`, `hard` |
| `boilerplate_code`| Text | Nullable | Code mồi định dạng sẵn trên Editor |

## 6. Bảng `test_cases` (Quản lý bộ test chấm điểm)
Lưu trữ các trường hợp kiểm thử để đánh giá code của sinh viên.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | Mã test case (Khóa chính) |
| `exercise_id` | Integer | FK -> `exercises.id`| Trỏ về bài tập tương ứng |
| `input_data` | Text | Nullable | Dữ liệu đầu vào truyền cho chương trình |
| `expected_output` | Text | Nullable | Kết quả đầu ra kỳ vọng để so sánh |
| `is_hidden` | Boolean | Default: True | True = Dùng để chấm ngầm, False = Hiển thị làm ví dụ |

## 7. Bảng `submissions` (Lịch sử nộp bài)
Lưu trữ các lần nộp code của sinh viên để đánh giá và thống kê.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | Mã lượt nộp bài (Khóa chính) |
| `user_id` | Integer | FK -> `users.id` | Sinh viên nộp bài |
| `exercise_id` | Integer | FK -> `exercises.id`| Bài tập được giải |
| `source_code` | Text | Nullable | Mã nguồn sinh viên gửi lên |
| `status` | String(20) | Nullable | Trạng thái: `passed`, `failed`, `error` |
| `submitted_at` | DateTime | Default: NOW() | Thời điểm bấm nộp bài |

## 8. Bảng `chat_history` (Lịch sử vấn đáp AI)
Lưu trữ ngữ cảnh trò chuyện giữa sinh viên và AI Mentor theo từng bài tập.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | Mã tin nhắn (Khóa chính) |
| `user_id` | Integer | FK -> `users.id` | Sinh viên thực hiện đoạn chat |
| `exercise_id` | Integer | FK -> `exercises.id`| Ngữ cảnh chat thuộc về bài toán nào |
| `role` | String(10) | Nullable | Phân loại tin nhắn: `user` hoặc `ai` |
| `content` | Text | Nullable | Nội dung chi tiết của tin nhắn |
| `created_at` | DateTime | Default: NOW() | Thời gian gửi tin nhắn |