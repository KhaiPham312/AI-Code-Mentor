# Checklist Chuẩn Bị Backend

Rà soát dựa trên code hiện có: backend mới có schema SQLAlchemy tạo SQLite; chưa thấy API, cấu hình chạy ứng dụng, dependency manifest, migration hay kiểm thử. Frontend hiện dùng mock/localStorage cho đăng nhập, bài tập, chấm code và AI.

## Ưu tiên chuẩn bị trước

- [x] **Chốt nền tảng và cách chạy:** chọn framework Python (FastAPI), quản lý cấu hình theo môi trường (`pydantic-settings`, `.env`, `.env.example`), CORS middleware, logging và lệnh chạy local `uvicorn app.main:app --reload`. Tạo dependency manifest `requirements.txt`, tài liệu `README.md` và kiểm thử `pytest`.
- [x] **Chọn database mục tiêu:** SQLite cho thử nghiệm local; hỗ trợ chuyển sang PostgreSQL qua cấu hình `DATABASE_URL`. Đã thiết lập hệ thống migration **Alembic** (`alembic upgrade head`) thay vì chỉ dựa vào `create_all`.
- [x] **Rà lại schema trước khi viết API:** các bảng đã được mở rộng và đồng bộ với Frontend:
  - `exercises`: ngôn ngữ, category, giới hạn thời gian/bộ nhớ, định dạng input/output, constraints.
  - `submissions`: số test đạt/tổng số, thời gian chạy, verdict chi tiết, error message, chi tiết kết quả.
  - `users`: tên hiển thị, mã sinh viên, thông tin lớp/ảnh, `role` (student/teacher/admin), `is_active`.
  - `test_cases`: phân biệt rõ test mẫu và test ẩn; API bảo mật tuyệt đối không bao giờ trả test ẩn cho client.
  - `chat_history`: thống nhất vai trò `user` và `assistant` (thay vì `ai`), lưu intent và ngữ cảnh code/terminal error.
  - Đã có script seed dữ liệu mẫu (`scripts/seed_data.py`) đồng bộ với mock frontend.

## API cần có để thay mock

Frontend types và mock ở [../ai-mentor-fe/src/types/auth.ts](../ai-mentor-fe/src/types/auth.ts), [../ai-mentor-fe/src/types/exercise.ts](../ai-mentor-fe/src/types/exercise.ts), [../ai-mentor-fe/src/services/mockAuth.ts](../ai-mentor-fe/src/services/mockAuth.ts), [../ai-mentor-fe/src/services/mockExerciseService.ts](../ai-mentor-fe/src/services/mockExerciseService.ts), [../ai-mentor-fe/src/services/mockAIService.ts](../ai-mentor-fe/src/services/mockAIService.ts) gợi ý các luồng sau:

- [ ] **Tài khoản:** đăng ký, đăng nhập bằng username hoặc email, lấy hồ sơ hiện tại, đăng xuất/thu hồi phiên. Mật khẩu phải hash; token có thời hạn; role và quyền phải kiểm tra phía server. SSO hiện chỉ là mock nên cần quyết định có tích hợp SSO thật hay không.
- [ ] **Danh mục học tập:** lấy danh sách và chi tiết bài tập, lọc theo ngôn ngữ/độ khó/chủ đề/trạng thái; lấy trạng thái tiến độ của người dùng.
- [ ] **Chạy thử và nộp bài:** chạy sample tests, nộp để chấm toàn bộ tests, xem lịch sử submissions và kết quả từng test được phép công khai.
- [ ] **AI Mentor:** gửi câu hỏi kèm bài tập, code và lỗi terminal; lưu lịch sử; hỗ trợ streaming nếu giữ trải nghiệm gõ chữ hiện tại. Cần cấu hình nhà cung cấp/model, API key ở server, giới hạn tốc độ/chi phí và chính sách lưu dữ liệu.
- [ ] **Giảng viên và lớp học:** CRUD bài tập/test case, quản lý môn/lớp/học viên, xem thống kê và log AI. Bắt buộc giới hạn quyền theo giảng viên/lớp, không chỉ dựa vào role chung.
- [ ] **Leaderboard:** endpoint trả thứ hạng, điểm, số bài giải và streak; trước khi làm cần định nghĩa cách tính và phạm vi xếp hạng (lớp, môn hay toàn hệ thống).

## Rủi ro cần xử lý sớm

- [ ] **Sandbox là phần quan trọng nhất về bảo mật.** Mock hiện giả lập kết quả; backend thật không được chạy code sinh viên trực tiếp trong tiến trình API. Cần dùng runner cô lập (container/judge service), giới hạn CPU, RAM, thời gian, mạng và dung lượng output; hỗ trợ Python/C++/Java theo lựa chọn ngôn ngữ trong bài tập.
- [ ] **Không để lộ test ẩn hoặc dữ liệu người khác.** API cần kiểm tra quyền sở hữu/lớp trước khi trả submissions, chat và log; chỉ trả kết quả phù hợp cho sinh viên.
- [ ] **Kiểm thử các ca quan trọng:** đăng nhập sai và trùng tài khoản, phân quyền, test ẩn, timeout/runtime error, nhiều lượt nộp đồng thời, và các truy vấn theo lớp.

## Thứ tự triển khai đề xuất

1. Nền tảng + DB/migration.
2. Auth.
3. Bài tập và trạng thái tiến độ.
4. Sandbox/chấm bài.
5. Lịch sử nộp.
6. AI chat.
7. Công cụ giảng viên/leaderboard.

Các màn hình dashboard/teacher hiện có vẫn là mock, nên có thể để sau khi luồng học viên chạy end-to-end.
