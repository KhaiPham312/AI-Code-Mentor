const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/ide/StudentWorkspace.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Line 120: getSubmissionsForExercise(currentExercise.id) -> getSubmissionsForExercise(currentExercise.id, userKey)
content = content.replace(
  'getSubmissionsForExercise(currentExercise.id)',
  'getSubmissionsForExercise(currentExercise.id, userKey)'
);

// 2. Line 172: setSubmissions(getSubmissionsForExercise(localEx.id));
content = content.replace(
  'setSubmissions(getSubmissionsForExercise(localEx.id));',
  'setSubmissions(getSubmissionsForExercise(localEx.id, userKey));'
);

// 3. submitStudentCode(currentExercise, code) -> submitStudentCode(currentExercise, code, user)
content = content.replace(
  'subRecord = await submitStudentCode(currentExercise, code);',
  'subRecord = await submitStudentCode(currentExercise, code, user);'
);

// 4. Line 308 & 310:
content = content.replace(
  'else setSubmissions(getSubmissionsForExercise(currentExercise.id));\r\n      } catch {\r\n        setSubmissions(getSubmissionsForExercise(currentExercise.id));',
  'else setSubmissions(getSubmissionsForExercise(currentExercise.id, userKey));\r\n      } catch {\r\n        setSubmissions(getSubmissionsForExercise(currentExercise.id, userKey));'
);
content = content.replace(
  'else setSubmissions(getSubmissionsForExercise(currentExercise.id));\n      } catch {\n        setSubmissions(getSubmissionsForExercise(currentExercise.id));',
  'else setSubmissions(getSubmissionsForExercise(currentExercise.id, userKey));\n      } catch {\n        setSubmissions(getSubmissionsForExercise(currentExercise.id, userKey));'
);

// 5. Lines 330-363: update saveUserSubmission and localStorage.setItem
const targetBlock = `      saveUserSubmission(userKey, {
        id: subRecord.id,
        exerciseId: currentExercise.id,
        exerciseTitle: currentExercise.title,
        category: currentExercise.category,
        submittedAt: subRecord.submittedAt,
        status: subRecord.status,
        passedTests: subRecord.passedTests,
        totalTests: subRecord.totalTests,
        executionTimeMs: subRecord.executionTimeMs,
        code: code,
        language: currentLanguageOption?.label || currentExercise.language || 'Python 3',
        score: isAllPassed ? 10 : Math.round((subRecord.passedTests / subRecord.totalTests) * 10),
      });

      if (isAllPassed) {
        try {
          markExerciseAsSolved(userKey, currentExercise.id);
          localStorage.setItem(
            \`ai_mentor_latest_user_submission_\${userKey}_\${currentExercise.id}\`,
            JSON.stringify({
              name: user.name || 'Học viên',
              studentId: user.studentId || user.id,
              score: 10,
              executionTimeMs: subRecord.executionTimeMs || 28,
              memoryMb: 14.1,
              language: currentLanguageOption?.label || currentExercise.language || 'Python 3',
              timeAgo: t.justNow,
              submittedCode: code,
            })
          );
        } catch {
          // ignore
        }`;

const replacementBlock = `      const finalScore = isAllPassed ? 10 : Math.round((subRecord.passedTests / subRecord.totalTests) * 10);
      const studentIdStr = user.studentId ? String(user.studentId) : user.id ? String(user.id) : undefined;
      const cleanStudentName = user.name ? user.name.replace(/\\s*\\([^)]*\\)/g, '').trim() : 'Học viên';

      saveUserSubmission(userKey, {
        id: subRecord.id,
        exerciseId: currentExercise.id,
        exerciseTitle: currentExercise.title,
        category: currentExercise.category,
        submittedAt: subRecord.submittedAt,
        status: subRecord.status,
        passedTests: subRecord.passedTests,
        totalTests: subRecord.totalTests,
        executionTimeMs: subRecord.executionTimeMs,
        code: code,
        language: currentLanguageOption?.label || currentExercise.language || 'Python 3',
        score: finalScore,
        studentKey: userKey,
        studentName: cleanStudentName,
        studentEmail: user.email,
        studentId: studentIdStr,
        memoryMb: 14.1,
      });

      // Luôn lưu key bài nộp mới nhất của sinh viên cho bài tập này (cả đạt và chưa đạt)
      try {
        localStorage.setItem(
          \`ai_mentor_latest_user_submission_\${userKey}_\${currentExercise.id}\`,
          JSON.stringify({
            id: subRecord.id,
            name: cleanStudentName,
            studentId: studentIdStr || userKey,
            studentEmail: user.email,
            studentKey: userKey,
            exerciseId: currentExercise.id,
            exerciseTitle: currentExercise.title,
            score: finalScore,
            executionTimeMs: subRecord.executionTimeMs || 28,
            memoryMb: 14.1,
            language: currentLanguageOption?.label || currentExercise.language || 'Python 3',
            timeAgo: t.justNow,
            submittedCode: code,
            status: subRecord.status,
            passedTests: subRecord.passedTests,
            totalTests: subRecord.totalTests,
          })
        );
      } catch {
        // ignore
      }

      setSubmissions(getSubmissionsForExercise(currentExercise.id, userKey));

      if (isAllPassed) {
        try {
          markExerciseAsSolved(userKey, currentExercise.id);
        } catch {
          // ignore
        }`;

content = content.replace(targetBlock.replace(/\r?\n/g, '\r\n'), replacementBlock.replace(/\r?\n/g, '\r\n'));
if (!content.includes('finalScore = isAllPassed')) {
  // Try with LF if CRLF didn't match
  content = content.replace(targetBlock.replace(/\r?\n/g, '\n'), replacementBlock.replace(/\r?\n/g, '\n'));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated StudentWorkspace.tsx');
