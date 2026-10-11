export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  courseName: string;
  term: string;
  totalStudents: number;
  activeStudents: number;
  activePercentage: number;
  completionRate: number;
  maxCompleted: number;
  inProgress: number;
  notStarted: number;
  totalAIQueries: number;
  resolvedWithAI: number;
  stuckStudentsCount: number;
  commonErrors: { name: string; percentage: number; count: number }[];
  weeklyLogins: { day: string; active: number }[];
  gradeDistribution: { bracket: string; count: number; percentage: number; color: string }[];
}

export interface LiveSubmission {
  id: number;
  studentName: string;
  studentId: string;
  classGroup: string;
  exerciseId: number;
  exerciseTitle: string;
  language: string;
  testCasesPassed: number;
  totalTestCases: number;
  score: number;
  executionTimeMs: number;
  memoryMb: number;
  status: 'accepted' | 'wrong_answer' | 'time_limit' | 'compile_error';
  timeAgo: string;
  plagiarismScore: number; // percentage of similarity (0-100)
  submittedCode: string;
}

export interface TranscriptMessage {
  sender: 'student' | 'ai';
  text: string;
  codeSnippet?: string;
  time: string;
}

export interface StudentAIAuditLog {
  id: number;
  studentName: string;
  studentId: string;
  avatarColor: string;
  classGroup: string;
  exerciseId: number;
  exerciseTitle: string;
  errorType: 'IndexError' | 'TimeLimitExceeded' | 'LogicError' | 'SyntaxError' | 'TypeError';
  errorDetails: string;
  studentPrompt: string;
  aiHintSummary: string;
  resolved: boolean;
  needsTeacherHelp: boolean;
  attemptCount: number;
  timeAgo: string;
  studentCodeSnapshot: string;
  pedagogicalInsight: string;
  transcript: TranscriptMessage[];
}

export interface TeacherAssignment {
  id: number;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  classGroup: string;
  deadline: string;
  deadlineDate: string; // ISO string
  submittedCount: number;
  totalStudents: number;
  passRate: number;
  aiSocraticEnabled: boolean;
  antiPlagiarismEnabled: boolean;
  status: 'active' | 'closed';
  testCasesCount: number;
  description: string;
}

export interface StudentRosterItem {
  studentId: string;
  name: string;
  email: string;
  classGroup: string;
  solvedCount: number;
  totalAssignments: number;
  gpa: number;
  attendanceRate: number;
  aiQueriesCount: number;
  status: 'excellent' | 'progressing' | 'needs_attention' | 'at_risk';
  recentActivity: string;
}

