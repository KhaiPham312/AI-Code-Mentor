import React, { useState } from 'react';
import { User } from '../../types/auth';
import { MOCK_EXERCISES } from '../../services/mockExerciseService';
import {
  BookOpen,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Eye,
  LogOut,
  Bot
} from 'lucide-react';

interface StudentAILog {
  id: number;
  studentName: string;
  studentId: string;
  exerciseTitle: string;
  errorEncountered: string;
  studentPrompt: string;
  aiHintSummary: string;
  resolved: boolean;
  timeAgo: string;
}

const MOCK_AI_LOGS: StudentAILog[] = [
  {
    id: 1,
    studentName: 'Nguyễn Văn Minh',
    studentId: '2151050012',
    exerciseTitle: 'Bài 01: Tìm số nguyên tố trong mảng',
    errorEncountered: 'IndexError: list index out of range',
    studentPrompt: 'Em đang bị lỗi này ở dòng 4, tại sao vậy ạ?',
    aiHintSummary: 'Gợi mở về biên mảng N - 1 khi duyệt arr[i+1], hướng dẫn sinh viên đặt lại điều kiện vòng lặp.',
    resolved: true,
    timeAgo: '12 phút trước'
  },
  {
    id: 2,
    studentName: 'Trần Thị Mai',
    studentId: '2151050045',
    exerciseTitle: 'Bài 02: Kiểm tra tính hợp lệ chuỗi ngoặc',
    errorEncountered: 'LogicError: Wrong Answer on Case 2',
    studentPrompt: 'Em dùng stack rồi nhưng test case "([)]" vẫn bị trả về True.',
    aiHintSummary: 'Đặt câu hỏi về thứ tự LIFO của dấu ngoặc mở gần nhất so với dấu ngoặc đóng hiện tại.',
    resolved: true,
    timeAgo: '28 phút trước'
  },
  {
    id: 3,
    studentName: 'Lê Hoàng Nam',
    studentId: '2151050089',
    exerciseTitle: 'Bài 01: Tìm số nguyên tố trong mảng',
    errorEncountered: 'Time Limit Exceeded (> 1000ms)',
    studentPrompt: 'Hàm của em chạy đúng với số nhỏ nhưng số lớn thì bị quay đơ.',
    aiHintSummary: 'Gợi ý kiểm tra ước tới căn bậc hai của n thay vì duyệt tuần tự tới n - 1.',
    resolved: false,
    timeAgo: '45 phút trước'
  },
  {
    id: 4,
    studentName: 'Phạm Đức Anh',
    studentId: '2151050033',
    exerciseTitle: 'Bài 03: Tìm cặp số Two Sum',
    errorEncountered: 'SyntaxError: expected \':\'',
    studentPrompt: 'Báo lỗi SyntaxError ở sau lệnh for là sao ạ?',
    aiHintSummary: 'Chỉ ra quy tắc cú pháp khối lệnh bắt buộc phải có dấu hai chấm trong Python.',
    resolved: true,
    timeAgo: '1 giờ trước'
  }
];

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
  onPreviewStudentIDE?: (exerciseId: number) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  onLogout,
  onPreviewStudentIDE
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'exercises' | 'logs'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form tạo bài tập mới
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [newDesc, setNewDesc] = useState('');

  const filteredLogs = MOCK_AI_LOGS.filter(
    (log) =>
      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.studentId.includes(searchTerm) ||
      log.errorEncountered.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
            AI
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white tracking-wide">
                TEACHER DASHBOARD
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 font-mono">
                Cổng Giảng Viên
              </span>
            </div>
            <span className="text-xs text-slate-400 block -mt-1">
              Trường Đại học Sư phạm Hà Nội • Quản lý & Giám sát AI
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-slate-200">{user.name}</div>
            <div className="text-xs text-indigo-400 font-mono">
              Khoa Công nghệ Thông tin
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-red-900/40 hover:text-red-300 text-slate-300 text-xs font-medium transition border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Tổng quan học tập</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'logs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Log Tương tác AI của Sinh viên</span>
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] border border-indigo-700 font-mono">
                {MOCK_AI_LOGS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('exercises')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'exercises'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ngân hàng bài tập ({MOCK_EXERCISES.length})</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm shadow-blue-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Giao bài tập mới</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Tổng sinh viên tham gia
                </div>
                <div className="text-3xl font-bold text-white mt-2">68</div>
                <div className="text-xs text-slate-400 mt-2">Lớp K71A & K71B CNTT</div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Lượt sinh viên hỏi AI Mentor
                </div>
                <div className="text-3xl font-bold text-amber-400 mt-2">148</div>
                <div className="text-xs text-emerald-400 mt-2">100% tuân thủ Socratic (không nhả code)</div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Tỷ lệ tự sửa lỗi thành công
                </div>
                <div className="text-3xl font-bold text-emerald-400 mt-2">87.5%</div>
                <div className="text-xs text-slate-400 mt-2">Sau gợi ý tư duy của AI</div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Lỗi sinh viên hay gặp nhất
                </div>
                <div className="text-xl font-bold text-rose-400 mt-2 font-mono truncate">
                  IndexError (42%)
                </div>
                <div className="text-xs text-slate-400 mt-2">Kế tiếp: SyntaxError & TLE</div>
              </div>
            </div>

            {/* Quick Summary of Recent Logs */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span>Hoạt động vấn đáp AI gần đây nhất của sinh viên</span>
                </h3>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Xem toàn bộ log →
                </button>
              </div>

              <div className="divide-y divide-slate-700/60">
                {MOCK_AI_LOGS.slice(0, 3).map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{log.studentName}</span>
                        <span className="text-slate-400 font-mono">({log.studentId})</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-blue-400">{log.exerciseTitle}</span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-2">
                        <span className="text-rose-400 font-mono">{log.errorEncountered}</span>
                        <span>→ {log.aiHintSummary}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      {log.resolved ? (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Đã tự sửa xong ✔
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-amber-950 text-amber-400 border border-amber-800">
                          Đang xử lý...
                        </span>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">{log.timeAgo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT AI INTERACTION LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Search filter */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm theo tên sinh viên, mã SV, hoặc loại lỗi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="text-xs text-slate-400">
                Hiển thị {filteredLogs.length} bản ghi log
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Sinh viên</th>
                    <th className="py-3 px-4 font-semibold">Bài tập</th>
                    <th className="py-3 px-4 font-semibold">Lỗi gặp phải</th>
                    <th className="py-3 px-4 font-semibold">Nội dung hỏi & Định hướng của AI</th>
                    <th className="py-3 px-4 font-semibold text-center">Kết quả</th>
                    <th className="py-3 px-4 font-semibold text-right">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-750/50 transition">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div>{log.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{log.studentId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-blue-300 font-medium">
                        {log.exerciseTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-mono text-[11px]">
                          {log.errorEncountered}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="text-slate-300 italic">"{log.studentPrompt}"</div>
                        <div className="text-indigo-300 mt-1 font-sans">
                          🤖 AI: {log.aiHintSummary}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {log.resolved ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                            <Clock className="w-3.5 h-3.5" /> Đang thử
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                        {log.timeAgo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EXERCISES MANAGEMENT */}
        {activeTab === 'exercises' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MOCK_EXERCISES.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          ex.difficulty === 'easy'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : 'bg-amber-950/80 text-amber-400 border-amber-800'
                        }`}
                      >
                        {ex.difficulty.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {ex.sampleTestCases.length + ex.hiddenTestCaseCount} test cases
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-base">
                      {ex.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {ex.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Ngôn ngữ: Python 3</span>
                    {onPreviewStudentIDE && (
                      <button
                        onClick={() => onPreviewStudentIDE(ex.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem thử Web IDE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Giao bài tập mới (Mock) */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Tạo & Giao bài tập mới</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Tiêu đề bài toán:</label>
                  <input
                    type="text"
                    placeholder="VD: Bài 04: Tìm kiếm nhị phân trong mảng đã sắp xếp"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Độ khó:</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="easy">Cơ bản (Easy)</option>
                      <option value="medium">Trung bình (Medium)</option>
                      <option value="hard">Nâng cao (Hard)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Ngôn ngữ:</label>
                    <input
                      type="text"
                      disabled
                      value="Python 3.11"
                      className="w-full p-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Mô tả bài toán:</label>
                  <textarea
                    rows={4}
                    placeholder="Mô tả yêu cầu thuật toán, định dạng đầu vào và đầu ra..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    alert('Đã lưu bài tập mới vào CSDL mock!');
                    setShowCreateModal(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                >
                  Lưu & Giao bài
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
