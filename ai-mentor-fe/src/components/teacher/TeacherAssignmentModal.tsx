import React, { useState } from 'react';
import { TeacherAssignment } from '../../services/mockTeacherData';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  Bot,
  Code,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface TestCaseInput {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAssignment: (assignment: Partial<TeacherAssignment>) => void;
  currentLang: Language;
  currentTheme: ThemeMode;
  selectedClassId: string;
}

import { CANONICAL_COURSES } from '../../services/languageTracks';

export const TeacherAssignmentModal: React.FC<TeacherAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSaveAssignment,
  currentLang,
  currentTheme,
  selectedClassId,
}) => {
  const isDark = currentTheme === 'dark';
  const isVie = currentLang === 'vie';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('algorithms');
  const [primaryLanguage, setPrimaryLanguage] = useState<string>('C++17');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [targetClass, setTargetClass] = useState(selectedClassId);
  const [deadline, setDeadline] = useState('2026-10-25T23:59');
  const [description, setDescription] = useState('');
  const [enableAISocratic, setEnableAISocratic] = useState(true);
  const [enableAntiPlagiarism, setEnableAntiPlagiarism] = useState(true);

  // Test cases builder state
  const [testCases, setTestCases] = useState<TestCaseInput[]>([
    {
      id: 1,
      input: '5\n1 2 3 4 5',
      expectedOutput: '2 3 5',
      isHidden: false,
    },
    {
      id: 2,
      input: '4\n4 6 8 9',
      expectedOutput: '-1',
      isHidden: false,
    },
    {
      id: 3,
      input: '1000\n[random large array]',
      expectedOutput: '[prime numbers list]',
      isHidden: true,
    },
  ]);

  if (!isOpen) return null;

  const currentCourseConfig =
    CANONICAL_COURSES.find((c) => c.id === category) || CANONICAL_COURSES[0];
  const availableLanguageOptions = currentCourseConfig.options;

  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    const cfg = CANONICAL_COURSES.find((c) => c.id === catId);
    if (cfg) {
      setPrimaryLanguage(cfg.defaultLangLabel);
    }
  };

  const handleAddTestCase = () => {
    const newId = testCases.length + 1;
    setTestCases([
      ...testCases,
      {
        id: newId,
        input: '',
        expectedOutput: '',
        isHidden: false,
      },
    ]);
  };

  const handleRemoveTestCase = (id: number) => {
    if (testCases.length <= 1) return;
    setTestCases(testCases.filter((tc) => tc.id !== id));
  };

  const handleUpdateTestCase = (id: number, field: keyof TestCaseInput, value: any) => {
    setTestCases(
      testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert(isVie ? 'Vui lòng nhập tiêu đề bài tập!' : 'Please enter an assignment title!');
      return;
    }

    onSaveAssignment({
      title,
      category: currentCourseConfig ? currentCourseConfig.name : category,
      difficulty,
      language: primaryLanguage,
      classGroup: targetClass,
      deadline: `${deadline.replace('T', ' ')}`,
      deadlineDate: deadline,
      submittedCount: 0,
      totalStudents: 68,
      passRate: 0,
      aiSocraticEnabled: enableAISocratic,
      antiPlagiarismEnabled: enableAntiPlagiarism,
      status: 'active',
      testCasesCount: testCases.length,
      description,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative z-10 w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-[#0f172a] text-slate-100 border-slate-800'
            : 'bg-white text-neutral-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-[#0b1322]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isVie ? 'Tạo & Giao Bài Tập Mới' : 'Create & Assign New Problem'}
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-neutral-500'
                }`}
              >
                {isVie
                  ? 'Thiết lập yêu cầu thuật toán, cấu hình AI Mentor & Test Cases'
                  : 'Define algorithmic requirements, AI Mentor rules & Test Cases'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-slate-200 text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold mb-1">
              {isVie ? 'Tiêu đề bài tập:' : 'Assignment Title:'}
            </label>
            <input
              type="text"
              required
              placeholder={isVie ? 'VD: Bài 06: Tìm kiếm chuỗi con KMP tối ưu' : 'e.g. Problem 06: KMP Substring Search'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2.5 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-neutral-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Category, Difficulty, Class in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1 font-sans">
                {isVie ? 'Danh mục chủ đề (Khóa học):' : 'Category (Course):'}
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`w-full p-2.5 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-neutral-900'
                }`}
              >
                {CANONICAL_COURSES.map((cfg) => (
                  <option key={cfg.id} value={cfg.id}>
                    {cfg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 font-sans">
                {isVie ? 'Độ khó:' : 'Difficulty:'}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className={`w-full p-2.5 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-neutral-900'
                }`}
              >
                <option value="easy">Cơ bản (Easy)</option>
                <option value="medium">Trung bình (Medium)</option>
                <option value="hard">Nâng cao (Hard)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 font-sans">
                {isVie ? 'Lớp áp dụng:' : 'Assigned Class:'}
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className={`w-full p-2.5 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-neutral-900'
                }`}
              >
                <option value="K71A-CNTT">Lớp K71A - Công nghệ Thông tin (Cấu trúc dữ liệu)</option>
                <option value="K72A-KHMT">Lớp K72A - Khoa học Máy tính (Thuật toán)</option>
                <option value="K73A-CNTT">Lớp K73A - Công nghệ Thông tin (Lập trình C++)</option>
                <option value="K73B-KHMT">Lớp K73B - Khoa học Máy tính (Lập trình Python)</option>
                <option value="ALL">Tất cả các lớp</option>
              </select>
            </div>
          </div>

          {/* Deadline & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5 font-sans">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isVie ? 'Hạn chót nộp bài (Deadline):' : 'Submission Deadline:'}</span>
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`w-full p-2.5 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5 font-sans">
                <Code className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isVie ? 'Ngôn ngữ lập trình chính:' : 'Primary Language:'}</span>
              </label>
              <select
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value)}
                aria-label="Chọn ngôn ngữ lập trình chính"
                className={`w-full p-2.5 rounded-lg border font-sans font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-neutral-900'
                }`}
              >
                {availableLanguageOptions.map((opt) => (
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold mb-1">
              {isVie ? 'Mô tả bài toán & Ràng buộc:' : 'Problem Description & Constraints:'}
            </label>
            <textarea
              rows={3}
              placeholder={isVie ? 'Mô tả yêu cầu đầu vào, đầu ra, và các ràng buộc về thời gian / bộ nhớ...' : 'Problem requirements, input/output specifications, time/memory constraints...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2.5 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-neutral-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* AI Policy & Anti-Plagiarism Toggles */}
          <div
            className={`p-3.5 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-[#15233c]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="font-bold text-[11px] uppercase tracking-wider block text-indigo-400">
              {isVie ? 'Chính sách giám sát AI & Chống gian lận' : 'AI Policy & Integrity Rules'}
            </span>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="font-semibold block">
                    {isVie ? 'Bật trợ lý AI Socratic Mentor' : 'Enable AI Socratic Mentor'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {isVie
                      ? 'AI chỉ gợi mở tư duy, nghiêm cấm nhả code nguyên mẫu giải hộ'
                      : 'AI guides thinking, strictly forbids outputting full solutions'}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableAISocratic}
                onChange={(e) => setEnableAISocratic(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <div>
                  <span className="font-semibold block">
                    {isVie ? 'Kiểm tra đạo văn & độ tương đồng code' : 'Code Similarity & Plagiarism Scan'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {isVie
                      ? 'Tự động quét thuật toán đối chiếu với các bài nộp khác trong lớp'
                      : 'Automatically scans code AST against classmates submissions'}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableAntiPlagiarism}
                onChange={(e) => setEnableAntiPlagiarism(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Test Cases Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold flex items-center gap-1.5 font-sans">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isVie ? 'Bộ dữ liệu kiểm thử (Test Cases):' : 'Test Cases Suite:'}</span>
                <span className="text-[10px] text-slate-400 font-sans font-medium">({testCases.length})</span>
              </span>

              <button
                type="button"
                onClick={handleAddTestCase}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1 font-sans"
              >
                <Plus className="w-3 h-3" />
                <span>{isVie ? 'Thêm Test Case' : 'Add Case'}</span>
              </button>
            </div>

            <div className="space-y-3 font-sans">
              {testCases.map((tc, idx) => (
                <div
                  key={tc.id}
                  className={`p-3 rounded-xl border space-y-2 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-sans">#{idx + 1}</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) =>
                            handleUpdateTestCase(tc.id, 'isHidden', e.target.checked)
                          }
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className={tc.isHidden ? 'text-amber-400 font-semibold' : ''}>
                          {isVie ? 'Test Case Ẩn (Chấm điểm)' : 'Hidden Test Case'}
                        </span>
                      </label>
                    </div>

                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(tc.id)}
                        className="text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Input:</span>
                      <textarea
                        rows={2}
                        value={tc.input}
                        onChange={(e) =>
                          handleUpdateTestCase(tc.id, 'input', e.target.value)
                        }
                        placeholder="1 2 3..."
                        className={`w-full p-1.5 font-mono text-[11px] rounded border ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-200'
                            : 'bg-white border-slate-300 text-neutral-900'
                        }`}
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Expected Output:</span>
                      <textarea
                        rows={2}
                        value={tc.expectedOutput}
                        onChange={(e) =>
                          handleUpdateTestCase(tc.id, 'expectedOutput', e.target.value)
                        }
                        placeholder="Kết quả..."
                        className={`w-full p-1.5 font-mono text-[11px] rounded border ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-emerald-400'
                            : 'bg-white border-slate-300 text-emerald-700'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div
            className={`pt-4 border-t flex items-center justify-end space-x-2 shrink-0 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-semibold border transition ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-200 text-neutral-700'
              }`}
            >
              {isVie ? 'Hủy bỏ' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-900/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isVie ? 'Lưu & Phát hành bài tập' : 'Save & Publish Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
