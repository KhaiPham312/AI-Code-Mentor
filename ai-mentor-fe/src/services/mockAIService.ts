import { AIMessage, QuickPrompt, SocraticIntent } from '../types/ai';

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'explain_error',
    title: 'Phân tích lỗi Runtime/Syntax',
    desc: 'Giải thích nguyên nhân gây ra lỗi và cách khắc phục tư duy',
    icon: 'AlertTriangle',
    badge: 'Ưu tiên khi có lỗi'
  },
  {
    id: 'hint_next_step',
    title: 'Gợi ý bước kế tiếp',
    desc: 'Định hướng tư duy tiếp theo mà không làm hộ code',
    icon: 'Lightbulb'
  },
  {
    id: 'analyze_complexity',
    title: 'Đánh giá độ phức tạp (Big-O)',
    desc: 'Phân tích Time & Space Complexity của thuật toán hiện tại',
    icon: 'Cpu'
  },
  {
    id: 'suggest_test_cases',
    title: 'Gợi ý Edge Case kiểm thử',
    desc: 'Tìm các trường hợp biên mảng rỗng, số âm, số 0 dễ gây lỗi',
    icon: 'ShieldCheck'
  }
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: `👋 Chào bạn! Tôi là **AI Code Mentor** của lớp học.

🎯 **Quy tắc đồng hành của tôi:**
1. Tôi sẽ **không viết code hoàn chỉnh thay bạn** (để đảm bảo bạn nắm vững tư duy lập trình).
2. Tôi sẽ cùng bạn **phân tích lỗi, giải thích bản chất** và đặt câu hỏi gợi mở (Socratic Method) để bạn tự tìm ra giải pháp.

👉 Khi gặp lỗi ở Terminal hoặc phân vân thuật toán, hãy ấn vào các nút gợi ý nhanh bên dưới hoặc đặt câu hỏi cho tôi nhé!`,
    timestamp: 'Vừa xong',
    intent: 'free_chat'
  }
];

/**
 * Tạo câu trả lời sư phạm dựa trên ngữ cảnh code và lỗi terminal
 */
