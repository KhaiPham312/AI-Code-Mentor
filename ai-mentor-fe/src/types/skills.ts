export type SkillIconType =
  | 'algorithms'
  | 'data-structures'
  | 'mathematics'
  | 'ai'
  | 'c'
  | 'cpp'
  | 'java'
  | 'python'
  | 'sql';

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
];
