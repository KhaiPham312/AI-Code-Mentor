# 🤖 AI Code Mentor

Hệ thống Trợ giảng Lập trình Thông minh theo phương pháp gợi mở sư phạm (**Socratic AI Mentor**), tích hợp trình biên dịch & chấm code trực tuyến (Online Judge / Web IDE) và hệ thống quản lý học tập dành cho sinh viên & giảng viên ngành CNTT.

---

## 🌟 Tổng Quan Kiến Trúc

Dự án gồm 2 phần chính:
- **`ai-mentor-fe`**: Frontend xây dựng bằng **React 19**, **Vite**, **TypeScript**, **TailwindCSS**, Monaco Editor và KaTeX.
- **`ai-mentor-be`**: Backend API xây dựng bằng **FastAPI**, **SQLAlchemy**, **Alembic**, **Pydantic** và **PostgreSQL** (có kết nối Connection Pool chịu tải 500+ CCU, dự phòng SQLite), tích hợp Google Gemini AI.
- **`docker-compose.yml`**: Khởi chạy nhanh cụm dịch vụ PostgreSQL 16 container hóa sẵn sàng cho môi trường tải cao.

```text
AI-Code-Mentor/
├── ai-mentor-fe/       # Mã nguồn giao diện Frontend (React + Vite)
├── ai-mentor-be/       # Mã nguồn dịch vụ Backend API (FastAPI)
├── docker-compose.yml  # Cấu hình container PostgreSQL 16
└── README.md           # Hướng dẫn khởi chạy toàn bộ hệ thống
```

---

## 📋 Yêu Cầu Môi Trường (Prerequisites)

Trước khi bắt đầu, đảm bảo máy tính đã cài đặt:
1. **Node.js** (Khuyến nghị phiên bản `>= 20.x` hoặc `22.x`) và **npm**.
2. **Python** (Khuyến nghị phiên bản `>= 3.10` hoặc `3.11`/`3.12`/`3.14`).
3. **Docker** & **Docker Compose** (Khuyến nghị dùng để chạy PostgreSQL chịu tải cao).
4. **Git**.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### BƯỚC 1: Clone kho mã nguồn từ GitHub

```bash
git clone https://github.com/KhaiPham312/AI-Code-Mentor.git
cd AI-Code-Mentor
```

---

### BƯỚC 2: Khởi chạy CSDL & Backend (`ai-mentor-be`)

1. **Khởi chạy PostgreSQL & Redis bằng Docker (Khuyến nghị cho hiệu năng cao):**
   Tại thư mục gốc dự án:
   ```bash
   docker compose up -d
   ```
   *(Cả 2 container PostgreSQL 16 và Redis 7 sẽ tự động chạy ngầm phục vụ CSDL và hàng đợi chấm code).*

2. **Di chuyển vào thư mục backend:**
   ```bash
   cd ai-mentor-be
   ```

3. **Khởi tạo và kích hoạt môi trường ảo (Virtualenv):**
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

4. **Cài đặt các thư viện cần thiết:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Tạo file cấu hình môi trường `.env`:**
   ```bash
   cp .env.example .env
   ```
   *(File `.env.example` đã cấu hình sẵn kết nối tới PostgreSQL container. Mở file `.env` và điền `GEMINI_API_KEY` nếu bạn muốn sử dụng mô hình Google Gemini thật).*

6. **Khởi tạo cơ sở dữ liệu và nạp dữ liệu mẫu:**
   ```bash
   python scripts/seed_data.py
   ```

7. **Khởi chạy Backend Server & Celery Judge Worker:**
   - **Chạy Backend Server:**
     - Khi phát triển cục bộ:
       ```bash
       uvicorn app.main:app --reload --port 8000
       ```
     - Khi chạy tải cao (Multi-worker):
       ```bash
       ./start_server.sh
       ```
   - **Chạy Celery Judge Worker (Xử lý chấm bài bất đồng bộ qua Redis):**
     Mở một terminal mới trong thư mục `ai-mentor-be/`:
     ```bash
     ./start_judge_worker.sh
     ```
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

Hệ thống đã có sẵn 3 tài khoản mẫu ứng với 3 vai trò để bạn trải nghiệm:

| Vai trò | Tên đăng nhập | Email | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- | :--- |
| **Học sinh (Student)** | `student` | `student@hnue.edu.vn` | `123456` | Web IDE, Làm bài, nộp bài, Chat Socratic AI |
| **Giáo viên (Teacher)** | `teacher` | `teacher@hnue.edu.vn` | `123456` | Quản lý lớp, quản lý bài tập, theo dõi tiến độ |
| **Quản trị viên (Admin)** | `admin` | `admin@hnue.edu.vn` | `123456` | Quản lý người dùng, nhật ký Sandbox, cấu hình AI |

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
