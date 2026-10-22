import { AIMessage, QuickPrompt, SocraticIntent } from '../types/ai';
import { getFirstName } from './mockAuth';

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'hint_next_step',
    title: 'Gợi ý bước kế tiếp',
    desc: 'Định hướng tư duy tiếp theo cho bài tập hiện tại',
    icon: 'Lightbulb',
  },
  {
    id: 'explain_error',
    title: 'Phân tích lỗi Runtime/Syntax',
    desc: 'Giải thích nguyên nhân gây ra lỗi và cách khắc phục',
    icon: 'AlertTriangle',
    badge: 'Ưu tiên khi có lỗi',
  },
  {
    id: 'analyze_complexity',
    title: 'Đánh giá độ phức tạp (Big-O)',
    desc: 'Phân tích Time & Space Complexity của thuật toán hiện tại',
    icon: 'Cpu',
  },
  {
    id: 'suggest_test_cases',
    title: 'Gợi ý Edge Case kiểm thử',
    desc: 'Tìm các trường hợp biên mảng rỗng, số âm, số 0',
    icon: 'ShieldCheck',
  },
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: `👋 Xin chào! Mình là **AI Code Mentor** trợ lý lập trình thông minh chuẩn Gemini.
Bạn có thể hỏi mình bất kỳ thắc mắc nào về lập trình, giải thuật (Dijkstra, Quy hoạch động, Đồ thị, Tree...), phân tích độ phức tạp $O(n)$, kiến thức OOP / SQL hay chữa lỗi mã nguồn nhé!`,
    timestamp: 'Vừa xong',
    intent: 'free_chat',
  },
];

export interface ExerciseAIContext {
  title?: string;
  category?: string;
  description?: string;
  code?: string;
  error?: string;
}

function getCurrentUserName(): string {
  try {
    const raw = localStorage.getItem('ai_mentor_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u.name) return getFirstName(u.name);
    }
  } catch {
    // Ignore
  }
  return 'Minh';
}

/**
 * Trình tạo phản hồi AI Trợ lý Toàn Năng (Chuẩn Gemini / GPT)
 */
