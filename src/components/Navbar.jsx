import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">

          {/* โลโก้ */}
          <h1 className="text-xl font-bold">
            ไก่พลัส
          </h1>

          {/* เมนู Desktop */}
          <div className="hidden md:flex gap-6 items-center">

            <Link to="/" className="hover:text-blue-200">
              หน้าแรก
            </Link>

            <Link to="/buy" className="hover:text-blue-200">
              ซื้อหวย
            </Link>

            <Link to="/result" className="hover:text-blue-200">
              ผลรางวัล
            </Link>

            <Link to="/orders">ประวัติคำสั่งซื้อ</Link>

            {!isLoggedIn ? (
              <>
                <Link to="/login" className="hover:text-yellow-300">
                  เข้าสู่ระบบ
                </Link>

                <Link to="/register" className="hover:text-yellow-300">
                  สมัครสมาชิก
                </Link>
              </>
            ) : (
              <>
                <span className="font-semibold">
                  {currentUser?.firstName}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-3 py-1 rounded-lg font-semibold hover:bg-gray-200"
                >
                  ออกจากระบบ
                </button>
              </>
            )}

          </div>

          {/* ปุ่มมือถือ */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

        </div>
      </div>

      {/* เมนูมือถือ */}
      {open && (
        <div className="md:hidden bg-blue-500 px-4 py-3 space-y-2">

          <Link to="/" className="block">หน้าแรก</Link>
          <Link to="/buy" className="block">ซื้อหวย</Link>
          <Link to="/result" className="block">ผลรางวัล</Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="block">เข้าสู่ระบบ</Link>
              <Link to="/register" className="block">สมัครสมาชิก</Link>
            </>
          ) : (
            <>
              <div>สวัสดี {currentUser?.firstName}</div>
              <button
                onClick={handleLogout}
                className="w-full bg-white text-blue-600 py-1 rounded-lg font-semibold"
              >
                ออกจากระบบ
              </button>
            </>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;