export const generateSocraticResponse = async (
  intent: SocraticIntent,
  userPrompt: string,
  _code: string,
  terminalError?: string,
  onChunk?: (text: string) => void
): Promise<string> => {
  let fullResponse = '';

  // 1. Nếu người dùng đòi xin code giải trực tiếp
  const directCodeRequests = ['cho em xin code', 'giải hộ', 'code hoàn chỉnh', 'làm bài giúp', 'cho đáp án', 'viet code'];
  const isAskingForSolution = directCodeRequests.some(term => userPrompt.toLowerCase().includes(term));

  if (isAskingForSolution) {
    fullResponse = `🤖 **Thầy/AI Mentor không thể đưa code giải hoàn chỉnh cho bạn được nhé!**

Mục tiêu của bài tập là rèn luyện khả năng tư duy thuật toán cho bạn. Thay vào đó, chúng ta hãy cùng chia nhỏ bài toán:

1. **Đầu tiên:** Bạn đã nắm được điều kiện để một số là số nguyên tố chưa? (Gợi ý: Một số $n$ thì cần kiểm tra các ước từ đâu đến đâu?)
2. **Kế tiếp:** Trong code của bạn, mảng kết quả đang lưu trữ những gì?

Bạn thử trả lời câu hỏi số 1 trước nhé, tôi sẽ hướng dẫn bạn viết từng dòng điều kiện! 💡`;
  }
  // 2. Xử lý khi có lỗi Terminal
  else if (intent === 'explain_error') {
    if (terminalError?.includes('IndexError')) {
      fullResponse = `🔍 **Phân tích lỗi \`IndexError: list index out of range\`**

⚠️ **Bản chất lỗi:**
Chương trình của bạn đang cố truy cập vào một vị trí chỉ mục (index) không tồn tại trong danh sách.
Ví dụ: Mảng có $N$ phần tử thì chỉ mục hợp lệ chỉ từ $0$ đến $N - 1$. Nếu bạn gọi \`arr[i + 1]\` ở phần tử cuối cùng, chỉ mục sẽ bằng $N$ và gây sập chương trình.

❓ **Câu hỏi gợi mở cho bạn:**
- Trong vòng lặp của bạn, biến \`i\` đang chạy đến đâu?
- Khi \`i = len(arr) - 1\`, giá trị của \`i + 1\` là bao nhiêu?
- Bạn có thể điều chỉnh cận trên của vòng \`range(...)\` như thế nào để phần tử kế tiếp luôn nằm trong mảng?`;
    } else if (terminalError?.includes('SyntaxError')) {
      fullResponse = `⚠️ **Phát hiện lỗi cú pháp (\`SyntaxError\`)**

Trong Python, sau các câu lệnh định nghĩa hàm (\`def\`), rẽ nhánh (\`if/elif/else\`), hoặc vòng lặp (\`for/while\`), bạn luôn cần một dấu hai chấm \`:\` ở cuối dòng để bắt đầu một khối lệnh (block).

🔍 Bạn hãy nhìn lại dòng khai báo hàm hoặc điều kiện gần nhất xem đã có ký tự \`:\` chưa nhé!`;
    } else if (terminalError?.includes('IndentationError')) {
      fullResponse = `⚠️ **Phát hiện lỗi thụt đầu dòng (\`IndentationError\`)**

Python sử dụng khoảng trắng (Indentation) để xác định khối lệnh thay cho cặp ngoặc nhọn \`{}\` như C++/Java:
- Thông thường mỗi cấp thụt lề chuẩn là **4 dấu cách (spaces)**.
- Bạn hãy kiểm tra xem có dòng nào thụt lề so le (lúc 2 spaces, lúc 4 spaces) không nhé.`;
    } else {
      fullResponse = `🔍 **Kiểm tra trạng thái chạy thử**

Chương trình hiện tại chưa vượt qua hết các test case mẫu.
- Kết quả thực tế hàm trả về chưa khớp với kết quả mong đợi.
- Bạn hãy đặt thử lệnh \`print()\` bên trong vòng lặp để quan sát xem biến đang nhận giá trị gì qua từng bước nhé!`;
    }
  }
  // 3. Gợi ý bước kế tiếp
  else if (intent === 'hint_next_step') {
    fullResponse = `💡 **Gợi ý định hướng bước kế tiếp:**

Để giải quyết bài toán này một cách tối ưu, bạn có thể chia làm 2 giai đoạn:
1. **Giai đoạn 1:** Xây dựng hàm bổ trợ nhỏ \`is_prime(n)\` chỉ làm đúng 1 nhiệm vụ: kiểm tra xem số $n$ có phải số nguyên tố hay không.
2. **Giai đoạn 2:** Dùng một vòng lặp \`for\` duyệt qua từng phần tử của danh sách đầu vào, nếu phần tử thỏa mãn hàm ở giai đoạn 1 thì thêm vào danh sách kết quả.

❓ **Thử thách tư duy:** Thay vì kiểm tra ước tới tận $n - 1$, bạn có biết tại sao ta chỉ cần kiểm tra tới $\\sqrt{n}$ là đã đủ kết luận không?`;
  }
  // 4. Phân tích độ phức tạp
  else if (intent === 'analyze_complexity') {
    fullResponse = `⏱️ **Đánh giá độ phức tạp thuật toán (Complexity Analysis)**

Dựa trên cấu trúc code hiện tại của bạn:
- **Thời gian (Time Complexity):**
  - Vòng lặp ngoài duyệt qua $N$ phần tử của mảng: $O(N)$.
  - Với mỗi phần tử, kiểm tra ước đến $\\sqrt{k}$: $O(\\sqrt{k})$.
  - $\\Rightarrow$ Tổng thời gian xấp xỉ: **$O(N \\sqrt{k})$**. Đây là cách tiếp cận rất tốt cho mảng có $N \\le 10^4$.
- **Bộ nhớ (Space Complexity):**
  - Mảng \`primes\` lưu trữ tối đa $N$ phần tử: **$O(N)$** không gian phụ trợ.

🎯 **Điểm cộng:** Bạn đã áp dụng bước nhảy $\\sqrt{n}$ giúp tiết kiệm đáng kể thời gian so với duyệt tuần tự $O(n)$!`;
  }
  // 5. Gợi ý test cases biên
  else if (intent === 'suggest_test_cases') {
    fullResponse = `🧪 **Các trường hợp biên (Edge Cases) bạn nên thử kiểm tra:**

1. **Mảng rỗng:** \`arr = []\` $\\rightarrow$ hàm phải trả về \`[]\`, không được báo lỗi.
2. **Các số đặc biệt:** \`arr = [0, 1]\` $\\rightarrow$ cả 0 và 1 đều **không** phải số nguyên tố.
3. **Mảng toàn số âm:** \`arr = [-3, -7, -11]\` $\\rightarrow$ số âm không phải số nguyên tố.
4. **Số nguyên tố nhỏ nhất:** \`arr = [2]\` $\\rightarrow$ số 2 là số nguyên tố chẵn duy nhất.

Bạn có thể thêm các case này vào hàm để chạy thử xem code của mình đã bao quát hết chưa nhé!`;
  }
  // 6. Free chat chung
  else {
    fullResponse = `Chào bạn! Tôi đã đọc câu hỏi: "*${userPrompt}*".

Dựa vào đoạn code bạn đang viết, tôi nhận thấy bạn đã hoàn thành khung cơ bản của bài tập. 

❓ Bạn đang băn khoăn ở phần nào nhất:
- Cách kiểm tra điều kiện?
- Cú pháp mảng trong Python?
- Hay cách tối ưu thời gian chạy để nộp bài đạt điểm tối đa?`;
  }

  // Giả lập hiệu ứng gõ chữ (Streaming effect)
  if (onChunk) {
    const words = fullResponse.split(' ');
    let currentText = '';
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      onChunk(currentText);
      await new Promise(r => setTimeout(r, 20)); // gõ chữ mượt mà
    }
  }

  return fullResponse;
};
