const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/teacher/TeacherDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports from teacherAnalytics
if (!content.includes('getWeeklyActivity')) {
  content = content.replace(
    "import { isTeacherTab, TeacherTab } from '../../services/navigation';",
    `import { isTeacherTab, TeacherTab } from '../../services/navigation';\nimport { getWeeklyActivity, getAllCoursesStats, getClassTotalStudents } from '../../services/teacherAnalytics';`
  );
}

// 2. Add state and memos in TeacherDashboard component
const targetAfterState = `  const isDark = currentTheme === 'dark';\r\n  const isVie = currentLang === 'vie';`;
const targetAfterStateLF = `  const isDark = currentTheme === 'dark';\n  const isVie = currentLang === 'vie';`;

const memosToAdd = `

  const [isCourseProgressExpanded, setIsCourseProgressExpanded] = useState(false);

  const weeklyActivity = useMemo(() => {
    return getWeeklyActivity(selectedClassId);
  }, [selectedClassId, storageTick]);

  const allCoursesProgress = useMemo(() => {
    return getAllCoursesStats(selectedClassId);
  }, [selectedClassId, storageTick]);

  const classTotalStudents = useMemo(() => {
    return getClassTotalStudents(selectedClassId);
  }, [selectedClassId]);

  const peakWeekly = useMemo(() => {
    if (weeklyActivity.length === 0) return { studentCount: 0, day: 'T6' };
    return weeklyActivity.reduce((max, cur) => cur.studentCount > max.studentCount ? cur : max, weeklyActivity[0]);
  }, [weeklyActivity]);`;

if (!content.includes('const [isCourseProgressExpanded, setIsCourseProgressExpanded]')) {
  if (content.includes(targetAfterState)) {
    content = content.replace(targetAfterState, targetAfterState + memosToAdd.replace(/\n/g, '\r\n'));
  } else if (content.includes(targetAfterStateLF)) {
    content = content.replace(targetAfterStateLF, targetAfterStateLF + memosToAdd);
  }
}

// 3. Replace Card 1 and Card 2 JSX
const card12Start = '{/* CARD 1: Enrolled & Active Students with 7-Day Sparkline */}';
const card3Start = '{/* CARD 3: AI Socratic Efficiency */}';

const startIndex = content.indexOf(card12Start);
const endIndex = content.indexOf(card3Start);