export const MOCK_CLASS_GROUPS: ClassGroup[] = [
  {
    id: 'K71A-CNTT',
    name: 'Lớp K71A - Công nghệ Thông tin',
    code: 'COMP201_K71A',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật',
    term: 'Học kỳ 1 • 2026-2027',
    totalStudents: 68,
    activeStudents: 64,
    activePercentage: 94.1,
    completionRate: 72.4,
    maxCompleted: 37,
    inProgress: 12,
    notStarted: 19,
    totalAIQueries: 148,
    resolvedWithAI: 87.5,
    stuckStudentsCount: 5,
    commonErrors: [
      { name: 'IndexError', percentage: 42, count: 62 },
      { name: 'TimeLimitExceeded', percentage: 25, count: 37 },
      { name: 'SyntaxError', percentage: 18, count: 27 },
      { name: 'LogicError', percentage: 15, count: 22 },
    ],
    weeklyLogins: [
      { day: 'T2', active: 58 },
      { day: 'T3', active: 62 },
      { day: 'T4', active: 65 },
      { day: 'T5', active: 64 },
      { day: 'T6', active: 68 },
      { day: 'T7', active: 45 },
      { day: 'CN', active: 52 },
    ],
    gradeDistribution: [
      { bracket: '< 5.0 (Yếu)', count: 4, percentage: 5.9, color: '#ef4444' },
      { bracket: '5.0 - 6.4 (TB)', count: 11, percentage: 16.2, color: '#f59e0b' },
      { bracket: '6.5 - 7.9 (Khá)', count: 24, percentage: 35.3, color: '#3b82f6' },
      { bracket: '8.0 - 8.9 (Giỏi)', count: 21, percentage: 30.9, color: '#10b981' },
      { bracket: '9.0 - 10.0 (Xuất sắc)', count: 8, percentage: 11.8, color: '#00EA64' },
    ],
  },
  {
    id: 'K71B-CNTT',
    name: 'Lớp K71B - Công nghệ Thông tin',
    code: 'COMP202_K71B',
    courseName: 'Lập trình Python & Trí tuệ Nhân tạo',
    term: 'Học kỳ 1 • 2026-2027',
    totalStudents: 64,
    activeStudents: 59,
    activePercentage: 92.2,
    completionRate: 68.5,
    maxCompleted: 32,
    inProgress: 14,
    notStarted: 18,
    totalAIQueries: 162,
    resolvedWithAI: 85.2,
    stuckStudentsCount: 7,
    commonErrors: [
      { name: 'TypeError', percentage: 38, count: 48 },
      { name: 'KeyError', percentage: 28, count: 35 },
      { name: 'IndexError', percentage: 20, count: 25 },
      { name: 'AttributeError', percentage: 14, count: 18 },
    ],
    weeklyLogins: [
      { day: 'T2', active: 52 },
      { day: 'T3', active: 57 },
      { day: 'T4', active: 61 },
      { day: 'T5', active: 59 },
      { day: 'T6', active: 63 },
      { day: 'T7', active: 39 },
      { day: 'CN', active: 48 },
    ],
    gradeDistribution: [
      { bracket: '< 5.0 (Yếu)', count: 5, percentage: 7.8, color: '#ef4444' },
      { bracket: '5.0 - 6.4 (TB)', count: 13, percentage: 20.3, color: '#f59e0b' },
      { bracket: '6.5 - 7.9 (Khá)', count: 22, percentage: 34.4, color: '#3b82f6' },
      { bracket: '8.0 - 8.9 (Giỏi)', count: 18, percentage: 28.1, color: '#10b981' },
      { bracket: '9.0 - 10.0 (Xuất sắc)', count: 6, percentage: 9.4, color: '#00EA64' },
    ],
  },
  {
    id: 'K72A-KHMT',
    name: 'Lớp K72A - Khoa học Máy tính',
    code: 'CS301_K72A',
    courseName: 'Thuật toán Nâng cao & Olympic',
    term: 'Học kỳ 1 • 2026-2027',
    totalStudents: 55,
    activeStudents: 53,
    activePercentage: 96.4,
    completionRate: 83.6,
    maxCompleted: 35,
    inProgress: 11,
    notStarted: 9,
    totalAIQueries: 115,
    resolvedWithAI: 91.3,
    stuckStudentsCount: 3,
    commonErrors: [
      { name: 'TimeLimitExceeded', percentage: 48, count: 55 },
      { name: 'MemoryLimitExceeded', percentage: 24, count: 28 },
      { name: 'RecursionError', percentage: 16, count: 18 },
      { name: 'IndexError', percentage: 12, count: 14 },
    ],
    weeklyLogins: [
      { day: 'T2', active: 50 },
      { day: 'T3', active: 52 },
      { day: 'T4', active: 54 },
      { day: 'T5', active: 53 },
      { day: 'T6', active: 55 },
      { day: 'T7', active: 48 },
      { day: 'CN', active: 51 },
    ],
    gradeDistribution: [
      { bracket: '< 5.0 (Yếu)', count: 1, percentage: 1.8, color: '#ef4444' },
      { bracket: '5.0 - 6.4 (TB)', count: 6, percentage: 10.9, color: '#f59e0b' },
      { bracket: '6.5 - 7.9 (Khá)', count: 15, percentage: 27.3, color: '#3b82f6' },
      { bracket: '8.0 - 8.9 (Giỏi)', count: 21, percentage: 38.2, color: '#10b981' },
      { bracket: '9.0 - 10.0 (Xuất sắc)', count: 12, percentage: 21.8, color: '#00EA64' },
    ],
  },
];

