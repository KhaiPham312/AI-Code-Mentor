export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Cột trái - Ảnh nền & Text (Sẽ ẩn đi nếu dùng điện thoại màn hình nhỏ) */}
      <div
        className="relative hidden md:flex flex-col justify-between w-2/3 bg-cover bg-center p-10 text-white"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2000&auto=format&fit=crop')" }}
      >
        {/* Lớp phủ màu đen trong suốt để dễ đọc chữ */}
        <div className="absolute inset-0 bg-black/30"></div> 
        
        {/* Header Trái */}
        <div className="relative z-10 flex items-center gap-3">
           <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white">HNUE</div>
           <span className="text-xl font-semibold tracking-wider">HNUE LMS</span>
        </div>

        {/* Chữ to ở giữa */}
        <div className="relative z-10 mb-20">
          <h2 className="text-orange-400 text-2xl font-bold mb-2">HỆ THỐNG QUẢN LÍ HỌC TẬP TRỰC TUYẾN</h2>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight drop-shadow-lg uppercase">
            Trường Đại học<br />Sư phạm Hà Nội
          </h1>
        </div>

        {/* Footer Trái */}
        <div className="relative z-10 text-sm text-gray-200">
          Copyright©2024 Trường Đại học Sư phạm Hà Nội
        </div>
      </div>

      {/* Cột phải - Form đăng nhập */}
      <div className="w-full md:w-1/3 bg-white p-8 md:p-12 flex flex-col overflow-y-auto">
        {/* Logo & Tiêu đề form */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-blue-800 rounded-full mb-3 flex items-center justify-center text-white text-xs">LOGO</div>
          <h3 className="text-[11px] text-gray-800 font-bold uppercase tracking-wider">Trường Đại học Sư phạm Hà Nội</h3>
          <h2 className="text-red-600 text-sm font-bold uppercase mt-1">Hệ thống quản lí học tập trực tuyến</h2>
        </div>

        {/* Các ô input */}
        <form className="flex flex-col gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Username / email" 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            {/* Icon User tạm bằng SVG */}
            <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          
          <div className="relative">
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            {/* Icon Key tạm bằng SVG */}
            <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Forgotten your username or password?</a>
          </div>

          <button type="button" className="w-full bg-[#0047b3] hover:bg-blue-800 text-white font-semibold py-2.5 rounded-md transition duration-200 mt-2">
            Log In
          </button>

          <div className="flex items-center justify-center gap-2 mt-2">
             <div className="relative flex items-center cursor-pointer">
                <input type="checkbox" id="remember" className="peer sr-only" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">Remember username</label>
          </div>
        </form>

        {/* Nút đăng nhập SSO */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-4">Log in using your account on:</p>
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition text-gray-700 text-sm font-medium">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px]">HN</div>
            Đăng nhập SSO HNUE
          </button>
        </div>

        {/* Footer phải */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-orange-500 font-bold mb-4 text-sm">Is this your first time here?</p>
          <div className="w-full h-24 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
            [Khu vực chèn banner/ảnh]
          </div>
        </div>
      </div>
    </div>
  );
}