if (startIndex !== -1 && endIndex !== -1) {
  const newCardsJSX = `{/* CARD 1: Enrolled & Active (Mục 4.1: Biểu đồ cột 7 ngày có số SV và % từng ngày) */}
          <div
            className={\`p-5 rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between \${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }\`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-sans">
                  {isVie ? 'Tổng sinh viên & Tỷ lệ học' : 'Total Students & Active Rate'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-black font-sans tracking-tight">
                  {classTotalStudents}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                  {isVie ? 'sinh viên' : 'students'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ml-auto font-sans whitespace-nowrap shrink-0">
                  {activeClass.activePercentage}% {isVie ? 'hoạt động' : 'active'}
                </span>
              </div>
            </div>

            {/* 7-Day Mini Sparkline Bars with Exact Numbers & % per Day */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-2 flex justify-between items-center font-sans">
                <span>{isVie ? 'Đăng nhập 7 ngày qua' : '7-Day Activity'}</span>
                <span className="font-sans font-semibold text-emerald-500 whitespace-nowrap shrink-0">
                  {isVie ? \`Cao nhất: \${peakWeekly.studentCount} SV\` : \`Peak: \${peakWeekly.studentCount} students\`}
                </span>
              </div>

              {/* Fixed height chart container: h-32 */}
              <div className="flex items-end justify-between gap-1.5 h-32 pt-6 pb-1">
                {weeklyActivity.map((item, idx) => {
                  const dayName = isVie ? item.day : item.dayEn;
                  const barHeight = Math.max(18, Math.round(item.percent));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-1 group relative">
                      {/* Rich hover tooltip */}
                      <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center px-2 py-1 rounded-md text-[10px] font-medium bg-slate-900 text-white shadow-xl pointer-events-none whitespace-nowrap border border-slate-700/80">
                        <span className="font-bold text-emerald-400">
                          {dayName}: {item.studentCount}/{item.totalStudents} {isVie ? 'SV' : 'std'} ({item.percent}%)
                        </span>
                        <span className="text-[9px] text-slate-300">
                          {item.submissionsCount} {isVie ? 'lượt nộp' : 'subs'} • {isVie ? 'Cao điểm' : 'Peak'}: {item.peakHour}
                        </span>
                      </div>

                      {/* Number + % label directly on/above column: e.g. "52 SV · 76%" */}
                      <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0 mb-0.5 transform -rotate-12 group-hover:rotate-0 transition-transform">
                        {item.studentCount} {isVie ? 'SV' : 'st'} · {item.percent}%
                      </span>

                      {/* Bar column */}
                      <div
                        style={{ height: \`\${barHeight}%\` }}
                        className="w-full rounded-t-md bg-indigo-500/75 group-hover:bg-[#00EA64] transition-all cursor-pointer relative"
                      />
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                        {dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 2: Assignment Completion Progress (Mục 4.2: Tóm tắt theo từng khóa học) */}
          <div
            className={\`p-5 rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between \${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }\`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-sans">
                  {isVie ? 'Tiến độ hoàn thành bài' : 'Assignment Completion Progress'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-black font-sans tracking-tight text-emerald-600 dark:text-emerald-400">
                  {activeClass.completionRate}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isVie ? 'đúng hạn' : 'on time'}
                </span>
              </div>
            </div>

            {/* Tri-color Multi-Segment Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: \`\${(activeClass.maxCompleted / activeClass.totalStudents) * 100}%\` }}
                  className="bg-emerald-500 h-full"
                  title={\`\${isVie ? 'Đạt tối đa' : 'Passed'}: \${activeClass.maxCompleted} \${isVie ? 'SV' : 'students'}\`}
                />
                <div
                  style={{ width: \`\${(activeClass.inProgress / activeClass.totalStudents) * 100}%\` }}
                  className="bg-amber-400 h-full"
                  title={\`\${isVie ? 'Đang làm' : 'In Progress'}: \${activeClass.inProgress} \${isVie ? 'SV' : 'students'}\`}
                />
                <div
                  style={{ width: \`\${(activeClass.notStarted / activeClass.totalStudents) * 100}%\` }}
                  className="bg-rose-500/70 h-full"
                  title={\`\${isVie ? 'Chưa nộp' : 'Not Started'}: \${activeClass.notStarted} \${isVie ? 'SV' : 'students'}\`}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{activeClass.maxCompleted} {isVie ? 'Đạt' : 'Passed'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{activeClass.inProgress} {isVie ? 'Đang làm' : 'WIP'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{activeClass.notStarted} {isVie ? 'Chưa làm' : 'Not yet'}</span>
                </span>
              </div>

              {/* 4.2 Tóm tắt theo từng khóa học (Thanh xếp chồng nhỏ gọn, đánh dấu cao nhất & thấp nhất) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsCourseProgressExpanded((prev) => !prev)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors py-1 cursor-pointer"
                >
                  <span>
                    {isVie ? 'Tỷ lệ theo 9 khóa học' : 'Rate by 9 Courses'} ({allCoursesProgress.length})
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-[#00EA64]">
                    <span>{isCourseProgressExpanded ? (isVie ? 'Thu gọn' : 'Collapse') : (isVie ? 'Chi tiết' : 'Expand')}</span>
                    <ChevronDown className={\`w-3.5 h-3.5 transition-transform duration-200 \${isCourseProgressExpanded ? 'rotate-180' : ''}\`} />
                  </div>
                </button>

                {isCourseProgressExpanded && (
                  <div className="max-h-52 overflow-y-auto space-y-2.5 mt-2 pr-1 custom-scrollbar">
                    {allCoursesProgress.map((course) => {
                      const courseName = isVie ? course.trackNameVie : course.trackNameEng;
                      return (
                        <div key={course.trackId} className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-medium font-sans">
                            <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                              <span className="truncate font-semibold">{courseName}</span>
                              {course.isHighest && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0">
                                  {isVie ? 'Cao nhất' : 'Highest'}
                                </span>
                              )}
                              {course.isLowest && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap shrink-0">
                                  {isVie ? 'Thấp nhất' : 'Lowest'}
                                </span>
                              )}
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0 font-mono text-[9px]">
                              {course.passedPercent}% · {course.inProgressPercent}% · {course.notStartedPercent}%
                            </span>
                          </div>

                          {/* Mini stacked bar */}
                          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                            <div
                              style={{ width: \`\${course.passedPercent}%\` }}
                              className="bg-emerald-500 h-full"
                              title={\`\${isVie ? 'Đạt' : 'Passed'}: \${course.passedPercent}%\`}
                            />
                            <div
                              style={{ width: \`\${course.inProgressPercent}%\` }}
                              className="bg-amber-400 h-full"
                              title={\`\${isVie ? 'Đang làm' : 'In Progress'}: \${course.inProgressPercent}%\`}
                            />
                            <div
                              style={{ width: \`\${course.notStartedPercent}%\` }}
                              className="bg-slate-300 dark:bg-slate-700 h-full"
                              title={\`\${isVie ? 'Chưa làm' : 'Not Started'}: \${course.notStartedPercent}%\`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          `;

  content = content.slice(0, startIndex) + newCardsJSX.replace(/\n/g, content.includes('\r\n') ? '\r\n' : '\n') + content.slice(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated Card 1 and Card 2 in TeacherDashboard.tsx');
} else {
  console.error('Could not find Card 1 and Card 2 boundaries in TeacherDashboard.tsx');
}
