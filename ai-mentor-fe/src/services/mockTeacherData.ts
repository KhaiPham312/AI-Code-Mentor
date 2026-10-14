export interface ClassGroup {
  id: string;
  name: string;
  nameEng?: string;
  code: string;
  courseName: string;
  courseNameEng?: string;
  term: string;
  termEng?: string;
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
    name: 'Lớp K71A – Công nghệ Thông tin',
    nameEng: 'Class K71A – Information Technology',
    code: 'COMP201_K71A',
    courseName: 'Cấu trúc dữ liệu (Data Structures)',
    courseNameEng: 'Data Structures',
    term: 'Học kỳ 1 • 2026-2027',
    termEng: 'Semester 1 • 2026-2027',
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
    id: 'K72A-KHMT',
    name: 'Lớp K72A – Khoa học Máy tính',
    nameEng: 'Class K72A – Computer Science',
    code: 'COMP202_K72A',
    courseName: 'Thuật toán (Algorithms)',
    courseNameEng: 'Algorithms',
    term: 'Học kỳ 1 • 2026-2027',
    termEng: 'Semester 1 • 2026-2027',
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
  {
    id: 'K73A-CNTT',
    name: 'Lớp K73A – Công nghệ Thông tin',
    nameEng: 'Class K73A – Information Technology',
    code: 'COMP104_K73A',
    courseName: 'Lập trình C++ (C++)',
    courseNameEng: 'C++ Programming',
    term: 'Học kỳ 1 • 2026-2027',
    termEng: 'Semester 1 • 2026-2027',
    totalStudents: 62,
    activeStudents: 58,
    activePercentage: 93.5,
    completionRate: 75.8,
    maxCompleted: 34,
    inProgress: 13,
    notStarted: 15,
    totalAIQueries: 130,
    resolvedWithAI: 89.2,
    stuckStudentsCount: 4,
    commonErrors: [
      { name: 'SegmentationFault', percentage: 40, count: 52 },
      { name: 'MemoryLeak', percentage: 26, count: 34 },
      { name: 'CompileError', percentage: 20, count: 26 },
      { name: 'LogicError', percentage: 14, count: 18 },
    ],
    weeklyLogins: [
      { day: 'T2', active: 54 },
      { day: 'T3', active: 56 },
      { day: 'T4', active: 58 },
      { day: 'T5', active: 57 },
      { day: 'T6', active: 60 },
      { day: 'T7', active: 42 },
      { day: 'CN', active: 49 },
    ],
    gradeDistribution: [
      { bracket: '< 5.0 (Yếu)', count: 3, percentage: 4.8, color: '#ef4444' },
      { bracket: '5.0 - 6.4 (TB)', count: 10, percentage: 16.1, color: '#f59e0b' },
      { bracket: '6.5 - 7.9 (Khá)', count: 23, percentage: 37.1, color: '#3b82f6' },
      { bracket: '8.0 - 8.9 (Giỏi)', count: 18, percentage: 29.0, color: '#10b981' },
      { bracket: '9.0 - 10.0 (Xuất sắc)', count: 8, percentage: 12.9, color: '#00EA64' },
    ],
  },
  {
    id: 'K73B-KHMT',
    name: 'Lớp K73B – Khoa học Máy tính',
    nameEng: 'Class K73B – Computer Science',
    code: 'COMP105_K73B',
    courseName: 'Lập trình Python (Python)',
    courseNameEng: 'Python Programming',
    term: 'Học kỳ 1 • 2026-2027',
    termEng: 'Semester 1 • 2026-2027',
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

// ==================== I18N LOCALIZATION MAPPERS & HELPERS ====================

export const EXERCISE_TITLE_MAP: Record<string, string> = {
  'Tìm số nguyên tố trong mảng': 'Find Prime Numbers in Array',
  'Kiểm tra tính hợp lệ chuỗi ngoặc': 'Valid Parentheses Check',
  'Tìm cặp số Two Sum': 'Two Sum Problem',
  'Sắp xếp mảng bằng QuickSort': 'QuickSort Array Implementation',
  'Tìm đường đi ngắn nhất Dijkstra': "Dijkstra's Shortest Path",
  'Cây nhị phân tìm kiếm (BST)': 'Binary Search Tree (BST) Operations',
  'Sắp xếp mảng QuickSort & MergeSort': 'QuickSort & MergeSort Implementation',
  'Kiểm tra Đồ thị Hai phía (Bipartite Graph)': 'Bipartite Graph Verification',
  'Bài 01: Tìm số nguyên tố trong mảng': 'Problem 01: Find Prime Numbers in Array',
  'Bài 02: Kiểm tra tính hợp lệ chuỗi ngoặc': 'Problem 02: Valid Parentheses Check',
  'Bài 03: Tìm cặp số Two Sum': 'Problem 03: Two Sum Problem',
  'Bài 04: Sắp xếp mảng QuickSort & MergeSort': 'Problem 04: QuickSort & MergeSort Implementation',
  'Bài 05: Kiểm tra Đồ thị Hai phía (Bipartite Graph)': 'Problem 05: Bipartite Graph Verification',
};

export const TIME_AGO_MAP: Record<string, string> = {
  'Vừa xong': 'Just now',
  '1 phút trước': '1 min ago',
  '3 phút trước': '3 mins ago',
  '6 phút trước': '6 mins ago',
  '11 phút trước': '11 mins ago',
  '12 phút trước': '12 mins ago',
  '15 phút trước': '15 mins ago',
  '22 phút trước': '22 mins ago',
  '28 phút trước': '28 mins ago',
  '45 phút trước': '45 mins ago',
  '1 giờ trước': '1 hour ago',
  '2 giờ trước': '2 hours ago',
  'Hôm qua': 'Yesterday',
};

export const GRADE_BRACKET_MAP: Record<string, string> = {
  '< 5.0 (Yếu)': '< 5.0 (Fail / Poor)',
  '5.0 - 6.4 (TB)': '5.0 - 6.4 (Average)',
  '6.5 - 7.9 (Khá)': '6.5 - 7.9 (Good)',
  '8.0 - 8.9 (Giỏi)': '8.0 - 8.9 (Very Good)',
  '9.0 - 10.0 (Xuất sắc)': '9.0 - 10.0 (Excellent)',
};

export const DAY_OF_WEEK_MAP: Record<string, string> = {
  'T2': 'Mon',
  'T3': 'Tue',
  'T4': 'Wed',
  'T5': 'Thu',
  'T6': 'Fri',
  'T7': 'Sat',
  'CN': 'Sun',
};

export const ROSTER_ACTIVITY_MAP: Record<string, string> = {
  'Nộp bài 01 đạt 10/10 (12 phút trước)': 'Submitted Problem 01: 10/10 (12 mins ago)',
  'Nộp bài 02 đạt 10/10 (28 phút trước)': 'Submitted Problem 02: 10/10 (28 mins ago)',
  'Nộp bài 03 đạt 10/10 (1 giờ trước)': 'Submitted Problem 03: 10/10 (1 hour ago)',
  'Bị lỗi TLE Bài 01 (45 phút trước)': 'TLE on Problem 01 (45 mins ago)',
  'Bế tắc Bài 03, hỏi AI 4 lần chưa giải xong': 'Stuck on Problem 03, 4 AI queries pending',
  'Sai test case Bài 02 (15 phút trước)': 'Failed test case on Problem 02 (15 mins ago)',
  'Đã hoàn thành 3/4 bài tập': 'Completed 3/4 assignments',
  'Nộp bài hôm qua': 'Submitted yesterday',
};

export const ASSIGNMENT_DESC_MAP: Record<string, string> = {
  'Viết chương trình tìm tất cả các số nguyên tố trong mảng số nguyên dương N phần tử. Tối ưu thuật toán kiểm tra số nguyên tố.':
    'Write a program to find all prime numbers in an array of positive integers of length N. Optimize primality testing.',
  'Sử dụng cấu trúc dữ liệu Ngăn xếp (Stack) để kiểm tra tính hợp lệ của chuỗi chứa các ký tự ngoặc đơn (), ngoặc vuông [], và ngoặc nhọn {}.':
    'Use a Stack data structure to validate expressions containing parenthesis (), brackets [], and braces {}.',
  'Cho mảng số nguyên nums và số nguyên target, tìm chỉ số của hai số sao cho tổng của chúng bằng target trong độ phức tạp thời gian O(N).':
    'Given an integer array nums and target integer, find indices of the two numbers that sum up to target in O(N) time.',
  'Cài đặt thuật toán chia để trị QuickSort và MergeSort. Đo lường số phép so sánh và thời gian thực thi trên mảng ngẫu nhiên 10^5 phần tử.':
    'Implement QuickSort and MergeSort divide-and-conquer algorithms. Benchmark comparisons and runtime on 10^5 elements.',
  'Áp dụng thuật toán tìm kiếm theo chiều rộng (BFS) hoặc DFS để tô màu 2 màu cho các đỉnh của đồ thị vô hướng.':
    'Apply BFS or DFS traversal to determine if an undirected graph can be 2-colored (Bipartite graph verification).',
};

export const AI_LOG_SUMMARY_MAP: Record<string, { prompt: string; hint: string; insight: string }> = {
  '1': {
    prompt: "I'm encountering an error on line 6 inside the while loop, why is this happening?",
    hint: 'Socratic guidance on array boundary N - 1 when inspecting arr[i+1], guiding student to adjust loop to i < len(arr) - 1.',
    insight: 'Student understands adjacent element comparison concept but overlooked boundary index checks when i reaches array end.',
  },
  '2': {
    prompt: 'I used a stack but test case "([)]" still returns True.',
    hint: 'Prompted about LIFO order of the most recent opening bracket compared to the current closing bracket.',
    insight: 'Student grasps stack mechanism but missed mapping dictionary verification between opening and closing brackets.',
  },
  '3': {
    prompt: 'My function works for small numbers but times out on large test cases without completing.',
    hint: 'Suggested checking divisors up to square root of n (isqrt) instead of linear scan to reduce Big-O from O(N) to O(sqrt(N)).',
    insight: 'Student struggles with Big-O time complexity optimization. Submitted 5 consecutive times retaining O(N) loop.',
  },
  '4': {
    prompt: 'Why is it giving a SyntaxError after the for statement?',
    hint: 'Pointed out Python block syntax rules requiring a colon after control flow statements.',
    insight: 'Basic syntax oversight caused by typing fast or transitioning from C++ to Python.',
  },
  '5': {
    prompt: 'When array has duplicate values, my hash map overwrites the previous index.',
    hint: 'Suggested checking if complement exists before recording current index into hash map.',
    insight: 'Student pre-built entire dictionary rather than using a one-pass look-up-and-insert approach.',
  },
};

export const AI_LOG_TRANSCRIPT_MAP: Record<string, TranscriptMessage[]> = {
  '1': [
    {
      sender: 'student',
      text: "I'm getting an IndexError: list index out of range on line 2, why is that?",
      codeSnippet: 'if arr[i] > arr[i+1]:',
      time: '14:20',
    },
    {
      sender: 'ai',
      text: "Hello! Let's examine the value of `i` during the last iteration. When `i = len(arr) - 1`, what will `i + 1` evaluate to? Does that index exist in the array?",
      time: '14:21',
    },
    {
      sender: 'student',
      text: "Oh! At that point i + 1 equals len(arr), which exceeds the array length!",
      time: '14:23',
    },
    {
      sender: 'ai',
      text: "Spot on! So how would you adjust the `range(...)` bounds so that `i + 1` never exceeds the last element?",
      time: '14:24',
    },
    {
      sender: 'student',
      text: "I changed it to range(len(arr) - 1) and passed 10/10 test cases now. Thanks bot!",
      time: '14:26',
    },
  ],
  '2': [
    {
      sender: 'student',
      text: 'I used a stack but test case "([)]" still returns True.',
      time: '14:02',
    },
    {
      sender: 'ai',
      text: "When encountering closing bracket `]`, what is the top element of the stack (most recent open bracket)? Does it match the type of `]`?",
      time: '14:03',
    },
    {
      sender: 'student',
      text: "The top of the stack is `(`, which does not match `]`!",
      time: '14:05',
    },
    {
      sender: 'ai',
      text: "Correct! In nested brackets, the nearest open bracket must close first. You can use a mapping dictionary to check matching pairs.",
      time: '14:06',
    },
    {
      sender: 'student',
      text: "Added the mapping dict and all test cases passed!",
      time: '14:10',
    },
  ],
  '3': [
    {
      sender: 'student',
      text: "I hit Time Limit Exceeded on test case 8, but my algorithm logic seems right?",
      time: '13:40',
    },
    {
      sender: 'ai',
      text: "Your logic produces correct outputs, but with n = 1,000,000, `for i in range(2, n)` runs 1 million times. If n is composite, can its smallest factor exceed sqrt(n)?",
      time: '13:42',
    },
    {
      sender: 'student',
      text: "Why square root of n? My professor hasn't covered this mathematical property yet.",
      time: '13:45',
    },
    {
      sender: 'ai',
      text: "If n = a * b and both a and b were greater than sqrt(n), their product a * b would exceed n (contradiction). Hence at least one factor <= sqrt(n). Try using `math.isqrt(n)`!",
      time: '13:47',
    },
    {
      sender: 'student',
      text: "Added math.isqrt but got NameError because I haven't imported math. Fixing it now.",
      time: '13:52',
    },
  ],
  '4': [
    {
      sender: 'student',
      text: "Why does it report SyntaxError after the for loop?",
      codeSnippet: 'for i in range(len(nums))',
      time: '13:10',
    },
    {
      sender: 'ai',
      text: "In Python, after control flow statements like `for`, `if`, `while`, `def`, which character is required to open a block?",
      time: '13:11',
    },
    {
      sender: 'student',
      text: "Ah! I forgot the colon `:`!",
      time: '13:12',
    },
  ],
  '5': [
    {
      sender: 'student',
      text: "When the array has duplicate values, my hash map overwrites indices. Two Sum has test [3, 3] with target 6.",
      time: '12:20',
    },
    {
      sender: 'ai',
      text: "Instead of pre-populating the dictionary for all elements, what happens if you check whether `target - num` is already present while iterating through each element?",
      time: '12:22',
    },
  ],
};

export function translateExerciseTitle(title: string, isVie: boolean): string {
  if (isVie) return title;
  return EXERCISE_TITLE_MAP[title] || title;
}

export function translateTimeAgo(time: string, isVie: boolean): string {
  if (isVie) return time;
  if (TIME_AGO_MAP[time]) return TIME_AGO_MAP[time];
  const minuteMatch = time.match(/(\d+)\s*phút\s*trước/i);
  if (minuteMatch) {
    const mins = minuteMatch[1];
    return `${mins} min${Number(mins) > 1 ? 's' : ''} ago`;
  }
  const hourMatch = time.match(/(\d+)\s*giờ\s*trước/i);
  if (hourMatch) {
    const hrs = hourMatch[1];
    return `${hrs} hour${Number(hrs) > 1 ? 's' : ''} ago`;
  }
  if (time.toLowerCase().includes('hôm qua')) return 'Yesterday';
  if (time.toLowerCase().includes('vừa xong')) return 'Just now';
  return time;
}

export function translateGradeBracket(bracket: string, isVie: boolean): string {
  if (isVie) return bracket;
  return GRADE_BRACKET_MAP[bracket] || bracket;
}

export function translateDayOfWeek(day: string, isVie: boolean): string {
  if (isVie) return day;
  return DAY_OF_WEEK_MAP[day] || day;
}

export function translateRecentActivity(act: string, isVie: boolean): string {
  if (isVie) return act;
  return ROSTER_ACTIVITY_MAP[act] || act;
}

export function translateAssignmentDesc(desc: string, isVie: boolean): string {
  if (isVie) return desc;
  return ASSIGNMENT_DESC_MAP[desc] || desc;
}

export function translateLogSummary(
  id: number | string,
  fallbackPrompt: string,
  fallbackHint: string,
  fallbackInsight: string,
  isVie: boolean
) {
  if (isVie) {
    return {
      prompt: fallbackPrompt,
      hint: fallbackHint,
      insight: fallbackInsight,
    };
  }
  const mapped = AI_LOG_SUMMARY_MAP[String(id)];
  return {
    prompt: mapped ? mapped.prompt : fallbackPrompt,
    hint: mapped ? mapped.hint : fallbackHint,
    insight: mapped ? mapped.insight : fallbackInsight,
  };
}

export function translateTranscript(
  id: number | string,
  messages: TranscriptMessage[],
  isVie: boolean
): TranscriptMessage[] {
  if (isVie) return messages;
  const mapped = AI_LOG_TRANSCRIPT_MAP[String(id)];
  return mapped || messages;
}

