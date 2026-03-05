import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // เพิ่ม useLocation

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  //ตรวจสอบสถานะทุกครั้งที่มีการเปลี่ยนหน้า
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("currentUser"));
    
    setIsLoggedIn(status);
    setCurrentUser(user);
  }, [location]); // ทำงานใหม่ทุกครั้งที่ URL เปลี่ยน

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md font-kanit">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <h1 className="text-xl font-bold tracking-tighter">ไก่พลัส+</h1>

          <div className="hidden md:flex gap-6 items-center">
            <Link to="/" className="hover:text-blue-200 transition">หน้าแรก</Link>
            <Link to="/buy" className="hover:text-blue-200 transition">ซื้อสลาก</Link>
            <Link to="/result" className="hover:text-blue-200 transition">ผลรางวัล</Link>
            <Link to="/orders" className="hover:text-blue-200 transition">ประวัติคำสั่งซื้อ</Link>

            {/*แสดงเมนูตามสถานะ isLoggedIn ใน State */}
            {!isLoggedIn ? (
              <div className="flex gap-4 border-l border-blue-400 pl-6 ml-2">
                <Link to="/login" className="hover:text-yellow-300 font-bold">เข้าสู่ระบบ</Link>
                <Link to="/register" className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full font-bold hover:bg-yellow-300 transition">สมัครสมาชิก</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-blue-400 pl-6 ml-2">
                <span className="font-semibold text-yellow-300">
                  สวัสดี, {currentUser?.username || 'ผู้ใช้งาน'} 
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-1 rounded-full font-bold hover:bg-red-50 hover:text-red-600 transition"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* เมนูมือถือ */}
      {open && (
        <div className="md:hidden bg-blue-700 px-6 py-4 space-y-4 animate-fadeIn">
          <Link to="/" onClick={() => setOpen(false)} className="block border-b border-blue-500 pb-2">หน้าแรก</Link>
          <Link to="/buy" onClick={() => setOpen(false)} className="block border-b border-blue-500 pb-2">ซื้อหวย</Link>
          <Link to="/result" onClick={() => setOpen(false)} className="block border-b border-blue-500 pb-2">ผลรางวัล</Link>
          <Link to="/orders" onClick={() => setOpen(false)} className="block border-b border-blue-500 pb-2">ประวัติคำสั่งซื้อ</Link>

          {!isLoggedIn ? (
            <div className="pt-2 space-y-3">
              <Link to="/login" onClick={() => setOpen(false)} className="block text-yellow-300 font-bold">เข้าสู่ระบบ</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block bg-yellow-400 text-blue-900 text-center py-2 rounded-xl font-bold">สมัครสมาชิก</Link>
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <div className="text-yellow-300 font-bold text-center">สวัสดีคุณ {currentUser?.username}</div>
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="w-full bg-red-500 text-white py-2 rounded-xl font-bold"
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;