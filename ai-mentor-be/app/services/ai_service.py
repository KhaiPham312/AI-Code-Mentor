import httpx
from typing import Optional
from app.core.config import settings

SOCRATIC_SYSTEM_PROMPT = """Bạn là "AI Code Mentor" trong một hệ thống học lập trình dành cho sinh viên CNTT.
Nhiệm vụ của bạn là đồng hành, hướng dẫn tư duy sư phạm (Socratic method):
1. TUYỆT ĐỐI KHÔNG viết code giải hoàn chỉnh thay cho học viên.
2. Phân tích lỗi (Syntax, Runtime, Logic), giải thích bản chất của vấn đề và gợi mở từng bước.
3. Nếu học viên hỏi gợi ý, hãy đặt câu hỏi định hướng hoặc gợi ý hướng tiếp cận giải thuật.
4. Trả lời bằng tiếng Việt, lịch sự, khích lệ và dùng định dạng Markdown rõ ràng."""


class AIService:
    @staticmethod
    async def generate_mentor_reply(
        prompt: str,
        code_context: Optional[str] = None,
        terminal_error: Optional[str] = None,
        intent: Optional[str] = "free_chat",
    ) -> str:
        # If Gemini API key is configured, call Gemini API
        if settings.GEMINI_API_KEY:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.DEFAULT_AI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
                user_content = f"Ngữ cảnh mã nguồn của sinh viên:\n```python\n{code_context or 'Không có'}\n```\n"
                if terminal_error:
                    user_content += f"Lỗi terminal phát sinh:\n```\n{terminal_error}\n```\n"
                user_content += f"Ý định người dùng: {intent}\nCâu hỏi: {prompt}"

                payload = {
                    "contents": [
                        {"role": "user", "parts": [{"text": f"{SOCRATIC_SYSTEM_PROMPT}\n\n{user_content}"}]}
                    ],
                    "generationConfig": {
                        "temperature": 0.4,
                        "maxOutputTokens": 1000,
                    }
                }
                async with httpx.AsyncClient(timeout=20.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                return parts[0].get("text", "")
                    else:
                        print(f"[Gemini API Error] Status: {resp.status_code}, Body: {resp.text}")
            except Exception as e:
                print(f"[Gemini API Exception] Error: {e}")

        # Intelligent Socratic Fallback
        if intent == "explain_error" and terminal_error:
            return (
                f"🔍 **Phân tích lỗi:**\n"
                f"Lỗi của bạn thông báo:\n> `{terminal_error.strip()}`\n\n"
                f"💡 **Gợi ý kiểm tra:**\n"
                f"- Hãy kiểm tra xem chỉ số truy cập mảng/danh sách có vượt quá độ dài hay không (`IndexError`).\n"
                f"- Kiểm tra kiểu dữ liệu của biến đầu vào trước khi thực hiện phép toán.\n"
                f"- Bạn thử in (`print`) giá trị biến ngay trước dòng lỗi để xem nó đang mang giá trị gì nhé!"
            )
        elif intent == "hint_next_step":
            return (
                f"💡 **Định hướng bước kế tiếp:**\n"
                f"1. Xác định trường hợp cơ bản (base case / edge case): mảng rỗng hoặc số nhỏ nhất.\n"
                f"2. Bạn đã duyệt qua từng phần tử chưa? Điều kiện nào cần thỏa mãn để đưa phần tử vào kết quả?\n"
                f"👉 Hãy thử viết ra giấy logic từng bước trước khi gõ code nhé!"
            )
        elif intent == "analyze_complexity":
            return (
                f"⚡ **Phân tích độ phức tạp (Big-O):**\n"
                f"- Về **Thời gian (Time Complexity)**: Bạn đang dùng bao nhiêu vòng lặp lồng nhau? Với $N$ phần tử, thuật toán chạy cỡ bao nhiêu phép tính?\n"
                f"- Về **Không gian (Space Complexity)**: Bạn có tạo thêm mảng phụ hay cấu trúc dữ liệu mới chiếm bộ nhớ không?"
            )
        elif intent == "suggest_test_cases":
            return (
                f"🛡️ **Gợi ý Edge Cases kiểm thử:**\n"
                f"1. Mảng rỗng `[]` hoặc chỉ có 1 phần tử.\n"
                f"2. Các số âm hoặc số 0.\n"
                f"3. Dữ liệu với các giá trị trùng lặp.\n"
                f"4. Dữ liệu ở cận giới hạn lớn nhất của bài toán."
            )

        return (
            f"👋 Chào bạn! Tôi đã nhận được câu hỏi: *\"{prompt}\"*.\n\n"
            f"Hãy cho tôi biết cụ thể bạn đang gặp khó khăn ở bước giải thuật nào hoặc dòng code nào nhé!"
        )
