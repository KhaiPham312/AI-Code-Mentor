# Graph Report - AI-Code-Mentor  (2026-10-31)

## Corpus Check
- 121 files · ~123,659 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 4, .ini 2, .bak 1)

## Summary
- 755 nodes · 1874 edges · 48 communities (35 shown, 13 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Auth UI & Layout
- Admin Dashboard & Course Management
- Submission Status & Analytics UI
- Frontend Dependencies & Config
- Auth API Endpoints
- Backend Dependency Injection & Guards
- Admin Management API
- Database Migrations & Sessions
- Backend Data Models
- Code Execution (Run & Submit)
- Alembic Migration Scripts
- AI Mentor Chat (Frontend)
- App Routing & Entry
- Student Workspace (Web IDE)
- TypeScript Configuration
- Pydantic Schemas
- Math/Markdown Renderer & Problem View
- Exercise Management API
- Integration Test Scripts (CJS)
- Exercise & Submission Service (Frontend)
- Submission History API
- IDE i18n & Code Editor Props
- Language Tracks & Courses
- Email Service
- Script Utilities (Storage & Hooks)
- Analytics Breakdown Scripts
- Teacher Dashboard Update Scripts
- Student Workspace Update Scripts
- Constraint Check Scripts
- Submissions Page Update Scripts
- Teacher Dashboard M3 Scripts
- Teacher Data Update Scripts
- User Storage Update Scripts
- Backend App Settings
- Code Analysis Utilities
- Line Inspector Scripts
- Analytics Locator Scripts
- Health Check API
- Server Check Script
- Vite Environment Types
- SVG Icons (File)
- SVG Icons (Globe)
- SVG Icons (Next.js)
- SVG Icons (Vercel)
- SVG Icons (Window)

## God Nodes (most connected - your core abstractions)
1. `User` - 37 edges
2. `react` - 33 edges
3. `User` - 32 edges
4. `Language` - 31 edges
5. `StudentWorkspace()` - 24 edges
6. `lucide-react` - 22 edges
7. `ThemeMode` - 22 edges
8. `TeacherDashboard()` - 20 edges
9. `getUserStorageKey()` - 18 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Socratic Prompt Engineering` --conceptually_related_to--> `Socratic AI Mentor Pedagogy`  [INFERRED]
  ai-mentor-be/BACKEND_PREPARATION.md → README.md
- `Vite App Entry Point (index.html)` --conceptually_related_to--> `Frontend Stack (React 19 + Vite + TypeScript + TailwindCSS)`  [INFERRED]
  ai-mentor-fe/index.html → README.md
- `Next.js Frontend Application` --references--> `Frontend Stack (React 19 + Vite + TypeScript + TailwindCSS)`  [INFERRED]
  ai-mentor-fe/README.md → README.md
- `Project Report Outline (Chapters 1-7)` --references--> `4-Layer System Architecture`  [INFERRED]
  sample.txt → ai-mentor-be/BACKEND_PREPARATION.md
- `Project Report Outline (Chapters 1-7)` --references--> `Sandbox Security (AST + Regex + setrlimit)`  [INFERRED]
  sample.txt → ai-mentor-be/BACKEND_PREPARATION.md

## Import Cycles
- 2-file cycle: `ai-mentor-fe/src/services/mockTeacherData.ts -> ai-mentor-fe/src/services/userStorage.ts -> ai-mentor-fe/src/services/mockTeacherData.ts`

## Hyperedges (group relationships)
- **Core Database Entities** — ai_mentor_be_database_db_des_users_table, ai_mentor_be_database_db_des_exercises_table, ai_mentor_be_database_db_des_submissions_table, ai_mentor_be_database_db_des_chat_history_table [EXTRACTED 1.00]
- **Socratic AI Mentor User Flow** — readme_socratic_ai_mentor, readme_floating_ai_mentor_chat, ai_mentor_be_backend_preparation_prompt_engineering, ai_mentor_be_database_db_des_chat_history_table [INFERRED 0.85]
- **Code Execution and Grading Pipeline** — readme_online_judge, ai_mentor_be_readme_sandbox, ai_mentor_be_backend_preparation_adapter_pattern_runner, ai_mentor_be_database_db_des_test_cases_table, ai_mentor_be_database_db_des_submissions_table [INFERRED 0.85]

## Communities (48 total, 13 thin omitted)

### Community 0 - "Auth UI & Layout"
Cohesion: 0.07
Nodes (59): @heroicons/react@^2.2.0, AuthLayout(), AuthLayoutProps, BrandSidebar(), BrandSidebarProps, ForgotPasswordForm(), ForgotPasswordFormProps, getAuthErrorMessage() (+51 more)

### Community 1 - "Admin Dashboard & Course Management"
Cohesion: 0.09
Nodes (53): AdminDashboardProps, AdminTab, CourseDetailView(), CourseDetailViewProps, renderTrackHeaderIcon(), DashboardHero(), DashboardHeroProps, DayContribution (+45 more)

### Community 2 - "Submission Status & Analytics UI"
Cohesion: 0.07
Nodes (56): StatusBadge(), StatusBadgeProps, SubmissionStatusType, AnalyticsBreakdown(), AnalyticsBreakdownProps, TeacherAITranscriptDrawer(), TeacherAITranscriptDrawerProps, TeacherAssignmentModal() (+48 more)

### Community 3 - "Frontend Dependencies & Config"
Cohesion: 0.06
Nodes (41): dependencies, gsap@^3.15.0, katex@^0.19.0, lucide-react@^1.16.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0, three@^0.186.1 (+33 more)

### Community 4 - "Auth API Endpoints"
Cohesion: 0.13
Nodes (18): forgot_password(), ForgotPasswordRequest, ForgotPasswordResponse, get_current_user_profile(), login(), register(), reset_password(), ResetPasswordRequest (+10 more)

### Community 5 - "Backend Dependency Injection & Guards"
Cohesion: 0.11
Nodes (10): get_current_active_user(), get_current_teacher_or_admin(), get_current_user(), chat_with_ai_mentor(), get_chat_history(), get_db(), root(), ChatMessageCreate (+2 more)

### Community 6 - "Admin Management API"
Cohesion: 0.17
Nodes (22): get_current_admin(), create_user_by_admin(), delete_user_by_admin(), get_all_users(), get_platform_analytics(), get_security_logs(), get_system_ai_config(), reset_user_password() (+14 more)

### Community 7 - "Database Migrations & Sessions"
Cohesion: 0.21
Nodes (10): downgrade(), upgrade(), ChatHistory, Class, ClassEnrollment, Subject, Exercise, TestCase (+2 more)

### Community 8 - "Backend Data Models"
Cohesion: 0.08
Nodes (21): Admin Governance and Security Auditing, Alembic DB Migration, Sandbox Security (AST + Regex + setrlimit), Chat History Table, Classes Table, Exercises Table, Subjects Table, Submissions Table (+13 more)

### Community 9 - "Code Execution (Run & Submit)"
Cohesion: 0.13
Nodes (4): run_sample_code(), submit_code(), CodeRunner, SecuritySanitizer

### Community 10 - "Alembic Migration Scripts"
Cohesion: 0.10
Nodes (10): run_migrations_offline(), run_migrations_online(), ChatHistory, Class, ClassEnrollment, Exercise, Subject, Submission (+2 more)

### Community 11 - "AI Mentor Chat (Frontend)"
Cohesion: 0.18
Nodes (18): FloatingAIMentorChat(), BackendChatResponse, fetchAIConversationHistory(), normalizeIntent(), sendAIMessage(), SendMessagePayload, VALID_SOCRATIC_INTENTS, api (+10 more)

### Community 12 - "App Routing & Entry"
Cohesion: 0.18
Nodes (17): App(), clearSessionState(), AdminDashboard(), SettingsPage(), SubmissionsPage(), setAuthToken(), AppView, buildRouteUrl() (+9 more)

### Community 13 - "Student Workspace (Web IDE)"
Cohesion: 0.23
Nodes (16): CodeEditor(), StudentWorkspace(), loadData(), TerminalPanel(), fetchExerciseById(), fetchSubmissionsForExercise(), getLanguageOptionsForContext(), getExerciseById() (+8 more)

### Community 14 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 15 - "Pydantic Schemas"
Cohesion: 0.17
Nodes (11): main(), add_bullet(), add_caption(), add_h1(), add_h2(), add_h3(), add_h4(), add_p() (+3 more)

### Community 16 - "Math/Markdown Renderer & Problem View"
Cohesion: 0.19
Nodes (13): MathMarkdownRenderer(), MathMarkdownRendererProps, ProblemDescription(), ProblemDescriptionProps, StoredSubmission, EXERCISE_EN, ExerciseEnTranslation, localizeExercise() (+5 more)

### Community 17 - "Exercise Management API"
Cohesion: 0.28
Nodes (10): create_exercise(), get_exercise_detail(), list_exercises(), ExerciseBase, ExerciseCreate, ExerciseDetail, ExerciseListItem, TestCaseBase (+2 more)

### Community 18 - "Integration Test Scripts (CJS)"
Cohesion: 0.12
Nodes (15): analyticsFile, breakdownExists, enFile, fs, hasAllCourses, hasCourse, hasDynamicStorage, hasExercise (+7 more)

### Community 19 - "Exercise & Submission Service (Frontend)"
Cohesion: 0.23
Nodes (14): BackendCodeRunResponse, BackendExerciseDetail, BackendExerciseListItem, BackendSubmissionItem, BackendTestCase, evaluateCodeLocally(), executeStudentCode(), fetchExerciseByIdSync() (+6 more)

### Community 20 - "Submission History API"
Cohesion: 0.41
Nodes (7): get_submission_history(), CodeRunRequest, CodeRunResponse, SubmissionCreate, SubmissionDetail, SubmissionResponse, TestCaseResult

### Community 21 - "IDE i18n & Code Editor Props"
Cohesion: 0.29
Nodes (9): FloatingAIMentorChatProps, CodeEditorProps, ideTranslations, Language, StudentWorkspaceProps, TerminalPanelProps, getInitialOptionForExercise(), LanguageOption (+1 more)

### Community 22 - "Language Tracks & Courses"
Cohesion: 0.18
Nodes (10): ALGORITHMS_LANGUAGES, C_LANGUAGES, CANONICAL_COURSES, CourseTrackConfig, CPP_LANGUAGES, FP_LANGUAGES, JAVA_LANGUAGES, LINUX_LANGUAGES (+2 more)

### Community 25 - "Script Utilities (Storage & Hooks)"
Cohesion: 0.29
Nodes (4): content, fs, content, fs

### Community 26 - "Analytics Breakdown Scripts"
Cohesion: 0.29
Nodes (6): content, endIndex, filePath, fs, path, startIndex

### Community 27 - "Teacher Dashboard Update Scripts"
Cohesion: 0.29
Nodes (6): content, endIndex, filePath, fs, path, startIndex

### Community 28 - "Student Workspace Update Scripts"
Cohesion: 0.33
Nodes (4): content, filePath, fs, path

### Community 29 - "Constraint Check Scripts"
Cohesion: 0.40
Nodes (3): { execSync }, fs, touchedFiles

### Community 30 - "Submissions Page Update Scripts"
Cohesion: 0.40
Nodes (4): content, filePath, fs, path

### Community 31 - "Teacher Dashboard M3 Scripts"
Cohesion: 0.40
Nodes (4): content, filePath, fs, path

### Community 32 - "Teacher Data Update Scripts"
Cohesion: 0.40
Nodes (4): content, filePath, fs, path

### Community 33 - "User Storage Update Scripts"
Cohesion: 0.40
Nodes (4): content, filePath, fs, path

### Community 35 - "Code Analysis Utilities"
Cohesion: 0.50
Nodes (3): content, fs, lines

### Community 36 - "Line Inspector Scripts"
Cohesion: 0.50
Nodes (3): content, fs, lines

### Community 37 - "Analytics Locator Scripts"
Cohesion: 0.50
Nodes (3): content, fs, lines

## Knowledge Gaps
- **12 isolated node(s):** `JWT Authentication`, `Classes Table`, `Test Cases Table`, `Admin Governance and Security Auditing`, `Alembic DB Migration` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 244 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Admin Dashboard & Course Management` to `Auth UI & Layout`, `Submission Status & Analytics UI`, `Frontend Dependencies & Config`, `AI Mentor Chat (Frontend)`, `App Routing & Entry`, `Student Workspace (Web IDE)`, `Math/Markdown Renderer & Problem View`, `IDE i18n & Code Editor Props`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Are the 25 inferred relationships involving `User` (e.g. with `get_current_active_user()` and `get_current_admin()`) actually correct?**
  _`User` has 25 INFERRED edges - model-reasoned connections that need verification._
- **What connects `JWT Authentication`, `Classes Table`, `Test Cases Table` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth UI & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.06921529175050302 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Admin Dashboard & Course Management` to `Submission Status & Analytics UI`, `Frontend Dependencies & Config`, `AI Mentor Chat (Frontend)`, `Student Workspace (Web IDE)`, `Math/Markdown Renderer & Problem View`, `IDE i18n & Code Editor Props`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `Admin Dashboard & Course Management` be split into smaller, more focused modules?**
  _Cohesion score 0.09482001755926252 - nodes in this community are weakly interconnected._
- **Why does `User` connect `Admin Dashboard & Course Management` to `Auth UI & Layout`, `Submission Status & Analytics UI`, `App Routing & Entry`, `Student Workspace (Web IDE)`, `Math/Markdown Renderer & Problem View`, `IDE i18n & Code Editor Props`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._