export const MOCK_LIVE_SUBMISSIONS: LiveSubmission[] = [
  {
    id: 101,
    studentName: 'Nguyễn Văn Minh',
    studentId: '2151050012',
    classGroup: 'K71A-CNTT',
    exerciseId: 1,
    exerciseTitle: 'Tìm số nguyên tố trong mảng',
    language: 'Python 3',
    testCasesPassed: 10,
    totalTestCases: 10,
    score: 10.0,
    executionTimeMs: 38,
    memoryMb: 12.4,
    status: 'accepted',
    timeAgo: '1 phút trước',
    plagiarismScore: 3,
    submittedCode: `import math

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(math.isqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

def find_primes(arr):
    return [x for x in arr if is_prime(x)]

# Đọc input và in output
if __name__ == '__main__':
    n = int(input())
    arr = list(map(int, input().split()))
    primes = find_primes(arr)
    print(*(primes if primes else [-1]))`,
  },
  {
    id: 102,
    studentName: 'Trần Thị Mai',
    studentId: '2151050045',
    classGroup: 'K71A-CNTT',
    exerciseId: 2,
    exerciseTitle: 'Kiểm tra tính hợp lệ chuỗi ngoặc',
    language: 'Python 3',
    testCasesPassed: 10,
    totalTestCases: 10,
    score: 10.0,
    executionTimeMs: 42,
    memoryMb: 14.1,
    status: 'accepted',
    timeAgo: '3 phút trước',
    plagiarismScore: 5,
    submittedCode: `def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
  },
  {
    id: 103,
    studentName: 'Lê Hoàng Nam',
    studentId: '2151050089',
    classGroup: 'K71A-CNTT',
    exerciseId: 1,
    exerciseTitle: 'Tìm số nguyên tố trong mảng',
    language: 'Python 3',
    testCasesPassed: 7,
    totalTestCases: 10,
    score: 7.0,
    executionTimeMs: 1250,
    memoryMb: 18.2,
    status: 'time_limit',
    timeAgo: '6 phút trước',
    plagiarismScore: 2,
    submittedCode: `def is_prime(n):
    if n < 2:
        return False
    # Duyệt tuần tự tới n gây TLE với n lớn
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

def find_primes(arr):
    return [x for x in arr if is_prime(x)]`,
  },
  {
    id: 104,
    studentName: 'Phạm Đức Anh',
    studentId: '2151050033',
    classGroup: 'K71A-CNTT',
    exerciseId: 3,
    exerciseTitle: 'Tìm cặp số Two Sum',
    language: 'Python 3',
    testCasesPassed: 10,
    totalTestCases: 10,
    score: 10.0,
    executionTimeMs: 29,
    memoryMb: 15.6,
    status: 'accepted',
    timeAgo: '11 phút trước',
    plagiarismScore: 8,
    submittedCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  },
  {
    id: 105,
    studentName: 'Vũ Thị Hồng Nhung',
    studentId: '2151050067',
    classGroup: 'K71A-CNTT',
    exerciseId: 2,
    exerciseTitle: 'Kiểm tra tính hợp lệ chuỗi ngoặc',
    language: 'Python 3',
    testCasesPassed: 4,
    totalTestCases: 10,
    score: 4.0,
    executionTimeMs: 35,
    memoryMb: 12.0,
    status: 'wrong_answer',
    timeAgo: '15 phút trước',
    plagiarismScore: 4,
    submittedCode: `def is_valid_parentheses(s: str) -> bool:
    # Sai lầm chỉ đếm số lượng ngoặc không theo thứ tự LIFO
    return s.count('(') == s.count(')') and s.count('[') == s.count(']') and s.count('{') == s.count('}')`,
  },
  {
    id: 106,
    studentName: 'Đặng Quốc Huy',
    studentId: '2151050102',
    classGroup: 'K71A-CNTT',
    exerciseId: 3,
    exerciseTitle: 'Tìm cặp số Two Sum',
    language: 'Python 3',
    testCasesPassed: 0,
    totalTestCases: 10,
    score: 0.0,
    executionTimeMs: 0,
    memoryMb: 0,
    status: 'compile_error',
    timeAgo: '22 phút trước',
    plagiarismScore: 1,
    submittedCode: `def two_sum(nums, target)
    # Lỗi thiếu dấu hai chấm sau định nghĩa hàm
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`,
  },
  {
    id: 107,
    studentName: 'Bùi Tuấn Kiệt',
    studentId: '2151050028',
    classGroup: 'K71B-CNTT',
    exerciseId: 1,
    exerciseTitle: 'Tìm số nguyên tố trong mảng',
    language: 'Python 3',
    testCasesPassed: 10,
    totalTestCases: 10,
    score: 10.0,
    executionTimeMs: 31,
    memoryMb: 12.8,
    status: 'accepted',
    timeAgo: '28 phút trước',
    plagiarismScore: 6,
    submittedCode: `import math

def is_prime(x):
    if x <= 1: return False
    for i in range(2, int(math.isqrt(x)) + 1):
        if x % i == 0: return False
    return True`,
  },
];

export const MOCK_AI_AUDIT_LOGS: StudentAIAuditLog[] = [
  {
    id: 1,
    studentName: 'Nguyễn Văn Minh',
    studentId: '2151050012',
    avatarColor: 'bg-emerald-600',
    classGroup: 'K71A-CNTT',
    exerciseId: 1,
    exerciseTitle: 'Tìm số nguyên tố trong mảng',
    errorType: 'IndexError',
    errorDetails: 'IndexError: list index out of range at line 6',
    studentPrompt: 'Em đang bị lỗi này ở dòng 6 trong vòng lặp while, tại sao vậy ạ?',
    aiHintSummary: 'Gợi mở về biên mảng N - 1 khi duyệt arr[i+1], hướng dẫn sinh viên đặt lại điều kiện vòng lặp i < len(arr) - 1.',
    resolved: true,
    needsTeacherHelp: false,
    attemptCount: 2,
    timeAgo: '12 phút trước',
    studentCodeSnapshot: `for i in range(len(arr)):
    if arr[i] > arr[i+1]: # Gây IndexError khi i = len(arr) - 1
        arr[i], arr[i+1] = arr[i+1], arr[i]`,
    pedagogicalInsight: 'Sinh viên nắm được ý tưởng so sánh 2 phần tử liền kề nhưng quên kiểm tra chỉ số cận biên mảng khi i đạt giá trị cuối.',
    transcript: [
      {
        sender: 'student',
        text: 'Em đang bị lỗi IndexError: list index out of range ở dòng 2, tại sao vậy ạ?',
        codeSnippet: 'if arr[i] > arr[i+1]:',
        time: '14:20',
      },
      {
        sender: 'ai',
        text: 'Chào bạn! Hãy cùng nhìn vào giá trị của `i` ở vòng lặp cuối cùng nhé. Khi `i = len(arr) - 1`, giá trị `i + 1` sẽ là bao nhiêu? Phần tử đó có tồn tại trong mảng không?',
        time: '14:21',
      },
      {
        sender: 'student',
        text: 'Dạ, lúc đó i+1 bằng len(arr), vượt quá độ dài mảng nên lỗi!',
        time: '14:23',
      },
      {
        sender: 'ai',
        text: 'Chính xác! Vậy bạn sẽ điều chỉnh phạm vi `range(...)` như thế nào để `i + 1` không bao giờ vượt quá phần tử cuối cùng của mảng?',
        time: '14:24',
      },
      {
        sender: 'student',
        text: 'Em sửa thành range(len(arr) - 1) và đã chạy thành công 10/10 test case rồi ạ. Cảm ơn bot!',
        time: '14:26',
      },
    ],
  },
  {
    id: 2,
    studentName: 'Trần Thị Mai',
    studentId: '2151050045',
    avatarColor: 'bg-indigo-600',
    classGroup: 'K71A-CNTT',
    exerciseId: 2,
    exerciseTitle: 'Kiểm tra tính hợp lệ chuỗi ngoặc',
    errorType: 'LogicError',
    errorDetails: 'Wrong Answer on Sample Case 2: expected False, got True',
    studentPrompt: 'Em dùng stack rồi nhưng test case "([)]" vẫn bị trả về True.',
    aiHintSummary: 'Đặt câu hỏi về thứ tự LIFO của dấu ngoặc mở gần nhất so với dấu ngoặc đóng hiện tại.',
    resolved: true,
    needsTeacherHelp: false,
    attemptCount: 3,
    timeAgo: '28 phút trước',
    studentCodeSnapshot: `if char in ')]}':
    stack.pop() # Chỉ pop mà không đối chiếu loại ngoặc tương ứng`,
    pedagogicalInsight: 'Sinh viên hiểu cơ chế ngăn xếp nhưng bỏ qua bước đối chiếu ánh xạ (mapping dictionary) giữa dấu ngoặc đóng và ngoặc mở.',
    transcript: [
      {
        sender: 'student',
        text: 'Em dùng stack rồi nhưng test case "([)]" vẫn bị trả về True.',
        time: '14:02',
      },
      {
        sender: 'ai',
        text: 'Khi gặp dấu đóng `]`, phần tử ở đỉnh ngăn xếp (phần tử mở gần nhất) là dấu ngoặc nào? Nó có khớp loại với dấu `]` không?',
        time: '14:03',
      },
      {
        sender: 'student',
        text: 'Đỉnh ngăn xếp là `(`, nó không khớp với `]`!',
        time: '14:05',
      },
      {
        sender: 'ai',
        text: 'Đúng vậy! Trong cấu trúc ngoặc lồng nhau, dấu ngoặc mở gần nhất phải đóng trước. Bạn có thể dùng từ điển (dict) ánh xạ các cặp tương ứng để kiểm tra.',
        time: '14:06',
      },
      {
        sender: 'student',
        text: 'Em đã thêm mapping dict và pass toàn bộ!',
        time: '14:10',
      },
    ],
  },
  {
    id: 3,
    studentName: 'Lê Hoàng Nam',
    studentId: '2151050089',
    avatarColor: 'bg-rose-600',
    classGroup: 'K71A-CNTT',
    exerciseId: 1,
    exerciseTitle: 'Tìm số nguyên tố trong mảng',
    errorType: 'TimeLimitExceeded',
    errorDetails: 'Time Limit Exceeded (> 1000ms) on Hidden Test Case 8 (N = 10^7)',
    studentPrompt: 'Hàm của em chạy đúng với số nhỏ nhưng test case số lớn thì bị quay đơ không ra kết quả.',
    aiHintSummary: 'Gợi ý kiểm tra ước tới căn bậc hai của n (isqrt) thay vì duyệt tuần tự tới n - 1 để giảm Big-O từ O(N) xuống O(sqrt(N)).',
    resolved: false,
    needsTeacherHelp: true, // Stuck alert
    attemptCount: 5,
    timeAgo: '45 phút trước',
    studentCodeSnapshot: `def is_prime(n):
    if n < 2: return False
    for i in range(2, n): # Đã thử 5 lần vẫn chưa thay đổi cận
        if n % i == 0: return False
    return True`,
    pedagogicalInsight: 'Sinh viên gặp khó khăn với khái niệm tối ưu độ phức tạp thời gian Big-O. Đã nộp 5 lần liên tiếp vẫn giữ vòng lặp O(N).',
    transcript: [
      {
        sender: 'student',
        text: 'Em bị quá thời gian chạy ở test case 8, bài này thuật toán em viết đúng mà?',
        time: '13:40',
      },
      {
        sender: 'ai',
        text: 'Thuật toán của bạn đúng về mặt kết quả, nhưng với n = 1,000,000, vòng lặp `for i in range(2, n)` sẽ chạy tới 1 triệu lần. Nếu một số n là hợp số, ước số lớn nhất của nó có thể vượt quá căn bậc 2 của n không?',
        time: '13:42',
      },
      {
        sender: 'student',
        text: 'Em không hiểu tại sao lại là căn bậc 2 ạ? Thầy trên lớp chưa giảng phần này kỹ.',
        time: '13:45',
      },
      {
        sender: 'ai',
        text: 'Nếu n = a * b, giả sử cả a và b đều lớn hơn sqrt(n), thì tích a * b sẽ lớn hơn n (mâu thuẫn). Do đó, ít nhất một trong hai ước phải nhỏ hơn hoặc bằng sqrt(n). Bạn thử áp dụng `math.isqrt(n)` xem sao nhé!',
        time: '13:47',
      },
      {
        sender: 'student',
        text: 'Em thêm math.isqrt rồi nhưng vẫn bị lỗi NameError do chưa import math. Em vẫn chưa nộp được.',
        time: '13:52',
      },
    ],
  },
  {
    id: 4,
    studentName: 'Phạm Đức Anh',
    studentId: '2151050033',
    avatarColor: 'bg-amber-600',
    classGroup: 'K71A-CNTT',
    exerciseId: 3,
    exerciseTitle: 'Tìm cặp số Two Sum',
    errorType: 'SyntaxError',
    errorDetails: 'SyntaxError: expected \':\' at line 3',
    studentPrompt: 'Báo lỗi SyntaxError ở sau lệnh for là sao ạ?',
    aiHintSummary: 'Chỉ ra quy tắc cú pháp khối lệnh bắt buộc phải có dấu hai chấm trong Python.',
    resolved: true,
    needsTeacherHelp: false,
    attemptCount: 1,
    timeAgo: '1 giờ trước',
    studentCodeSnapshot: `for i in range(len(nums))
    for j in range(i+1, len(nums)):`,
    pedagogicalInsight: 'Lỗi cú pháp sơ đẳng do thói quen gõ nhanh hoặc chuyển từ C++ sang Python.',
    transcript: [
      {
        sender: 'student',
        text: 'Báo lỗi SyntaxError ở sau lệnh for là sao ạ?',
        codeSnippet: 'for i in range(len(nums))',
        time: '13:10',
      },
      {
        sender: 'ai',
        text: 'Trong Python, sau các cấu trúc điều khiển như `for`, `if`, `while`, `def`, ký tự nào là bắt buộc để bắt đầu một khối lệnh?',
        time: '13:11',
      },
      {
        sender: 'student',
        text: 'À em quên dấu hai chấm `:` ạ!',
        time: '13:12',
      },
    ],
  },
  {
    id: 5,
    studentName: 'Đặng Quốc Huy',
    studentId: '2151050102',
    avatarColor: 'bg-purple-600',
    classGroup: 'K71A-CNTT',
    exerciseId: 3,
    exerciseTitle: 'Tìm cặp số Two Sum',
    errorType: 'LogicError',
    errorDetails: 'Wrong Answer on duplicate values [3, 3] with target 6',
    studentPrompt: 'Mảng có 2 số giống nhau thì hash map của em bị ghi đè chỉ số.',
    aiHintSummary: 'Gợi ý kiểm tra complement trước khi lưu chỉ số hiện tại vào hash map.',
    resolved: false,
    needsTeacherHelp: true, // Stuck alert
    attemptCount: 4,
    timeAgo: '2 giờ trước',
    studentCodeSnapshot: `seen = {num: i for i, num in enumerate(nums)} # Bị ghi đè key trùng`,
    pedagogicalInsight: 'Sinh viên tạo trước toàn bộ từ điển thay vì duyệt one-pass và kiểm tra trước khi ghi.',
    transcript: [
      {
        sender: 'student',
        text: 'Mảng có 2 số giống nhau thì hash map của em bị ghi đè chỉ số, bài Two Sum có test [3, 3] target 6.',
        time: '12:20',
      },
      {
        sender: 'ai',
        text: 'Thay vì tạo sẵn từ điển cho tất cả phần tử, điều gì sẽ xảy ra nếu bạn vừa duyệt qua từng phần tử vừa kiểm tra xem `target - num` đã có trong từ điển trước đó chưa?',
        time: '12:22',
      },
    ],
  },
];

