import { Exercise } from '../types/exercise';

export const COMPREHENSIVE_EXERCISES: Exercise[] = [
  // ================= 1. PYTHON TRACK (12 bài) =================
  {
    id: 1,
    subjectId: 101,
    title: 'Tìm số nguyên tố trong mảng',
    titleEn: 'Find Prime Numbers in Array',
    difficulty: 'easy',
    category: 'Mảng & Số học',
    categoryEn: 'Arrays & Math',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho một danh sách các số nguyên \`arr\`. Hãy viết hàm \`find_primes(arr)\` để tìm và trả về một danh sách mới chứa tất cả các số nguyên tố có trong \`arr\`, giữ nguyên thứ tự xuất hiện ban đầu.
Một số nguyên dương $n > 1$ là số nguyên tố nếu chỉ có đúng 2 ước số dương là 1 và chính nó.`,
    inputFormat: 'Mảng số nguyên `arr` (ví dụ: `[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]`)',
    outputFormat: 'Danh sách các số nguyên tố tìm được (ví dụ: `[2, 3, 5, 7, 11]`)',
    constraints: ['0 <= len(arr) <= 10^4', '-10^5 <= arr[i] <= 10^5'],
    boilerplateCode: `def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def find_primes(arr: list[int]) -> list[int]:
    return [x for x in arr if is_prime(x)]
`,
    sampleTestCases: [
      { id: 1, input: '[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]', expectedOutput: '[2, 3, 5, 7, 11]', explanation: 'Các số nguyên tố gồm 2, 3, 5, 7, 11.' },
      { id: 2, input: '[4, 6, 8, 9, 10]', expectedOutput: '[]', explanation: 'Không có số nguyên tố.' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['python', 'algorithms', 'mathematics']
  },
  {
    id: 2,
    subjectId: 101,
    title: 'Kiểm tra tính hợp lệ của chuỗi ngoặc',
    titleEn: 'Valid Parentheses Check',
    difficulty: 'medium',
    category: 'Ngăn xếp (Stack)',
    categoryEn: 'Stack',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho một chuỗi ký tự \`s\` chỉ bao gồm các ký tự mở và đóng ngoặc: \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\`, \`']'\`.
Hãy viết hàm \`is_valid_parentheses(s: str) -> bool\` để xác định xem chuỗi đầu vào có hợp lệ hay không theo thứ tự đóng mở LIFO.`,
    inputFormat: 'Chuỗi ký tự `s` gồm các dấu ngoặc',
    outputFormat: 'Giá trị boolean `True` hoặc `False`',
    constraints: ['1 <= len(s) <= 10^4'],
    boilerplateCode: `def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0
`,
    sampleTestCases: [
      { id: 1, input: '"()[]{}"', expectedOutput: 'True', explanation: 'Các cặp ngoặc đóng mở hợp lệ.' },
      { id: 2, input: '"(]"', expectedOutput: 'False', explanation: 'Ngoặc tròn không khớp với ngoặc vuông.' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 120,
    trackIds: ['python', 'data-structures', 'algorithms']
  },
  {
    id: 3,
    subjectId: 101,
    title: 'Tìm hai số có tổng bằng Target (Two Sum)',
    titleEn: 'Two Sum Problem',
    difficulty: 'easy',
    category: 'Mảng & Bảng băm',
    categoryEn: 'Arrays & Hash Table',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho mảng số nguyên \`nums\` và số nguyên \`target\`. Trả về chỉ số của 2 số sao cho tổng của chúng bằng \`target\`. Độ phức tạp yêu cầu là $O(n)$ sử dụng Dictionary.`,
    inputFormat: '`nums = [2, 7, 11, 15]`, `target = 9`',
    outputFormat: '`[0, 1]`',
    constraints: ['2 <= len(nums) <= 10^4'],
    boilerplateCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`,
    sampleTestCases: [
      { id: 1, input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 100,
    trackIds: ['python', 'algorithms', 'data-structures']
  },
  {
    id: 4,
    subjectId: 101,
    title: 'Đảo ngược từng từ trong câu',
    titleEn: 'Reverse Words in a Sentence',
    difficulty: 'easy',
    category: 'Xử lý chuỗi (String)',
    categoryEn: 'String Manipulation',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho chuỗi văn bản \`s\`. Đảo ngược thứ tự các từ trong câu, loại bỏ các khoảng trắng thừa ở đầu, cuối và giữa các từ.`,
    inputFormat: '`s = "  the sky  is  blue  "`',
    outputFormat: '`"blue is sky the"`',
    constraints: ['1 <= len(s) <= 10^4'],
    boilerplateCode: `def reverse_words(s: str) -> str:
    words = s.strip().split()
    return " ".join(reversed(words))
`,
    sampleTestCases: [
      { id: 1, input: '"the sky is blue"', expectedOutput: '"blue is sky the"', explanation: 'Đảo ngược từ' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 80,
    trackIds: ['python']
  },
  {
    id: 5,
    subjectId: 101,
    title: 'Kiểm tra chuỗi đối xứng (Palindrome)',
    titleEn: 'Valid Palindrome Check',
    difficulty: 'easy',
    category: 'Hai con trỏ (Two Pointers)',
    categoryEn: 'Two Pointers',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Kiểm tra một chuỗi có phải Palindrome không, chỉ xét các ký tự chữ và số, không phân biệt chữ hoa chữ thường.`,
    inputFormat: '`"A man, a plan, a canal: Panama"`',
    outputFormat: '`True`',
    constraints: ['1 <= len(s) <= 2 * 10^5'],
    boilerplateCode: `def is_palindrome(s: str) -> bool:
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]
`,
    sampleTestCases: [
      { id: 1, input: '"race a car"', expectedOutput: 'False', explanation: 'Không đối xứng' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 90,
    trackIds: ['python', 'algorithms']
  },
  {
    id: 6,
    subjectId: 101,
    title: 'Nhóm các từ Anagrams',
    titleEn: 'Group Anagrams',
    difficulty: 'medium',
    category: 'Hash Map & String',
    categoryEn: 'Hash Map & String',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho danh sách các từ \`strs\`. Hãy gom nhóm các từ Anagrams (từ tạo thành từ cùng một bộ chữ cái) lại với nhau.`,
    inputFormat: '`["eat","tea","tan","ate","nat","bat"]`',
    outputFormat: '`[["bat"],["nat","tan"],["ate","eat","tea"]]`',
    constraints: ['1 <= len(strs) <= 10^4'],
    boilerplateCode: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())
`,
    sampleTestCases: [
      { id: 1, input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '3 groups', explanation: 'Nhóm theo bộ ký tự sắp xếp' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['python', 'data-structures']
  },
  {
    id: 7,
    subjectId: 101,
    title: 'Tìm chuỗi con không lặp dài nhất',
    titleEn: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    category: 'Cửa sổ trượt (Sliding Window)',
    categoryEn: 'Sliding Window',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho chuỗi \`s\`, tìm độ dài của chuỗi con dài nhất không chứa bất kỳ ký tự nào lặp lại.`,
    inputFormat: '`"abcabcbb"`',
    outputFormat: '`3` ("abc")',
    constraints: ['0 <= len(s) <= 5 * 10^4'],
    boilerplateCode: `def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, c in enumerate(s):
        if c in char_map and char_map[c] >= left:
            left = char_map[c] + 1
        char_map[c] = right
        max_len = max(max_len, right - left + 1)
    return max_len
`,
    sampleTestCases: [
      { id: 1, input: '"pwwkew"', expectedOutput: '3', explanation: 'Chuỗi con "wke" có độ dài 3' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 140,
    trackIds: ['python', 'algorithms']
  },
  {
    id: 8,
    subjectId: 101,
    title: 'Thiết kế Lớp Tài Khoản Ngân Hàng (OOP)',
    titleEn: 'Bank Account Class Design (OOP)',
    difficulty: 'easy',
    category: 'Hướng đối tượng (OOP)',
    categoryEn: 'Object-Oriented Programming (OOP)',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Xây dựng lớp \`BankAccount\` có các phương thức: nạp tiền \`deposit(amount)\`, rút tiền \`withdraw(amount)\`, và kiểm tra số dư \`get_balance()\`. Không cho phép số dư âm.`,
    inputFormat: 'Khởi tạo tài khoản với số dư ban đầu',
    outputFormat: 'Số dư sau các thao tác',
    constraints: ['amount > 0'],
    boilerplateCode: `class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        self.owner = owner
        self._balance = max(0.0, initial_balance)

    def deposit(self, amount: float) -> bool:
        if amount > 0:
            self._balance += amount
            return True
        return False

    def withdraw(self, amount: float) -> bool:
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False

    def get_balance(self) -> float:
        return self._balance
`,
    sampleTestCases: [
      { id: 1, input: 'deposit(100), withdraw(40)', expectedOutput: '60.0', explanation: '100 - 40 = 60' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 100,
    trackIds: ['python']
  },
  {
    id: 9,
    subjectId: 101,
    title: 'Tính số Fibonacci thứ N với Memoization',
    titleEn: 'N-th Fibonacci with Memoization',
    difficulty: 'easy',
    category: 'Quy hoạch động (DP)',
    categoryEn: 'Dynamic Programming (DP)',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Tính số Fibonacci thứ $n$ với $F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)$. Tối ưu thời gian $O(n)$ bằng memoization hoặc lặp.`,
    inputFormat: '`n = 10`',
    outputFormat: '`55`',
    constraints: ['0 <= n <= 50'],
    boilerplateCode: `def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
`,
    sampleTestCases: [
      { id: 1, input: 'n = 10', expectedOutput: '55', explanation: 'F(10) = 55' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 100,
    trackIds: ['python', 'algorithms', 'mathematics']
  },
  {
    id: 10,
    subjectId: 101,
    title: 'Bài toán Đổi Tiền Xu (Coin Change)',
    titleEn: 'Coin Change Problem',
    difficulty: 'hard',
    category: 'Quy hoạch động (DP)',
    categoryEn: 'Dynamic Programming (DP)',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho mảng mệnh giá tiền \`coins\` và số tiền \`amount\`. Tìm số đồng xu ít nhất để đổi được số tiền đó. Nếu không thể đổi, trả về -1.`,
    inputFormat: '`coins = [1, 2, 5]`, `amount = 11`',
    outputFormat: '`3` (5 + 5 + 1)',
    constraints: ['1 <= len(coins) <= 12', '0 <= amount <= 10^4'],
    boilerplateCode: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
`,
    sampleTestCases: [
      { id: 1, input: 'coins = [1,2,5], amount = 11', expectedOutput: '3', explanation: '5+5+1' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 180,
    trackIds: ['python', 'algorithms']
  },

  // ================= 2. C LANGUAGE TRACK (11 bài) =================
  {
    id: 11,
    subjectId: 102,
    title: 'Đảo ngược mảng bằng con trỏ',
    titleEn: 'Reverse Array Using Pointers',
    difficulty: 'easy',
    category: 'Con trỏ (Pointers)',
    categoryEn: 'Pointers',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cho mảng số nguyên gồm $N$ phần tử. Sử dụng kỹ thuật hai con trỏ \`int *left\` và \`int *right\` để hoán đổi và đảo ngược mảng in-place, không cấp phát mảng phụ.`,
    inputFormat: 'Mảng số nguyên `arr` và kích thước `n`',
    outputFormat: 'Mảng sau khi đảo ngược',
    constraints: ['1 <= n <= 10^5'],
    boilerplateCode: `#include <stdio.h>

void reverse_array(int *arr, int n) {
    int *left = arr;
    int *right = arr + n - 1;
    while (left < right) {
        int temp = *left;
        *left = *right;
        *right = temp;
        left++;
        right--;
    }
}
`,
    sampleTestCases: [
      { id: 1, input: 'arr = [1, 2, 3, 4, 5], n = 5', expectedOutput: '[5, 4, 3, 2, 1]', explanation: 'Đảo ngược mảng' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['c', 'data-structures']
  },
  {
    id: 12,
    subjectId: 102,
    title: 'Tìm phần tử lớn nhất và nhỏ nhất',
    titleEn: 'Find Maximum and Minimum Elements',
    difficulty: 'easy',
    category: 'Mảng một chiều',
    categoryEn: '1D Arrays',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Tìm giá trị lớn nhất và nhỏ nhất trong mảng bằng con trỏ truyền qua tham số hàm \`void find_min_max(int *arr, int n, int *min, int *max)\`.`,
    inputFormat: '`arr = [3, 9, 1, 8, 2], n = 5`',
    outputFormat: '`min = 1, max = 9`',
    constraints: ['1 <= n <= 10^5'],
    boilerplateCode: `#include <stdio.h>

void find_min_max(const int *arr, int n, int *min_val, int *max_val) {
    *min_val = arr[0];
    *max_val = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < *min_val) *min_val = arr[i];
        if (arr[i] > *max_val) *max_val = arr[i];
    }
}
`,
    sampleTestCases: [
      { id: 1, input: '[3, 9, 1, 8, 2]', expectedOutput: 'min = 1, max = 9', explanation: 'Phần tử bé nhất 1, lớn nhất 9' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 90,
    trackIds: ['c']
  },
  {
    id: 13,
    subjectId: 102,
    title: 'Đếm số từ trong chuỗi ký tự',
    titleEn: 'Count Words in String',
    difficulty: 'easy',
    category: 'Xâu ký tự (String)',
    categoryEn: 'Strings',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Đếm số từ trong một xâu ký tự chuẩn C (\`char *\`), các từ phân tách nhau bởi một hoặc nhiều dấu cách.`,
    inputFormat: '`"  Khoa CNTT   Truong DHSP Ha Noi "`',
    outputFormat: '`7` từ',
    constraints: ['strlen(str) <= 1000'],
    boilerplateCode: `#include <stdio.h>
#include <ctype.h>

int count_words(const char *str) {
    int count = 0;
    int in_word = 0;
    while (*str) {
        if (!isspace((unsigned char)*str)) {
            if (!in_word) {
                count++;
                in_word = 1;
            }
        } else {
            in_word = 0;
        }
        str++;
    }
    return count;
}
`,
    sampleTestCases: [
      { id: 1, input: '"Hello World"', expectedOutput: '2', explanation: 'Gồm 2 từ' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['c']
  },
  {
    id: 14,
    subjectId: 102,
    title: 'Quản lý sinh viên với Struct',
    titleEn: 'Student Management with Struct',
    difficulty: 'medium',
    category: 'Cấu trúc (Struct)',
    categoryEn: 'Structs',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Định nghĩa cấu trúc \`struct Student\` gồm mã SV, họ tên và điểm GPA. Viết hàm sắp xếp danh sách sinh viên theo điểm GPA giảm dần.`,
    inputFormat: 'Mảng sinh viên',
    outputFormat: 'Danh sách sau sắp xếp',
    constraints: ['1 <= n <= 500'],
    boilerplateCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char id[15];
    char name[50];
    float gpa;
} Student;

void sort_students(Student *list, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (list[j].gpa > list[i].gpa) {
                Student tmp = list[i];
                list[i] = list[j];
                list[j] = tmp;
            }
        }
    }
}
`,
    sampleTestCases: [
      { id: 1, input: '3 students', expectedOutput: 'Sorted by GPA desc', explanation: 'Thứ tự điểm cao đứng trước' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 120,
    trackIds: ['c', 'data-structures']
  },
  {
    id: 15,
    subjectId: 102,
    title: 'Cấp phát động & Quản lý bộ nhớ Malloc',
    titleEn: 'Dynamic Memory Allocation with Malloc',
    difficulty: 'medium',
    category: 'Cấp phát động (Memory)',
    categoryEn: 'Dynamic Memory Allocation',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cấp phát động một mảng số nguyên $N$ phần tử bằng \`malloc\`, nhập giá trị, tính trung bình cộng, sau đó giải phóng bộ nhớ bằng \`free\`, tránh memory leak.`,
    inputFormat: '`n = 5`, các giá trị mảng',
    outputFormat: 'Giá trị trung bình cộng',
    constraints: ['1 <= n <= 10^5'],
    boilerplateCode: `#include <stdio.h>
#include <stdlib.h>

double compute_dynamic_average(int n) {
    int *arr = (int *)malloc(n * sizeof(int));
    if (!arr) return 0.0;
    
    long long sum = 0;
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 2;
        sum += arr[i];
    }
    
    double avg = (double)sum / n;
    free(arr); // Quan trọng: Giải phóng bộ nhớ
    return avg;
}
`,
    sampleTestCases: [
      { id: 1, input: 'n = 5', expectedOutput: '6.0', explanation: '(2+4+6+8+10)/5 = 6.0' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 110,
    trackIds: ['c']
  },
  {
    id: 16,
    subjectId: 102,
    title: 'Đảo ngược danh sách liên kết đơn (Linked List)',
    titleEn: 'Reverse Singly Linked List',
    difficulty: 'medium',
    category: 'Danh sách liên kết',
    categoryEn: 'Linked Lists',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cho con trỏ \`head\` trỏ tới đầu danh sách liên kết đơn. Viết hàm đảo ngược toàn bộ liên kết và trả về \`head\` mới.`,
    inputFormat: '`1 -> 2 -> 3 -> 4 -> 5`',
    outputFormat: '`5 -> 4 -> 3 -> 2 -> 1`',
    constraints: ['Số node từ 0 đến 5000'],
    boilerplateCode: `#include <stdio.h>

struct ListNode {
    int val;
    struct ListNode *next;
};

struct ListNode* reverseList(struct ListNode* head) {
    struct ListNode *prev = NULL;
    struct ListNode *curr = head;
    while (curr != NULL) {
        struct ListNode *nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}
`,
    sampleTestCases: [
      { id: 1, input: '1->2->3', expectedOutput: '3->2->1', explanation: 'Đảo ngược liên kết' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['c', 'data-structures']
  },
  {
    id: 17,
    subjectId: 102,
    title: 'Tìm kiếm nhị phân (Binary Search)',
    titleEn: 'Binary Search Implementation',
    difficulty: 'easy',
    category: 'Giải thuật tìm kiếm',
    categoryEn: 'Search Algorithms',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cài đặt thuật toán Binary Search trên mảng số nguyên đã sắp xếp tăng dần trong $O(\\log n)$. Trả về chỉ số phần tử hoặc -1 nếu không tìm thấy.`,
    inputFormat: '`arr = [2, 5, 8, 12, 16], target = 8`',
    outputFormat: '`2` (vị trí index 2)',
    constraints: ['1 <= n <= 10^5'],
    boilerplateCode: `#include <stdio.h>

int binary_search(const int *arr, int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
`,
    sampleTestCases: [
      { id: 1, input: '[2, 5, 8, 12, 16], target = 8', expectedOutput: '2', explanation: 'Phần tử 8 tại index 2' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['c', 'algorithms']
  },
  {
    id: 18,
    subjectId: 102,
    title: 'Nhân hai ma trận vuông',
    titleEn: 'Square Matrix Multiplication',
    difficulty: 'medium',
    category: 'Mảng hai chiều',
    categoryEn: '2D Arrays',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Thực hiện phép nhân hai ma trận vuông cấp $N \\times N$: $C = A \\times B$ với $c_{ij} = \\sum_{k=1}^N a_{ik} b_{kj}$.`,
    inputFormat: 'Hai ma trận vuông kích thước $N \\times N$',
    outputFormat: 'Ma trận tích',
    constraints: ['1 <= N <= 100'],
    boilerplateCode: `#include <stdio.h>

void matrix_multiply(int n, const int A[n][n], const int B[n][n], int C[n][n]) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = 0;
            for (int k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}
`,
    sampleTestCases: [
      { id: 1, input: 'N = 2, A = [[1,2],[3,4]], B = [[2,0],[1,2]]', expectedOutput: '[[4,4],[10,8]]', explanation: 'Tích ma trận' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 120,
    trackIds: ['c', 'mathematics']
  },
  {
    id: 19,
    subjectId: 102,
    title: 'Thao tác Bitwise - Đếm số bit 1 (Hamming Weight)',
    titleEn: 'Bitwise Operations - Number of 1 Bits (Hamming Weight)',
    difficulty: 'easy',
    category: 'Bit Manipulation',
    categoryEn: 'Bit Manipulation',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cho số nguyên không âm $n$. Đếm số lượng bit 1 trong biểu diễn nhị phân của $n$ bằng thuật toán Brian Kernighan ($n \\ \\& \\ (n - 1)$).`,
    inputFormat: '`n = 11` (nhị phân: `1011`)',
    outputFormat: '`3`',
    constraints: ['0 <= n <= 2^31 - 1'],
    boilerplateCode: `#include <stdio.h>

int count_set_bits(unsigned int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1); // Xóa bit 1 thấp nhất
        count++;
    }
    return count;
}
`,
    sampleTestCases: [
      { id: 1, input: '11', expectedOutput: '3', explanation: '1011 có 3 bit 1' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 90,
    trackIds: ['c', 'mathematics']
  },
  {
    id: 20,
    subjectId: 102,
    title: 'Thuật toán Sắp xếp Nhanh (QuickSort)',
    titleEn: 'QuickSort Algorithm Implementation',
    difficulty: 'hard',
    category: 'Chia để trị (Divide and Conquer)',
    categoryEn: 'Divide and Conquer',
    language: 'c',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cài đặt giải thuật QuickSort phân hoạch Lomuto để sắp xếp mảng tăng dần trong thời gian trung bình $O(n \\log n)$.`,
    inputFormat: '`arr = [10, 7, 8, 9, 1, 5]`',
    outputFormat: '`[1, 5, 7, 8, 9, 10]`',
    constraints: ['1 <= n <= 10^5'],
    boilerplateCode: `#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}

int partition(int *arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quick_sort(int *arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}
`,
    sampleTestCases: [
      { id: 1, input: '[10, 7, 8, 9, 1, 5]', expectedOutput: '[1, 5, 7, 8, 9, 10]', explanation: 'Mảng đã sắp xếp' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 160,
    trackIds: ['c', 'algorithms']
  },

  // ================= 3. C++ TRACK (11 bài) =================
  {
    id: 21,
    subjectId: 103,
    title: 'Khử phần tử trùng lặp với std::set',
    titleEn: 'Remove Duplicates with std::set',
    difficulty: 'easy',
    category: 'STL Containers',
    categoryEn: 'STL Containers',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Sử dụng \`std::set\` trong thư viện C++ STL để loại bỏ tất cả các phần tử trùng lặp và sắp xếp theo thứ tự tăng dần.`,
    inputFormat: '`vector<int> {5, 2, 8, 2, 5, 1}`',
    outputFormat: '`vector<int> {1, 2, 5, 8}`',
    constraints: ['1 <= nums.size() <= 10^5'],
    boilerplateCode: `#include <iostream>
#include <vector>
#include <set>

std::vector<int> remove_duplicates(const std::vector<int>& nums) {
    std::set<int> unique_elements(nums.begin(), nums.end());
    return std::vector<int>(unique_elements.begin(), unique_elements.end());
}
`,
    sampleTestCases: [
      { id: 1, input: '[5, 2, 8, 2, 5, 1]', expectedOutput: '[1, 2, 5, 8]', explanation: 'Loại bỏ trùng lặp' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 100,
    trackIds: ['cpp', 'data-structures']
  },
  {
    id: 22,
    subjectId: 103,
    title: 'Xây dựng Lớp Phân Số (Fraction Class)',
    titleEn: 'Fraction Class Design',
    difficulty: 'easy',
    category: 'Lập trình Hướng đối tượng OOP',
    categoryEn: 'Object-Oriented Programming (OOP)',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Thiết kế lớp \`Fraction\` có tử số và mẫu số. Tối giản phân số bằng thuật toán tìm ước chung lớn nhất (std::gcd). Nạp chồng toán tử cộng \`operator+\`.`,
    inputFormat: 'Hai phân số 1/2 và 1/3',
    outputFormat: 'Phân số tối giản 5/6',
    constraints: ['Mẫu số khác 0'],
    boilerplateCode: `#include <iostream>
#include <numeric>

class Fraction {
public:
    int num, den;
    Fraction(int n = 0, int d = 1) : num(n), den(d) { simplify(); }
    void simplify() {
        int g = std::gcd(num, den);
        num /= g;
        den /= g;
    }
    Fraction operator+(const Fraction& other) const {
        return Fraction(num * other.den + other.num * den, den * other.den);
    }
};
`,
    sampleTestCases: [
      { id: 1, input: '1/2 + 1/3', expectedOutput: '5/6', explanation: '3/6 + 2/6 = 5/6' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 100,
    trackIds: ['cpp']
  },
  {
    id: 23,
    subjectId: 103,
    title: 'Duyệt đồ thị theo chiều rộng (BFS)',
    titleEn: 'Breadth-First Search (BFS) Traversal',
    difficulty: 'medium',
    category: 'Đồ thị (Graphs)',
    categoryEn: 'Graphs',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho đồ thị vô hướng gồm $V$ đỉnh và danh sách kề. Xuất thứ tự các đỉnh được thăm theo thuật toán Breadth-First Search (BFS) bắt đầu từ đỉnh nguồn 0.`,
    inputFormat: 'Danh sách kề đồ thị',
    outputFormat: 'Thứ tự duyệt BFS',
    constraints: ['1 <= V <= 10^4'],
    boilerplateCode: `#include <vector>
#include <queue>

std::vector<int> bfsOfGraph(int V, std::vector<std::vector<int>>& adj) {
    std::vector<bool> visited(V, false);
    std::vector<int> result;
    std::queue<int> q;

    visited[0] = true;
    q.push(0);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    return result;
}
`,
    sampleTestCases: [
      { id: 1, input: 'V = 5, edges: (0,1), (0,2), (0,3), (2,4)', expectedOutput: '[0, 1, 2, 3, 4]', explanation: 'BFS từ đỉnh 0' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 140,
    trackIds: ['cpp', 'algorithms']
  },
  {
    id: 24,
    subjectId: 103,
    title: 'Tìm đường đi ngắn nhất Dijkstra',
    titleEn: 'Dijkstra Shortest Path Algorithm',
    difficulty: 'hard',
    category: 'Đồ thị có trọng số',
    categoryEn: 'Weighted Graphs',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cài đặt thuật toán Dijkstra tìm khoảng cách ngắn nhất từ đỉnh 0 tới mọi đỉnh trên đồ thị có trọng số không âm bằng \`std::priority_queue\`.`,
    inputFormat: 'Số đỉnh $V$ và danh sách kề có trọng số',
    outputFormat: 'Mảng khoảng cách ngắn nhất',
    constraints: ['1 <= V <= 10^5, trọng số w >= 0'],
    boilerplateCode: `#include <vector>
#include <queue>

std::vector<int> dijkstra(int V, std::vector<std::vector<std::pair<int, int>>>& adj, int S) {
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<std::pair<int, int>>> pq;
    std::vector<int> dist(V, 1e9);

    dist[S] = 0;
    pq.push({0, S});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        for (auto [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
`,
    sampleTestCases: [
      { id: 1, input: 'V = 3, S = 0', expectedOutput: 'Distances from 0', explanation: 'Dijkstra shortest path' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 180,
    trackIds: ['cpp', 'algorithms']
  },
  {
    id: 25,
    subjectId: 103,
    title: 'Con trỏ thông minh (std::unique_ptr)',
    titleEn: 'Smart Pointers (std::unique_ptr)',
    difficulty: 'medium',
    category: 'Modern C++17/20',
    categoryEn: 'Modern C++17/20',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Quản lý vòng đời tài nguyên tự động RAII với \`std::unique_ptr\`. Tránh leak bộ nhớ khi ngoại lệ phát sinh.`,
    inputFormat: 'Thao tác tạo và chuyển nhượng quyền sở hữu qua `std::move`',
    outputFormat: 'Bộ nhớ giải phóng tự động khi rời khỏi scope',
    constraints: ['C++14 trở lên'],
    boilerplateCode: `#include <iostream>
#include <memory>

class Resource {
public:
    int id;
    Resource(int val) : id(val) {}
};

std::unique_ptr<Resource> create_resource(int id) {
    return std::make_unique<Resource>(id);
}
`,
    sampleTestCases: [
      { id: 1, input: 'create(42)', expectedOutput: 'ID: 42', explanation: 'RAII tự động dọn dẹp' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 110,
    trackIds: ['cpp']
  },

  // ================= 4. JAVA TRACK (11 bài) =================
  {
    id: 26,
    subjectId: 104,
    title: 'Lọc danh sách bằng Java Stream API',
    titleEn: 'Filter List with Java Stream API',
    difficulty: 'easy',
    category: 'Java Collections & Streams',
    categoryEn: 'Java Collections & Streams',
    language: 'java',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    description: `Cho một danh sách các chuỗi \`List<String> words\`. Sử dụng Stream API để lọc các từ bắt đầu bằng chữ 'A' và độ dài lớn hơn 3, sau đó chuyển thành chữ hoa.`,
    inputFormat: '`["Apple", "Banana", "Ant", "Avocado", "Cat"]`',
    outputFormat: '`["APPLE", "AVOCADO"]`',
    constraints: ['Java 8+'],
    boilerplateCode: `import java.util.List;
import java.util.stream.Collectors;

public class Solution {
    public static List<String> filterWords(List<String> words) {
        return words.stream()
            .filter(w -> w.startsWith("A") && w.length() > 3)
            .map(String::toUpperCase)
            .collect(Collectors.toList());
    }
}
`,
    sampleTestCases: [
      { id: 1, input: '["Apple", "Ant", "Avocado"]', expectedOutput: '["APPLE", "AVOCADO"]', explanation: 'Lọc từ > 3 ký tự' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['java']
  },
  {
    id: 27,
    subjectId: 104,
    title: 'Thiết kế Mẫu Singleton Thread-Safe',
    titleEn: 'Thread-Safe Singleton Pattern Design',
    difficulty: 'medium',
    category: 'Design Patterns',
    categoryEn: 'Design Patterns',
    language: 'java',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    description: `Cài đặt mẫu thiết kế Singleton an toàn trong môi trường đa luồng (Double-Checked Locking with volatile).`,
    inputFormat: 'Gọi `ConfigurationManager.getInstance()` từ nhiều luồng',
    outputFormat: 'Duy nhất một thể hiện được tạo',
    constraints: ['Multi-threaded safe'],
    boilerplateCode: `public class ConfigurationManager {
    private static volatile ConfigurationManager instance;

    private ConfigurationManager() {
        // Khởi tạo tài nguyên
    }

    public static ConfigurationManager getInstance() {
        if (instance == null) {
            synchronized (ConfigurationManager.class) {
                if (instance == null) {
                    instance = new ConfigurationManager();
                }
            }
        }
        return instance;
    }
}
`,
    sampleTestCases: [
      { id: 1, input: 'Multi-thread call', expectedOutput: 'Same instance reference', explanation: 'Chỉ 1 object duy nhất' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 120,
    trackIds: ['java']
  },
  {
    id: 28,
    subjectId: 104,
    title: 'Duyệt cây nhị phân In-order Traversal',
    titleEn: 'Binary Tree In-order Traversal',
    difficulty: 'medium',
    category: 'Cây nhị phân (Binary Tree)',
    categoryEn: 'Binary Tree',
    language: 'java',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    description: `Cho gốc cây nhị phân \`TreeNode root\`. Trả về danh sách giá trị các đỉnh theo thứ tự duyệt In-order (Left -> Root -> Right).`,
    inputFormat: '`[1, null, 2, 3]`',
    outputFormat: '`[1, 3, 2]`',
    constraints: ['0 <= nodes <= 100'],
    boilerplateCode: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        helper(root, res);
        return res;
    }
    private void helper(TreeNode node, List<Integer> res) {
        if (node == null) return;
        helper(node.left, res);
        res.add(node.val);
        helper(node.right, res);
    }
}
`,
    sampleTestCases: [
      { id: 1, input: '[1,null,2,3]', expectedOutput: '[1,3,2]', explanation: 'Thứ tự In-order' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['java', 'data-structures']
  },

  // ================= 5. SQL & DATABASES TRACK (11 bài) =================
  {
    id: 29,
    subjectId: 105,
    title: 'Tìm sinh viên có điểm GPA cao nhất',
    titleEn: 'Find Student with Highest GPA',
    difficulty: 'easy',
    category: 'Truy vấn cơ bản',
    categoryEn: 'Basic Queries',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cho bảng \`Students\` gồm \`(id, name, class_id, gpa)\`. Hãy viết câu truy vấn SQL tìm sinh viên có điểm GPA cao nhất trong toàn trường.`,
    inputFormat: 'Bảng `Students`',
    outputFormat: 'Bản ghi có `MAX(gpa)`',
    constraints: ['Có ít nhất 1 sinh viên'],
    boilerplateCode: `SELECT id, name, gpa
FROM Students
WHERE gpa = (SELECT MAX(gpa) FROM Students);
`,
    sampleTestCases: [
      { id: 1, input: 'Table Students with GPAs [3.2, 3.8, 4.0]', expectedOutput: 'Student with 4.0', explanation: 'Lấy sinh viên GPA 4.0' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 100,
    trackIds: ['sql']
  },
  {
    id: 30,
    subjectId: 105,
    title: 'Thống kê số lượng sinh viên theo từng lớp',
    titleEn: 'Count Students per Class Group',
    difficulty: 'easy',
    category: 'Phép nhóm (GROUP BY & JOIN)',
    categoryEn: 'GROUP BY & JOIN',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cho 2 bảng \`Classes\` (\`class_id, class_name\`) và \`Students\` (\`id, name, class_id\`). Viết câu lệnh kết hợp \`LEFT JOIN\` và \`GROUP BY\` để đếm số sinh viên của từng lớp (lớp chưa có sinh viên hiển thị 0).`,
    inputFormat: 'Bảng `Classes` và `Students`',
    outputFormat: '`class_name`, `student_count`',
    constraints: ['Không dùng subquery chậm'],
    boilerplateCode: `SELECT c.class_name, COUNT(s.id) AS student_count
FROM Classes c
LEFT JOIN Students s ON c.class_id = s.class_id
GROUP BY c.class_id, c.class_name
ORDER BY student_count DESC;
`,
    sampleTestCases: [
      { id: 1, input: 'Classes K72A, K72B', expectedOutput: 'K72A: 35, K72B: 32', explanation: 'Thống kê sinh viên' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 110,
    trackIds: ['sql']
  },
  {
    id: 31,
    subjectId: 105,
    title: 'Xếp hạng sinh viên với DENSE_RANK()',
    titleEn: 'Rank Students with DENSE_RANK()',
    difficulty: 'medium',
    category: 'Window Functions',
    categoryEn: 'Window Functions',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Sử dụng hàm cửa sổ \`DENSE_RANK() OVER (ORDER BY gpa DESC)\` để tính thứ hạng học tập của sinh viên. Các sinh viên bằng điểm nhau nhận cùng thứ hạng, không để bị cách quãng.`,
    inputFormat: 'Bảng `Students`',
    outputFormat: '`id, name, gpa, rank_score`',
    constraints: ['Hỗ trợ PostgreSQL/MySQL 8'],
    boilerplateCode: `SELECT id, name, gpa,
       DENSE_RANK() OVER (ORDER BY gpa DESC) AS rank_score
FROM Students;
`,
    sampleTestCases: [
      { id: 1, input: 'GPAs: 4.0, 4.0, 3.8', expectedOutput: 'Ranks: 1, 1, 2', explanation: 'DENSE_RANK không nhảy số' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 140,
    trackIds: ['sql']
  },

  // ================= 7. MATHEMATICS TRACK (10 bài) =================
  {
    id: 34,
    subjectId: 107,
    title: 'Tìm Ước chung lớn nhất (GCD) bằng Euclid',
    titleEn: 'Find Greatest Common Divisor (GCD) using Euclidean Algorithm',
    difficulty: 'easy',
    category: 'Lý thuyết số',
    categoryEn: 'Number Theory',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho hai số nguyên dương $a$ và $b$. Hãy viết hàm \`gcd(a, b)\` tìm ước số chung lớn nhất bằng thuật toán Euclid chia dư trong thời gian $O(\\log(\\min(a, b)))$.`,
    inputFormat: '`a = 48, b = 18`',
    outputFormat: '`6`',
    constraints: ['1 <= a, b <= 10^12'],
    boilerplateCode: `def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a
`,
    sampleTestCases: [
      { id: 1, input: '48, 18', expectedOutput: '6', explanation: 'GCD(48, 18) = 6' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['mathematics', 'algorithms', 'python']
  },
  {
    id: 35,
    subjectId: 107,
    title: 'Lũy thừa nhị phân tính (a^b) mod M',
    titleEn: 'Binary Exponentiation (a^b) mod M',
    difficulty: 'medium',
    category: 'Số học mô-đun',
    categoryEn: 'Modular Arithmetic',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Tính giá trị $(a^b) \\pmod M$ với $b \\le 10^{18}$ bằng phương pháp nhân bình phương liên tiếp (Binary Exponentiation) trong $O(\\log b)$.`,
    inputFormat: '`a = 2, b = 10, M = 1000`',
    outputFormat: '`24` (2^10 = 1024 % 1000 = 24)',
    constraints: ['1 <= a, M <= 10^9', '0 <= b <= 10^18'],
    boilerplateCode: `def power_mod(a: int, b: int, m: int) -> int:
    res = 1
    a %= m
    while b > 0:
        if b % 2 == 1:
            res = (res * a) % m
        a = (a * a) % m
        b //= 2
    return res
`,
    sampleTestCases: [
      { id: 1, input: 'a = 2, b = 10, M = 1000', expectedOutput: '24', explanation: '1024 % 1000 = 24' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 130,
    trackIds: ['mathematics', 'algorithms']
  },

  // ================= 8. AI & MACHINE LEARNING TRACK (10 bài) =================
  {
    id: 36,
    subjectId: 108,
    title: 'Tính độ tương đồng Cosine (Cosine Similarity)',
    titleEn: 'Cosine Similarity Calculation',
    difficulty: 'easy',
    category: 'Vector Space & NLP',
    categoryEn: 'Vector Space & NLP',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cho hai vector đặc trưng số học $A$ và $B$. Tính độ tương đồng góc Cosine giữa hai vector: $\\text{sim}(A, B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$.`,
    inputFormat: '`A = [1, 2, 3]`, `B = [2, 4, 6]`',
    outputFormat: '`1.0` (hai vector cùng hướng)',
    constraints: ['len(A) == len(B) <= 1000'],
    boilerplateCode: `import math

def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot_product = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)
`,
    sampleTestCases: [
      { id: 1, input: 'A = [1, 0], B = [0, 1]', expectedOutput: '0.0', explanation: 'Hai vector vuông góc' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['ai', 'mathematics', 'python']
  },
  {
    id: 37,
    subjectId: 108,
    title: 'Thuật toán K-Nearest Neighbors (KNN)',
    titleEn: 'K-Nearest Neighbors (KNN) Algorithm',
    difficulty: 'medium',
    category: 'Supervised Learning',
    categoryEn: 'Supervised Learning',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Cài đặt giải thuật KNN dự đoán nhãn cho điểm dữ liệu mới dựa trên $k$ điểm lân cận có khoảng cách Euclidean nhỏ nhất.`,
    inputFormat: 'Điểm query, tập dữ liệu huấn luyện và giá trị $k$',
    outputFormat: 'Nhãn chiếm đa số (Majority vote)',
    constraints: ['k là số lẻ'],
    boilerplateCode: `import math
from collections import Counter

def knn_classify(train_points, query_point, k):
    distances = []
    for x, y, label in train_points:
        dist = math.sqrt((x - query_point[0])**2 + (y - query_point[1])**2)
        distances.append((dist, label))
    distances.sort(key=lambda item: item[0])
    k_labels = [label for _, label in distances[:k]]
    return Counter(k_labels).most_common(1)[0][0]
`,
    sampleTestCases: [
      { id: 1, input: 'k = 3 with simple 2D clusters', expectedOutput: 'Predicted label', explanation: 'Bỏ phiếu đa số' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 150,
    trackIds: ['ai', 'algorithms']
  },

  
  // ================= 7. DATA STRUCTURES EXPANSIONS (Thêm 4 bài -> Đạt 12 bài) =================
  {
    id: 41,
    subjectId: 102,
    title: 'Hàng đợi hai đầu (Deque) - Giá trị lớn nhất trong cửa sổ trượt',
    titleEn: 'Sliding Window Maximum with Deque',
    difficulty: 'hard',
    category: 'Ngăn xếp & Hàng đợi (Deque)',
    categoryEn: 'Stack & Deque',
    language: 'python',
    timeLimitMs: 1500,
    memoryLimitMb: 128,
    description: 'Cho mảng số nguyên nums và số k. Một cửa sổ kích thước k trượt từ trái sang phải. Hãy trả về giá trị lớn nhất trong mỗi cửa sổ trượt trong thời gian O(N) sử dụng Monotonic Deque.',
    inputFormat: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
    outputFormat: '[3, 3, 5, 5, 6, 7]',
    constraints: ['1 <= nums.length <= 10^5', '1 <= k <= nums.length'],
    boilerplateCode: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    q = deque() # lưu chỉ số
    res = []
    for i, n in enumerate(nums):
        while q and nums[q[-1]] < n:
            q.pop()
        q.append(i)
        if q[0] <= i - k:
            q.popleft()
        if i >= k - 1:
            res.append(nums[q[0]])
    return res
`,
    sampleTestCases: [
      { id: 1, input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', expectedOutput: '[3, 3, 5, 5, 6, 7]', explanation: 'Cửa sổ trượt kích thước 3' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 150,
    trackIds: ['data-structures', 'algorithms']
  },
  {
    id: 42,
    subjectId: 102,
    title: 'Hàng đợi ưu tiên (Min-Heap) - Hợp nhất K danh sách liên kết',
    titleEn: 'Merge K Sorted Lists with Min-Heap',
    difficulty: 'hard',
    category: 'Cây & Hàng đợi ưu tiên (Heap)',
    categoryEn: 'Tree & Priority Queue (Heap)',
    language: 'python',
    timeLimitMs: 2000,
    memoryLimitMb: 128,
    description: 'Cho k danh sách liên kết đã sắp xếp theo thứ tự tăng dần. Hãy hợp nhất tất cả thành một danh sách duy nhất bằng hàng đợi ưu tiên Min-Heap với độ phức tạp O(N log k).',
    inputFormat: 'k danh sách con [[1,4,5],[1,3,4],[2,6]]',
    outputFormat: '[1,1,2,3,4,4,5,6]',
    constraints: ['0 <= k <= 10^4', 'Tổng số nút <= 5 * 10^4'],
    boilerplateCode: `import heapq

def merge_k_lists(lists: list[list[int]]) -> list[int]:
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    res = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        res.append(val)
        if elem_idx + 1 < len(lists[list_idx]):
            heapq.heappush(heap, (lists[list_idx][elem_idx + 1], list_idx, elem_idx + 1))
    return res
`,
    sampleTestCases: [
      { id: 1, input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', explanation: 'Hợp nhất 3 mảng' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 150,
    trackIds: ['data-structures', 'algorithms']
  },
  {
    id: 43,
    subjectId: 102,
    title: 'Cây tiền tố (Trie) - Xây dựng hệ thống gợi ý từ khóa',
    titleEn: 'Trie Prefix Tree - Autocomplete Suggestion System',
    difficulty: 'medium',
    category: 'Cây tiền tố (Trie)',
    categoryEn: 'Trie (Prefix Tree)',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Xây dựng cấu trúc cây Trie hỗ trợ các thao tác insert(word), search(word) và startsWith(prefix) phục vụ tính năng autocomplete tìm kiếm nhanh chóng.',
    inputFormat: 'Lệnh insert("apple"), search("app"), startsWith("app")',
    outputFormat: 'False, True',
    constraints: ['Độ dài từ khóa <= 1000', 'Ký tự thường a-z'],
    boilerplateCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True

    def starts_with(self, prefix: str) -> bool:
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return True
`,
    sampleTestCases: [
      { id: 1, input: 'insert "apple", check startsWith "app"', expectedOutput: 'True', explanation: 'Trie tìm kiếm tiền tố' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 120,
    trackIds: ['data-structures', 'algorithms']
  },
  {
    id: 44,
    subjectId: 102,
    title: 'Thiết kế bộ nhớ đệm LRU Cache (Least Recently Used)',
    titleEn: 'LRU Cache Design (Least Recently Used)',
    difficulty: 'medium',
    category: 'Bảng băm & Danh sách kép',
    categoryEn: 'Hash Table & Doubly Linked List',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Thiết kế cấu trúc dữ liệu LRU Cache hỗ trợ thao tác get(key) và put(key, value) trong thời gian O(1) sử dụng kết hợp Hash Map và Doubly Linked List.',
    inputFormat: 'Capacity = 2, put(1, 1), put(2, 2), get(1), put(3, 3), get(2)',
    outputFormat: '1, -1 (key 2 bị đẩy ra)',
    constraints: ['1 <= capacity <= 3000'],
    boilerplateCode: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
`,
    sampleTestCases: [
      { id: 1, input: 'LRUCache(2), put(1,1), put(2,2), get(1)', expectedOutput: '1', explanation: 'Lấy giá trị hợp lệ' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 130,
    trackIds: ['data-structures']
  },

  // ================= 8. MATHEMATICS EXPANSIONS (Thêm 5 bài -> Đạt 12 bài) =================
  {
    id: 45,
    subjectId: 107,
    title: 'Sàng nguyên tố Eratosthenes - Đếm số nguyên tố < N',
    titleEn: 'Sieve of Eratosthenes - Count Primes < N',
    difficulty: 'easy',
    category: 'Lý thuyết số',
    categoryEn: 'Number Theory',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Đếm số lượng số nguyên tố nhỏ hơn số nguyên không âm N cho trước bằng thuật toán sàng nguyên tố Eratosthenes với độ phức tạp O(N log log N).',
    inputFormat: 'n = 20',
    outputFormat: '8 (gồm 2, 3, 5, 7, 11, 13, 17, 19)',
    constraints: ['0 <= n <= 5 * 10^6'],
    boilerplateCode: `def count_primes(n: int) -> int:
    if n <= 2:
        return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n, i):
                is_prime[j] = False
    return sum(is_prime)
`,
    sampleTestCases: [
      { id: 1, input: 'n = 10', expectedOutput: '4', explanation: '2, 3, 5, 7' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 100,
    trackIds: ['mathematics', 'algorithms']
  },
  {
    id: 46,
    subjectId: 107,
    title: 'Tổ hợp chập K của N modulo 10^9+7 (Fermat Little Theorem)',
    titleEn: 'Combinations nCr mod 10^9+7 (Fermat Little Theorem)',
    difficulty: 'medium',
    category: 'Đại số & Tổ hợp',
    categoryEn: 'Algebra & Combinatorics',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Tính giá trị tổ hợp nCk mod (10^9+7) sử dụng nghịch đảo modulo theo định lý nhỏ Fermat: inv(x) = x^(P-2) mod P.',
    inputFormat: 'n = 5, k = 2, mod = 1000000007',
    outputFormat: '10',
    constraints: ['0 <= k <= n <= 10^5'],
    boilerplateCode: `def nCr_mod(n: int, r: int, p: int = 10**9 + 7) -> int:
    if r < 0 or r > n:
        return 0
    fact = [1] * (n + 1)
    for i in range(2, n + 1):
        fact[i] = (fact[i - 1] * i) % p
    num = fact[n]
    den = (fact[r] * fact[n - r]) % p
    return (num * pow(den, p - 2, p)) % p
`,
    sampleTestCases: [
      { id: 1, input: 'n = 10, r = 3', expectedOutput: '120', explanation: '10C3 = 120' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 130,
    trackIds: ['mathematics']
  },
  {
    id: 47,
    subjectId: 107,
    title: 'Phân tích thừa số nguyên tố (Prime Factorization)',
    titleEn: 'Prime Factorization',
    difficulty: 'easy',
    category: 'Số học cơ bản',
    categoryEn: 'Basic Number Theory',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Phân tích số nguyên dương N thành tích các thừa số nguyên tố kèm theo số mũ tương ứng dưới dạng danh sách các cặp (p, e).',
    inputFormat: 'n = 360',
    outputFormat: '[(2, 3), (3, 2), (5, 1)] (2^3 * 3^2 * 5^1)',
    constraints: ['2 <= n <= 10^12'],
    boilerplateCode: `def prime_factorization(n: int) -> list[tuple[int, int]]:
    factors = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            count = 0
            while n % d == 0:
                count += 1
                n //= d
            factors.append((d, count))
        d += 1
    if n > 1:
        factors.append((n, 1))
    return factors
`,
    sampleTestCases: [
      { id: 1, input: 'n = 100', expectedOutput: '[(2, 2), (5, 2)]', explanation: '2^2 * 5^2 = 100' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['mathematics']
  },
  {
    id: 48,
    subjectId: 107,
    title: 'Hình học tính toán - Diện tích đa giác lồi (Shoelace Formula)',
    titleEn: 'Computational Geometry - Convex Polygon Area (Shoelace Formula)',
    difficulty: 'medium',
    category: 'Hình học tính toán',
    categoryEn: 'Computational Geometry',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Cho tọa độ N đỉnh của một đa giác lồi theo thứ tự ngược chiều kim đồng hồ. Tính diện tích của đa giác bằng công thức dây giày Shoelace.',
    inputFormat: 'points = [(0, 0), (4, 0), (4, 3), (0, 3)]',
    outputFormat: '12.0',
    constraints: ['3 <= N <= 10^4', '-10^4 <= x, y <= 10^4'],
    boilerplateCode: `def polygon_area(points: list[tuple[float, float]]) -> float:
    n = len(points)
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]
    return abs(area) / 2.0
`,
    sampleTestCases: [
      { id: 1, input: '[(0,0), (4,0), (4,3)]', expectedOutput: '6.0', explanation: 'Diện tích tam giác vuông' }
    ],
    hiddenTestCaseCount: 5,
    status: 'not_started',
    score: 120,
    trackIds: ['mathematics', 'algorithms']
  },
  {
    id: 49,
    subjectId: 107,
    title: 'Dãy số Catalan - Đếm số lượng cây nhị phân hợp lệ',
    titleEn: 'Catalan Numbers - Count Valid Binary Trees',
    difficulty: 'hard',
    category: 'Tổ hợp nâng cao',
    categoryEn: 'Advanced Combinatorics',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Tính số Catalan thứ N biểu diễn số lượng cây nhị phân tìm kiếm phân biệt được tạo thành từ N nút: C_n = (2n)! / ((n+1)! * n!).',
    inputFormat: 'n = 4',
    outputFormat: '14',
    constraints: ['1 <= n <= 30'],
    boilerplateCode: `import math

def catalan_number(n: int) -> int:
    return math.comb(2 * n, n) // (n + 1)
`,
    sampleTestCases: [
      { id: 1, input: 'n = 3', expectedOutput: '5', explanation: 'C_3 = 5 cây' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 140,
    trackIds: ['mathematics', 'algorithms']
  },

  // ================= 9. AI & MACHINE LEARNING EXPANSIONS (Thêm 9 bài -> Đạt 11 bài) =================
  {
    id: 50,
    subjectId: 108,
    title: 'Giải thuật tìm kiếm A* (A-Star) trên lưới tọa độ',
    titleEn: 'A* Search Algorithm on 2D Grid',
    difficulty: 'hard',
    category: 'Tìm kiếm không gian trạng thái',
    categoryEn: 'State Space Search',
    language: 'python',
    timeLimitMs: 1500,
    memoryLimitMb: 128,
    description: 'Cài đặt giải thuật tìm đường A* sử dụng hàm Heuristic khoảng cách Manhattan h(n) = |x1 - x2| + |y1 - y2| để tìm đường đi ngắn nhất vượt qua các chướng ngại vật.',
    inputFormat: 'grid 2D, start=(0,0), end=(4,4)',
    outputFormat: 'Danh sách tọa độ đường đi ngắn nhất',
    constraints: ['Kích thước lưới tối đa 100x100'],
    boilerplateCode: `import heapq

def a_star_search(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int]) -> int:
    def h(p):
        return abs(p[0] - end[0]) + abs(p[1] - end[1])
    
    pq = [(h(start), 0, start)]
    visited = {start: 0}
    dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    
    while pq:
        f, g, (r, c) = heapq.heappop(pq)
        if (r, c) == end:
            return g
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] == 0:
                new_g = g + 1
                if (nr, nc) not in visited or new_g < visited[(nr, nc)]:
                    visited[(nr, nc)] = new_g
                    heapq.heappush(pq, (new_g + h((nr, nc)), new_g, (nr, nc)))
    return -1
`,
    sampleTestCases: [
      { id: 1, input: '5x5 grid without obstacles', expectedOutput: '8 bước', explanation: 'Đường đi tối ưu A*' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 160,
    trackIds: ['ai', 'algorithms']
  },
  {
    id: 51,
    subjectId: 108,
    title: 'Thuật toán Minimax với tỉa nhánh Alpha-Beta Pruning',
    titleEn: 'Minimax with Alpha-Beta Pruning',
    difficulty: 'hard',
    category: 'Trò chơi đối kháng & AI Games',
    categoryEn: 'Adversarial Search & Game AI',
    language: 'python',
    timeLimitMs: 1500,
    memoryLimitMb: 128,
    description: 'Cài đặt thuật toán Minimax kết hợp tỉa nhánh Alpha-Beta để tìm nước đi tối ưu cho người chơi trong cây trò chơi có độ sâu hữu hạn.',
    inputFormat: 'Trạng thái bàn cờ Tic-Tac-Toe, độ sâu depth',
    outputFormat: 'Giá trị heuristic tốt nhất',
    constraints: ['Alpha < Beta', 'Tối ưu nhánh cắt'],
    boilerplateCode: `def minimax(depth: int, node_index: int, is_max: bool, scores: list[int], alpha: float, beta: float) -> int:
    if depth == 3:
        return scores[node_index]
    if is_max:
        best = -float('inf')
        for i in range(2):
            val = minimax(depth + 1, node_index * 2 + i, False, scores, alpha, beta)
            best = max(best, val)
            alpha = max(alpha, best)
            if beta <= alpha:
                break
        return best
    else:
        best = float('inf')
        for i in range(2):
            val = minimax(depth + 1, node_index * 2 + i, True, scores, alpha, beta)
            best = min(best, val)
            beta = min(beta, best)
            if beta <= alpha:
                break
        return best
`,
    sampleTestCases: [
      { id: 1, input: 'scores = [3, 5, 6, 9, 1, 2, 0, -1]', expectedOutput: '5', explanation: 'Tối ưu nước đi minimax' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 160,
    trackIds: ['ai', 'algorithms']
  },
  {
    id: 52,
    subjectId: 108,
    title: 'Hồi quy tuyến tính đơn biến với Gradient Descent',
    titleEn: 'Linear Regression with Gradient Descent',
    difficulty: 'medium',
    category: 'Học máy cơ bản (Machine Learning)',
    categoryEn: 'Machine Learning Basics',
    language: 'python',
    timeLimitMs: 1200,
    memoryLimitMb: 128,
    description: 'Thực hiện huấn luyện mô hình Hồi quy tuyến tính y = w*x + b bằng thuật toán Gradient Descent để tối thiểu hóa hàm mất mát Mean Squared Error (MSE).',
    inputFormat: 'Dữ liệu X, y; learning_rate=0.01, epochs=100',
    outputFormat: 'Trọng số w và hệ số bias b tối ưu',
    constraints: ['1 <= len(X) <= 1000', 'Không dùng thư viện scikit-learn'],
    boilerplateCode: `def linear_regression_gd(x: list[float], y: list[float], lr: float = 0.01, epochs: int = 200) -> tuple[float, float]:
    w, b = 0.0, 0.0
    n = len(x)
    for _ in range(epochs):
        dw = sum(-2 * x[i] * (y[i] - (w * x[i] + b)) for i in range(n)) / n
        db = sum(-2 * (y[i] - (w * x[i] + b)) for i in range(n)) / n
        w -= lr * dw
        b -= lr * db
    return round(w, 4), round(b, 4)
`,
    sampleTestCases: [
      { id: 1, input: 'x = [1,2,3,4], y = [2,4,6,8]', expectedOutput: '(2.0, 0.0)', explanation: 'Hàm y = 2x' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['ai', 'mathematics']
  },
  {
    id: 53,
    subjectId: 108,
    title: 'Thuật toán K-Means Clustering phân cụm dữ liệu 2D',
    titleEn: 'K-Means Clustering on 2D Data',
    difficulty: 'medium',
    category: 'Học không giám sát (Unsupervised Learning)',
    categoryEn: 'Unsupervised Learning',
    language: 'python',
    timeLimitMs: 1200,
    memoryLimitMb: 128,
    description: 'Cài đặt thuật toán phân cụm K-Means: gán điểm vào tâm cụm gần nhất (khoảng cách Euclidean) và cập nhật lại trọng tâm cụm cho đến khi hội tụ.',
    inputFormat: 'Tập điểm points 2D, số cụm k, max_iters',
    outputFormat: 'Tọa độ k tâm cụm centroids',
    constraints: ['k <= số điểm <= 5000'],
    boilerplateCode: `def k_means(points: list[tuple[float, float]], k: int, iters: int = 20) -> list[tuple[float, float]]:
    centroids = points[:k]
    for _ in range(iters):
        clusters = [[] for _ in range(k)]
        for p in points:
            dists = [((p[0] - c[0])**2 + (p[1] - c[1])**2) for c in centroids]
            best_idx = dists.index(min(dists))
            clusters[best_idx].append(p)
        new_centroids = []
        for i in range(k):
            if clusters[i]:
                avg_x = sum(pt[0] for pt in clusters[i]) / len(clusters[i])
                avg_y = sum(pt[1] for pt in clusters[i]) / len(clusters[i])
                new_centroids.append((round(avg_x, 2), round(avg_y, 2)))
            else:
                new_centroids.append(centroids[i])
        centroids = new_centroids
    return centroids
`,
    sampleTestCases: [
      { id: 1, input: '4 points in 2 groups, k=2', expectedOutput: '2 centroids', explanation: 'Phân 2 cụm' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['ai']
  },
  {
    id: 54,
    subjectId: 108,
    title: 'Mô hình Naive Bayes phân loại tin nhắn Spam',
    titleEn: 'Naive Bayes Spam Classification',
    difficulty: 'medium',
    category: 'Phân loại văn bản & Xác suất',
    categoryEn: 'Text Classification & Probability',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Ứng dụng định lý Bayes tính xác suất P(Spam|Text) với giả định độc lập có điều kiện giữa các từ, sử dụng kỹ thuật Laplace Smoothing.',
    inputFormat: 'Tin nhắn email văn bản và từ điển tần suất',
    outputFormat: '"Spam" hoặc "Ham"',
    constraints: ['Laplace smoothing alpha = 1'],
    boilerplateCode: `import math

def predict_spam_naive_bayes(words: list[str], spam_probs: dict, ham_probs: dict, p_spam: float = 0.5) -> str:
    log_spam = math.log(p_spam)
    log_ham = math.log(1 - p_spam)
    for w in words:
        log_spam += math.log(spam_probs.get(w, 1e-4))
        log_ham += math.log(ham_probs.get(w, 1e-4))
    return "Spam" if log_spam > log_ham else "Ham"
`,
    sampleTestCases: [
      { id: 1, input: '["free", "lottery", "win"]', expectedOutput: '"Spam"', explanation: 'Chứa từ khóa spam' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['ai', 'mathematics']
  },
  {
    id: 55,
    subjectId: 108,
    title: 'Đánh giá mô hình - Ma trận Confusion Matrix & F1-Score',
    titleEn: 'Model Evaluation - Confusion Matrix & F1-Score',
    difficulty: 'easy',
    category: 'Đánh giá mô hình (Model Evaluation)',
    categoryEn: 'Model Evaluation',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Từ mảng nhãn thực tế y_true và nhãn dự đoán y_pred, hãy tính các chỉ số đánh giá cốt lõi: Precision, Recall và F1-Score: 2*(P*R)/(P+R).',
    inputFormat: 'y_true = [1, 0, 1, 1, 0], y_pred = [1, 0, 1, 0, 0]',
    outputFormat: 'precision, recall, f1_score',
    constraints: ['y_i thuộc {0, 1}'],
    boilerplateCode: `def calculate_metrics(y_true: list[int], y_pred: list[int]) -> dict:
    tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 1)
    fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 1)
    fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 0)
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    return {"precision": round(precision, 4), "recall": round(recall, 4), "f1": round(f1, 4)}
`,
    sampleTestCases: [
      { id: 1, input: 'y_true=[1,1,0,0], y_pred=[1,1,1,0]', expectedOutput: 'P=0.6667, R=1.0, F1=0.8', explanation: 'Đánh giá ma trận nhầm lẫn' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['ai']
  },
  {
    id: 56,
    subjectId: 108,
    title: 'Hàm kích hoạt Mạng Nơ-ron (Sigmoid, ReLU, Softmax)',
    titleEn: 'Neural Network Activation Functions (Sigmoid, ReLU, Softmax)',
    difficulty: 'easy',
    category: 'Mạng nơ-ron nhân tạo (Neural Networks)',
    categoryEn: 'Artificial Neural Networks',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Cài đặt các hàm kích hoạt (Activation Functions) tiêu chuẩn trong Deep Learning: Sigmoid(x), ReLU(x), và Softmax(z) kèm theo ổn định số học trừ giá trị max.',
    inputFormat: 'Vector logits z = [2.0, 1.0, 0.1]',
    outputFormat: 'Mảng xác suất chuẩn hóa có tổng bằng 1.0',
    constraints: ['Tránh tràn số học exp(z - max(z))'],
    boilerplateCode: `import math

def softmax(logits: list[float]) -> list[float]:
    max_val = max(logits)
    exp_vals = [math.exp(x - max_val) for x in logits]
    total = sum(exp_vals)
    return [round(x / total, 4) for x in exp_vals]
`,
    sampleTestCases: [
      { id: 1, input: '[1.0, 2.0, 3.0]', expectedOutput: '[0.0900, 0.2447, 0.6652]', explanation: 'Softmax probabilities' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['ai', 'mathematics']
  },
  {
    id: 57,
    subjectId: 108,
    title: 'Mã hóa văn bản với TF-IDF Vectorizer',
    titleEn: 'Text Vectorization with TF-IDF',
    difficulty: 'medium',
    category: 'Xử lý ngôn ngữ tự nhiên (NLP)',
    categoryEn: 'Natural Language Processing (NLP)',
    language: 'python',
    timeLimitMs: 1200,
    memoryLimitMb: 128,
    description: 'Chuyển đổi tập hợp các câu văn bản thành ma trận trọng số TF-IDF: TF(t, d) * log(N / (DF(t) + 1)) đo lường mức độ quan trọng của từ ngữ.',
    inputFormat: 'Corpus gồm 3 câu văn bản',
    outputFormat: 'Vector đặc trưng TF-IDF cho mỗi tài liệu',
    constraints: ['Xử lý lowercase, tách từ whitespace'],
    boilerplateCode: `import math
from collections import Counter

def compute_tfidf(corpus: list[str]) -> list[dict]:
    docs = [doc.lower().split() for doc in corpus]
    n = len(docs)
    df = Counter()
    for doc in docs:
        for word in set(doc):
            df[word] += 1
            
    res = []
    for doc in docs:
        tf = Counter(doc)
        total_words = len(doc)
        tfidf_doc = {}
        for w, count in tf.items():
            idf = math.log((n + 1) / (df[w] + 1)) + 1
            tfidf_doc[w] = round((count / total_words) * idf, 4)
        res.append(tfidf_doc)
    return res
`,
    sampleTestCases: [
      { id: 1, input: '["ai is great", "ai mentor learning"]', expectedOutput: 'TF-IDF scores', explanation: 'Trọng số từ khóa' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['ai']
  },
  {
    id: 58,
    subjectId: 108,
    title: 'Học tăng cường Q-Learning tìm đường trong Mê Cung',
    titleEn: 'Q-Learning Agent in Maze Gridworld',
    difficulty: 'hard',
    category: 'Học tăng cường (Reinforcement Learning)',
    categoryEn: 'Reinforcement Learning',
    language: 'python',
    timeLimitMs: 1500,
    memoryLimitMb: 128,
    description: 'Cài đặt thuật toán cập nhật bảng Q-Table theo phương trình Bellman: Q(s, a) = Q(s, a) + alpha * [r + gamma * max(Q(s\', a\')) - Q(s, a)].',
    inputFormat: 'Mê cung 4x4, reward tại đích = 100, bước đi = -1',
    outputFormat: 'Bảng Q-Table hội tụ đường đi tối ưu',
    constraints: ['Alpha=0.1, Gamma=0.9, Epsilon greedy'],
    boilerplateCode: `def update_q_value(q_val: float, reward: float, max_next_q: float, alpha: float = 0.1, gamma: float = 0.9) -> float:
    return q_val + alpha * (reward + gamma * max_next_q - q_val)
`,
    sampleTestCases: [
      { id: 1, input: 'q=0.0, reward=10.0, max_next=50.0', expectedOutput: '5.5', explanation: 'Cập nhật Bellman equation' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 150,
    trackIds: ['ai']
  },

  // ================= 10. C++ EXPANSIONS (Thêm 6 bài -> Đạt 11 bài) =================
  {
    id: 59,
    subjectId: 104,
    title: 'Xây dựng Stack Generic với C++ Template',
    titleEn: 'Generic Stack Design with C++ Templates',
    difficulty: 'medium',
    category: 'Templates & Generic Programming',
    categoryEn: 'Templates & Generic Programming',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Thiết kế lớp Stack<T> với C++ Generic Template hỗ trợ push(), pop(), top(), empty(), và tự động co giãn kích thước động.',
    inputFormat: 'Stack<int> s; s.push(10); s.push(20);',
    outputFormat: 'Top: 20',
    constraints: ['Quản lý bộ nhớ an toàn'],
    boilerplateCode: `#include <iostream>
#include <vector>
#include <stdexcept>

template <typename T>
class Stack {
private:
    std::vector<T> elements;
public:
    void push(const T& val) { elements.push_back(val); }
    void pop() {
        if (elements.empty()) throw std::out_of_range("Stack empty");
        elements.pop_back();
    }
    T top() const {
        if (elements.empty()) throw std::out_of_range("Stack empty");
        return elements.back();
    }
    bool empty() const { return elements.empty(); }
};
`,
    sampleTestCases: [
      { id: 1, input: 'push 1, 2; top()', expectedOutput: '2', explanation: 'LIFO' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 120,
    trackIds: ['cpp', 'data-structures']
  },
  {
    id: 60,
    subjectId: 104,
    title: 'Quản lý tài nguyên RAII & std::shared_ptr',
    titleEn: 'RAII Resource Management & std::shared_ptr',
    difficulty: 'medium',
    category: 'Smart Pointers & Memory Management',
    categoryEn: 'Smart Pointers & Memory Management',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Sử dụng std::shared_ptr và std::weak_ptr để tránh hiện tượng rò rỉ bộ nhớ chu trình vòng tròn (Circular Dependency Cycle).',
    inputFormat: 'Khởi tạo 2 đối tượng Node trỏ lẫn nhau',
    outputFormat: 'Ref count giải phóng hoàn toàn về 0',
    constraints: ['Không dùng delete thủ công'],
    boilerplateCode: `#include <memory>
#include <iostream>

struct Node {
    int val;
    std::weak_ptr<Node> next; // Tránh circular reference
    Node(int v) : val(v) {}
};
`,
    sampleTestCases: [
      { id: 1, input: 'Create circular nodes', expectedOutput: 'Destructed cleanly', explanation: 'Giải phóng an toàn' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 120,
    trackIds: ['cpp']
  },
  {
    id: 61,
    subjectId: 104,
    title: 'Sắp xếp sinh viên với Lambda Expression & std::sort',
    titleEn: 'Custom Sort with Lambda & std::sort',
    difficulty: 'easy',
    category: 'STL Algorithms & Modern C++',
    categoryEn: 'STL Algorithms & Modern C++',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Cho danh sách sinh viên gồm Tên và Điểm GPA. Hãy sử dụng std::sort kết hợp biểu thức C++ Lambda để sắp xếp giảm dần theo GPA, nếu bằng nhau sắp tăng dần theo Tên.',
    inputFormat: 'Danh sách sinh viên [{"Minh", 3.8}, {"An", 4.0}, {"Binh", 3.8}]',
    outputFormat: '[{"An", 4.0}, {"Binh", 3.8}, {"Minh", 3.8}]',
    constraints: ['Thời gian O(N log N)'],
    boilerplateCode: `#include <vector>
#include <string>
#include <algorithm>

struct Student {
    std::string name;
    double gpa;
};

void sort_students(std::vector<Student>& list) {
    std::sort(list.begin(), list.end(), [](const Student& a, const Student& b) {
        if (a.gpa != b.gpa) return a.gpa > b.gpa;
        return a.name < b.name;
    });
}
`,
    sampleTestCases: [
      { id: 1, input: '3 students with duplicate GPA', expectedOutput: 'Sorted list', explanation: 'Sắp xếp chuẩn' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['cpp', 'algorithms']
  },
  {
    id: 62,
    subjectId: 104,
    title: 'Tính đa hình Polymorphism & Virtual Destructor',
    titleEn: 'Polymorphism & Virtual Destructor in C++',
    difficulty: 'medium',
    category: 'Lập trình Hướng đối tượng OOP',
    categoryEn: 'Object-Oriented Programming (OOP)',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Thiết kế lớp trừu tượng HìnhHọc (Shape) với phương thức thuần ảo area() và virtual destructor để đảm bảo dọn dẹp bộ nhớ con trỏ cơ sở (Base pointer).',
    inputFormat: 'Vector con trỏ Shape* trỏ tới Circle và Rectangle',
    outputFormat: 'Tổng diện tích các hình',
    constraints: ['Tránh undefined behavior khi delete Base*'],
    boilerplateCode: `#include <vector>
#include <memory>

class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};
`,
    sampleTestCases: [
      { id: 1, input: 'Rectangle(4, 5)', expectedOutput: '20.0', explanation: 'Diện tích đa hình' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 120,
    trackIds: ['cpp']
  },
  {
    id: 63,
    subjectId: 104,
    title: 'Move Semantics & std::move tối ưu bản sao',
    titleEn: 'Move Semantics & std::move Optimization',
    difficulty: 'hard',
    category: 'Hiệu năng Modern C++',
    categoryEn: 'Modern C++ Performance',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Cài đặt Move Constructor và Move Assignment Operator (Quy tắc số 5 - Rule of 5) để chuyển giao quyền sở hữu buffer động mà không tốn chi phí sao chép sâu.',
    inputFormat: 'Khởi tạo Buffer 10MB và di chuyển sang biến mới',
    outputFormat: 'Thời gian di chuyển 0ms, không cấp phát thêm bộ nhớ',
    constraints: ['noexcept move semantics'],
    boilerplateCode: `#include <utility>

class DynamicBuffer {
    int* data;
    size_t size;
public:
    DynamicBuffer(size_t s) : size(s), data(new int[s]) {}
    ~DynamicBuffer() { delete[] data; }
    
    // Move Constructor
    DynamicBuffer(DynamicBuffer&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
    }
};
`,
    sampleTestCases: [
      { id: 1, input: 'std::move(buf)', expectedOutput: 'Ownership moved', explanation: 'Zero copy' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 150,
    trackIds: ['cpp']
  },
  {
    id: 64,
    subjectId: 104,
    title: 'Phân tích chuỗi với std::stringstream & string_view',
    titleEn: 'String Tokenization with stringstream & string_view',
    difficulty: 'easy',
    category: 'Xử lý chuỗi C++',
    categoryEn: 'C++ String Processing',
    language: 'cpp',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: 'Sử dụng std::stringstream để tách một chuỗi các số nguyên cách nhau bởi dấu cách và tính tổng các số chẵn trong chuỗi.',
    inputFormat: '"10 15 22 33 40 55"',
    outputFormat: '72 (10 + 22 + 40)',
    constraints: ['Chuỗi có tối đa 10^5 ký tự'],
    boilerplateCode: `#include <sstream>
#include <string>

long long sum_even_numbers(const std::string& input) {
    std::stringstream ss(input);
    long long num, sum = 0;
    while (ss >> num) {
        if (num % 2 == 0) sum += num;
    }
    return sum;
}
`,
    sampleTestCases: [
      { id: 1, input: '"2 4 6 7"', expectedOutput: '12', explanation: '2 + 4 + 6 = 12' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['cpp']
  },

  // ================= 11. JAVA EXPANSIONS (Thêm 8 bài -> Đạt 11 bài) =================
  {
    id: 65,
    subjectId: 105,
    title: 'Xử lý ngoại lệ Custom Exception trong giao dịch ngân hàng',
    titleEn: 'Custom Exception Handling in Banking Transactions',
    difficulty: 'easy',
    category: 'Xử lý ngoại lệ (Exception Handling)',
    categoryEn: 'Exception Handling',
    language: 'java',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Xây dựng ngoại lệ kiểm tra InsufficientFundsException phát sinh khi số dư tài khoản không đủ để thực hiện giao dịch rút tiền.',
    inputFormat: 'Số dư 500k, yêu cầu rút 700k',
    outputFormat: 'Throw InsufficientFundsException: "Số dư không đủ"',
    constraints: ['Kế thừa Exception chuẩn'],
    boilerplateCode: `class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

class BankAccount {
    private double balance;
    public BankAccount(double initial) { this.balance = initial; }
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException("Số dư không đủ: " + balance);
        }
        balance -= amount;
    }
}
`,
    sampleTestCases: [
      { id: 1, input: 'Withdraw > balance', expectedOutput: 'Exception thrown', explanation: 'Ngoại lệ giao dịch' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['java']
  },
  {
    id: 66,
    subjectId: 105,
    title: 'Đa luồng và Đồng bộ hóa với AtomicInteger',
    titleEn: 'Multithreading & Synchronization with AtomicInteger',
    difficulty: 'medium',
    category: 'Đa luồng (Multithreading & Concurrency)',
    categoryEn: 'Multithreading & Concurrency',
    language: 'java',
    timeLimitMs: 1500,
    memoryLimitMb: 128,
    description: 'Sử dụng AtomicInteger và ExecutorService để tăng biến đếm counter một cách thread-safe từ 100 luồng đồng thời mà không bị Race Condition.',
    inputFormat: '100 threads, mỗi thread tăng counter 1000 lần',
    outputFormat: '100,000 chính xác 100%',
    constraints: ['Tránh race condition'],
    boilerplateCode: `import java.util.concurrent.atomic.AtomicInteger;

public class ThreadSafeCounter {
    private final AtomicInteger count = new AtomicInteger(0);
    public void increment() { count.incrementAndGet(); }
    public int get() { return count.get(); }
}
`,
    sampleTestCases: [
      { id: 1, input: '100 threads x 1000 increments', expectedOutput: '100000', explanation: 'An toàn đa luồng' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['java']
  },
  {
    id: 67,
    subjectId: 105,
    title: 'Sắp xếp danh sách với Comparable & Comparator',
    titleEn: 'Object Sorting with Comparable & Comparator',
    difficulty: 'easy',
    category: 'Java Collections Framework',
    categoryEn: 'Java Collections Framework',
    language: 'java',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Cài đặt interface Comparable<Student> sắp xếp sinh viên theo mã số và Comparator sắp xếp theo điểm GPA giảm dần.',
    inputFormat: 'Danh sách sinh viên',
    outputFormat: 'Danh sách sắp xếp theo thứ tự mong muốn',
    constraints: ['Collections.sort'],
    boilerplateCode: `import java.util.*;

class Student implements Comparable<Student> {
    String id;
    String name;
    double gpa;

    public Student(String id, String name, double gpa) {
        this.id = id; this.name = name; this.gpa = gpa;
    }

    @Override
    public int compareTo(Student o) {
        return this.id.compareTo(o.id);
    }
}
`,
    sampleTestCases: [
      { id: 1, input: 'Sort by ID', expectedOutput: 'Ordered by student ID', explanation: 'Comparable interface' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['java']
  },
  {
    id: 68,
    subjectId: 105,
    title: 'Lập trình Hướng đối tượng OOP với Abstract Class',
    titleEn: 'Object-Oriented Programming with Abstract Class',
    difficulty: 'easy',
    category: 'Lập trình Hướng đối tượng (OOP)',
    categoryEn: 'Object-Oriented Programming (OOP)',
    language: 'java',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Thiết kế lớp trừu tượng Employee với phương thức calculateSalary() và các lớp con FullTimeEmployee, PartTimeEmployee.',
    inputFormat: 'FullTime(base=20tr, bonus=5tr), PartTime(hours=80, rate=50k)',
    outputFormat: '25tr, 4tr',
    constraints: ['Đóng gói Encapsulation & Kế thừa'],
    boilerplateCode: `abstract class Employee {
    protected String name;
    public Employee(String name) { this.name = name; }
    public abstract double calculateSalary();
}
`,
    sampleTestCases: [
      { id: 1, input: 'Calculate payroll', expectedOutput: 'Salaries calculated', explanation: 'Kế thừa trừu tượng' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['java']
  },
  {
    id: 69,
    subjectId: 105,
    title: 'Xử lý song song dữ liệu với Parallel Streams',
    titleEn: 'Parallel Data Processing with Java Streams',
    difficulty: 'medium',
    category: 'Java Streams API',
    categoryEn: 'Java Streams API',
    language: 'java',
    timeLimitMs: 1500,
    memoryLimitMb: 256,
    description: 'Sử dụng list.parallelStream() để tính tổng bình phương của tất cả các số nguyên tố trong danh sách 1,000,000 phần tử.',
    inputFormat: 'Danh sách 1 triệu số nguyên',
    outputFormat: 'Tổng bình phương của các số nguyên tố',
    constraints: ['Tận dụng đa nhân CPU'],
    boilerplateCode: `import java.util.List;

public class ParallelPrimeSum {
    public static boolean isPrime(long n) {
        if (n < 2) return false;
        for (long i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static long sumOfPrimeSquares(List<Long> numbers) {
        return numbers.parallelStream()
                      .filter(ParallelPrimeSum::isPrime)
                      .mapToLong(x -> x * x)
                      .sum();
    }
}
`,
    sampleTestCases: [
      { id: 1, input: 'List [2, 3, 4, 5]', expectedOutput: '38 (4 + 9 + 25)', explanation: 'Parallel stream' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['java']
  },
  {
    id: 70,
    subjectId: 105,
    title: 'Triển khai mô hình Producer-Consumer với BlockingQueue',
    titleEn: 'Producer-Consumer Pattern with BlockingQueue',
    difficulty: 'hard',
    category: 'Concurrency & Design Patterns',
    categoryEn: 'Concurrency & Design Patterns',
    language: 'java',
    timeLimitMs: 2000,
    memoryLimitMb: 128,
    description: 'Sử dụng ArrayBlockingQueue để phối hợp nhịp nhàng giữa tiến trình sinh dữ liệu Producer và tiến trình xử lý Consumer.',
    inputFormat: 'Queue capacity = 5, 2 producers, 2 consumers',
    outputFormat: 'Không bị deadlock hay starvation',
    constraints: ['java.util.concurrent'],
    boilerplateCode: `import java.util.concurrent.BlockingQueue;

public class Consumer implements Runnable {
    private final BlockingQueue<String> queue;
    public Consumer(BlockingQueue<String> q) { this.queue = q; }
    public void run() {
        try {
            while (true) {
                String item = queue.take();
                if ("EOF".equals(item)) break;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
`,
    sampleTestCases: [
      { id: 1, input: 'Enqueue and dequeue 50 items', expectedOutput: 'Completed smoothly', explanation: 'BlockingQueue' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 150,
    trackIds: ['java']
  },
  {
    id: 71,
    subjectId: 105,
    title: 'Xây dựng Lớp Generic Repository trong Java',
    titleEn: 'Generic Repository Pattern in Java',
    difficulty: 'medium',
    category: 'Java Generics',
    categoryEn: 'Java Generics',
    language: 'java',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Tạo interface Repository<T, ID> với các phương thức save(T), findById(ID), delete(ID) áp dụng cho bất kỳ thực thể Entity nào.',
    inputFormat: 'Repository<Student, String>',
    outputFormat: 'Thao tác CRUD thành công',
    constraints: ['Kiểm tra kiểu dữ liệu an toàn tại compile time'],
    boilerplateCode: `import java.util.*;

public interface GenericRepository<T, ID> {
    void save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
}
`,
    sampleTestCases: [
      { id: 1, input: 'Save and findById', expectedOutput: 'Entity found', explanation: 'Java Generics' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 120,
    trackIds: ['java']
  },
  {
    id: 72,
    subjectId: 105,
    title: 'Đọc ghi và xử lý tệp tin File I/O với Java NIO',
    titleEn: 'File I/O Processing with Java NIO',
    difficulty: 'easy',
    category: 'File I/O & Streams',
    categoryEn: 'File I/O & Streams',
    language: 'java',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: 'Sử dụng Files.lines() và Paths.get() để đọc tệp văn bản lớn theo từng dòng và đếm số lần xuất hiện của từ khóa cho trước.',
    inputFormat: 'Tệp input.txt và từ khóa "HNUE"',
    outputFormat: 'Số lần xuất hiện',
    constraints: ['Xử lý tệp lớn không tràn bộ nhớ'],
    boilerplateCode: `import java.nio.file.*;
import java.io.IOException;

public class FileWordCounter {
    public static long countKeyword(String filePath, String keyword) throws IOException {
        return Files.lines(Paths.get(filePath))
                    .flatMap(line -> Arrays.stream(line.split("\\\\s+")))
                    .filter(word -> word.equalsIgnoreCase(keyword))
                    .count();
    }
}
`,
    sampleTestCases: [
      { id: 1, input: 'File with 5 occurrences of "HNUE"', expectedOutput: '5', explanation: 'NIO Files.lines' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['java']
  },

  // ================= 12. SQL EXPANSIONS (Thêm 8 bài -> Đạt 11 bài) =================
  {
    id: 73,
    subjectId: 106,
    title: 'Truy vấn JOIN 3 bảng: Sinh viên, Khóa học và Điểm số',
    titleEn: 'Three-Table JOIN: Students, Courses, and Grades',
    difficulty: 'easy',
    category: 'Multi-table JOIN',
    categoryEn: 'Multi-table JOIN',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: 'Viết truy vấn INNER JOIN kết nối 3 bảng Students, Enrollments và Courses để hiển thị: student_name, course_title, score của tất cả sinh viên có điểm >= 8.5.',
    inputFormat: 'Bảng Students, Enrollments, Courses',
    outputFormat: 'Danh sách sinh viên xuất sắc',
    constraints: ['Chuẩn ANSI SQL'],
    boilerplateCode: `SELECT s.name AS student_name, c.title AS course_title, e.score
FROM Students s
INNER JOIN Enrollments e ON s.id = e.student_id
INNER JOIN Courses c ON e.course_id = c.id
WHERE e.score >= 8.5
ORDER BY e.score DESC;
`,
    sampleTestCases: [
      { id: 1, input: 'Sample enrollments', expectedOutput: 'Matched high scores', explanation: 'Multi-table join' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['sql']
  },
  {
    id: 74,
    subjectId: 106,
    title: 'Lọc nhóm với GROUP BY & HAVING',
    titleEn: 'Group Filtering with GROUP BY & HAVING',
    difficulty: 'easy',
    category: 'Aggregation & HAVING',
    categoryEn: 'Aggregation & HAVING',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: 'Thống kê điểm trung bình của từng khoa (department). Chỉ hiển thị những khoa có ít nhất 20 sinh viên và điểm GPA trung bình toàn khoa >= 7.5.',
    inputFormat: 'Bảng Students (id, name, department, gpa)',
    outputFormat: 'department, student_count, avg_gpa',
    constraints: ['Dùng HAVING lọc aggregate'],
    boilerplateCode: `SELECT department, COUNT(id) AS student_count, ROUND(AVG(gpa), 2) AS avg_gpa
FROM Students
GROUP BY department
HAVING COUNT(id) >= 20 AND AVG(gpa) >= 7.5
ORDER BY avg_gpa DESC;
`,
    sampleTestCases: [
      { id: 1, input: 'Departments dataset', expectedOutput: 'Qualified departments', explanation: 'HAVING filter' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['sql']
  },
  {
    id: 75,
    subjectId: 106,
    title: 'Truy vấn con tương quan (Correlated Subquery)',
    titleEn: 'Correlated Subquery Evaluation',
    difficulty: 'medium',
    category: 'Subqueries & Correlation',
    categoryEn: 'Subqueries & Correlation',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: 'Tìm tất cả các sinh viên có điểm GPA cao hơn điểm GPA trung bình của chính lớp học (class_group) mà sinh viên đó đang sinh hoạt.',
    inputFormat: 'Bảng Students (id, name, class_group, gpa)',
    outputFormat: 'id, name, class_group, gpa',
    constraints: ['Correlated subquery hoặc Window function'],
    boilerplateCode: `SELECT s1.id, s1.name, s1.class_group, s1.gpa
FROM Students s1
WHERE s1.gpa > (
    SELECT AVG(s2.gpa)
    FROM Students s2
    WHERE s2.class_group = s1.class_group
);
`,
    sampleTestCases: [
      { id: 1, input: 'Students dataset', expectedOutput: 'Students above class average', explanation: 'Correlated subquery' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['sql']
  },
  {
    id: 76,
    subjectId: 106,
    title: 'Tính tổng tích lũy (Cumulative Running Total)',
    titleEn: 'Cumulative Running Total with Window Functions',
    difficulty: 'medium',
    category: 'Window Functions',
    categoryEn: 'Window Functions',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: 'Tính tổng tích lũy tiền học phí thu được theo từng ngày: SUM(amount) OVER (ORDER BY payment_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).',
    inputFormat: 'Bảng Payments (payment_id, payment_date, amount)',
    outputFormat: 'payment_id, payment_date, amount, running_total',
    constraints: ['Hỗ trợ PostgreSQL, MySQL 8'],
    boilerplateCode: `SELECT payment_id, payment_date, amount,
       SUM(amount) OVER (ORDER BY payment_date) AS running_total
FROM Payments;
`,
    sampleTestCases: [
      { id: 1, input: 'Payments over 5 days', expectedOutput: 'Accumulated amounts', explanation: 'Running total' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 130,
    trackIds: ['sql']
  },
  {
    id: 77,
    subjectId: 106,
    title: 'Phân loại học lực với CASE WHEN & COALESCE',
    titleEn: 'Academic Grading with CASE WHEN & COALESCE',
    difficulty: 'easy',
    category: 'Conditional Logic',
    categoryEn: 'Conditional Logic',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: 'Xếp loại sinh viên: Xuất sắc (GPA >= 9.0), Giỏi (8.0 - 8.9), Khá (6.5 - 7.9), Trung bình (dưới 6.5). Nếu điểm NULL thay bằng 0 bằng hàm COALESCE.',
    inputFormat: 'Bảng Students (name, gpa)',
    outputFormat: 'name, gpa, academic_rank',
    constraints: ['CASE WHEN statement'],
    boilerplateCode: `SELECT name, COALESCE(gpa, 0.0) AS final_gpa,
       CASE
           WHEN gpa >= 9.0 THEN 'Xuất sắc'
           WHEN gpa >= 8.0 THEN 'Giỏi'
           WHEN gpa >= 6.5 THEN 'Khá'
           ELSE 'Trung bình'
       END AS academic_rank
FROM Students;
`,
    sampleTestCases: [
      { id: 1, input: 'GPA values from 5.0 to 9.5', expectedOutput: 'Classified students', explanation: 'CASE WHEN logic' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['sql']
  },
  {
    id: 78,
    subjectId: 106,
    title: 'Top 3 sinh viên điểm cao nhất mỗi ngành với CTE & ROW_NUMBER',
    titleEn: 'Top 3 Students per Major using CTE & ROW_NUMBER',
    difficulty: 'hard',
    category: 'Common Table Expressions (CTE)',
    categoryEn: 'Common Table Expressions (CTE)',
    language: 'sql',
    timeLimitMs: 1200,
    memoryLimitMb: 64,
    description: 'Sử dụng CTE WITH và hàm cửa sổ ROW_NUMBER() OVER (PARTITION BY major ORDER BY gpa DESC) để lọc ra top 3 sinh viên có điểm cao nhất của từng chuyên ngành.',
    inputFormat: 'Bảng Students (name, major, gpa)',
    outputFormat: 'major, name, gpa, rank',
    constraints: ['WHERE rank <= 3'],
    boilerplateCode: `WITH RankedStudents AS (
    SELECT name, major, gpa,
           ROW_NUMBER() OVER (PARTITION BY major ORDER BY gpa DESC) AS rnk
    FROM Students
)
SELECT major, name, gpa, rnk
FROM RankedStudents
WHERE rnk <= 3
ORDER BY major, rnk;
`,
    sampleTestCases: [
      { id: 1, input: 'Students across 4 majors', expectedOutput: 'Top 3 per major', explanation: 'CTE & Partition By' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 150,
    trackIds: ['sql']
  },
  {
    id: 79,
    subjectId: 106,
    title: 'Đệ quy CTE (Recursive CTE) duyệt cây môn học tiên quyết',
    titleEn: 'Recursive CTE for Prerequisite Course Tree',
    difficulty: 'hard',
    category: 'Recursive Queries',
    categoryEn: 'Recursive Queries',
    language: 'sql',
    timeLimitMs: 1500,
    memoryLimitMb: 64,
    description: 'Cho bảng Prerequisites (course_id, prereq_id). Sử dụng WITH RECURSIVE để tìm tất cả các môn học tiên quyết gián tiếp của môn "Học Máy Nâng Cao".',
    inputFormat: 'Bảng Prerequisites',
    outputFormat: 'Danh sách môn tiên quyết theo cấp độ phân cấp',
    constraints: ['WITH RECURSIVE'],
    boilerplateCode: `WITH RECURSIVE CoursePath AS (
    SELECT course_id, prereq_id, 1 AS level
    FROM Prerequisites
    WHERE course_id = 'COMP401'
    UNION ALL
    SELECT p.course_id, p.prereq_id, cp.level + 1
    FROM Prerequisites p
    INNER JOIN CoursePath cp ON p.course_id = cp.prereq_id
)
SELECT * FROM CoursePath;
`,
    sampleTestCases: [
      { id: 1, input: 'Prerequisite tree', expectedOutput: 'All prerequisite courses', explanation: 'Recursive CTE' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 160,
    trackIds: ['sql']
  },
  {
    id: 80,
    subjectId: 106,
    title: 'LEFT JOIN tìm sinh viên chưa nộp bài tập nào',
    titleEn: 'LEFT JOIN Finding Students with Zero Submissions',
    difficulty: 'easy',
    category: 'Outer Joins & Anti-pattern',
    categoryEn: 'Outer Joins & Anti-pattern',
    language: 'sql',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: 'Viết truy vấn LEFT JOIN giữa bảng Students và Submissions, lọc điều kiện WHERE sub.id IS NULL để tìm tất cả sinh viên chưa từng nộp bài trong học kỳ.',
    inputFormat: 'Bảng Students và Submissions',
    outputFormat: 'student_id, student_name, class_group',
    constraints: ['LEFT JOIN ... WHERE right_id IS NULL'],
    boilerplateCode: `SELECT s.id AS student_id, s.name AS student_name, s.class_group
FROM Students s
LEFT JOIN Submissions sub ON s.id = sub.student_id
WHERE sub.id IS NULL
ORDER BY s.id ASC;
`,
    sampleTestCases: [
      { id: 1, input: 'Students and submissions', expectedOutput: 'Inactive students', explanation: 'Anti-join' }
    ],
    hiddenTestCaseCount: 4,
    status: 'not_started',
    score: 100,
    trackIds: ['sql']
  }
];

export const EXERCISE_TITLE_TRANSLATIONS: Record<string, string> = {
  "Tìm số nguyên tố trong mảng": "Find Prime Numbers in Array",
  "Kiểm tra tính hợp lệ của chuỗi ngoặc": "Valid Parentheses Check",
  "Tìm hai số có tổng bằng Target (Two Sum)": "Two Sum Problem",
  "Đảo ngược từng từ trong câu": "Reverse Words in a Sentence",
  "Kiểm tra chuỗi đối xứng (Palindrome)": "Valid Palindrome Check",
  "Nhóm các từ Anagrams": "Group Anagrams",
  "Tìm chuỗi con không lặp dài nhất": "Longest Substring Without Repeating Characters",
  "Thiết kế Lớp Tài Khoản Ngân Hàng (OOP)": "Bank Account Class Design (OOP)",
  "Tính số Fibonacci thứ N với Memoization": "N-th Fibonacci with Memoization",
  "Bài toán Đổi Tiền Xu (Coin Change)": "Coin Change Problem",
  "Đảo ngược mảng bằng con trỏ": "Reverse Array Using Pointers",
  "Tìm phần tử lớn nhất và nhỏ nhất": "Find Maximum and Minimum Elements",
  "Đếm số từ trong chuỗi ký tự": "Count Words in String",
  "Quản lý sinh viên với Struct": "Student Management with Struct",
  "Cấp phát động & Quản lý bộ nhớ Malloc": "Dynamic Memory Allocation with Malloc",
  "Đảo ngược danh sách liên kết đơn (Linked List)": "Reverse Singly Linked List",
  "Tìm kiếm nhị phân (Binary Search)": "Binary Search Implementation",
  "Nhân hai ma trận vuông": "Square Matrix Multiplication",
  "Thao tác Bitwise - Đếm số bit 1 (Hamming Weight)": "Bitwise Operations - Number of 1 Bits (Hamming Weight)",
  "Thuật toán Sắp xếp Nhanh (QuickSort)": "QuickSort Algorithm Implementation",
  "Khử phần tử trùng lặp với std::set": "Remove Duplicates with std::set",
  "Xây dựng Lớp Phân Số (Fraction Class)": "Fraction Class Design",
  "Duyệt đồ thị theo chiều rộng (BFS)": "Breadth-First Search (BFS) Traversal",
  "Tìm đường đi ngắn nhất Dijkstra": "Dijkstra Shortest Path Algorithm",
  "Con trỏ thông minh (std::unique_ptr)": "Smart Pointers (std::unique_ptr)",
  "Lọc danh sách bằng Java Stream API": "Filter List with Java Stream API",
  "Thiết kế Mẫu Singleton Thread-Safe": "Thread-Safe Singleton Pattern Design",
  "Duyệt cây nhị phân In-order Traversal": "Binary Tree In-order Traversal",
  "Tìm sinh viên có điểm GPA cao nhất": "Find Student with Highest GPA",
  "Thống kê số lượng sinh viên theo từng lớp": "Count Students per Class Group",
  "Xếp hạng sinh viên với DENSE_RANK()": "Rank Students with DENSE_RANK()",
  "Tìm Ước chung lớn nhất (GCD) bằng Euclid": "Find Greatest Common Divisor (GCD) using Euclidean Algorithm",
  "Lũy thừa nhị phân tính (a^b) mod M": "Binary Exponentiation (a^b) mod M",
  "Tính độ tương đồng Cosine (Cosine Similarity)": "Cosine Similarity Calculation",
  "Thuật toán K-Nearest Neighbors (KNN)": "K-Nearest Neighbors (KNN) Algorithm",
  "Hàng đợi hai đầu (Deque) - Giá trị lớn nhất trong cửa sổ trượt": "Sliding Window Maximum with Deque",
  "Hàng đợi ưu tiên (Min-Heap) - Hợp nhất K danh sách liên kết": "Merge K Sorted Lists with Min-Heap",
  "Cây tiền tố (Trie) - Xây dựng hệ thống gợi ý từ khóa": "Trie Prefix Tree - Autocomplete Suggestion System",
  "Thiết kế bộ nhớ đệm LRU Cache (Least Recently Used)": "LRU Cache Design (Least Recently Used)",
  "Sàng nguyên tố Eratosthenes - Đếm số nguyên tố < N": "Sieve of Eratosthenes - Count Primes < N",
  "Tổ hợp chập K của N modulo 10^9+7 (Fermat Little Theorem)": "Combinations nCr mod 10^9+7 (Fermat Little Theorem)",
  "Phân tích thừa số nguyên tố (Prime Factorization)": "Prime Factorization",
  "Hình học tính toán - Diện tích đa giác lồi (Shoelace Formula)": "Computational Geometry - Convex Polygon Area (Shoelace Formula)",
  "Dãy số Catalan - Đếm số lượng cây nhị phân hợp lệ": "Catalan Numbers - Count Valid Binary Trees",
  "Giải thuật tìm kiếm A* (A-Star) trên lưới tọa độ": "A* Search Algorithm on 2D Grid",
  "Thuật toán Minimax với tỉa nhánh Alpha-Beta Pruning": "Minimax with Alpha-Beta Pruning",
  "Hồi quy tuyến tính đơn biến với Gradient Descent": "Linear Regression with Gradient Descent",
  "Thuật toán K-Means Clustering phân cụm dữ liệu 2D": "K-Means Clustering on 2D Data",
  "Mô hình Naive Bayes phân loại tin nhắn Spam": "Naive Bayes Spam Classification",
  "Đánh giá mô hình - Ma trận Confusion Matrix & F1-Score": "Model Evaluation - Confusion Matrix & F1-Score",
  "Hàm kích hoạt Mạng Nơ-ron (Sigmoid, ReLU, Softmax)": "Neural Network Activation Functions (Sigmoid, ReLU, Softmax)",
  "Mã hóa văn bản với TF-IDF Vectorizer": "Text Vectorization with TF-IDF",
  "Học tăng cường Q-Learning tìm đường trong Mê Cung": "Q-Learning Agent in Maze Gridworld",
  "Xây dựng Stack Generic với C++ Template": "Generic Stack Design with C++ Templates",
  "Quản lý tài nguyên RAII & std::shared_ptr": "RAII Resource Management & std::shared_ptr",
  "Sắp xếp sinh viên với Lambda Expression & std::sort": "Custom Sort with Lambda & std::sort",
  "Tính đa hình Polymorphism & Virtual Destructor": "Polymorphism & Virtual Destructor in C++",
  "Move Semantics & std::move tối ưu bản sao": "Move Semantics & std::move Optimization",
  "Phân tích chuỗi với std::stringstream & string_view": "String Tokenization with stringstream & string_view",
  "Xử lý ngoại lệ Custom Exception trong giao dịch ngân hàng": "Custom Exception Handling in Banking Transactions",
  "Đa luồng và Đồng bộ hóa với AtomicInteger": "Multithreading & Synchronization with AtomicInteger",
  "Sắp xếp danh sách với Comparable & Comparator": "Object Sorting with Comparable & Comparator",
  "Lập trình Hướng đối tượng OOP với Abstract Class": "Object-Oriented Programming with Abstract Class",
  "Xử lý song song dữ liệu với Parallel Streams": "Parallel Data Processing with Java Streams",
  "Triển khai mô hình Producer-Consumer với BlockingQueue": "Producer-Consumer Pattern with BlockingQueue",
  "Xây dựng Lớp Generic Repository trong Java": "Generic Repository Pattern in Java",
  "Đọc ghi và xử lý tệp tin File I/O với Java NIO": "File I/O Processing with Java NIO",
  "Truy vấn JOIN 3 bảng: Sinh viên, Khóa học và Điểm số": "Three-Table JOIN: Students, Courses, and Grades",
  "Lọc nhóm với GROUP BY & HAVING": "Group Filtering with GROUP BY & HAVING",
  "Truy vấn con tương quan (Correlated Subquery)": "Correlated Subquery Evaluation",
  "Tính tổng tích lũy (Cumulative Running Total)": "Cumulative Running Total with Window Functions",
  "Phân loại học lực với CASE WHEN & COALESCE": "Academic Grading with CASE WHEN & COALESCE",
  "Top 3 sinh viên điểm cao nhất mỗi ngành với CTE & ROW_NUMBER": "Top 3 Students per Major using CTE & ROW_NUMBER",
  "Đệ quy CTE (Recursive CTE) duyệt cây môn học tiên quyết": "Recursive CTE for Prerequisite Course Tree",
  "LEFT JOIN tìm sinh viên chưa nộp bài tập nào": "LEFT JOIN Finding Students with Zero Submissions"
};

export const EXERCISE_CATEGORY_TRANSLATIONS: Record<string, string> = {
  "Mảng & Số học": "Arrays & Math",
  "Ngăn xếp (Stack)": "Stack",
  "Mảng & Bảng băm": "Arrays & Hash Table",
  "Xử lý chuỗi (String)": "String Manipulation",
  "Hai con trỏ (Two Pointers)": "Two Pointers",
  "Hash Map & String": "Hash Map & String",
  "Cửa sổ trượt (Sliding Window)": "Sliding Window",
  "Hướng đối tượng (OOP)": "Object-Oriented Programming (OOP)",
  "Quy hoạch động (DP)": "Dynamic Programming (DP)",
  "Con trỏ (Pointers)": "Pointers",
  "Mảng một chiều": "1D Arrays",
  "Xâu ký tự (String)": "Strings",
  "Cấu trúc (Struct)": "Structs",
  "Cấp phát động (Memory)": "Dynamic Memory Allocation",
  "Danh sách liên kết": "Linked Lists",
  "Giải thuật tìm kiếm": "Search Algorithms",
  "Mảng hai chiều": "2D Arrays",
  "Bit Manipulation": "Bit Manipulation",
  "Chia để trị (Divide and Conquer)": "Divide and Conquer",
  "STL Containers": "STL Containers",
  "Lập trình Hướng đối tượng OOP": "Object-Oriented Programming (OOP)",
  "Đồ thị (Graphs)": "Graphs",
  "Đồ thị có trọng số": "Weighted Graphs",
  "Modern C++17/20": "Modern C++17/20",
  "Java Collections & Streams": "Java Collections & Streams",
  "Design Patterns": "Design Patterns",
  "Cây nhị phân (Binary Tree)": "Binary Tree",
  "Truy vấn cơ bản": "Basic Queries",
  "Phép nhóm (GROUP BY & JOIN)": "GROUP BY & JOIN",
  "Window Functions": "Window Functions",
  "Lý thuyết số": "Number Theory",
  "Số học mô-đun": "Modular Arithmetic",
  "Vector Space & NLP": "Vector Space & NLP",
  "Supervised Learning": "Supervised Learning",
  "Ngăn xếp & Hàng đợi (Deque)": "Stack & Deque",
  "Cây & Hàng đợi ưu tiên (Heap)": "Tree & Priority Queue (Heap)",
  "Cây tiền tố (Trie)": "Trie (Prefix Tree)",
  "Bảng băm & Danh sách kép": "Hash Table & Doubly Linked List",
  "Đại số & Tổ hợp": "Algebra & Combinatorics",
  "Số học cơ bản": "Basic Number Theory",
  "Hình học tính toán": "Computational Geometry",
  "Tổ hợp nâng cao": "Advanced Combinatorics",
  "Tìm kiếm không gian trạng thái": "State Space Search",
  "Trò chơi đối kháng & AI Games": "Adversarial Search & Game AI",
  "Học máy cơ bản (Machine Learning)": "Machine Learning Basics",
  "Học không giám sát (Unsupervised Learning)": "Unsupervised Learning",
  "Phân loại văn bản & Xác suất": "Text Classification & Probability",
  "Đánh giá mô hình (Model Evaluation)": "Model Evaluation",
  "Mạng nơ-ron nhân tạo (Neural Networks)": "Artificial Neural Networks",
  "Xử lý ngôn ngữ tự nhiên (NLP)": "Natural Language Processing (NLP)",
  "Học tăng cường (Reinforcement Learning)": "Reinforcement Learning",
  "Templates & Generic Programming": "Templates & Generic Programming",
  "Smart Pointers & Memory Management": "Smart Pointers & Memory Management",
  "STL Algorithms & Modern C++": "STL Algorithms & Modern C++",
  "Hiệu năng Modern C++": "Modern C++ Performance",
  "Xử lý chuỗi C++": "C++ String Processing",
  "Xử lý ngoại lệ (Exception Handling)": "Exception Handling",
  "Đa luồng (Multithreading & Concurrency)": "Multithreading & Concurrency",
  "Java Collections Framework": "Java Collections Framework",
  "Lập trình Hướng đối tượng (OOP)": "Object-Oriented Programming (OOP)",
  "Java Streams API": "Java Streams API",
  "Concurrency & Design Patterns": "Concurrency & Design Patterns",
  "Java Generics": "Java Generics",
  "File I/O & Streams": "File I/O & Streams",
  "Multi-table JOIN": "Multi-table JOIN",
  "Aggregation & HAVING": "Aggregation & HAVING",
  "Subqueries & Correlation": "Subqueries & Correlation",
  "Conditional Logic": "Conditional Logic",
  "Common Table Expressions (CTE)": "Common Table Expressions (CTE)",
  "Recursive Queries": "Recursive Queries",
  "Outer Joins & Anti-pattern": "Outer Joins & Anti-pattern"
};
