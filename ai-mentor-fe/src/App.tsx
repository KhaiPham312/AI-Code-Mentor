import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardPreview } from './components/DashboardPreview';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentWorkspace } from './components/ide/StudentWorkspace';
import { User } from './types/auth';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'ide'>('dashboard');
  const [selectedExerciseId, setSelectedExerciseId] = useState<number>(1);

  const handleLoginSuccess = (user: User, token: string) => {
    localStorage.setItem('auth_token', token);
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleOpenIDE = (exerciseId: number = 1) => {
    setSelectedExerciseId(exerciseId);
    setCurrentView('ide');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'ide') {
    return (
      <StudentWorkspace
        user={currentUser}
        initialExerciseId={selectedExerciseId}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // Phân quyền theo vai trò (Role-based views)
  if (currentUser.role === 'teacher') {
    return (
      <TeacherDashboard
        user={currentUser}
        onLogout={handleLogout}
        onPreviewStudentIDE={handleOpenIDE}
      />
    );
  }

  return (
    <DashboardPreview
      user={currentUser}
      onLogout={handleLogout}
      onOpenIDE={handleOpenIDE}
    />
  );
}

export default App;


