# AI Code Mentor - Backend API

Hệ thống Backend API xây dựng trên **FastAPI**, **SQLAlchemy** và **Alembic**, cung cấp dịch vụ quản lý bài tập lập trình, chấm điểm code (sandbox runner) và trợ giảng AI sư phạm (Socratic AI Mentor).

---

## 🚀 Tính Năng Chính Đã Hoàn Thiện

1. **Kiến trúc & Cấu hình:**
   - Framework FastAPI hiện đại, hỗ trợ async và auto Swagger Docs (`/docs`, `/redoc`).
   - Quản lý cấu hình môi trường qua `pydantic-settings` và `.env`.
   - Cấu hình CORS an toàn cho Frontend (Vite / React).

2. **Cơ sở dữ liệu & Migration:**
   - SQLAlchemy ORM hỗ trợ SQLite (mặc định cho local) và PostgreSQL (production).
   - Hệ thống Migration tự động với **Alembic** (`render_as_batch=True`).
   - Script khởi tạo dữ liệu mẫu (`scripts/seed_data.py`) đồng bộ với mock frontend.

3. **Xác thực & Phân quyền (Authentication):**
   - Đăng nhập bằng `username` hoặc `email`.
   - Mã hóa mật khẩu an toàn với `bcrypt`.
   - Cấp phát JWT Access Token và dependency phân quyền (`student`, `teacher`, `admin`).

4. **Quản lý Bài tập & Test Cases:**
   - Lọc bài tập theo độ khó (`easy`, `medium`, `hard`), chủ đề (`category`), ngôn ngữ (`language`).
   - **Bảo mật tuyệt đối:** API chỉ trả `sampleTestCases` cho sinh viên, không bao giờ lộ `hiddenTestCases`.

5. **Sandbox Chạy thử & Chấm điểm (Submissions):**
   - `POST /api/v1/submissions/run`: Chạy thử code trên các test case mẫu hoặc custom input của sinh viên.
   - `POST /api/v1/submissions`: Nộp bài và chấm toàn bộ test cases (gồm cả test ẩn), lưu lịch sử chấm điểm.
   - Cơ chế giới hạn thời gian (Time Limit), cắt ngắn output chống tràn bộ nhớ, cô lập tiến trình chạy.

6. **AI Mentor (Socratic Method):**
   - Hướng dẫn tư duy sư phạm: không làm hộ code, phân tích lỗi terminal, hướng dẫn gợi ý bước kế, phân tích Big-O, gợi ý edge cases.
   - Lưu trữ lịch sử hội thoại của từng người dùng và từng bài tập.
   - Tích hợp Gemini API qua `GEMINI_API_KEY` với fallback sư phạm thông minh.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Server

### 1. Kích hoạt Virtual Environment
```bash
cd ai-mentor-be
source venv/bin/activate
```

### 2. Cài đặt Dependencies (nếu cài mới)
```bash
pip install -r requirements.txt
```

### 3. Thiết lập biến môi trường
File `.env` đã được tạo sẵn từ `.env.example`. Bạn có thể chỉnh sửa `DATABASE_URL` hoặc thêm `GEMINI_API_KEY`:
```env
DATABASE_URL="sqlite:///./database/ai_mentor.db"
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Chạy Migration DB & Seed Dữ liệu mẫu
```bash
# Áp dụng migration mới nhất
alembic upgrade head

# Khởi tạo tài khoản mẫu và bài tập mẫu
python3 scripts/seed_data.py
```

**Tài khoản mặc định được tạo:**
- **Sinh viên:** username: `student` (hoặc `student@hnue.edu.vn`) | Mật khẩu: `123456`
- **Giảng viên:** username: `teacher` (hoặc `teacher@hnue.edu.vn`) | Mật khẩu: `123456`

### 5. Khởi chạy Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
- **API URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧪 Chạy Kiểm Thử Tự Động (Pytest)

Toàn bộ các luồng quan trọng (Healthcheck, Login/Auth, Lấy bài tập & bảo mật test ẩn, Chạy thử & nộp bài, AI Mentor Chat) đều có integration tests:

```bash
pytest -v
```

---

## 📁 Cấu Trúc Thư Mục

```text
ai-mentor-be/
├── alembic/                 # Cấu hình & các phiên bản migration DB
├── app/
│   ├── api/
│   │   ├── deps.py          # Dependency injection (get_db, current_user, roles)
│   │   └── v1/
│   │       ├── api.py       # Tập hợp các routes
│   │       └── endpoints/   # auth, exercises, submissions, ai, health
│   ├── core/
│   │   ├── config.py        # Settings & biến môi trường
│   │   └── security.py      # Hash bcrypt & JWT
│   ├── db/
│   │   ├── base.py          # Đăng ký models cho Alembic
│   │   └── session.py       # SQLAlchemy engine & session maker
│   ├── models/              # SQLAlchemy Models: User, Exercise, TestCase, Submission, etc.
│   ├── schemas/             # Pydantic v2 Schemas validation
│   ├── services/            # CodeRunner (Sandbox) & AIService (Socratic Mentor)
│   └── main.py              # FastAPI Application Entrypoint
├── database/                # File SQLite database local
├── scripts/
│   └── seed_data.py         # Seed dữ liệu mẫu đồng bộ với Frontend
├── tests/
│   └── test_api.py          # Bộ test integration tự động
├── .env.example             # Template file cấu hình môi trường
├── requirements.txt         # Khai báo thư viện Python
└── pytest.ini               # Cấu hình test runner
```