export const MOCK_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: 1,
    title: 'Bài 01: Tìm số nguyên tố trong mảng',
    category: 'Algorithms',
    difficulty: 'easy',
    language: 'Python 3',
    classGroup: 'K71A-CNTT',
    deadline: '23:59 • 15/10/2026',
    deadlineDate: '2026-10-15T23:59:00',
    submittedCount: 52,
    totalStudents: 68,
    passRate: 88.5,
    aiSocraticEnabled: true,
    antiPlagiarismEnabled: true,
    status: 'active',
    testCasesCount: 10,
    description: 'Viết chương trình tìm tất cả các số nguyên tố trong mảng số nguyên dương N phần tử. Tối ưu thuật toán kiểm tra số nguyên tố.',
  },
  {
    id: 2,
    title: 'Bài 02: Kiểm tra tính hợp lệ chuỗi ngoặc',
    category: 'Data Structures',
    difficulty: 'easy',
    language: 'Python 3',
    classGroup: 'K71A-CNTT',
    deadline: '23:59 • 18/10/2026',
    deadlineDate: '2026-10-18T23:59:00',
    submittedCount: 46,
    totalStudents: 68,
    passRate: 78.3,
    aiSocraticEnabled: true,
    antiPlagiarismEnabled: true,
    status: 'active',
    testCasesCount: 12,
    description: 'Sử dụng cấu trúc dữ liệu Ngăn xếp (Stack) để kiểm tra tính hợp lệ của chuỗi chứa các ký tự ngoặc đơn (), ngoặc vuông [], và ngoặc nhọn {}.',
  },
  {
    id: 3,
    title: 'Bài 03: Tìm cặp số Two Sum',
    category: 'Algorithms',
    difficulty: 'medium',
    language: 'Python 3',
    classGroup: 'K71A-CNTT',
    deadline: '23:59 • 22/10/2026',
    deadlineDate: '2026-10-22T23:59:00',
    submittedCount: 38,
    totalStudents: 68,
    passRate: 65.8,
    aiSocraticEnabled: true,
    antiPlagiarismEnabled: true,
    status: 'active',
    testCasesCount: 15,
    description: 'Cho mảng số nguyên nums và số nguyên target, tìm chỉ số của hai số sao cho tổng của chúng bằng target trong độ phức tạp thời gian O(N).',
  },
  {
    id: 4,
    title: 'Bài 04: Sắp xếp mảng QuickSort & MergeSort',
    category: 'Algorithms',
    difficulty: 'hard',
    language: 'Python 3',
    classGroup: 'K71A-CNTT',
    deadline: '23:59 • 25/10/2026',
    deadlineDate: '2026-10-25T23:59:00',
    submittedCount: 18,
    totalStudents: 68,
    passRate: 50.0,
    aiSocraticEnabled: true,
    antiPlagiarismEnabled: true,
    status: 'active',
    testCasesCount: 20,
    description: 'Cài đặt thuật toán chia để trị QuickSort và MergeSort. Đo lường số phép so sánh và thời gian thực thi trên mảng ngẫu nhiên 10^5 phần tử.',
  },
  {
    id: 5,
    title: 'Bài 05: Kiểm tra Đồ thị Hai phía (Bipartite Graph)',
    category: 'Graph Theory',
    difficulty: 'hard',
    language: 'Python 3',
    classGroup: 'K72A-KHMT',
    deadline: '23:59 • 30/10/2026',
    deadlineDate: '2026-10-30T23:59:00',
    submittedCount: 22,
    totalStudents: 55,
    passRate: 72.7,
    aiSocraticEnabled: true,
    antiPlagiarismEnabled: true,
    status: 'active',
    testCasesCount: 18,
    description: 'Áp dụng thuật toán tìm kiếm theo chiều rộng (BFS) hoặc DFS để tô màu 2 màu cho các đỉnh của đồ thị vô hướng.',
  },
];

