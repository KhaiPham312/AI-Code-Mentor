export type Language = 'vie' | 'eng';

export const translations = {
  vie: {
    // Left Brand Sidebar
    brandTitle: 'AI CODE MENTOR',
    brandTag: 'Trợ lý lập trình AI thông minh',
    heroTitleLine1: 'Nền tảng Học lập trình &',
    heroTitleLine2: 'Luyện thuật toán cùng AI',
    heroDesc: 'Trợ lý AI thông minh đồng hành, chấm code tự động và giải đáp thắc mắc 24/7 dành cho sinh viên.',

    // Right Auth Form - Headers
    loginWelcome: 'Chào mừng trở lại!',
    loginSub: 'Đăng nhập vào tài khoản của bạn',
    loginDesc: 'Rất vui được gặp lại bạn. Sẵn sàng viết code chưa?',
    registerWelcome: 'Tạo tài khoản mới',
    registerSub: 'Đăng ký thành viên AI Code Mentor',
    registerDesc: 'Bắt đầu hành trình lập trình cùng AI Code Mentor',

    // Demo pills
    demoStudentBtn: '🎓 Đăng nhập thử: Sinh viên',
    demoTeacherBtn: '👨‍🏫 Giảng viên',

    // Field labels & placeholders
    fullNameLabel: 'Họ và tên',
    fullNamePlaceholder: 'Ví dụ: Nguyễn Văn An',
    regUsernameLabel: 'Tên đăng nhập',
    regUsernamePlaceholder: 'vd: an_nguyen',
    loginUsernameLabel: 'Tên đăng nhập hoặc Email',
    loginUsernamePlaceholder: 'Username hoặc email (vd: student)',
    emailLabel: 'Địa chỉ Email',
    emailPlaceholder: 'example@gmail.com',
    passwordLabel: 'Mật khẩu',
    passwordLoginPlaceholder: 'Nhập mật khẩu của bạn',
    passwordRegisterPlaceholder: 'Tối thiểu 6 ký tự',
    confirmPasswordLabel: 'Xác nhận mật khẩu',
    confirmPasswordPlaceholder: 'Nhập lại mật khẩu',
    roleSelectorLabel: 'Vai trò tài khoản',
    studentRoleOption: '👨‍🎓 Sinh viên',
    teacherRoleOption: '👨‍🏫 Giảng viên',

    // Auxiliary & Buttons
    rememberMe: 'Ghi nhớ đăng nhập',
    forgotPassword: 'Quên mật khẩu?',
    forgotPasswordAlert: 'Vui lòng liên hệ quản trị viên hoặc giảng viên phụ trách để đặt lại mật khẩu.',
    logInBtn: 'Đăng nhập',
    loggingInBtn: 'Đang đăng nhập...',
    signUpBtn: 'Đăng ký tài khoản',
    signingUpBtn: 'Đang tạo tài khoản...',

    // Footer toggles
    dontHaveAccount: 'Chưa có tài khoản?',
    signUpLink: 'Đăng ký ngay',
    alreadyHaveAccount: 'Đã có tài khoản?',
    logInLink: 'Đăng nhập ngay',

    // Validation errors
    errFullNameRequired: 'Vui lòng nhập họ và tên.',
    errFullNameMin: 'Họ và tên phải có ít nhất 3 ký tự.',
    errUsernameRequired: 'Vui lòng nhập tên đăng nhập.',
    errUsernameMin: 'Tên đăng nhập phải có ít nhất 3 ký tự.',
    errUsernameFormat: 'Tên đăng nhập chỉ gồm chữ cái, số, dấu gạch dưới hoặc chấm (không khoảng trắng).',
    errUsernameExists: 'Tên đăng nhập này đã tồn tại.',
    errEmailRequired: 'Vui lòng nhập địa chỉ email.',
    errEmailInvalid: 'Địa chỉ email không hợp lệ (ví dụ: example@gmail.com).',
    errEmailExists: 'Email này đã được đăng ký tài khoản.',
    errPasswordRequired: 'Vui lòng nhập mật khẩu.',
    errPasswordMin: 'Mật khẩu phải có tối thiểu 6 ký tự.',
    errConfirmPasswordRequired: 'Vui lòng xác nhận lại mật khẩu.',
    errConfirmPasswordMismatch: 'Mật khẩu xác nhận không trùng khớp.',
    errLoginIdentifierRequired: 'Vui lòng nhập tên đăng nhập hoặc email.',

    // Success Toast
    registerSuccessToast: 'Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...',
    loginSuccessToast: 'Đăng nhập thành công!',

    // Forgot Password Flow
    forgotTitle: 'Quên mật khẩu?',
    forgotDesc: 'Đừng lo! Hãy nhập email hoặc tên đăng nhập của bạn bên dưới, chúng tôi sẽ gửi liên kết hướng dẫn đặt lại mật khẩu.',
    forgotInputLabel: 'Email hoặc Tên đăng nhập *',
    forgotInputPlaceholder: 'Nhập email hoặc tên đăng nhập...',
    forgotSendBtn: 'Gửi liên kết đặt lại',
    forgotSendingBtn: 'Đang gửi email...',
    forgotBackTo: 'Quay lại ',
    forgotLoginWord: 'Đăng nhập',
    forgotNotFound: 'Không tìm thấy tài khoản với email hoặc tên đăng nhập này!',
    forgotSuccessSentPart1: 'Liên kết đặt lại mật khẩu đã được gửi tới email ',
    forgotSuccessSentPart2: '! Vui lòng mở hộp thư Gmail của bạn và nhấn vào nút "Đặt lại mật khẩu" trong thư.',

    // Reset Password Flow
    resetTitle: 'Đặt lại mật khẩu mới',
    resetAccountPrefix: 'Tài khoản:',
    resetNewPassLabel: 'Mật khẩu mới',
    resetNewPassPlaceholder: 'Tối thiểu 6 ký tự',
    resetConfirmPassLabel: 'Xác nhận mật khẩu mới',
    resetConfirmPassPlaceholder: 'Nhập lại mật khẩu mới',
    resetSubmitBtn: 'Cập nhật mật khẩu',
    resetUpdatingBtn: 'Đang cập nhật mật khẩu...',
    resetSuccessToast: 'Cập nhật mật khẩu thành công! Đang chuyển về trang đăng nhập...',
    resetMismatch: 'Xác nhận mật khẩu mới không trùng khớp.',
    resetMinLength: 'Mật khẩu mới phải có tối thiểu 6 ký tự.',
    resetInvalidLink: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',

    // Standardized Auth Errors
    errAccountNotFound: 'Không tìm thấy tài khoản với email hoặc tên đăng nhập này!',
    errSessionExpired: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
    errInvalidCredentials: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
    errNetwork: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.',
    msgResetSuccess: 'Cập nhật mật khẩu thành công! Đang chuyển về trang đăng nhập...',
  },
  eng: {
    // Left Brand Sidebar
    brandTitle: 'AI CODE MENTOR',
    brandTag: 'Smart Coding Assistant',
    heroTitleLine1: 'Master Programming &',
    heroTitleLine2: 'Algorithms with AI',
    heroDesc: 'Your smart AI mentor for automated grading, instant feedback, and 24/7 interactive Socratic guidance.',

    // Right Auth Form - Headers
    loginWelcome: 'Welcome back!',
    loginSub: 'Login to your account',
    loginDesc: "It's nice to see you again. Ready to code?",
    registerWelcome: 'Create an account',
    registerSub: 'Sign up for AI Code Mentor',
    registerDesc: 'Start your coding journey with AI Code Mentor',

    // Demo pills
    demoStudentBtn: '🎓 Demo: Student',
    demoTeacherBtn: '👨‍🏫 Teacher',

    // Field labels & placeholders
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'e.g. John Doe',
    regUsernameLabel: 'Username',
    regUsernamePlaceholder: 'e.g. an_nguyen',
    loginUsernameLabel: 'Username or Email',
    loginUsernamePlaceholder: 'Username or email (e.g. student)',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordLoginPlaceholder: 'Enter your password',
    passwordRegisterPlaceholder: 'At least 6 characters',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    roleSelectorLabel: 'Account Role',
    studentRoleOption: '👨‍🎓 Student',
    teacherRoleOption: '👨‍🏫 Teacher',

    // Auxiliary & Buttons
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    forgotPasswordAlert: 'Please contact your administrator or instructor to reset your password.',
    logInBtn: 'Log In',
    loggingInBtn: 'Logging in...',
    signUpBtn: 'Sign Up',
    signingUpBtn: 'Creating account...',

    // Footer toggles
    dontHaveAccount: "Don't have an account?",
    signUpLink: 'Sign up',
    alreadyHaveAccount: 'Already have an account?',
    logInLink: 'Log in',

    // Validation errors
    errFullNameRequired: 'Please enter your full name.',
    errFullNameMin: 'Full name must be at least 3 characters.',
    errUsernameRequired: 'Please enter your username.',
    errUsernameMin: 'Username must be at least 3 characters.',
    errUsernameFormat: 'Username can only contain letters, numbers, dots, and underscores.',
    errUsernameExists: 'Username is already taken.',
    errEmailRequired: 'Please enter your email address.',
    errEmailInvalid: 'Invalid email address (e.g. example@gmail.com).',
    errEmailExists: 'This email is already registered.',
    errPasswordRequired: 'Please enter your password.',
    errPasswordMin: 'Password must be at least 6 characters.',
    errConfirmPasswordRequired: 'Please confirm your password.',
    errConfirmPasswordMismatch: 'Passwords do not match.',
    errLoginIdentifierRequired: 'Please enter your username or email.',

    // Success Toast
    registerSuccessToast: 'Account created successfully! Redirecting to login...',
    loginSuccessToast: 'Logged in successfully!',

    // Forgot Password Flow
    forgotTitle: 'Forgot Password?',
    forgotDesc: 'No Problem! Enter your email or username below and we will send you an email with instructions to reset your password.',
    forgotInputLabel: 'Email or Username *',
    forgotInputPlaceholder: 'Enter your email or username...',
    forgotSendBtn: 'Send Reset Link',
    forgotSendingBtn: 'Sending email...',
    forgotBackTo: 'Back to ',
    forgotLoginWord: 'Login',
    forgotNotFound: 'No account found with this email or username!',
    forgotSuccessSentPart1: 'Password reset link has been sent to ',
    forgotSuccessSentPart2: '! Please check your Gmail inbox and click the "Reset Password" button in the email.',

    // Reset Password Flow
    resetTitle: 'Reset Your Password',
    resetAccountPrefix: 'Account:',
    resetNewPassLabel: 'New Password',
    resetNewPassPlaceholder: 'At least 6 characters',
    resetConfirmPassLabel: 'Confirm New Password',
    resetConfirmPassPlaceholder: 'Re-enter new password',
    resetSubmitBtn: 'Update Password',
    resetUpdatingBtn: 'Updating password...',
    resetSuccessToast: 'Password updated successfully! Redirecting to login...',
    resetMismatch: 'New password confirmation does not match.',
    resetMinLength: 'New password must be at least 6 characters.',
    resetInvalidLink: 'Password reset link is invalid or expired.',

    // Standardized Auth Errors
    errAccountNotFound: 'No account found with this email or username!',
    errSessionExpired: 'Session has expired. Please log in again.',
    errInvalidCredentials: 'Invalid username or password.',
    errNetwork: 'Cannot connect to server. Please check your network connection.',
    msgResetSuccess: 'Password updated successfully! Redirecting to login...',
  },
};

/**
 * Map error codes to localized UI messages
 */
export function getAuthErrorMessage(errorCodeOrMessage: string, lang: Language): string {
  const t = translations[lang];
  if (!errorCodeOrMessage) return '';
  switch (errorCodeOrMessage) {
    case 'ACCOUNT_NOT_FOUND':
    case 'Không tìm thấy tài khoản với email hoặc tên đăng nhập này!':
      return t.errAccountNotFound;
    case 'SESSION_EXPIRED':
    case 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.':
      return t.errSessionExpired;
    case 'INVALID_CREDENTIALS':
      return t.errInvalidCredentials;
    case 'INVALID_RESET_LINK':
    case 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.':
      return t.resetInvalidLink;
    case 'RESET_SUCCESS':
      return t.msgResetSuccess;
    case 'NETWORK_ERROR':
      return t.errNetwork;
    default:
      return errorCodeOrMessage;
  }
}
