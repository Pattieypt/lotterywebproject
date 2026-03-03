import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // โหลดข้อมูลจาก localStorage ครั้งเดียวตอนเริ่ม
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [email, setEmail] = useState(() => savedUser.email || "");
  const [password, setPassword] = useState(() => savedUser.password || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (
      !registeredUser ||
      registeredUser.email !== email ||
      registeredUser.password !== password
    ) {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง ❌");
      return;
    }

    // เก็บสถานะ login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(registeredUser));

    alert("เข้าสู่ระบบสำเร็จ ✅");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          เข้าสู่ระบบ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            เข้าสู่ระบบ
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;