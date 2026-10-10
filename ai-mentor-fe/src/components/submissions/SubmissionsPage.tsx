import React, { useState, useMemo } from 'react';
import { User } from '../../types/auth';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  ChevronRight,
  Search,
  Filter,
  Copy,
  Check,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  Cpu,
  Layers,
  BarChart3,
  X,
} from 'lucide-react';

export interface SubmissionItem {
  id: string;
  exerciseId: number;
  problemTitle: string;
  topic: string;
  trackId: string;
  language: 'Python' | 'C++' | 'SQL' | 'Java' | 'JavaScript';
  status: 'accepted' | 'wrong_answer' | 'time_limit';
  passedTests: number;
  totalTests: number;
  score: number;
  executionTimeMs: number;
  memoryMb: number;
  submittedAt: string;
  code: string;
}

const MOCK_SUBMISSIONS: SubmissionItem[] = [
  {
    id: 'sub-801',
    exerciseId: 1,
    problemTitle: 'Ước chung lớn nhất (GCD) & Euclid',
    topic: 'Thuật toán Cơ bản',
    trackId: 'algorithms',
    language: 'Python',
    status: 'accepted',
    passedTests: 5,
    totalTests: 5,
    score: 100,
    executionTimeMs: 14,
    memoryMb: 12.8,
    submittedAt: '10 phút trước',
    code: `def gcd(a: int, b: int) -> int:
    """
    Thuật toán Euclid tìm ước chung lớn nhất O(log(min(a, b)))
    """
    while b:
        a, b = b, a % b
    return a

# Đọc input và thực thi
if __name__ == "__main__":
    import sys
    lines = sys.stdin.read().split()
    if len(lines) >= 2:
        x, y = int(lines[0]), int(lines[1])
        print(gcd(x, y))`,
  },
  {
    id: 'sub-802',
    exerciseId: 2,
    problemTitle: 'Kiểm tra chuỗi ngoặc hợp lệ (Valid Parentheses)',
    topic: 'Cấu trúc dữ liệu & Ngăn xếp',
    trackId: 'data-structures',
    language: 'C++',
    status: 'accepted',
    passedTests: 6,
    totalTests: 6,
    score: 100,
    executionTimeMs: 8,
    memoryMb: 10.2,
    submittedAt: '45 phút trước',
    code: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

bool isValidParentheses(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return st.empty();
}

int main() {
    string s;
    if (cin >> s) {
        cout << (isValidParentheses(s) ? "true" : "false") << endl;
    }
    return 0;
}`,
  },
  {
    id: 'sub-803',
    exerciseId: 3,
    problemTitle: 'Kiểm tra số nguyên tố tối ưu',
    topic: 'Số học & Toán rời rạc',
    trackId: 'algorithms',
    language: 'Python',
    status: 'wrong_answer',
    passedTests: 4,
    totalTests: 7,
    score: 57,
    executionTimeMs: 48,
    memoryMb: 14.1,
    submittedAt: '2 giờ trước',
    code: `def is_prime(n: int) -> bool:
    # Lỗi: Chưa xử lý đúng số âm và số 0, 1
    if n <= 1:
        return False
    # Vòng lặp O(N) chậm khi gặp số lớn
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

print(is_prime(int(input())))`,
  },
  {
    id: 'sub-804',
    exerciseId: 4,
    problemTitle: 'Tìm kiếm nhị phân trên mảng đã sắp xếp',
    topic: 'Chia để trị (Binary Search)',
    trackId: 'algorithms',
    language: 'C++',
    status: 'accepted',
    passedTests: 8,
    totalTests: 8,
    score: 100,
    executionTimeMs: 6,
    memoryMb: 9.8,
    submittedAt: 'Hôm qua, 16:20',
    code: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int n, target;
    if (cin >> n >> target) {
        vector<int> arr(n);
        for (int i = 0; i < n; ++i) cin >> arr[i];
        cout << binarySearch(arr, target) << endl;
    }
    return 0;
}`,
  },
  {
    id: 'sub-805',
    exerciseId: 5,
    problemTitle: 'Bài toán Cái Balo 0/1 (Knapsack DP)',
    topic: 'Quy hoạch động (Dynamic Programming)',
    trackId: 'algorithms',
    language: 'Python',
    status: 'time_limit',
    passedTests: 3,
    totalTests: 6,
    score: 50,
    executionTimeMs: 1250,
    memoryMb: 32.4,
    submittedAt: 'Hôm qua, 11:15',
    code: `def knapsack_brute_force(weights, values, capacity, n):
    # Đệ quy vét cạn O(2^N) bị Time Limit Exceeded với N > 25
    if n == 0 or capacity == 0:
        return 0
    if weights[n - 1] > capacity:
        return knapsack_brute_force(weights, values, capacity, n - 1)
    return max(
        values[n - 1] + knapsack_brute_force(weights, values, capacity - weights[n - 1], n - 1),
        knapsack_brute_force(weights, values, capacity, n - 1)
    )`,
  },
  {
    id: 'sub-806',
    exerciseId: 6,
    problemTitle: 'Truy vấn INNER JOIN Khách hàng & Đơn hàng',
    topic: 'Cơ sở dữ liệu & SQL',
    trackId: 'sql',
    language: 'SQL',
    status: 'accepted',
    passedTests: 5,
    totalTests: 5,
    score: 100,
    executionTimeMs: 18,
    memoryMb: 16.0,
    submittedAt: '2 ngày trước',
    code: `SELECT 
    c.customer_id,
    c.customer_name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.total_amount) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_status = 'COMPLETED'
GROUP BY c.customer_id, c.customer_name
HAVING SUM(o.total_amount) >= 1000
ORDER BY total_spent DESC;`,
  },
  {
    id: 'sub-807',
    exerciseId: 7,
    problemTitle: 'Tìm đường đi ngắn nhất Dijkstra',
    topic: 'Lý thuyết Đồ thị (Graph Theory)',
    trackId: 'algorithms',
    language: 'Python',
    status: 'accepted',
    passedTests: 7,
    totalTests: 7,
    score: 100,
    executionTimeMs: 22,
    memoryMb: 15.6,
    submittedAt: '3 ngày trước',
    code: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        cur_dist, u = heapq.heappop(pq)
        if cur_dist > distances[u]:
            continue
        for v, weight in graph[u]:
            dist = cur_dist + weight
            if dist < distances[v]:
                distances[v] = dist
                heapq.heappush(pq, (dist, v))
    return distances`,
  },
  {
    id: 'sub-808',
    exerciseId: 8,
    problemTitle: 'Hệ thống Quản lý Sinh viên OOP',
    topic: 'Lập trình Hướng đối tượng',
    trackId: 'python',
    language: 'Java',
    status: 'accepted',
    passedTests: 5,
    totalTests: 5,
    score: 100,
    executionTimeMs: 42,
    memoryMb: 28.5,
    submittedAt: '4 ngày trước',
    code: `public class StudentManager {
    public static class Student {
        private String id;
        private String name;
        private double gpa;

        public Student(String id, String name, double gpa) {
            this.id = id;
            this.name = name;
            this.gpa = gpa;
        }

        public boolean isHonorRoll() {
            return this.gpa >= 3.6;
        }
    }
}`,
  },
];

interface SubmissionsPageProps {
  user: User;
  onBackToDashboard: () => void;
  onOpenIDE: (exerciseId: number) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
  onLogout: () => void;
}

export const SubmissionsPage: React.FC<SubmissionsPageProps> = ({
  user,
  onBackToDashboard,
  onOpenIDE,
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
  onLogout,
}) => {
  const isVie = currentLang === 'vie';

  const cleanName = (user.name || '').replace(/\s*\([^)]*\)/g, '').trim() || user.name;

  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'wrong_answer' | 'time_limit'>('all');
  const [langFilter, setLangFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Code inspection modal state
  const [activeCodeModal, setActiveCodeModal] = useState<SubmissionItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Filtered submissions
  const filteredList = useMemo(() => {
    return MOCK_SUBMISSIONS.filter((sub) => {
      const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchLang = langFilter === 'all' || sub.language.toLowerCase() === langFilter.toLowerCase();
      const matchSearch =
        sub.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchLang && matchSearch;
    });
  }, [statusFilter, langFilter, searchQuery]);

  // Key KPI stats
  const totalSubmissions = MOCK_SUBMISSIONS.length;
  const acceptedCount = MOCK_SUBMISSIONS.filter((s) => s.status === 'accepted').length;
  const accuracyRate = Math.round((acceptedCount / totalSubmissions) * 100);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full h-16 border-b bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md border-slate-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Branding & Back Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isVie ? 'Quay lại Bảng điều khiển' : 'Back to Dashboard'}</span>
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-gray-800 hidden sm:block" />

            <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToDashboard}>
              <div className="w-8 h-8 rounded-md bg-[#1BA94C] flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
                <span className="font-mono text-base font-extrabold">H</span>
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white uppercase font-sans hidden md:inline">
                AI CODE MENTOR
              </span>
            </div>
          </div>

          {/* Right: Controls & User Info */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => onLanguageChange('vie')}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  currentLang === 'vie'
                    ? 'bg-[#1BA94C] text-white shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                VIE
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('eng')}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  currentLang === 'eng'
                    ? 'bg-[#1BA94C] text-white shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onThemeToggle}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60"
            >
              {currentTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* User Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-gray-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center">
                {cleanName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-bold text-slate-900 dark:text-white">{cleanName}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {user.studentId || 'K72 CNTT'}
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                title={isVie ? 'Đăng xuất' : 'Sign out'}
                className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-600 dark:text-[#00EA64] font-semibold">
            {isVie ? 'Lịch sử nộp bài' : 'Submissions'}
          </span>
        </nav>

        {/* Hero Header & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isVie ? 'Lịch sử nộp bài của tôi' : 'My Submission History'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {isVie
                ? 'Theo dõi toàn bộ mã nguồn, tỷ lệ test case vượt qua và hiệu năng thực thi của các lần giải bài tập trên nền tảng.'
                : 'Review your complete submission log, test case pass rates, runtime performance, and source codes.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenIDE(1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1BA94C] hover:bg-[#168a3e] text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>{isVie ? 'Mở Web IDE Luyện tập' : 'Open Web IDE'}</span>
          </button>
        </div>

        {/* 3. KPI SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isVie ? 'Tổng bài nộp' : 'Total Submissions'}
              </span>
              <Layers className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {totalSubmissions}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isVie ? 'Tất cả các chủ đề' : 'Across all tracks'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isVie ? 'Bài đạt chuẩn (Accepted)' : 'Accepted'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-[#00EA64] mt-2">
              {acceptedCount}
            </div>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-1 block">
              {accuracyRate}% {isVie ? 'tỷ lệ chính xác' : 'accuracy rate'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isVie ? 'Thời gian chạy TB' : 'Avg Execution Time'}
              </span>
              <Cpu className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              18.4 ms
            </div>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 block">
              {isVie ? 'Rất nhanh và tối ưu' : 'Highly optimized'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isVie ? 'Xếp hạng lớp K72' : 'Class Ranking'}
              </span>
              <BarChart3 className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              Top 5%
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">
              {isVie ? 'Thứ 3 / 68 sinh viên' : 'Rank 3 / 68 students'}
            </span>
          </div>
        </div>

        {/* 4. FILTERS & SEARCH CONTROLS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVie ? 'Tìm theo tên bài tập hoặc chủ đề...' : 'Search by problem title or topic...'}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700/80 focus:outline-none focus:border-[#1BA94C] text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{isVie ? 'Bộ lọc:' : 'Filters:'}</span>
            </div>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#1BA94C]"
            >
              <option value="all">{isVie ? 'Tất cả trạng thái' : 'All Statuses'}</option>
              <option value="accepted">Accepted (Thành công)</option>
              <option value="wrong_answer">Wrong Answer (Sai kết quả)</option>
              <option value="time_limit">Time Limit Exceeded (Quá giờ)</option>
            </select>

            {/* Language Select */}
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#1BA94C]"
            >
              <option value="all">{isVie ? 'Tất cả ngôn ngữ' : 'All Languages'}</option>
              <option value="python">Python</option>
              <option value="c++">C++</option>
              <option value="sql">SQL</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>

        {/* 5. HACKERRANK-GRADE SUBMISSIONS TABLE */}
        <div className="rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50/70 dark:bg-[#0e1420]/70 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">{isVie ? 'Bài tập' : 'Problem'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Khóa học / Chủ đề' : 'Topic'}</th>
                  <th className="py-3.5 px-3">{isVie ? 'Ngôn ngữ' : 'Language'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Trạng thái' : 'Status'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Test Cases / Điểm' : 'Score / Tests'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Thời gian & Bộ nhớ' : 'Runtime & Memory'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Thời gian nộp' : 'Submitted'}</th>
                  <th className="py-3.5 px-4 text-right">{isVie ? 'Hành động' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60 font-medium">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      {isVie ? 'Không tìm thấy lượt nộp bài nào phù hợp bộ lọc.' : 'No submissions found matching criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((sub) => {
                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Problem Name */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <button
                            type="button"
                            onClick={() => onOpenIDE(sub.exerciseId)}
                            className="text-left font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-[#00EA64] transition-colors flex items-center gap-1.5 group"
                          >
                            <span>{sub.problemTitle}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </td>

                        {/* Course / Topic */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {sub.topic}
                          </span>
                        </td>

                        {/* Language */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {sub.language}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {sub.status === 'accepted' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/60">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00EA64]" />
                              <span>Accepted</span>
                            </span>
                          ) : sub.status === 'wrong_answer' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              <span>Wrong Answer</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Time Limit</span>
                            </span>
                          )}
                        </td>

                        {/* Score & Test cases */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            {sub.passedTests}/{sub.totalTests} tests
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {sub.score} / 100 pts
                          </div>
                        </td>

                        {/* Runtime & Memory */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-slate-700 dark:text-slate-300">
                            {sub.executionTimeMs} ms
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {sub.memoryMb} MB
                          </div>
                        </td>

                        {/* Submitted Time */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                          {sub.submittedAt}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveCodeModal(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-[#00EA64] text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-[#00EA64] bg-white dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>{isVie ? 'Xem mã nguồn' : 'View Code'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 6. HACKERRANK-STYLE CODE REVIEW MODAL */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#0e1420]/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeCodeModal.problemTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#00EA64]">
                    {activeCodeModal.language}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isVie ? 'Nộp vào lúc:' : 'Submitted at:'} {activeCodeModal.submittedAt} •{' '}
                  {activeCodeModal.executionTimeMs}ms • {activeCodeModal.memoryMb}MB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission Status Banner */}
            <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-[#0b0f17] border-b border-slate-200 dark:border-gray-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  {isVie ? 'Kết quả kiểm thử:' : 'Test Results:'}
                </span>
                <span
                  className={`font-bold ${
                    activeCodeModal.status === 'accepted'
                      ? 'text-emerald-600 dark:text-[#00EA64]'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {activeCodeModal.passedTests}/{activeCodeModal.totalTests} tests ({activeCodeModal.score} pts)
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(activeCodeModal.code)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-[#00EA64] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isVie ? 'Đã sao chép!' : 'Copied!') : isVie ? 'Sao chép code' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Source Code Container */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed select-text">
              <pre className="overflow-x-auto whitespace-pre">
                <code>{activeCodeModal.code}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#0e1420]/70">
              <span className="text-xs text-slate-500 font-medium">
                {isVie ? 'Mã nguồn đã qua kiểm thử Sandbox' : 'Sandbox validated code'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCodeModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isVie ? 'Đóng' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const exId = activeCodeModal.exerciseId;
                    setActiveCodeModal(null);
                    onOpenIDE(exId);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1BA94C] hover:bg-[#168a3e] text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{isVie ? 'Luyện tập lại trên IDE' : 'Practice in IDE'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
