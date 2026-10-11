export type SkillIconType =
  | 'algorithms'
  | 'data-structures'
  | 'mathematics'
  | 'ai'
  | 'c'
  | 'cpp'
  | 'java'
  | 'python'
  | 'sql'
  | 'databases'
  | 'linux-shell'
  | 'fp'
  | 'regex'
  | 'react';

export interface SkillTrack {
  id: string;
  nameVie: string;
  nameEng: string;
  descVie: string;
  descEng: string;
  iconType: SkillIconType;
  color: string; // Tailored badge color
  badgeText?: string;
}

export const SKILL_TRACKS: SkillTrack[] = [
  {
    id: 'algorithms',
    nameVie: 'Thuật toán (Algorithms)',
    nameEng: 'Algorithms',
    descVie: 'Sắp xếp, tìm kiếm, đồ thị, quy hoạch động và chia để trị.',
    descEng: 'Sorting, searching, graph algorithms, dynamic programming & divide and conquer.',
    iconType: 'algorithms',
    color: '#10b981', // emerald
  },
  {
    id: 'data-structures',
    nameVie: 'Cấu trúc dữ liệu (Data Structures)',
    nameEng: 'Data Structures',
    descVie: 'Mảng, danh sách liên kết, ngăn xếp (Stack), hàng đợi (Queue), cây và đồ thị.',
    descEng: 'Arrays, linked lists, stacks, queues, trees, and hash tables.',
    iconType: 'data-structures',
    color: '#06b6d4', // cyan
  },
  {
    id: 'mathematics',
    nameVie: 'Toán học (Mathematics)',
    nameEng: 'Mathematics',
    descVie: 'Số học, tổ hợp, lý thuyết số, hình học tính toán và xác suất.',
    descEng: 'Combinatorics, number theory, arithmetic, probability and computational geometry.',
    iconType: 'mathematics',
    color: '#8b5cf6', // purple
  },
  {
    id: 'ai',
    nameVie: 'Trí tuệ nhân tạo (AI)',
    nameEng: 'Artificial Intelligence',
    descVie: 'Tìm kiếm không gian trạng thái, Heuristic A*, học máy cơ bản và xử lý ngôn ngữ.',
    descEng: 'State space search, heuristic search, machine learning basics & NLP.',
    iconType: 'ai',
    color: '#ec4899', // pink
  },
  {
    id: 'c',
    nameVie: 'Lập trình C (C Language)',
    nameEng: 'C',
    descVie: 'Quản lý bộ nhớ con trỏ, thao tác mảng cấu trúc và tối ưu hiệu năng phần cứng.',
    descEng: 'Pointers, memory management, low-level structures and hardware optimizations.',
    iconType: 'c',
    color: '#3b82f6', // blue
  },
  {
    id: 'cpp',
    nameVie: 'Lập trình C++ (C++)',
    nameEng: 'C++',
    descVie: 'Lập trình hướng đối tượng OOP, STL containers, generic templates và con trỏ thông minh.',
    descEng: 'OOP principles, STL algorithms and containers, templates, and smart pointers.',
    iconType: 'cpp',
    color: '#2563eb', // royal blue
  },
  {
    id: 'java',
    nameVie: 'Lập trình Java (Java)',
    nameEng: 'Java',
    descVie: 'Lập trình hướng đối tượng, Java Collections Framework, Streams API và xử lý ngoại lệ.',
    descEng: 'Object-oriented programming, Collections Framework, Streams API & multithreading.',
    iconType: 'java',
    color: '#f97316', // orange
  },
  {
    id: 'python',
    nameVie: 'Lập trình Python (Python)',
    nameEng: 'Python',
    descVie: 'Cú pháp hiện đại, List Comprehension, xử lý chuỗi, cấu trúc dữ liệu và thư viện AI.',
    descEng: 'Modern syntax, list comprehensions, functional primitives & data analysis.',
    iconType: 'python',
    color: '#eab308', // yellow
  },
  {
    id: 'sql',
    nameVie: 'Cơ sở dữ liệu SQL (SQL)',
    nameEng: 'SQL',
    descVie: 'Truy vấn SELECT, JOIN nhiều bảng, GROUP BY, Aggregate functions và subqueries.',
    descEng: 'Queries, complex JOINs, aggregation, window functions and indexing.',
    iconType: 'sql',
    color: '#0284c7', // sky
  },
  {
    id: 'databases',
    nameVie: 'Hệ cơ sở dữ liệu (Databases)',
    nameEng: 'Databases',
    descVie: 'Thiết kế lược đồ ERD, chuẩn hóa 1NF-3NF, Indexing và tối ưu truy vấn.',
    descEng: 'Schema design, normalization, transactions, ACID properties & indexing.',
    iconType: 'databases',
    color: '#6366f1', // indigo
  },
  {
    id: 'linux-shell',
    nameVie: 'Hệ điều hành Linux (Linux Shell)',
    nameEng: 'Linux Shell',
    descVie: 'Lệnh Bash, đường ống dẫn Pipe, xử lý tệp tin grep/awk/sed và viết shell script.',
    descEng: 'Bash scripting, pipes and redirects, text processing with grep, awk & sed.',
    iconType: 'linux-shell',
    color: '#64748b', // slate
  },
  {
    id: 'fp',
    nameVie: 'Lập trình hàm (Functional Programming)',
    nameEng: 'Functional Programming',
    descVie: 'Hàm thuần túy Pure Functions, đệ quy, Map/Filter/Reduce và tính bất biến.',
    descEng: 'Pure functions, recursion, lambda calculus, immutability & monads.',
    iconType: 'fp',
    color: '#14b8a6', // teal
  },
  {
    id: 'regex',
    nameVie: 'Biểu thức chính quy (Regex)',
    nameEng: 'Regex',
    descVie: 'Khớp mẫu chuỗi, nhóm bắt giữ (Capturing groups), lookahead và validation dữ liệu.',
    descEng: 'Pattern matching, character classes, lookarounds & string validation.',
    iconType: 'regex',
    color: '#a855f7', // violet
  },
  {
    id: 'react',
    nameVie: 'Lập trình Web React (React)',
    nameEng: 'React',
    descVie: 'Xây dựng component, Hooks (useState, useEffect, useMemo), Props và quản lý state.',
    descEng: 'Component architecture, Hooks, Props, virtual DOM & unidirectional data flow.',
    iconType: 'react',
    color: '#06b6d4', // cyan
  },
];
