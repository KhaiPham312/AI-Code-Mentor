# Graph Report - AI-Code-Mentor  (2026-11-09)

## Corpus Check
- 108 files · ~119,413 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 4, .ini 2, .bak 1)

## Summary
- 735 nodes · 1970 edges · 34 communities (19 shown, 15 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7094de6`
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
- define_table.py
- AI Code Mentor System
- StudentWorkspace.tsx
- TypeScript Configuration
- Pydantic Schemas
- CodeRunner
- Exercise Management API
- App.tsx
- start_server.sh
- submissions.py
- aiMentorService.ts
- grade_submission_task
- email.py
- Backend App Settings
- Vite Environment Types
- SVG Icons (File)
- SVG Icons (Globe)
- SVG Icons (Next.js)
- SVG Icons (Vercel)
- SVG Icons (Window)

## God Nodes (most connected - your core abstractions)
1. `User` - 38 edges
2. `Language` - 36 edges
3. `react` - 35 edges
4. `User` - 34 edges
5. `lucide-react` - 24 edges
6. `ThemeMode` - 24 edges
7. `StudentWorkspace()` - 22 edges
8. `getUserStorageKey()` - 20 edges
9. `TeacherDashboard()` - 18 edges
10. `getStoredAccounts()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Vite App Entry Point (index.html)` --conceptually_related_to--> `Frontend Stack (React 19 + Vite + TypeScript + TailwindCSS)`  [INFERRED]
  ai-mentor-fe/index.html → README.md
- `Next.js Frontend Application` --references--> `Frontend Stack (React 19 + Vite + TypeScript + TailwindCSS)`  [INFERRED]
  ai-mentor-fe/README.md → README.md
- `Socratic Prompt Engineering` --conceptually_related_to--> `Socratic AI Mentor Pedagogy`  [INFERRED]
  ai-mentor-be/BACKEND_PREPARATION.md → README.md
- `get_current_active_user()` --uses--> `User`  [INFERRED]
  ai-mentor-be/app/api/deps.py → ai-mentor-be/app/models/user.py
- `get_current_teacher_or_admin()` --uses--> `User`  [INFERRED]
  ai-mentor-be/app/api/deps.py → ai-mentor-be/app/models/user.py

## Import Cycles
- 2-file cycle: `ai-mentor-fe/src/services/mockTeacherData.ts -> ai-mentor-fe/src/services/userStorage.ts -> ai-mentor-fe/src/services/mockTeacherData.ts`

## Hyperedges (group relationships)
- **Core Database Entities** — ai_mentor_be_database_db_des_users_table, ai_mentor_be_database_db_des_exercises_table, ai_mentor_be_database_db_des_submissions_table, ai_mentor_be_database_db_des_chat_history_table [EXTRACTED 1.00]
- **Code Execution and Grading Pipeline** — readme_online_judge, ai_mentor_be_readme_sandbox, ai_mentor_be_backend_preparation_adapter_pattern_runner, ai_mentor_be_database_db_des_test_cases_table, ai_mentor_be_database_db_des_submissions_table [INFERRED 0.85]
- **Socratic AI Mentor User Flow** — readme_socratic_ai_mentor, readme_floating_ai_mentor_chat, ai_mentor_be_backend_preparation_prompt_engineering, ai_mentor_be_database_db_des_chat_history_table [INFERRED 0.85]

## Communities (34 total, 15 thin omitted)

### Community 0 - "Auth UI & Layout"
Cohesion: 0.06
Nodes (70): AuthLayout(), AuthLayoutProps, BrandSidebar(), BrandSidebarProps, ForgotPasswordForm(), ForgotPasswordFormProps, getAuthErrorMessage(), Language (+62 more)

### Community 1 - "Admin Dashboard & Course Management"
Cohesion: 0.10
Nodes (55): AdminDashboard(), AdminDashboardProps, AdminTab, AppSidebar(), AppSidebarProps, BackToTopButton(), BackToTopButtonProps, FloatingAIMentorChat() (+47 more)

### Community 2 - "Submission Status & Analytics UI"
Cohesion: 0.07
Nodes (54): StatusBadge(), StatusBadgeProps, SubmissionStatusType, ScoreDistributionCard(), ScoreDistributionCardProps, TeacherAITranscriptDrawer(), TeacherAITranscriptDrawerProps, TeacherAssignmentModal() (+46 more)

### Community 3 - "Frontend Dependencies & Config"
Cohesion: 0.07
Nodes (39): dependencies, gsap@^3.15.0, @heroicons/react@^2.2.0, katex@^0.19.0, lucide-react@^1.16.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0 (+31 more)

### Community 4 - "Auth API Endpoints"
Cohesion: 0.13
Nodes (18): forgot_password(), ForgotPasswordRequest, ForgotPasswordResponse, get_current_user_profile(), login(), register(), reset_password(), ResetPasswordRequest (+10 more)

### Community 5 - "Backend Dependency Injection & Guards"
Cohesion: 0.10
Nodes (10): get_current_active_user(), get_current_teacher_or_admin(), chat_with_ai_mentor(), get_chat_history(), health_check(), get_db(), root(), ChatMessageCreate (+2 more)

### Community 6 - "Admin Management API"
Cohesion: 0.16
Nodes (23): get_current_admin(), get_current_user(), create_user_by_admin(), delete_user_by_admin(), get_all_users(), get_platform_analytics(), get_security_logs(), get_system_ai_config() (+15 more)

### Community 7 - "Database Migrations & Sessions"
Cohesion: 0.27
Nodes (8): downgrade(), upgrade(), ChatHistory, Class, ClassEnrollment, Subject, TestCase, seed_database()

### Community 8 - "Backend Data Models"
Cohesion: 0.13
Nodes (14): Admin Governance and Security Auditing, Alembic DB Migration, Sandbox Security (AST + Regex + setrlimit), Chat History Table, Classes Table, Exercises Table, Subjects Table, Submissions Table (+6 more)

### Community 9 - "postgres"
Cohesion: 0.09
Nodes (26): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, interval, retries, test, timeout, container_name (+18 more)

### Community 11 - "define_table.py"
Cohesion: 0.36
Nodes (8): ChatHistory, Class, ClassEnrollment, Exercise, Subject, Submission, TestCase, User

### Community 12 - "AI Code Mentor System"
Cohesion: 0.24
Nodes (6): Vite App Entry Point (index.html), Next.js Frontend Application, AI Code Mentor System, FloatingAIMentorChat Component, Online Judge / Code Execution, StudentWorkspace Web IDE

### Community 13 - "StudentWorkspace.tsx"
Cohesion: 0.06
Nodes (73): FloatingAIMentorChatProps, MathMarkdownRenderer(), MathMarkdownRendererProps, CodeEditor(), CodeEditorProps, ideTranslations, Language, ProblemDescription() (+65 more)

### Community 14 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 15 - "Pydantic Schemas"
Cohesion: 0.17
Nodes (11): main(), add_bullet(), add_caption(), add_h1(), add_h2(), add_h3(), add_h4(), add_p() (+3 more)

### Community 17 - "Exercise Management API"
Cohesion: 0.26
Nodes (11): create_exercise(), get_exercise_detail(), list_exercises(), Exercise, ExerciseBase, ExerciseCreate, ExerciseDetail, ExerciseListItem (+3 more)

### Community 18 - "App.tsx"
Cohesion: 0.16
Nodes (18): AdminDashboard, App(), clearSessionState(), StudentWorkspace, TeacherDashboard, ViewLoadingFallback(), AUTH_UNAUTHORIZED_EVENT, AppView (+10 more)

### Community 20 - "submissions.py"
Cohesion: 0.22
Nodes (11): get_submission_history(), get_submission_status(), run_sample_code(), submit_code(), Submission, CodeRunRequest, CodeRunResponse, SubmissionCreate (+3 more)

### Community 21 - "aiMentorService.ts"
Cohesion: 0.18
Nodes (15): BackendChatResponse, fetchAIConversationHistory(), normalizeIntent(), sendAIMessage(), SendMessagePayload, VALID_SOCRATIC_INTENTS, ExerciseAIContext, generateSocraticResponse() (+7 more)

## Knowledge Gaps
- **12 isolated node(s):** `Vite App Entry Point (index.html)`, `Next.js Frontend Application`, `File Icon SVG`, `Globe Icon SVG`, `Next.js Logo SVG` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 199 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Admin Dashboard & Course Management` to `Auth UI & Layout`, `Submission Status & Analytics UI`, `Frontend Dependencies & Config`, `StudentWorkspace.tsx`, `App.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 26 inferred relationships involving `User` (e.g. with `get_current_active_user()` and `get_current_admin()`) actually correct?**
  _`User` has 26 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Vite App Entry Point (index.html)`, `Next.js Frontend Application`, `File Icon SVG` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth UI & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.06494269761974727 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Admin Dashboard & Course Management` to `Submission Status & Analytics UI`, `Frontend Dependencies & Config`, `StudentWorkspace.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `Admin Dashboard & Course Management` be split into smaller, more focused modules?**
  _Cohesion score 0.09818913480885312 - nodes in this community are weakly interconnected._
- **Why does `User` connect `Admin Dashboard & Course Management` to `Auth UI & Layout`, `App.tsx`, `Submission Status & Analytics UI`, `StudentWorkspace.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._