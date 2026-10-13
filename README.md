# 🤖 AI Code Mentor

Hệ thống Trợ giảng Lập trình Thông minh theo phương pháp gợi mở sư phạm (**Socratic AI Mentor**), tích hợp trình biên dịch & chấm code trực tuyến (Online Judge / Web IDE) và hệ thống quản lý học tập dành cho sinh viên & giảng viên ngành CNTT.

---

## 🌟 Tổng Quan Kiến Trúc

Dự án gồm 2 phần chính:
- **`ai-mentor-fe`**: Frontend xây dựng bằng **React 19**, **Vite**, **TypeScript**, **TailwindCSS**, Monaco Editor và KaTeX.
- **`ai-mentor-be`**: Backend API xây dựng bằng **FastAPI**, **SQLAlchemy**, **Alembic**, **Pydantic** và **SQLite** (hoặc PostgreSQL), tích hợp Google Gemini AI.

```text
AI-Code-Mentor/
├── ai-mentor-fe/       # Mã nguồn giao diện Frontend (React + Vite)
├── ai-mentor-be/       # Mã nguồn dịch vụ Backend API (FastAPI)
└── README.md           # Hướng dẫn khởi chạy toàn bộ hệ thống
```

---

## 📋 Yêu Cầu Môi Trường (Prerequisites)

Trước khi bắt đầu, đảm bảo máy tính đã cài đặt:
1. **Node.js** (Khuyến nghị phiên bản `>= 20.x` hoặc `22.x`) và **npm**.
2. **Python** (Khuyến nghị phiên bản `>= 3.10` hoặc `3.11`/`3.12`).
3. **Git**.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### BƯỚC 1: Clone kho mã nguồn từ GitHub

```bash
git clone https://github.com/KhaiPham312/AI-Code-Mentor.git
cd AI-Code-Mentor
```

---

### BƯỚC 2: Cài đặt và khởi chạy Backend (`ai-mentor-be`)

1. **Di chuyển vào thư mục backend:**
   ```bash
   cd ai-mentor-be
   ```

2. **Khởi tạo và kích hoạt môi trường ảo (Virtualenv):**
   - Trên **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - Trên **Windows** (PowerShell / Command Prompt):
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Cài đặt các thư viện cần thiết:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Tạo file cấu hình môi trường `.env`:**
   ```bash
   cp .env.example .env
   ```
   *(Tùy chọn: Mở file `.env` và điền `GEMINI_API_KEY` nếu bạn muốn sử dụng mô hình Google Gemini thật).*

5. **Khởi tạo cơ sở dữ liệu và nạp dữ liệu mẫu:**
   ```bash
   alembic upgrade head
   python scripts/seed_data.py
   ```

6. **Khởi chạy Backend Server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * Backend API hoạt động tại: **`http://localhost:8000`**
   * Tài liệu API tương tác (Swagger UI): **`http://localhost:8000/docs`**

---

### BƯỚC 3: Cài đặt và khởi chạy Frontend (`ai-mentor-fe`)

Mở một **Terminal mới** (giữ nguyên terminal Backend đang chạy):

1. **Di chuyển vào thư mục frontend:**
   ```bash
   cd ai-mentor-fe
   ```

2. **Tạo file cấu hình môi trường `.env`:**
   ```bash
   cp .env.example .env
   ```
   *Nội dung mặc định kết nối tới Backend:*
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

4. **Khởi chạy Frontend Dev Server:**
   ```bash
   npm run dev
   ```
   * Mở trình duyệt truy cập: **`http://localhost:5173`**

---

## 🔑 Tài Khoản Đăng Nhập Mẫu (Seed Data)

Hệ thống đã có sẵn 2 tài khoản mẫu để bạn trải nghiệm ngay:

| Vai trò | Tên đăng nhập | Email | Mật khẩu |
| :--- | :--- | :--- | :--- |
| **Học sinh (Student)** | `student` | `student@hnue.edu.vn` | `123456` |
| **Giáo viên (Teacher)** | `teacher` | `teacher@hnue.edu.vn` | `123456` |

> *Ghi chú: Bạn cũng có thể bấm nút **"Đăng ký"** trên màn hình để tạo một tài khoản mới bất kỳ.*

---

## 💡 Luồng Trải Nghiệm Chính

1. **Đăng nhập:** Đăng nhập với tài khoản `student`.
2. **Chọn bài tập:** Danh mục bài tập hiển thị trên Dashboard kèm độ khó, chủ đề giải thuật.
3. **Không gian Web IDE (`StudentWorkspace`):**
   * Đọc đề bài, xem các test case ví dụ.
   * Viết code giải thuật (Python, C++, Java,...).
   * Bấm **Run Code** để kiểm tra nhanh kết quả với các test case mẫu.
   * Bấm **Submit** để nộp bài và chấm toàn bộ test cases (bao gồm cả test ẩn).
4. **Trợ lý AI Mentor (`FloatingAIMentorChat`):**
   * Bấm icon AI ở góc màn hình để nhận gợi ý hướng giải quyết theo phong cách Socratic (không spoil đáp án).
   * Phân tích nguyên nhân lỗi compiler/runtime và đánh giá độ phức tạp $O(N)$ bằng KaTeX.
