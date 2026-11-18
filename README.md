# 🤖 AI Code Mentor

Hệ thống Trợ giảng Lập trình Thông minh theo phương pháp gợi mở sư phạm (**Socratic AI Mentor**), tích hợp trình biên dịch & chấm code trực tuyến (Online Judge / Web IDE) và hệ thống quản lý học tập dành cho sinh viên, giảng viên và quản trị viên ngành CNTT.

---

## 🌟 Tính Năng Nổi Bật

- **Trợ lý AI Mentor (Socratic Method):**
  - Tích hợp **Google Gemini Interactions API** (`gemini-3.1-flash-lite`, `gemini-3.8-flash`).
  - Hướng dẫn tư duy gợi mở sư phạm từng bước, **tuyệt đối không spoil toàn bộ lời giải**.
  - Phân tích nguyên nhân lỗi biên dịch/runtime, gợi ý trường hợp biên (edge cases) và phân tích độ phức tạp thuật toán $O(N)$ định dạng toán KaTeX chuẩn xác.
- **Trình biên dịch & Sandbox An toàn:**
  - Hỗ trợ đa ngôn ngữ: Python, C++, Java, JavaScript, C, SQL.
  - Cơ chế bảo mật 2 tầng: Bộ lọc tĩnh AST / Regex chặn thư viện nguy hiểm (`os`, `subprocess`, `socket`, `fstream`...) và cơ chế giới hạn tài nguyên hệ điều hành (`setrlimit`).
- **Kiến trúc Sẵn sàng Tải cao (500+ CCU):**
  - **Cơ sở dữ liệu:** PostgreSQL 16 với SQLAlchemy Connection Pooling (`pool_size=25`, `max_overflow=50`).
  - **Hàng đợi chấm code:** Kiến trúc bất đồng bộ **Redis + Celery Judge Worker**, giảm tải tối đa cho web server, xử lý chấm bài song song mà không nghẽn luồng.
  - **Web Server:** Chạy đa tiến trình qua **Gunicorn + Uvicorn Workers**.
- **Phân quyền 3 Vai trò (RBAC):**
  - 🎓 **Sinh viên (Student):** Web IDE Monaco Editor, chạy thử test cases, nộp bài chính thức, xem lịch sử, chat hỏi đáp Socratic AI.
  - 👨‍🏫 **Giảng viên (Teacher):** Quản lý môn học, lớp học, ngân hàng bài tập, thống kê tiến độ học tập của từng lớp.
  - 🛡️ **Quản trị viên (Admin):** Quản trị tài khoản toàn hệ thống, giám sát nhật ký vi phạm an ninh sandbox, cấu hình tham số AI runtime & quota câu hỏi.

---

## 🏗️ Tổng Quan Kiến Trúc

```text
AI-Code-Mentor/
├── ai-mentor-fe/       # Frontend UI (React 19 + Vite + TypeScript + TailwindCSS + Monaco)
├── ai-mentor-be/       # Backend API (FastAPI + SQLAlchemy + Celery + Gunicorn)
│   ├── app/
│   │   ├── api/        # RESTful API Endpoints (Auth, Exercises, Submissions, Admin, AI)
│   │   ├── core/       # Cấu hình hệ thống, bảo mật JWT, Celery app
│   │   ├── models/     # Mô hình dữ liệu ORM (Users, Classes, Exercises, Submissions, Chat)
│   │   ├── schemas/    # Pydantic Schemas request/response
│   │   ├── services/   # Bộ thực thi mã nguồn Sandbox & Gemini AI Service
│   │   └── tasks/      # Background Celery judge tasks
│   ├── gunicorn_conf.py# Cấu hình đa tiến trình Gunicorn Multi-Worker
│   ├── start_server.sh # Script khởi động Web Server sản xuất
│   └── start_judge_worker.sh # Script khởi động Celery Judge Worker
├── docker-compose.yml  # Dịch vụ PostgreSQL 16 & Redis 7 containerized
└── README.md           # Hướng dẫn chi tiết triển khai & vận hành
```

---

## 📋 Yêu Cầu Môi Trường (Prerequisites)

1. **Node.js** (Phiên bản `>= 20.x` hoặc `22.x`) và **npm**.
2. **Python** (Phiên bản `>= 3.10` hoặc `3.11`/`3.12`/`3.14`).
3. **Docker** & **Docker Compose** (Khởi chạy PostgreSQL và Redis).
4. **Git**.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy Dự Án

### BƯỚC 1: Clone kho mã nguồn từ GitHub

```bash
git clone https://github.com/KhaiPham312/AI-Code-Mentor.git
cd AI-Code-Mentor
```

---

### BƯỚC 2: Khởi chạy Cụm Hạ Tầng (PostgreSQL & Redis)

