const fs = require('fs');
const filePath = 'c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/teacher/TeacherDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = "  const isDark = currentTheme === 'dark';\r\n  const isVie = currentLang === 'vie';";
const targetLF = "  const isDark = currentTheme === 'dark';\n  const isVie = currentLang === 'vie';";

const addition = `

  const [storageTick, setStorageTick] = useState(0);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('ai_mentor_')) {
        setStorageTick((prev) => prev + 1);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);`;

if (content.includes(target)) {
  content = content.replace(target, target + addition.replace(/\n/g, '\r\n'));
} else if (content.includes(targetLF)) {
  content = content.replace(targetLF, targetLF + addition);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Inserted storageTick successfully');
