import { Exercise, ExecutionResult, SubmissionRecord, TestCaseResult } from '../types/exercise';

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 1,
    subjectId: 101,
    title: 'Bài 01: Tìm số nguyên tố trong mảng',
    difficulty: 'easy',
    category: 'Mảng & Số học',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho một danh sách các số nguyên \`arr\`. Hãy viết hàm \`find_primes(arr)\` để tìm và trả về một danh sách mới chứa tất cả các số nguyên tố có trong \`arr\`, giữ nguyên thứ tự xuất hiện ban đầu.

Một số nguyên dương $n > 1$ được gọi là **số nguyên tố** nếu nó chỉ có đúng 2 ước số dương là 1 và chính nó.

**Lưu ý:**
- Các số $\\le 1$ không phải là số nguyên tố.
- Giữ nguyên thứ tự phần tử như trong mảng ban đầu.
- Trả về danh sách rỗng \`[]\` nếu không có số nguyên tố nào.`,
    inputFormat: 'Mảng số nguyên `arr` (ví dụ: `[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]`)',
    outputFormat: 'Danh sách các số nguyên tố tìm được (ví dụ: `[2, 3, 5, 7, 11]`)',
    constraints: [
      '0 <= len(arr) <= 10^4',
      '-10^5 <= arr[i] <= 10^5'
    ],
    boilerplateCode: `def is_prime(n: int) -> bool:
    # Bước 1: Viết hàm kiểm tra một số có phải số nguyên tố không
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def find_primes(arr: list[int]) -> list[int]:
    """
    Tìm tất cả các số nguyên tố trong mảng arr.
    """
    primes = []
    # Gợi ý: Duyệt qua từng phần tử trong arr và kiểm tra
    for num in arr:
        if is_prime(num):
            primes.append(num)
    return primes
`,
    sampleTestCases: [
      {
        id: 1,
        input: '[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]',
        expectedOutput: '[2, 3, 5, 7, 11]',
        explanation: 'Các số nguyên tố gồm 2, 3, 5, 7, 11.'
      },
      {
        id: 2,
        input: '[4, 6, 8, 9, 10]',
        expectedOutput: '[]',
        explanation: 'Không có số nguyên tố nào trong mảng.'
      },
      {
        id: 3,
        input: '[-5, 0, 1, 2, 13]',
        expectedOutput: '[2, 13]',
        explanation: 'Số âm, 0 và 1 không phải là số nguyên tố.'
      }
    ],
    hiddenTestCaseCount: 4,
    status: 'solved',
    score: 100
  },
  {
    id: 2,
    subjectId: 101,
    title: 'Bài 02: Kiểm tra tính hợp lệ của chuỗi ngoặc',
    difficulty: 'medium',
    category: 'Cấu trúc dữ liệu Stack',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho một chuỗi ký tự \`s\` chỉ bao gồm các ký tự mở và đóng ngoặc: \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\`, \`']'\`.

Hãy viết hàm \`is_valid_parentheses(s: str) -> bool\` để xác định xem chuỗi đầu vào có hợp lệ hay không.

Chuỗi đầu vào hợp lệ khi và chỉ khi:
1. Mọi dấu mở ngoặc đều phải được đóng lại bởi dấu cùng loại.
2. Các dấu mở ngoặc phải được đóng theo đúng thứ tự (LIFO - Last In, First Out).
3. Mỗi dấu đóng ngoặc đều phải tương ứng với một dấu mở ngoặc cùng loại trước đó.`,
    inputFormat: 'Chuỗi ký tự `s` gồm các dấu ngoặc',
    outputFormat: 'Giá trị boolean `True` hoặc `False`',
    constraints: [
      '1 <= len(s) <= 10^4',
      'Chuỗi s chỉ bao gồm các ký tự `()[]{}`'
    ],
    boilerplateCode: `def is_valid_parentheses(s: str) -> bool:
    """
    Kiểm tra chuỗi ngoặc có hợp lệ hay không bằng cấu trúc dữ liệu Stack.
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    # Bắt đầu duyệt từng ký tự trong chuỗi s
    for char in s:
        if char in mapping:
            # Lấy phần tử đỉnh ngăn xếp (nếu có)
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
            
    return len(stack) == 0
`,
    sampleTestCases: [
      {
        id: 1,
        input: '"()[]{}"',
        expectedOutput: 'True',
        explanation: 'Các cặp ngoặc mở và đóng liên tiếp hợp lệ.'
      },
      {
        id: 2,
        input: '"([)]"',
        expectedOutput: 'False',
        explanation: 'Ngoặc lồng sai thứ tự đóng mở.'
      },
      {
        id: 3,
        input: '"{[]}"',
        expectedOutput: 'True',
        explanation: 'Ngoặc lồng nhau đúng quy tắc.'
      }
    ],
    hiddenTestCaseCount: 5,
    status: 'in_progress',
    score: 70
  },
  {
    id: 3,
    subjectId: 101,
    title: 'Bài 03: Tìm hai số có tổng bằng Target (Two Sum)',
    difficulty: 'easy',
    category: 'Hash Map & Mảng',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho một mảng số nguyên \`nums\` và một số nguyên \`target\`. Hãy viết hàm \`two_sum(nums: list[int], target: int) -> list[int]\` trả về chỉ số (0-indexed) của 2 phần tử trong mảng sao cho tổng của chúng bằng đúng \`target\`.

**Quy tắc:**
- Giả định mỗi đầu vào luôn có duy nhất một đáp án chính xác.
- Không được sử dụng cùng một phần tử 2 lần.
- Trả về danh sách gồm 2 chỉ số theo thứ tự tăng dần \`[index1, index2]\`.`,
    inputFormat: 'Mảng `nums` và số nguyên `target`',
    outputFormat: 'Danh sách `[i, j]` là 2 chỉ số thỏa mãn `nums[i] + nums[j] == target`',
    constraints: [
      '2 <= len(nums) <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    boilerplateCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Tìm chỉ số 2 phần tử có tổng bằng target.
    Gợi ý: Sử dụng bảng băm (dict) để đạt độ phức tạp O(N).
    """
    seen = {} # lưu {giá trị: vị trí}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
        
    return []
`,
    sampleTestCases: [
      {
        id: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
      },
      {
        id: 2,
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
      }
    ],
    hiddenTestCaseCount: 3,
    status: 'solved',
    score: 100
  },
  {
    id: 4,
    subjectId: 101,
    title: 'Bài 04: Đảo ngược danh sách liên kết đơn (Reverse Linked List)',
    difficulty: 'medium',
    category: 'Cấu trúc dữ liệu',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho con trỏ \`head\` của một danh sách liên kết đơn. Hãy viết hàm đảo ngược danh sách và trả về con trỏ tới nút đầu mới.

**Yêu cầu:** Thực hiện với độ phức tạp thời gian O(N) và bộ nhớ phụ O(1) bằng phương pháp con trỏ lặp (Iterative pointers).`,
    inputFormat: 'Danh sách các giá trị nút `head = [1, 2, 3, 4, 5]`',
    outputFormat: 'Danh sách sau khi đảo ngược `[5, 4, 3, 2, 1]`',
    constraints: ['0 <= Số lượng nút <= 5000', '-5000 <= Node.val <= 5000'],
    boilerplateCode: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
    sampleTestCases: [
      { id: 1, input: '[1, 2, 3, 4, 5]', expectedOutput: '[5, 4, 3, 2, 1]', explanation: 'Danh sách được đảo ngược thứ tự.' },
      { id: 2, input: '[1, 2]', expectedOutput: '[2, 1]', explanation: '2 nút đổi chỗ cho nhau.' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 0
  },
  {
    id: 5,
    subjectId: 101,
    title: 'Bài 05: Tìm kiếm nhị phân trên mảng đã sắp xếp (Binary Search)',
    difficulty: 'easy',
    category: 'Giải thuật',
    language: 'cpp',
    timeLimitMs: 800,
    memoryLimitMb: 64,
    description: `Cho một mảng số nguyên \`nums\` đã được sắp xếp tăng dần và một số nguyên \`target\`.
Hãy viết hàm tìm kiếm \`target\` trong \`nums\`. Nếu tồn tại, trả về chỉ số của nó; ngược lại trả về \`-1\`.

Thuật toán phải đạt độ phức tạp thời gian **O(log N)**.`,
    inputFormat: 'Mảng `nums` đã sắp xếp và `target`',
    outputFormat: 'Chỉ số tìm thấy hoặc `-1`',
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'Tất cả phần tử trong nums là duy nhất'],
    boilerplateCode: `int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    sampleTestCases: [
      { id: 1, input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', expectedOutput: '4', explanation: '9 tồn tại tại chỉ số 4.' },
      { id: 2, input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', expectedOutput: '-1', explanation: '2 không có trong mảng.' }
    ],
    hiddenTestCaseCount: 5,
    status: 'solved',
    score: 100
  },
  {
    id: 6,
    subjectId: 101,
    title: 'Bài 06: Sắp xếp trộn & Đếm số cặp nghịch thế (Merge Sort Inversions)',
    difficulty: 'hard',
    category: 'Giải thuật',
    language: 'cpp',
    timeLimitMs: 1500,
    memoryLimitMb: 256,
    description: `Cho một mảng số nguyên \`arr\` gồm N phần tử. Một cặp chỉ số \`(i, j)\` được gọi là một cặp nghịch thế nếu \`i < j\` và \`arr[i] > arr[j]\`.
Hãy đếm tổng số cặp nghịch thế trong mảng với độ phức tạp **O(N log N)** dựa trên giải thuật Sắp xếp trộn (Merge Sort).`,
    inputFormat: 'Mảng số nguyên `arr`',
    outputFormat: 'Số nguyên là tổng số cặp nghịch thế',
    constraints: ['1 <= N <= 10^5', '1 <= arr[i] <= 10^9'],
    boilerplateCode: `long long countInversions(vector<int>& arr) {
    // Triển khai Merge Sort và cộng dồn số cặp nghịch thế khi trộn 2 mảng con
    return 0;
}`,
    sampleTestCases: [
      { id: 1, input: '[2, 4, 1, 3, 5]', expectedOutput: '3', explanation: 'Các cặp: (2, 1), (4, 1), (4, 3).' },
      { id: 2, input: '[5, 4, 3, 2, 1]', expectedOutput: '10', explanation: 'Mảng giảm dần có N*(N-1)/2 = 10 cặp.' }
    ],
    hiddenTestCaseCount: 6,
    status: 'not_started',
    score: 0
  },
  {
    id: 7,
    subjectId: 101,
    title: 'Bài 07: Cây nhị phân tìm kiếm - Duyệt theo thứ tự giữa (BST Inorder)',
    difficulty: 'medium',
    category: 'Cấu trúc dữ liệu',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho nút gốc của một Cây nhị phân tìm kiếm (Binary Search Tree). Hãy trả về danh sách các giá trị nút theo thứ tự duyệt giữa (Inorder Traversal: Left -> Root -> Right).`,
    inputFormat: 'Cây nhị phân dưới dạng mảng `root = [1, null, 2, 3]`',
    outputFormat: 'Mảng giá trị theo thứ tự duyệt `[1, 3, 2]`',
    constraints: ['Số lượng nút từ 0 đến 100', '-100 <= Node.val <= 100'],
    boilerplateCode: `def inorder_traversal(root):
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    dfs(root)
    return result`,
    sampleTestCases: [
      { id: 1, input: '[1, null, 2, 3]', expectedOutput: '[1, 3, 2]', explanation: 'Thứ tự duyệt Trái -> Gốc -> Phải.' },
      { id: 2, input: '[]', expectedOutput: '[]', explanation: 'Cây rỗng.' }
    ],
    hiddenTestCaseCount: 4,
    status: 'in_progress',
    score: 60
  },
  {
    id: 8,
    subjectId: 101,
    title: 'Bài 08: Tìm đường đi ngắn nhất đồ thị trọng số (Dijkstra)',
    difficulty: 'hard',
    category: 'Giải thuật',
    language: 'python',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    description: `Cho một đồ thị có hướng gồm \`n\` đỉnh (đánh số từ 1 đến n) và danh sách các cạnh có trọng số dương \`times\`.
Hãy viết thuật toán Dijkstra sử dụng hàng đợi ưu tiên (Min Heap) để tìm khoảng cách ngắn nhất từ đỉnh nguồn \`k\` tới tất cả các đỉnh còn lại.`,
    inputFormat: '`times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2`',
    outputFormat: 'Thời gian ngắn nhất để tín hiệu tới toàn bộ các nút, hoặc -1 nếu không thể',
    constraints: ['1 <= k <= n <= 100', '1 <= times.length <= 6000', '0 <= weight <= 100'],
    boilerplateCode: `import heapq

def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    # Gợi ý: Dựng danh sách kề và áp dụng Priority Queue
    pass`,
    sampleTestCases: [
      { id: 1, input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', expectedOutput: '2', explanation: 'Tín hiệu xuất phát từ 2 tới 4 mất 2 đơn vị thời gian.' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 0
  }
];

// Lưu lịch sử nộp bài trong phiên làm việc
let mockSubmissionsHistory: SubmissionRecord[] = [
  {
    id: 101,
    exerciseId: 1,
    submittedAt: 'Hôm qua, 14:30',
    status: 'failed',
    passedTests: 4,
    totalTests: 7,
    executionTimeMs: 58,
    code: `# Lần nộp trước (bị lỗi Time Limit với số lớn)
def is_prime(n):
    if n < 2: return False
    for i in range(2, n): # O(N) quá chậm
        if n % i == 0: return False
    return True`
  }
];

export const getExercises = (): Exercise[] => {
  return MOCK_EXERCISES;
};

export const getExerciseById = (id: number): Exercise | undefined => {
  return MOCK_EXERCISES.find(ex => ex.id === id);
};

export const getSubmissionsForExercise = (exerciseId: number): SubmissionRecord[] => {
  return mockSubmissionsHistory.filter(sub => sub.exerciseId === exerciseId);
};

/**
 * Giả lập trình thực thi Python Sandbox (Run Code)
 */
export const runStudentCode = async (
  exercise: Exercise,
  code: string
): Promise<ExecutionResult> => {
  // Giả lập độ trễ mạng và chạy subprocess (500ms - 900ms)
  await new Promise(resolve => setTimeout(resolve, 600));

  // Kiểm tra lỗi cú pháp cơ bản (Python syntax checks)
  if (code.includes('def ') && !code.includes(':')) {
    return {
      status: 'error',
      errorMessage: 'SyntaxError: expected \':\' at end of function definition header',
      executionTimeMs: 12,
      results: [],
      passedTests: 0,
      totalTests: exercise.sampleTestCases.length,
      stdout: 'Traceback (most recent call last):\n  File "solution.py", line 1\n    def ...\n           ^\nSyntaxError: expected \':\''
    };
  }

  // Phát hiện lỗi thụt lề
  const lines = code.split('\n');
  const hasIndentError = lines.some(line => line.startsWith(' ') && (line.length - line.trimStart().length) % 2 !== 0 && (line.length - line.trimStart().length) % 4 !== 0);
  if (hasIndentError) {
    return {
      status: 'error',
      errorMessage: 'IndentationError: unindent does not match any outer indentation level',
      executionTimeMs: 15,
      results: [],
      passedTests: 0,
      totalTests: exercise.sampleTestCases.length,
      stdout: 'Traceback (most recent call last):\n  File "solution.py", line 4\n    IndentationError: unexpected indent'
    };
  }

  // Kiểm tra lỗi tràn chỉ số nếu người dùng viết arr[i+1] mà không kiểm tra độ dài
  if (code.includes('[i+1]') && !code.includes('len(arr) - 1')) {
    return {
      status: 'error',
      errorMessage: 'IndexError: list index out of range at line 6',
      executionTimeMs: 25,
      results: [],
      passedTests: 0,
      totalTests: exercise.sampleTestCases.length,
      stdout: 'Traceback (most recent call last):\n  File "solution.py", line 6, in <module>\n    if arr[i+1] == ...:\nIndexError: list index out of range'
    };
  }

  // Nếu code để trống hoặc chỉ có pass
  const cleanCode = code.replace(/#.*$/gm, '').replace(/\s+/g, '');
  if (cleanCode.includes('pass') && !cleanCode.includes('return') && !cleanCode.includes('primes.append')) {
    const failedResults: TestCaseResult[] = exercise.sampleTestCases.map(tc => ({
      testCaseId: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: 'None',
      passed: false,
      executionTimeMs: 8,
      errorMessage: 'Hàm trả về None thay vì kết quả yêu cầu.'
    }));
    return {
      status: 'failed',
      stdout: 'Running test cases...\nResult: None\nExpected: ' + exercise.sampleTestCases[0].expectedOutput,
      executionTimeMs: 24,
      results: failedResults,
      passedTests: 0,
      totalTests: exercise.sampleTestCases.length
    };
  }

  // Giả lập chạy test cases mẫu
  const results: TestCaseResult[] = exercise.sampleTestCases.map((tc, idx) => {
    // Nếu code có trả về kết quả hợp lý
    const passed = true; // code mẫu mặc định pass
    return {
      testCaseId: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: tc.expectedOutput,
      passed: passed,
      executionTimeMs: 14 + idx * 6
    };
  });

  const passedCount = results.filter(r => r.passed).length;

  return {
    status: passedCount === results.length ? 'passed' : 'failed',
    stdout: `[SANDBOX] Python 3.11.4 executed successfully.\nTested ${results.length} sample cases.\nTotal time: 42ms | Memory: 14.2 MB`,
    executionTimeMs: 42,
    results,
    passedTests: passedCount,
    totalTests: results.length
  };
};

/**
 * Nộp bài chính thức (chấm cả test case ẩn)
 */
export const submitStudentCode = async (
  exercise: Exercise,
  code: string
): Promise<SubmissionRecord> => {
  await new Promise(resolve => setTimeout(resolve, 900));

  const totalTests = exercise.sampleTestCases.length + exercise.hiddenTestCaseCount;
  const isCorrect = !code.includes('pass') && code.length > 50;

  const passedTests = isCorrect ? totalTests : Math.max(1, totalTests - 3);
  const status = passedTests === totalTests ? 'passed' : 'failed';

  const newSubmission: SubmissionRecord = {
    id: Date.now(),
    exerciseId: exercise.id,
    submittedAt: 'Vừa xong',
    status,
    passedTests,
    totalTests,
    executionTimeMs: 78,
    code
  };

  mockSubmissionsHistory.unshift(newSubmission);
  return newSubmission;
};
