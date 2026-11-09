import { COMPREHENSIVE_EXERCISES } from './mockExercisesData';

export type VerdictType = 'accepted' | 'wrong_answer' | 'time_limit' | 'compile_error';

/**
 * Normalizes source code for robust matching across line endings and whitespace.
 */
export function normalizeCodeKey(code: string): string {
  if (!code) return '';
  return code
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

// In-memory registry mapping normalized code -> verdict
const demoVerdictsMap = new Map<string, VerdictType>();
let isInitialized = false;

export function registerDemoVerdict(code: string, verdict: VerdictType): void {
  const key = normalizeCodeKey(code);
  if (key) {
    demoVerdictsMap.set(key, verdict);
  }
}

export function lookupDemoVerdict(code: string): VerdictType | null {
  ensureDemoVerdicts();
  const key = normalizeCodeKey(code);
  if (!key) return null;
  return demoVerdictsMap.get(key) || null;
}

/**
 * Generates realistic student submission code for Teacher dashboard and ensures it is registered.
 */
export function getDemoSubmissionCode(
  exercise: { id: number; language?: string; boilerplateCode?: string },
  status: VerdictType,
  studentIndex: number = 0
): string {
  const lang = (exercise.language || 'python').toLowerCase();
  const bp = (exercise.boilerplateCode || '').trim();
  let code = '';

  if (lang === 'python') {
    if (status === 'accepted') {
      const variantComment = studentIndex % 2 === 0
        ? '# Optimized solution: achieves O(N) runtime complexity\n'
        : '# Full implementation passing all test cases\n';
      code = `${variantComment}${bp || 'def solve(data):\n    return [x for x in data if x is not None]'}\n`;
    } else if (status === 'wrong_answer') {
      // Modifies return or logic to fail on edge cases
      code = `# Logic flaw: misses boundary conditions and empty inputs\n` +
        (bp.includes('return ')
          ? bp.replace(/return\s+[^\n]+/, 'return -1  # Fails edge case check')
          : `${bp}\n    return None\n`);
    } else if (status === 'time_limit') {
      // Infinite loop without break or return
      code = `# TLE: Unbounded iteration on large input\nwhile True:\n    pass\n\n${bp}\n`;
    } else {
      // Python syntax error: missing colon
      code = `def solve(data)\n    # SyntaxError: missing colon after function signature\n    for item in data\n        print(item)\n`;
    }
  } else if (lang === 'cpp') {
    if (status === 'accepted') {
      code = `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Solution: Optimal implementation for C++17\n${bp || 'int main() {\n    cout << "Passed" << endl;\n    return 0;\n}'}\n`;
    } else if (status === 'wrong_answer') {
      code = `#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Logic bug: always returns 0 or -1\nint main() {\n    cout << -1 << endl;\n    return 0;\n}\n`;
    } else if (status === 'time_limit') {
      code = `#include <iostream>\nusing namespace std;\n\n// Time Limit Exceeded: infinite loop\nint main() {\n    while (true) {\n        // no exit condition\n    }\n    return 0;\n}\n`;
    } else {
      code = `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Syntax error missing semicolon"\n    return 0\n}\n`;
    }
  } else if (lang === 'c') {
    if (status === 'accepted') {
      code = `#include <stdio.h>\n#include <stdlib.h>\n\n// Solution: Efficient C implementation\n${bp || 'int main() {\n    printf("Passed\\n");\n    return 0;\n}'}\n`;
    } else if (status === 'wrong_answer') {
      code = `#include <stdio.h>\n\n// Edge case bug in C implementation\nint main() {\n    printf("-1\\n");\n    return 0;\n}\n`;
    } else if (status === 'time_limit') {
      code = `#include <stdio.h>\n\n// TLE: Infinite loop\nint main() {\n    for (;;) {\n        // spin without termination\n    }\n    return 0;\n}\n`;
    } else {
      code = `#include <stdio.h>\n\nint main() {\n    printf("Missing semicolon")\n    return 0\n}\n`;
    }
  } else if (lang === 'java') {
    if (status === 'accepted') {
      code = `import java.util.*;\n\n// Accepted Java Solution\npublic class Solution {\n    ${bp ? bp.replace(/^public class Solution \{?/, '').replace(/\}$/, '') : 'public static void main(String[] args) { System.out.println("Passed"); }'}\n}\n`;
    } else if (status === 'wrong_answer') {
      code = `import java.util.*;\n\n// Java Logic Flaw: incorrect boundary handling\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("-1");\n    }\n}\n`;
    } else if (status === 'time_limit') {
      code = `import java.util.*;\n\n// Java Time Limit Exceeded\npublic class Solution {\n    public static void main(String[] args) {\n        while (true) {\n            // infinite loop\n        }\n    }\n}\n`;
    } else {
      code = `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Missing semicolon")\n    }\n}\n`;
    }
  } else {
    // SQL
    if (status === 'accepted') {
      code = `-- Optimal SQL query\n${bp || 'SELECT id, name FROM records WHERE active = 1 ORDER BY id;'}\n`;
    } else if (status === 'wrong_answer') {
      code = `-- Flawed query: empty result set\nSELECT * FROM (${bp ? bp.replace(/;$/, '') : 'SELECT 1'}) AS subq WHERE 1 = 0;\n`;
    } else if (status === 'time_limit') {
      code = `-- Recursive query causing timeout\nWITH RECURSIVE inf_loop AS (\n    SELECT 1 AS n\n    UNION ALL\n    SELECT n + 1 FROM inf_loop\n)\nSELECT * FROM inf_loop;\n`;
    } else {
      code = `SELEC * FORM invalid_sql_query WHEER id = 1;\n`;
    }
  }

  // Register in demoVerdictsMap
  registerDemoVerdict(code, status);
  return code;
}

/**
 * Ensures demo verdicts are populated for all exercises and sample submissions.
 */
export function ensureDemoVerdicts(): void {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Pre-register for all 75 exercises and all 4 verdicts
  const statuses: VerdictType[] = ['accepted', 'wrong_answer', 'time_limit', 'compile_error'];
  for (const ex of COMPREHENSIVE_EXERCISES) {
    for (const st of statuses) {
      for (let variant = 0; variant < 3; variant++) {
        getDemoSubmissionCode(ex, st, variant);
      }
    }
  }

  // 2. Pre-register known MOCK_LIVE_SUBMISSIONS codes
  // Exercise 1: Prime numbers accepted
  registerDemoVerdict(`import math

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
    print(*(primes if primes else [-1]))`, 'accepted');

  // Exercise 2: Parentheses accepted
  registerDemoVerdict(`def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`, 'accepted');

  // Exercise 1: TLE
  registerDemoVerdict(`def is_prime(n):
    if n < 2:
        return False
    # Duyệt tuần tự tới n gây TLE với n lớn
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

def find_primes(arr):
    return [x for x in arr if is_prime(x)]`, 'time_limit');

  // Exercise 3: Two Sum accepted
  registerDemoVerdict(`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`, 'accepted');

  // Exercise 2: Wrong Answer
  registerDemoVerdict(`def is_valid_parentheses(s: str) -> bool:
    # Sai lầm chỉ đếm số lượng ngoặc không theo thứ tự LIFO
    return s.count('(') == s.count(')') and s.count('[') == s.count(']') and s.count('{') == s.count('}')`, 'wrong_answer');

  // Exercise 3: Compile Error
  registerDemoVerdict(`def two_sum(nums, target)
    # Lỗi thiếu dấu hai chấm sau định nghĩa hàm
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`, 'compile_error');
}

