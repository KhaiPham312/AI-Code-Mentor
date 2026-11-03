# Graph Report - AI-Code-Mentor  (2026-11-03)

## Corpus Check
- 114 files · ~122,429 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 4, .ini 2, .bak 1)

## Summary
- 773 nodes · 1889 edges · 48 communities (35 shown, 13 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a753ed7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- postgres
- Alembic Migration Scripts
- AI Mentor Chat (Frontend)
- AI Code Mentor System
- StudentWorkspace.tsx
- TypeScript Configuration
- Pydantic Schemas
- languageTracks.ts
- Exercise Management API
- Integration Test Scripts (CJS)
- ProblemDescription.tsx
- submissions.py
- TerminalPanel.tsx
- exerciseService.ts
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
- chat_with_ai_mentor
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
- `Vite App Entry Point (index.html)` --conceptually_related_to--> `Frontend Stack (React 19 + Vite + TypeScript + TailwindCSS)`  [INFERRED]
  ai-mentor-fe/index.html → README.md
- `Next.js Frontend Application` --references--> `Frontend Stack (React 19 + Vite + TypeScript + TailwindCSS)`  [INFERRED]
  ai-mentor-fe/README.md → README.md
- `Socratic Prompt Engineering` --conceptually_related_to--> `Socratic AI Mentor Pedagogy`  [INFERRED]
  ai-mentor-be/BACKEND_PREPARATION.md → README.md
- `get_current_user()` --uses--> `User`  [INFERRED]
  ai-mentor-be/app/api/deps.py → ai-mentor-be/app/models/user.py
- `get_current_active_user()` --uses--> `User`  [INFERRED]
  ai-mentor-be/app/api/deps.py → ai-mentor-be/app/models/user.py

## Import Cycles
- 2-file cycle: `ai-mentor-fe/src/services/mockTeacherData.ts -> ai-mentor-fe/src/services/userStorage.ts -> ai-mentor-fe/src/services/mockTeacherData.ts`

## Hyperedges (group relationships)
- **Core Database Entities** — ai_mentor_be_database_db_des_users_table, ai_mentor_be_database_db_des_exercises_table, ai_mentor_be_database_db_des_submissions_table, ai_mentor_be_database_db_des_chat_history_table [EXTRACTED 1.00]
- **Code Execution and Grading Pipeline** — readme_online_judge, ai_mentor_be_readme_sandbox, ai_mentor_be_backend_preparation_adapter_pattern_runner, ai_mentor_be_database_db_des_test_cases_table, ai_mentor_be_database_db_des_submissions_table [INFERRED 0.85]
- **Socratic AI Mentor User Flow** — readme_socratic_ai_mentor, readme_floating_ai_mentor_chat, ai_mentor_be_backend_preparation_prompt_engineering, ai_mentor_be_database_db_des_chat_history_table [INFERRED 0.85]

## Communities (48 total, 13 thin omitted)

### Community 0 - "Auth UI & Layout"
Cohesion: 0.05
Nodes (74): App(), clearSessionState(), AdminDashboard(), AuthLayout(), AuthLayoutProps, BrandSidebar(), BrandSidebarProps, ForgotPasswordForm() (+66 more)

### Community 1 - "Admin Dashboard & Course Management"
Cohesion: 0.10
Nodes (53): AdminDashboardProps, AdminTab, CourseDetailView(), CourseDetailViewProps, renderTrackHeaderIcon(), DashboardHero(), DashboardHeroProps, DayContribution (+45 more)

### Community 2 - "Submission Status & Analytics UI"
Cohesion: 0.08
Nodes (52): AnalyticsBreakdown(), AnalyticsBreakdownProps, TeacherAITranscriptDrawer(), TeacherAITranscriptDrawerProps, TeacherAssignmentModal(), TeacherCodeReviewModal(), TeacherDashboard(), COMPREHENSIVE_EXERCISES (+44 more)

### Community 3 - "Frontend Dependencies & Config"
Cohesion: 0.06
Nodes (42): dependencies, gsap@^3.15.0, @heroicons/react@^2.2.0, katex@^0.19.0, lucide-react@^1.16.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0 (+34 more)

### Community 4 - "Auth API Endpoints"
Cohesion: 0.13
Nodes (12): forgot_password(), ForgotPasswordRequest, ForgotPasswordResponse, login(), register(), reset_password(), ResetPasswordRequest, ResetPasswordResponse (+4 more)

### Community 5 - "Backend Dependency Injection & Guards"
Cohesion: 0.18
Nodes (5): get_current_active_user(), get_current_user(), get_current_user_profile(), get_db(), root()

### Community 6 - "Admin Management API"
Cohesion: 0.17
Nodes (22): get_current_admin(), create_user_by_admin(), delete_user_by_admin(), get_all_users(), get_platform_analytics(), get_security_logs(), get_system_ai_config(), reset_user_password() (+14 more)

### Community 7 - "Database Migrations & Sessions"
Cohesion: 0.24
Nodes (7): downgrade(), upgrade(), ChatHistory, Class, ClassEnrollment, Subject, Submission

### Community 8 - "Backend Data Models"
Cohesion: 0.13
Nodes (14): Admin Governance and Security Auditing, Alembic DB Migration, Sandbox Security (AST + Regex + setrlimit), Chat History Table, Classes Table, Exercises Table, Subjects Table, Submissions Table (+6 more)

### Community 9 - "postgres"
Cohesion: 0.11
Nodes (18): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, interval, retries, test, timeout, container_name (+10 more)

### Community 10 - "Alembic Migration Scripts"
Cohesion: 0.06
Nodes (13): run_migrations_offline(), run_migrations_online(), run_sample_code(), CodeRunner, SecuritySanitizer, ChatHistory, Class, ClassEnrollment (+5 more)

### Community 11 - "AI Mentor Chat (Frontend)"
Cohesion: 0.15
Nodes (20): FloatingAIMentorChat(), MathMarkdownRenderer(), MathMarkdownRendererProps, BackendChatResponse, fetchAIConversationHistory(), normalizeIntent(), sendAIMessage(), SendMessagePayload (+12 more)

### Community 12 - "AI Code Mentor System"
Cohesion: 0.24
Nodes (6): Vite App Entry Point (index.html), Next.js Frontend Application, AI Code Mentor System, FloatingAIMentorChat Component, Online Judge / Code Execution, StudentWorkspace Web IDE

### Community 13 - "StudentWorkspace.tsx"
Cohesion: 0.20
Nodes (21): CodeEditor(), StudentWorkspace(), loadData(), evaluateCodeLocally(), executeStudentCode(), fetchExerciseById(), fetchExerciseByIdSync(), fetchSubmissionsForExercise() (+13 more)

### Community 14 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 15 - "Pydantic Schemas"
Cohesion: 0.17
Nodes (11): main(), add_bullet(), add_caption(), add_h1(), add_h2(), add_h3(), add_h4(), add_p() (+3 more)

### Community 16 - "languageTracks.ts"
Cohesion: 0.16
Nodes (13): CodeEditorProps, ALGORITHMS_LANGUAGES, C_LANGUAGES, CANONICAL_COURSES, CourseTrackConfig, CPP_LANGUAGES, FP_LANGUAGES, getInitialOptionForExercise() (+5 more)

### Community 17 - "Exercise Management API"
Cohesion: 0.21
Nodes (13): get_current_teacher_or_admin(), create_exercise(), get_exercise_detail(), list_exercises(), Exercise, TestCase, ExerciseBase, ExerciseCreate (+5 more)

### Community 18 - "Integration Test Scripts (CJS)"
Cohesion: 0.12
Nodes (15): analyticsFile, breakdownExists, enFile, fs, hasAllCourses, hasCourse, hasDynamicStorage, hasExercise (+7 more)

### Community 19 - "ProblemDescription.tsx"
Cohesion: 0.23
Nodes (11): ProblemDescription(), ProblemDescriptionProps, StoredSubmission, EXERCISE_EN, ExerciseEnTranslation, localizeExercise(), Difficulty, Exercise (+3 more)

### Community 20 - "submissions.py"
Cohesion: 0.17
Nodes (16): get_submission_history(), submit_code(), ChatMessageCreate, ChatMessageResponse, CodeRunRequest, CodeRunResponse, SubmissionCreate, SubmissionDetail (+8 more)

### Community 21 - "TerminalPanel.tsx"
Cohesion: 0.23
Nodes (10): FloatingAIMentorChatProps, StatusBadge(), StatusBadgeProps, SubmissionStatusType, ideTranslations, Language, StudentWorkspaceProps, TerminalPanel() (+2 more)

### Community 22 - "exerciseService.ts"
Cohesion: 0.29
Nodes (10): BackendCodeRunResponse, BackendExerciseDetail, BackendExerciseListItem, BackendSubmissionItem, BackendTestCase, fetchExercises(), mapBackendExerciseToFrontend(), normalizeDifficulty() (+2 more)

### Community 25 - "Script Utilities (Storage & Hooks)"
Cohesion: 0.18
Nodes (7): content, fs, content, fs, lines, content, fs

### Community 26 - "Analytics Breakdown Scripts"
Cohesion: 0.29
Nodes (6): content, endIndex, filePath, fs, path, startIndex

### Community 27 - "Teacher Dashboard Update Scripts"
Cohesion: 0.29
Nodes (6): content, endIndex, filePath, fs, path, startIndex

### Community 28 - "Student Workspace Update Scripts"
Cohesion: 0.40
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
Cohesion: 0.33
Nodes (4): content, filePath, fs, path

### Community 33 - "User Storage Update Scripts"
Cohesion: 0.40
Nodes (4): content, filePath, fs, path

### Community 35 - "Code Analysis Utilities"
Cohesion: 0.50
Nodes (3): content, fs, lines

### Community 36 - "chat_with_ai_mentor"
Cohesion: 0.33
Nodes (3): chat_with_ai_mentor(), get_chat_history(), AIService

### Community 37 - "Analytics Locator Scripts"
Cohesion: 0.50
Nodes (3): content, fs, lines

## Knowledge Gaps
- **12 isolated node(s):** `Vite App Entry Point (index.html)`, `Next.js Frontend Application`, `File Icon SVG`, `Globe Icon SVG`, `Next.js Logo SVG` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 258 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Admin Dashboard & Course Management` to `Auth UI & Layout`, `Submission Status & Analytics UI`, `Frontend Dependencies & Config`, `AI Mentor Chat (Frontend)`, `StudentWorkspace.tsx`, `languageTracks.ts`, `ProblemDescription.tsx`, `TerminalPanel.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Are the 25 inferred relationships involving `User` (e.g. with `get_current_active_user()` and `get_current_admin()`) actually correct?**
  _`User` has 25 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Vite App Entry Point (index.html)`, `Next.js Frontend Application`, `File Icon SVG` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth UI & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.05418227215980025 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Admin Dashboard & Course Management` to `Submission Status & Analytics UI`, `Frontend Dependencies & Config`, `AI Mentor Chat (Frontend)`, `StudentWorkspace.tsx`, `languageTracks.ts`, `ProblemDescription.tsx`, `TerminalPanel.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `Admin Dashboard & Course Management` be split into smaller, more focused modules?**
  _Cohesion score 0.09505541346973571 - nodes in this community are weakly interconnected._
- **Why does `User` connect `Admin Dashboard & Course Management` to `Auth UI & Layout`, `Submission Status & Analytics UI`, `StudentWorkspace.tsx`, `ProblemDescription.tsx`, `TerminalPanel.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._