Tại thư mục gốc dự án:

```bash
docker compose up -d
```

> Cả 2 container `ai_mentor_postgres` (Port 5432) và `ai_mentor_redis` (Port 6379) sẽ khởi động với volume lưu trữ dữ liệu bền vững.

---

### BƯỚC 3: Thiết lập & Khởi chạy Backend (`ai-mentor-be`)

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

3. **Cài đặt dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Tạo file cấu hình môi trường `.env`:**
   ```bash
   cp .env.example .env
   ```
   *(File `.env.example` đã cấu hình sẵn kết nối tới PostgreSQL và Redis container. Bạn chỉ cần cập nhật `GEMINI_API_KEY` của mình vào `.env`).*

5. **Khởi tạo bảng dữ liệu và nạp dữ liệu mẫu ban đầu:**
   ```bash
   python scripts/seed_data.py
   ```

6. **Khởi chạy Web Server & Worker chấm bài:**
   - **Terminal 1 - Khởi chạy Backend Web Server:**
     - *Chế độ phát triển (Auto reload):*
       ```bash
       uvicorn app.main:app --reload --port 8000
       ```
     - *Chế độ tải cao (Gunicorn Multi-Worker):*
       ```bash
       ./start_server.sh
       ```
   - **Terminal 2 - Khởi chạy Celery Judge Worker (Chấm bài ngầm qua Redis):**
     ```bash
     ./start_judge_worker.sh
     ```

* Backend API: **`http://localhost:8000`**
* Tài liệu Swagger UI tương tác: **`http://localhost:8000/docs`**

---

### BƯỚC 4: Thiết lập & Khởi chạy Frontend (`ai-mentor-fe`)

Mở một **Terminal mới** (giữ nguyên Backend và Worker đang chạy):

1. **Di chuyển vào thư mục frontend:**
   ```bash
   cd ai-mentor-fe
   ```

2. **Tạo file cấu hình môi trường `.env`:**
   ```bash
   cp .env.example .env
   ```
   *Cấu hình trỏ tới Backend API:*
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. **Cài đặt thư viện dependencies:**
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

Hệ thống đã có sẵn 3 tài khoản mặc định đại diện cho 3 vai trò:

| Vai trò | Tên đăng nhập | Email | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- | :--- |
| 🎓 **Học sinh (Student)** | `student` | `student@hnue.edu.vn` | `123456` | Web IDE, Nộp bài, Hỏi đáp Socratic AI |
| 👨‍🏫 **Giảng viên (Teacher)** | `teacher` | `teacher@hnue.edu.vn` | `123456` | Quản lý lớp, quản lý bài tập, theo dõi kết quả học tập |
| 🛡️ **Quản trị viên (Admin)** | `admin` | `admin@hnue.edu.vn` | `123456` | Quản lý người dùng, nhật ký Sandbox, điều chỉnh tham số AI |

> *Bạn cũng có thể bấm nút **"Đăng ký"** tại trang Login để tạo tài khoản mới.*

---

## 💡 Luồng Trải Nghiệm Chính

1. **Đăng nhập:** Truy cập `http://localhost:5173` và đăng nhập bằng tài khoản `student` (hoặc `teacher`, `admin`).
2. **Khám phá Bài tập:** Chọn các bài tập thuật toán từ danh mục trên Dashboard.
3. **Lập trình trên Web IDE (`StudentWorkspace`):**
   - Viết mã nguồn với hỗ trợ gợi ý cú pháp Monaco Editor.
   - Bấm **Run Code** để kiểm tra nhanh trên các test cases ví dụ.
   - Bấm **Submit** để đưa vào hàng đợi chấm ngầm toàn bộ test cases (bao gồm test ẩn).
4. **Tương tác cùng AI Code Mentor (`FloatingAIMentorChat`):**
   - Đặt câu hỏi trực tiếp hoặc sử dụng các hành động nhanh: *"Giải thích lỗi"*, *"Gợi ý bước tiếp theo"*, *"Phân tích độ phức tạp"*, *"Đề xuất test cases biên"*.
   - AI sẽ hướng dẫn tư duy sư phạm giải thuật mà không tiết lộ đáp án.

---

## 🧪 Kiểm Thử Hệ Thống (Automated Tests)

Chạy bộ kiểm thử tự động của Backend:

```bash
cd ai-mentor-be
pytest tests -q
```
*(Bao gồm kiểm thử API Auth, Exercises, Submission Queue, và AI Mentor Chat Endpoint).*

---

## 📄 Bản Quyền & Giấy Phép

Dự án được phát triển phục vụ mục đích nghiên cứu, học tập và ứng dụng AI vào đổi mới phương pháp giảng dạy lập trình tại các cơ sở đào tạo đại học.
