import { Exercise } from '../types/exercise';

export const COMPREHENSIVE_EXERCISES: Exercise[] = [
  // ================= 1. PYTHON TRACK (12 bài) =================
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
    status: 'solved',
    score: 100,
    trackIds: ['python', 'algorithms', 'mathematics']
  },
  {
    id: 2,
    subjectId: 101,
    title: 'Bài 02: Kiểm tra tính hợp lệ của chuỗi ngoặc',
    difficulty: 'medium',
    category: 'Ngăn xếp (Stack)',
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
    status: 'in_progress',
    score: 120,
    trackIds: ['python', 'data-structures', 'algorithms']
  },
  {
    id: 3,
    subjectId: 101,
    title: 'Bài 03: Tìm hai số có tổng bằng Target (Two Sum)',
    difficulty: 'easy',
    category: 'Mảng & Bảng băm',
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
    status: 'solved',
    score: 100,
    trackIds: ['python', 'algorithms', 'data-structures']
  },
  {
    id: 4,
    subjectId: 101,
    title: 'Bài 04: Đảo ngược từng từ trong câu',
    difficulty: 'easy',
    category: 'Xử lý chuỗi (String)',
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
    title: 'Bài 05: Kiểm tra chuỗi đối xứng (Palindrome)',
    difficulty: 'easy',
    category: 'Hai con trỏ (Two Pointers)',
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
    status: 'solved',
    score: 90,
    trackIds: ['python', 'algorithms']
  },
  {
    id: 6,
    subjectId: 101,
    title: 'Bài 06: Nhóm các từ Anagrams',
    difficulty: 'medium',
    category: 'Hash Map & String',
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
    title: 'Bài 07: Tìm chuỗi con không lặp dài nhất',
    difficulty: 'medium',
    category: 'Cửa sổ trượt (Sliding Window)',
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
    title: 'Bài 08: Thiết kế Lớp Tài Khoản Ngân Hàng (OOP)',
    difficulty: 'easy',
    category: 'Hướng đối tượng (OOP)',
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
    status: 'solved',
    score: 100,
    trackIds: ['python']
  },
  {
    id: 9,
    subjectId: 101,
    title: 'Bài 09: Tính số Fibonacci thứ N với Memoization',
    difficulty: 'easy',
    category: 'Quy hoạch động (DP)',
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
    status: 'solved',
    score: 100,
    trackIds: ['python', 'algorithms', 'mathematics']
  },
  {
    id: 10,
    subjectId: 101,
    title: 'Bài 10: Bài toán Đổi Tiền Xu (Coin Change)',
    difficulty: 'hard',
    category: 'Quy hoạch động (DP)',
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
    title: 'Bài 01 (C): Đảo ngược mảng bằng con trỏ',
    difficulty: 'easy',
    category: 'Con trỏ (Pointers)',
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
    status: 'solved',
    score: 100,
    trackIds: ['c', 'data-structures']
  },
  {
    id: 12,
    subjectId: 102,
    title: 'Bài 02 (C): Tìm phần tử lớn nhất và nhỏ nhất',
    difficulty: 'easy',
    category: 'Mảng một chiều',
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
    status: 'solved',
    score: 90,
    trackIds: ['c']
  },
  {
    id: 13,
    subjectId: 102,
    title: 'Bài 03 (C): Đếm số từ trong chuỗi ký tự',
    difficulty: 'easy',
    category: 'Xâu ký tự (String)',
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
    title: 'Bài 04 (C): Quản lý sinh viên với Struct',
    difficulty: 'medium',
    category: 'Cấu trúc (Struct)',
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
    title: 'Bài 05 (C): Cấp phát động & Quản lý bộ nhớ Malloc',
    difficulty: 'medium',
    category: 'Cấp phát động (Memory)',
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
    status: 'solved',
    score: 110,
    trackIds: ['c']
  },
  {
    id: 16,
    subjectId: 102,
    title: 'Bài 06 (C): Đảo ngược danh sách liên kết đơn (Linked List)',
    difficulty: 'medium',
    category: 'Danh sách liên kết',
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
    status: 'in_progress',
    score: 130,
    trackIds: ['c', 'data-structures']
  },
  {
    id: 17,
    subjectId: 102,
    title: 'Bài 07 (C): Tìm kiếm nhị phân (Binary Search)',
    difficulty: 'easy',
    category: 'Giải thuật tìm kiếm',
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
    status: 'solved',
    score: 100,
    trackIds: ['c', 'algorithms']
  },
  {
    id: 18,
    subjectId: 102,
    title: 'Bài 08 (C): Nhân hai ma trận vuông',
    difficulty: 'medium',
    category: 'Mảng hai chiều',
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
    title: 'Bài 09 (C): Thao tác Bitwise - Đếm số bit 1 (Hamming Weight)',
    difficulty: 'easy',
    category: 'Bit Manipulation',
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
    status: 'solved',
    score: 90,
    trackIds: ['c', 'mathematics']
  },
  {
    id: 20,
    subjectId: 102,
    title: 'Bài 10 (C): Thuật toán Sắp xếp Nhanh (QuickSort)',
    difficulty: 'hard',
    category: 'Chia để trị (Divide and Conquer)',
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
    title: 'Bài 01 (C++): Khử phần tử trùng lặp với std::set',
    difficulty: 'easy',
    category: 'STL Containers',
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
    status: 'solved',
    score: 100,
    trackIds: ['cpp', 'data-structures']
  },
  {
    id: 22,
    subjectId: 103,
    title: 'Bài 02 (C++): Xây dựng Lớp Phân Số (Fraction Class)',
    difficulty: 'easy',
    category: 'Lập trình Hướng đối tượng OOP',
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
    status: 'solved',
    score: 100,
    trackIds: ['cpp']
  },
  {
    id: 23,
    subjectId: 103,
    title: 'Bài 03 (C++): Duyệt đồ thị theo chiều rộng (BFS)',
    difficulty: 'medium',
    category: 'Đồ thị (Graphs)',
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
    title: 'Bài 04 (C++): Tìm đường đi ngắn nhất Dijkstra',
    difficulty: 'hard',
    category: 'Đồ thị có trọng số',
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
    title: 'Bài 05 (C++): Con trỏ thông minh (std::unique_ptr)',
    difficulty: 'medium',
    category: 'Modern C++17/20',
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
    status: 'solved',
    score: 110,
    trackIds: ['cpp']
  },

  // ================= 4. JAVA TRACK (11 bài) =================
  {
    id: 26,
    subjectId: 104,
    title: 'Bài 01 (Java): Lọc danh sách bằng Java Stream API',
    difficulty: 'easy',
    category: 'Java Collections & Streams',
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
    status: 'solved',
    score: 100,
    trackIds: ['java']
  },
  {
    id: 27,
    subjectId: 104,
    title: 'Bài 02 (Java): Thiết kế Mẫu Singleton Thread-Safe',
    difficulty: 'medium',
    category: 'Design Patterns',
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
    status: 'solved',
    score: 120,
    trackIds: ['java']
  },
  {
    id: 28,
    subjectId: 104,
    title: 'Bài 03 (Java): Duyệt cây nhị phân In-order Traversal',
    difficulty: 'medium',
    category: 'Cây nhị phân (Binary Tree)',
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
    status: 'in_progress',
    score: 130,
    trackIds: ['java', 'data-structures']
  },

  // ================= 5. SQL & DATABASES TRACK (11 bài) =================
  {
    id: 29,
    subjectId: 105,
    title: 'Bài 01 (SQL): Tìm sinh viên có điểm GPA cao nhất',
    difficulty: 'easy',
    category: 'Truy vấn cơ bản',
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
    status: 'solved',
    score: 100,
    trackIds: ['sql', 'databases']
  },
  {
    id: 30,
    subjectId: 105,
    title: 'Bài 02 (SQL): Thống kê số lượng sinh viên theo từng lớp',
    difficulty: 'easy',
    category: 'Phép nhóm (GROUP BY & JOIN)',
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
    status: 'solved',
    score: 110,
    trackIds: ['sql', 'databases']
  },
  {
    id: 31,
    subjectId: 105,
    title: 'Bài 03 (SQL): Xếp hạng sinh viên với DENSE_RANK()',
    difficulty: 'medium',
    category: 'Window Functions',
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
    trackIds: ['sql', 'databases']
  },

  // ================= 6. LINUX SHELL TRACK (10 bài) =================
  {
    id: 32,
    subjectId: 106,
    title: 'Bài 01 (Linux): Lọc dòng lỗi ERROR từ tệp log truy cập',
    difficulty: 'easy',
    category: 'Xử lý văn bản (grep)',
    language: 'bash',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Cho tệp tin \`access.log\`. Viết lệnh Bash sử dụng \`grep\` để trích xuất tất cả các dòng có chứa từ khóa "ERROR 500" hoặc "FATAL" không phân biệt chữ hoa chữ thường.`,
    inputFormat: 'File log hệ thống',
    outputFormat: 'Các dòng chứa lỗi',
    constraints: ['Dùng pipeline Linux'],
    boilerplateCode: `#!/bin/bash
grep -Ei "ERROR 500|FATAL" access.log
`,
    sampleTestCases: [
      { id: 1, input: 'log containing ERROR 500 and INFO', expectedOutput: 'Only ERROR lines', explanation: 'Lọc lỗi' }
    ],
    hiddenTestCaseCount: 3,
    status: 'solved',
    score: 100,
    trackIds: ['linux-shell']
  },
  {
    id: 33,
    subjectId: 106,
    title: 'Bài 02 (Linux): Thống kê 5 IP truy cập nhiều nhất bằng awk & sort',
    difficulty: 'medium',
    category: 'Pipeline & awk',
    language: 'bash',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Trích xuất cột địa chỉ IP (cột thứ 1) từ file \`nginx.log\`, thống kê tần suất và in ra top 5 địa chỉ IP có số lượt truy cập nhiều nhất.`,
    inputFormat: 'Tệp `nginx.log`',
    outputFormat: 'Top 5 IP kèm số lần',
    constraints: ['Pipeline: awk | sort | uniq -c | sort -nr | head -n 5'],
    boilerplateCode: `#!/bin/bash
awk '{print $1}' nginx.log | sort | uniq -c | sort -nr | head -n 5
`,
    sampleTestCases: [
      { id: 1, input: '100 requests log', expectedOutput: 'Top 5 IPs', explanation: 'Thống kê tần suất IP' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 130,
    trackIds: ['linux-shell']
  },

  // ================= 7. MATHEMATICS TRACK (10 bài) =================
  {
    id: 34,
    subjectId: 107,
    title: 'Bài 01 (Toán): Tìm Ước chung lớn nhất (GCD) bằng Euclid',
    difficulty: 'easy',
    category: 'Lý thuyết số',
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
    status: 'solved',
    score: 100,
    trackIds: ['mathematics', 'algorithms', 'python']
  },
  {
    id: 35,
    subjectId: 107,
    title: 'Bài 02 (Toán): Lũy thừa nhị phân tính (a^b) mod M',
    difficulty: 'medium',
    category: 'Số học mô-đun',
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
    title: 'Bài 01 (AI): Tính độ tương đồng Cosine (Cosine Similarity)',
    difficulty: 'easy',
    category: 'Vector Space & NLP',
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
    status: 'solved',
    score: 100,
    trackIds: ['ai', 'mathematics', 'python']
  },
  {
    id: 37,
    subjectId: 108,
    title: 'Bài 02 (AI): Thuật toán K-Nearest Neighbors (KNN)',
    difficulty: 'medium',
    category: 'Supervised Learning',
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

  // ================= 9. REACT TRACK (10 bài) =================
  {
    id: 38,
    subjectId: 109,
    title: 'Bài 01 (React): Xây dựng Hook useLocalStorage',
    difficulty: 'easy',
    category: 'Custom Hooks',
    language: 'javascript',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Viết một Custom Hook \`useLocalStorage(key, initialValue)\` tự động đồng bộ hóa trạng thái của biến vào \`localStorage\` và lắng nghe thay đổi.`,
    inputFormat: 'Khóa lưu trữ và giá trị khởi tạo',
    outputFormat: 'Cặp `[value, setValue]`',
    constraints: ['Hỗ trợ JSON serialize'],
    boilerplateCode: `import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}
`,
    sampleTestCases: [
      { id: 1, input: 'useLocalStorage("theme", "dark")', expectedOutput: 'syncs with localStorage', explanation: 'Lưu trữ tự động' }
    ],
    hiddenTestCaseCount: 3,
    status: 'solved',
    score: 100,
    trackIds: ['react']
  },
  {
    id: 39,
    subjectId: 109,
    title: 'Bài 02 (React): Tối ưu danh sách lớn với useMemo',
    difficulty: 'medium',
    category: 'Hiệu năng React',
    language: 'javascript',
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    description: `Sử dụng \`useMemo\` để lọc danh sách 10,000 sinh viên theo từ khóa tìm kiếm mà không kích hoạt tính toán lại khi các state khác không liên quan thay đổi.`,
    inputFormat: 'Danh sách mảng lớn và từ khóa search query',
    outputFormat: 'Danh sách đã lọc ghi nhớ kết quả',
    constraints: ['Tránh re-compute không cần thiết'],
    boilerplateCode: `import React, { useMemo } from 'react';

export function FilteredStudentList({ students, query }) {
    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return students.filter(s => s.name.toLowerCase().includes(q));
    }, [students, query]);

    return (
        <ul>
            {filtered.map(s => <li key={s.id}>{s.name}</li>)}
        </ul>
    );
}
`,
    sampleTestCases: [
      { id: 1, input: 'query = "Minh"', expectedOutput: 'Filtered list', explanation: 'Ghi nhớ kết quả useMemo' }
    ],
    hiddenTestCaseCount: 3,
    status: 'not_started',
    score: 130,
    trackIds: ['react']
  },

  // ================= 10. REGEX TRACK (10 bài) =================
  {
    id: 40,
    subjectId: 110,
    title: 'Bài 01 (Regex): Kiểm tra định dạng Email sinh viên HNUE',
    difficulty: 'easy',
    category: 'Biểu thức chính quy (Regex)',
    language: 'python',
    timeLimitMs: 1000,
    memoryLimitMb: 64,
    description: `Viết biểu thức chính quy (Regular Expression) kiểm tra địa chỉ email có đuôi \`@hnue.edu.vn\` hoặc \`@fit.hnue.edu.vn\` hợp lệ.`,
    inputFormat: '`"student123@hnue.edu.vn"`',
    outputFormat: '`True`',
    constraints: ['Regex RFC 5322'],
    boilerplateCode: `import re

def validate_hnue_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@(fit\\.)?hnue\\.edu\\.vn$'
    return bool(re.match(pattern, email.strip()))
`,
    sampleTestCases: [
      { id: 1, input: '"khai.pt@hnue.edu.vn"', expectedOutput: 'True', explanation: 'Email trường hợp lệ' }
    ],
    hiddenTestCaseCount: 4,
    status: 'solved',
    score: 100,
    trackIds: ['regex', 'python']
  }
];