export const MOCK_STUDENT_ROSTER: StudentRosterItem[] = [
  {
    studentId: '2151050012',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nv21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 4,
    totalAssignments: 4,
    gpa: 9.6,
    attendanceRate: 98,
    aiQueriesCount: 6,
    status: 'excellent',
    recentActivity: 'Nộp bài 01 đạt 10/10 (12 phút trước)',
  },
  {
    studentId: '2151050045',
    name: 'Trần Thị Mai',
    email: 'mai.tt21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 4,
    totalAssignments: 4,
    gpa: 9.2,
    attendanceRate: 96,
    aiQueriesCount: 8,
    status: 'excellent',
    recentActivity: 'Nộp bài 02 đạt 10/10 (28 phút trước)',
  },
  {
    studentId: '2151050033',
    name: 'Phạm Đức Anh',
    email: 'anh.pd21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 3,
    totalAssignments: 4,
    gpa: 8.4,
    attendanceRate: 92,
    aiQueriesCount: 14,
    status: 'progressing',
    recentActivity: 'Nộp bài 03 đạt 10/10 (1 giờ trước)',
  },
  {
    studentId: '2151050089',
    name: 'Lê Hoàng Nam',
    email: 'nam.lh21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 2,
    totalAssignments: 4,
    gpa: 6.8,
    attendanceRate: 85,
    aiQueriesCount: 24,
    status: 'needs_attention',
    recentActivity: 'Bị lỗi TLE Bài 01 (45 phút trước)',
  },
  {
    studentId: '2151050102',
    name: 'Đặng Quốc Huy',
    email: 'huy.dq21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 1,
    totalAssignments: 4,
    gpa: 5.2,
    attendanceRate: 74,
    aiQueriesCount: 32,
    status: 'at_risk',
    recentActivity: 'Bế tắc Bài 03, hỏi AI 4 lần chưa giải xong',
  },
  {
    studentId: '2151050067',
    name: 'Vũ Thị Hồng Nhung',
    email: 'nhung.vth21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 2,
    totalAssignments: 4,
    gpa: 7.2,
    attendanceRate: 88,
    aiQueriesCount: 18,
    status: 'progressing',
    recentActivity: 'Sai test case Bài 02 (15 phút trước)',
  },
  {
    studentId: '2151050028',
    name: 'Bùi Tuấn Kiệt',
    email: 'kiet.bt21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 3,
    totalAssignments: 4,
    gpa: 8.8,
    attendanceRate: 95,
    aiQueriesCount: 10,
    status: 'excellent',
    recentActivity: 'Đã hoàn thành 3/4 bài tập',
  },
  {
    studentId: '2151050115',
    name: 'Hoàng Bảo Ngọc',
    email: 'ngoc.hb21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 3,
    totalAssignments: 4,
    gpa: 8.0,
    attendanceRate: 90,
    aiQueriesCount: 12,
    status: 'progressing',
    recentActivity: 'Nộp bài hôm qua',
  },
];