export const generateSocraticResponse = async (
  intent: SocraticIntent,
  userPrompt: string,
  code: string,
  terminalError?: string,
  exerciseContext?: ExerciseAIContext,
  onChunk?: (text: string) => void,
  lang: 'vie' | 'eng' = 'vie'
): Promise<string> => {
  const promptLower = userPrompt.toLowerCase().trim();
  const userName = getCurrentUserName();
  const exerciseTitle = exerciseContext?.title || '';
  const exerciseCategory = exerciseContext?.category || '';
  const contextLower = `${exerciseTitle} ${exerciseCategory}`.toLowerCase();
  const err = terminalError || exerciseContext?.error;

  let fullResponse = '';

  // =========================================================================
  // 1. XỬ LÝ HỘI THOẠI TỰ NHIÊN / CHÀO HỎI (GREETING) CHUẨN GEMINI
  // =========================================================================
  const isGreetingWord =
    intent === 'greeting' ||
    /^(hi|hello|helo|hey|alo|chào|chao|xin chào|chào bạn|chào mentor|chào bot|good morning|hi bot|hello bot)[\s!.,?~]*$/i.test(
      promptLower
    );

  if (lang === 'eng') {
    if (isGreetingWord) {
      if (exerciseTitle) {
        fullResponse = `Hello ${userName}! 👋 Glad to be working with you today!

You are currently working on **"${exerciseTitle}"** (${exerciseCategory || 'Programming'}).
Would you like a step-by-step hint, a walkthrough of the optimal algorithm, or an explanation of the constraints? Feel free to ask anytime! ✨`;
      } else {
        fullResponse = `Hello ${userName}! 👋 Nice to meet you!

What would you like to explore today? We can dive into graph algorithms, dynamic programming, system design, or review and optimize your code! 🚀`;
      }
    } else if (intent === 'explain_error') {
      fullResponse = `🔍 **Error Diagnosis & Debugging:**
${err ? `Analyzing the reported terminal output:\n\`\`\`\n${err}\n\`\`\`\n` : ''}Common causes include out-of-bounds indices, unhandled empty inputs, or edge cases. Verify your loop bounds and base cases!`;
    } else if (intent === 'analyze_complexity') {
      fullResponse = `⏱️ **Time & Space Complexity Breakdown:**
- **Time Complexity:** Optimal solutions for **"${exerciseTitle || 'this problem'}"** typically run in $O(N)$ or $O(N \\log N)$. Avoiding nested linear scans ensures solutions stay well within the execution time limits.
- **Space Complexity:** Aim for $O(1)$ auxiliary space if in-place modification is permitted, or $O(N)$ if hashing or memoization is required.`;
    } else if (intent === 'hint_next_step') {
      fullResponse = `💡 **Socratic Guidance & Next Step:**
1. What invariant or property remains true after each step?
2. Consider edge cases: what happens when the collection is empty or contains duplicates?
3. How can a Hash Map or Two Pointers reduce redundant operations?`;
    } else {
      fullResponse = `Great observation! In problem-solving, breaking the algorithm down into preconditions, invariant state, and postconditions leads to robust code. Let me know which specific edge case or data structure you would like to examine!`;
    }
  } else if (isGreetingWord) {
    if (exerciseTitle) {
      fullResponse = `Chào ${userName}! 👋 Rất vui được đồng hành cùng bạn hôm nay!

Hiện tại bạn đang ở bài tập **"${exerciseTitle}"** (${exerciseCategory || 'Lập trình'}).
Bạn có muốn mình giải thích đề bài, gợi mở hướng tư duy thuật toán tối ưu, hay bạn muốn trao đổi về một chủ đề lập trình nào khác? Bạn cứ hỏi tự nhiên nhé! ✨`;
    } else {
      fullResponse = `Chào ${userName}! 👋 Rất vui được gặp bạn!

Hôm nay bạn muốn tìm hiểu về thuật toán nào (Dijkstra, Quy hoạch động, Đồ thị...), ôn tập kiến thức CNTT (OOP, Design Patterns, SQL JOINs), hay cần mình hỗ trợ review đoạn code nào không? Bạn cứ hỏi tự nhiên nhé! 🚀`;
    }
  }

  // =========================================================================
  // 2. XỬ LÝ THEO NGỮ CẢNH BÀI TẬP HIỆN TẠI (CONTEXT-AWARE)
  // Chỉ kích hoạt khi:
  // - Người dùng bấm chip gợi ý ('hint_next_step', 'explain_error', 'analyze_complexity'), HOẶC
  // - Câu hỏi có chứa các từ khóa liên quan trực tiếp đến bài tập hiện tại ("bài này", "gợi ý", "đề bài", v.v.)
  // =========================================================================
  else if (
    exerciseTitle &&
    (intent === 'hint_next_step' ||
      intent === 'explain_error' ||
      intent === 'analyze_complexity' ||
      promptLower.includes('bài này') ||
      promptLower.includes('đề bài') ||
      promptLower.includes('gợi ý bài') ||
      promptLower.includes('giải bài này') ||
      promptLower.includes('làm thế nào bài này'))
  ) {
    // 2.1. BÀI TẬP: ƯỚC CHUNG LỚN NHẤT (GCD / EUCLID) - TUYỆT ĐỐI KHÔNG NÓI VỀ SỐ NGUYÊN TỐ
    if (contextLower.includes('ước chung') || contextLower.includes('gcd') || contextLower.includes('euclid')) {
      if (intent === 'analyze_complexity') {
        fullResponse = `⏱️ **Phân tích độ phức tạp thuật toán Euclid (GCD):**
- **Độ phức tạp thời gian (Time Complexity):** $O(\\log(\\min(a, b)))$
  * *Chứng minh (Định lý Lamé):* Sau mỗi 2 bước chia dư liên tiếp, giá trị của $a$ giảm đi ít nhất một nửa ($a \\% b < a / 2$). Do đó số lần lặp tối đa không vượt quá $5$ lần số chữ số thập phân của $\\min(a, b)$.
- **Độ phức tạp không gian (Space Complexity):**
  * Dùng vòng lặp \`while\`: $O(1)$ tối ưu hoàn toàn bộ nhớ.
  * Dùng đệ quy: $O(\\log(\\min(a, b)))$ do call stack.`;
      } else if (intent === 'explain_error' || err) {
        fullResponse = `⚠️ **Khắc phục lỗi bài toán Ước chung lớn nhất (GCD):**
- **Trường hợp một số bằng 0:** Nếu $b = 0$, $\\gcd(a, 0) = a$. Bạn cần đảm bảo vòng lặp dừng ngay khi $b = 0$.
- **Trường hợp số âm:** Trong toán học, ước chung lớn nhất luôn là số nguyên dương $\\gcd(a, b) \\ge 1$. Hãy dùng \`abs(a)\` và \`abs(b)\` trước khi chạy thuật toán.
- **Tránh đệ quy quá sâu:** Nên ưu tiên vòng lặp \`while b:\` thay vì đệ quy để tránh lỗi \`RecursionError\`.`;
      } else {
        fullResponse = `💡 **Gợi mở tư duy bài toán: "${exerciseTitle}"**

Để tìm ước chung lớn nhất giữa hai số $a$ và $b$, thuật toán cổ điển và tối ưu nhất chính là **Giải thuật Euclid**:

### 🧠 Bản chất giải thuật:
Ước chung lớn nhất của hai số không thay đổi khi ta thay số lớn bằng phần dư của phép chia nó cho số nhỏ:
$$\\gcd(a, b) = \\gcd(b, a \\% b)$$

### 👣 Các bước triển khai:
1. Trong khi $b \\ne 0$:
   - Gán đồng thời: $a, b = b, a \\% b$
2. Khi $b = 0$, kết quả cần tìm chính là giá trị của $a$.

\`\`\`python
def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return abs(a)
\`\`\`

❓ **Câu hỏi gợi mở:** Bạn đã áp dụng phép gán song song \`a, b = b, a % b\` trong Python chưa, hay bạn đang dùng biến tạm?`;
      }
    }

    // 2.2. BÀI TẬP: KIỂM TRA SỐ NGUYÊN TỐ - TUYỆT ĐỐI KHÔNG NÓI VỀ GCD
    else if (contextLower.includes('nguyên tố') || contextLower.includes('prime')) {
      if (intent === 'analyze_complexity') {
        fullResponse = `⏱️ **Độ phức tạp kiểm tra số nguyên tố:**
- **Thuật toán ngây thơ (Duyệt đến $N$):** $O(N)$ - Quá chậm khi $N = 10^9$, chắc chắn bị Time Limit Exceeded (TLE).
- **Thuật toán tối ưu (Duyệt đến $\\sqrt{N}$):** $O(\\sqrt{N})$ - Với $N = 10^{12}$, chỉ cần tối đa $10^6$ phép tính, chạy dưới 0.05 giây!
- **Thuật toán nâng cao bước nhảy 6k ± 1:** Giảm 2/3 số phép chia, tăng tốc độ thực thi gấp 3 lần.`;
      } else if (intent === 'explain_error' || err) {
        fullResponse = `⚠️ **Lỗi thường gặp ở bài toán Số nguyên tố:**
1. **Quên số đặc biệt:** $n \\le 1$ không phải số nguyên tố! Cần return \`False\` ngay đầu hàm.
2. **Số 2:** 2 là số nguyên tố chẵn duy nhất. Nếu xử lý riêng số chẵn, nhớ return \`True\` khi $n == 2$.
3. **Chạy vòng lặp thiếu cận:** Cận trên phải là \`int(n**0.5) + 1\` (bao gồm cả căn bậc hai).`;
      } else {
        fullResponse = `💡 **Gợi mở tư duy bài toán: "${exerciseTitle}"**

### 🧠 Định lý căn bậc hai:
Nếu một số nguyên $n > 1$ là hợp số, nó **bắt buộc** phải có ít nhất một ước số $d$ thỏa mãn $2 \\le d \\le \\sqrt{n}$. Do đó, ta không cần duyệt quá $\\lfloor\\sqrt{n}\\rfloor$!

### 👣 Các bước triển khai tối ưu:
1. Kiểm tra trường hợp biên: Nếu $n \\le 1$ trả về \`False\`.
2. Duyệt từ $i = 2$ đến $\\lfloor\\sqrt{n}\\rfloor$:
   - Nếu $n \\% i == 0$: $n$ là hợp số $\\rightarrow$ trả về \`False\`.
3. Nếu không tìm thấy ước nào, $n$ là số nguyên tố $\\rightarrow$ trả về \`True\`.

\`\`\`python
import math

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for i in range(2, int(math.isqrt(n)) + 1):
        if n % i == 0:
            return False
    return True
\`\`\``;
      }
    }

    // 2.3. BÀI TẬP: CHUỖI NGOẶC HỢP LỆ (VALID PARENTHESES / STACK)
    else if (contextLower.includes('ngoặc') || contextLower.includes('stack') || contextLower.includes('parentheses')) {
      fullResponse = `💡 **Gợi mở tư duy bài toán: "${exerciseTitle}"**

Bài toán kiểm tra tính hợp lệ của dấu ngoặc yêu cầu quy tắc **vào sau ra trước (LIFO)**, cấu trúc dữ liệu hoàn hảo nhất là **Ngăn xếp (Stack)**:

1. **Khởi tạo:** Một ngăn xếp rỗng \`st = []\` và một bảng ánh xạ ngoặc đóng sang ngoặc mở \`{')': '(', ']': '[', '}': '{'}\`.
2. **Duyệt qua từng ký tự:**
   - Nếu là dấu mở (\`(\`, \`[\`, \`{\`): Đẩy (push) vào Stack.
   - Nếu là dấu đóng:
     * Nếu Stack đang rỗng $\\rightarrow$ Thừa dấu đóng $\\rightarrow$ Không hợp lệ.
     * Lấy đỉnh Stack ra, nếu không khớp với dấu mở tương ứng $\\rightarrow$ Không hợp lệ.
3. **Kết thúc:** Nếu Stack rỗng hoàn toàn $\\rightarrow$ Chuỗi hợp lệ!

Độ phức tạp: **Thời gian $O(N)$**, **Không gian $O(N)$**.`;
    }

    // 2.4. BÀI TẬP: TÌM KIẾM NHỊ PHÂN (BINARY SEARCH)
    else if (contextLower.includes('nhị phân') || contextLower.includes('binary search')) {
      fullResponse = `💡 **Gợi mở tư duy bài toán: "${exerciseTitle}"**

Để áp dụng **Tìm kiếm nhị phân (Binary Search)**, điều kiện tiên quyết là mảng phải **được sắp xếp theo thứ tự**:

1. Duy trì 2 con trỏ: \`left = 0\`, \`right = len(arr) - 1\`.
2. Trong khi \`left <= right\`:
   - Tính điểm giữa an toàn tránh tràn số: \`mid = left + (right - left) // 2\`.
   - Nếu \`arr[mid] == target\`: Trả về \`mid\`.
   - Nếu \`arr[mid] < target\`: Thu hẹp sang nửa phải: \`left = mid + 1\`.
   - Ngược lại: Thu hẹp sang nửa trái: \`right = mid - 1\`.
3. Nếu không tìm thấy, trả về \`-1\`. Độ phức tạp: **$O(\\log N)$**.`;
    }

    // 2.5. BÀI TẬP: QUY HOẠCH ĐỘNG BALO (KNAPSACK)
    else if (contextLower.includes('balo') || contextLower.includes('knapsack')) {
      fullResponse = `💡 **Gợi mở tư duy bài toán: "${exerciseTitle}"**

Bài toán Balo 0/1 giải quyết bằng **Quy hoạch động (DP)**:
- Gọi \`dp[i][w]\` là giá trị lớn nhất khi xét $i$ đồ vật đầu tiên với trọng lượng tối đa là $w$.
- Công thức truy hồi:
  $$dp[i][w] = \\max(dp[i-1][w], \\text{val}[i-1] + dp[i-1][w - \\text{wt}[i-1]])$$
- **Tối ưu bộ nhớ:** Ta có thể nén mảng 2 chiều thành mảng 1 chiều $O(W)$ bằng cách duyệt ngược trọng lượng từ $W$ về $0$.`;
    }

    // 2.6. BÀI TẬP CHUNG TRONG IDE
    else {
      fullResponse = `💡 **Định hướng giải quyết cho bài tập: "${exerciseTitle}"**

1. **Phân tích Input & Output:**
   - Xác định rõ kiểu dữ liệu đầu vào và các giới hạn kích thước dữ liệu ($N \\le 10^5$ hay $N \\le 10^3$) để chọn thuật toán có độ phức tạp phù hợp.
2. **Chiến lược tiếp cận:**
   - Bắt đầu từ trường hợp cơ sở (Base Case).
   - Chia bài toán thành các hàm con độc lập (hàm validate dữ liệu, hàm xử lý chính).
3. **Kiểm thử biên (Edge Cases):**
   - Kiểm tra các trường hợp mảng rỗng, mảng 1 phần tử, số âm, số 0.`;
    }
  }

  // =========================================================================
  // 3. XỬ LÝ KIẾN THỨC LẬP TRÌNH TỔNG QUÁT (GENERAL CS / GEMINI ASSISTANT)
  // Bất kỳ câu hỏi nào về CNTT, thuật toán, ngôn ngữ, công nghệ
  // =========================================================================
  else if (promptLower.includes('dijkstra')) {
    fullResponse = `🛣️ **Thuật toán Dijkstra (Tìm đường đi ngắn nhất nguồn đơn)**

Thuật toán Dijkstra tìm đường đi ngắn nhất từ đỉnh nguồn $S$ đến tất cả các đỉnh còn lại trên đồ thị có trọng số **không âm** ($w \\ge 0$).

### 💡 Nguyên lý hoạt động:
1. **Khởi tạo:** Khoảng cách $d[S] = 0$, mọi đỉnh khác $d[v] = \\infty$.
2. **Min-Heap (Priority Queue):** Lưu các cặp \`(khoảng_cách, đỉnh)\`. Luôn lấy ra đỉnh $u$ có khoảng cách ngắn nhất chưa cố định.
3. **Thư giãn cạnh (Edge Relaxation):** Với mỗi đỉnh kề $v$ của $u$, nếu $d[u] + w(u, v) < d[v]$:
   - Cập nhật $d[v] = d[u] + w(u, v)$
   - Đẩy \`(d[v], v)\` vào Priority Queue.

### 🐍 Minh họa code Python chuẩn:
\`\`\`python
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]  # (khoảng cách, đỉnh)

    while pq:
        cur_dist, u = heapq.heappop(pq)
        
        # Bỏ qua nếu khoảng cách này đã cũ
        if cur_dist > distances[u]:
            continue

        for v, weight in graph[u]:
            dist = cur_dist + weight
            if dist < distances[v]:
                distances[v] = dist
                heapq.heappush(pq, (dist, v))

    return distances
\`\`\`

⚡ **Độ phức tạp:**
- **Thời gian:** $O((V + E) \\log V)$ khi dùng Binary Heap.
- **Không gian:** $O(V + E)$ để lưu danh sách kề và Priority Queue.`;
  }

  else if (promptLower.includes('quy hoạch động') || promptLower.includes('dynamic programming') || promptLower.includes('dp')) {
    fullResponse = `🎯 **Quy hoạch động (Dynamic Programming - DP)**

Quy hoạch động là kỹ thuật tối ưu hóa bằng cách chia bài toán lớn thành các bài toán con gối nhau (Overlapping Subproblems) và lưu lại kết quả đã giải để không phải tính lại.

### 🔑 2 Dấu hiệu nhận biết bài toán DP:
1. **Cấu trúc con tối ưu (Optimal Substructure):** Nghiệm tối ưu của bài toán lớn được xây dựng từ nghiệm tối ưu của các bài toán con.
2. **Các bài toán con gối nhau (Overlapping Subproblems):** Các bài toán con bị lặp lại nhiều lần trong quá trình đệ quy.

### 🔄 2 Phương pháp triển khai:
- **Top-Down (Đệ quy có nhớ - Memoization):** Đi từ bài toán lớn xuống, dùng Hash Map hoặc mảng để lưu kết quả.
- **Bottom-Up (Bảng phương án - Tabulation):** Đi từ bài toán cơ sở (Base Case) lặp dần lên đến bài toán lớn.

### 🐍 Ví dụ: Dãy Fibonacci
\`\`\`python
# Cách tối ưu Bottom-Up O(N) thời gian, O(1) bộ nhớ:
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
\`\`\``;
  }

  else if (promptLower.includes('bfs') || promptLower.includes('dfs') || promptLower.includes('duyệt đồ thị')) {
    fullResponse = `🌳 **So sánh Thuật toán BFS & DFS trên Đồ thị & Cây**

| Tiêu chí | BFS (Breadth-First Search) | DFS (Depth-First Search) |
|---|---|---|
| **Cơ chế duyệt** | Theo từng lớp / mức chiều rộng | Đi sâu nhất có thể theo một nhánh rồi quay lui |
| **Cấu trúc dữ liệu** | Hàng đợi (**Queue - FIFO**) | Ngăn xếp (**Stack - LIFO**) hoặc Đệ quy |
| **Ứng dụng chính** | Tìm đường đi ngắn nhất trên đồ thị không trọng số | Tìm chu trình, sắp xếp Tô-pô (Topological Sort), đếm thành phần liên thông |
| **Độ phức tạp** | $O(V + E)$ thời gian, $O(V)$ không gian | $O(V + E)$ thời gian, $O(H)$ không gian ($H$ là chiều cao) |

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    while queue:
        u = queue.popleft()
        print(u, end=" ")
        for v in graph[u]:
            if v not in visited:
                visited.add(v)
                queue.append(v)
\`\`\``;
  }

  else if (promptLower.includes('oop') || promptLower.includes('hướng đối tượng') || promptLower.includes('huong doi tuong')) {
    fullResponse = `🏛️ **Lập trình Hướng đối tượng (OOP) & 4 Trụ cột Cốt lõi**

1. **Tính đóng gói (Encapsulation):**
   - Gom dữ liệu (attributes) và các hàm thao tác (methods) vào trong Class.
   - Ẩn giấu chi tiết cài đặt và bảo vệ trạng thái nội bộ bằng các phạm vi truy cập (private, protected, public).
2. **Tính kế thừa (Inheritance):**
   - Lớp con (Subclass) tái sử dụng và mở rộng các thuộc tính, phương thức của lớp cha (Superclass).
3. **Tính đa hình (Polymorphism):**
   - Các đối tượng khác nhau có thể phản hồi cùng một thông điệp (tên phương thức) theo những cách khác nhau thông qua ghi đè (Override) hoặc nạp chồng (Overload).
4. **Tính trừu tượng (Abstraction):**
   - Chỉ phơi bày những tính năng cần thiết cho người dùng thông qua Abstract Class hoặc Interface, giấu đi logic phức tạp bên dưới.

\`\`\`python
class Animal:
    def __init__(self, name: str):
        self._name = name  # Protected

    def speak(self) -> str:
        raise NotImplementedError("Lớp con phải tự cài đặt speak()")

class Dog(Animal):
    def speak(self) -> str:
        return f"{self._name} sủa: Gâu gâu!"

class Cat(Animal):
    def speak(self) -> str:
        return f"{self._name} kêu: Meo meo!"

animals = [Dog("Mực"), Cat("Miu")]
for a in animals:
    print(a.speak())  # Đa hình hoạt động tại runtime!
\`\`\``;
  }

  else if (promptLower.includes('design pattern') || promptLower.includes('singleton') || promptLower.includes('factory')) {
    fullResponse = `🏗️ **Mẫu thiết kế phần mềm (Design Patterns): Singleton & Factory**

### 1. Singleton Pattern:
- **Mục đích:** Đảm bảo một Class chỉ có duy nhất **một instance** trong toàn bộ vòng đời ứng dụng, đồng thời cung cấp điểm truy cập toàn cục.
- **Ứng dụng:** Kết nối Database, Logger, Quản lý cấu hình Settings.

\`\`\`python
class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            print("Đang khởi tạo kết nối CSDL lần đầu tiên!")
        return cls._instance

db1 = DatabaseConnection()
db2 = DatabaseConnection()
print(db1 is db2)  # True! Cả 2 cùng trỏ về 1 instance
\`\`\`

### 2. Factory Pattern:
- **Mục đích:** Tạo đối tượng mà không cần chỉ định rõ tên Class cụ thể trong code gọi, giúp code tuân thủ nguyên lý Open-Closed (OCP) của SOLID.`;
  }

  else if (promptLower.includes('sql') || promptLower.includes('join') || promptLower.includes('database')) {
    fullResponse = `🗄️ **Tổng hợp các loại JOIN trong SQL & Tối ưu hóa truy vấn**

1. **INNER JOIN:** Chỉ trả về các bản ghi có giá trị khớp ở cả 2 bảng.
2. **LEFT JOIN (LEFT OUTER JOIN):** Trả về toàn bộ bản ghi ở bảng bên trái, kèm các bản ghi khớp ở bảng phải (nếu không khớp, điền \`NULL\`).
3. **RIGHT JOIN:** Tương tự LEFT JOIN nhưng giữ lại toàn bộ bảng bên phải.
4. **FULL OUTER JOIN:** Trả về tất cả bản ghi khi có sự trùng khớp ở một trong hai bảng.

\`\`\`sql
-- Ví dụ: Lấy tên sinh viên và điểm thi (kể cả sinh viên chưa có điểm)
SELECT 
    s.student_id,
    s.full_name,
    COALESCE(g.score, 0) AS final_score
FROM students s
LEFT JOIN grades g ON s.student_id = g.student_id
WHERE s.class_group = 'K72 CNTT A'
ORDER BY final_score DESC;
\`\`\`

⚡ **Mẹo tối ưu hiệu năng:** Luôn tạo **B-Tree Index** trên các cột khóa ngoại tham gia vào điều kiện \`ON\` hoặc \`WHERE\`!`;
  }

  else if (promptLower.includes('big-o') || promptLower.includes('độ phức tạp') || promptLower.includes('toi uu')) {
    fullResponse = `⏱️ **Bảng phân cấp độ phức tạp thuật toán (Big-O Complexity Chart)**

Từ nhanh nhất đến chậm nhất:
1. $O(1)$ - Hằng số: Truy xuất mảng theo index, Hash Table lookup.
2. $O(\\log n)$ - Logarithmic: Tìm kiếm nhị phân (Binary Search), GCD Euclid.
3. $O(n)$ - Tuyến tính: Duyệt mảng 1 lần, tìm Max/Min.
4. $O(n \\log n)$ - Tuyến tính logarit: QuickSort, MergeSort, HeapSort.
5. $O(n^2)$ - Bậc hai: 2 vòng lặp lồng nhau, Bubble Sort.
6. $O(2^n)$ - Hàm mũ: Đệ quy vét cạn dãy Fibonacci không nhớ.
7. $O(n!)$ - Giai thừa: Liệt kê mọi hoán vị (Travelling Salesperson brute-force).

💡 **Quy tắc vàng khi thi đấu lập trình:**
- Với $N \\le 10^5$: Thuật toán phải đạt $O(n)$ hoặc $O(n \\log n)$.
- Với $N \\le 10^3$: Chấp nhận được $O(n^2)$.
- Với $N \\le 20$: Có thể dùng quay lui $O(2^n)$.`;
  }

  // =========================================================================
  // 4. OPEN-ENDED INTELLIGENT FALLBACK CHUẨN GEMINI
  // =========================================================================
  else {
    fullResponse = `🤖 **Trợ lý lập trình AI Mentor xin chào ${userName}!**

Về câu hỏi: *"${userPrompt}"*

Để phân tích vấn đề này một cách có hệ thống, chúng ta có thể chia làm các bước:

1. **Hiểu rõ bài toán & Yêu cầu:**
   - Xác định rõ dữ liệu đầu vào (Input), cấu trúc dữ liệu lưu trữ, và kết quả mong muốn (Output).
2. **Lựa chọn thuật toán & Cấu trúc dữ liệu:**
   - Ưu tiên cấu trúc dữ liệu cho phép truy xuất và cập nhật nhanh (ví dụ: Hash Map $O(1)$, Heap $O(\\log n)$ hoặc Two Pointers $O(n)$).
3. **Triển khai mã nguồn sạch (Clean Code):**
   - Đặt tên biến rõ nghĩa, xử lý triệt để các trường hợp biên (Edge Cases: dữ liệu rỗng, số âm, số 0).

${
  code
    ? `Dựa trên đoạn code hiện tại của bạn, bạn có thể áp dụng thêm kỹ thuật tối ưu hóa vòng lặp hoặc chia nhỏ logic để tăng tốc độ thực thi.`
    : `Bạn có muốn mình đưa ra ví dụ code mẫu minh họa bằng **Python** hoặc **C++**, hay bạn muốn đào sâu vào phần nào cụ thể? Hãy cho mình biết nhé! 🚀`
}`;
  }

  // Giả lập hiệu ứng gõ chữ (Streaming Simulation)
  if (onChunk) {
    const words = fullResponse.split(' ');
    let currentText = '';
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      onChunk(currentText);
      await new Promise((r) => setTimeout(r, 14));
    }
  }

  return fullResponse;
};
