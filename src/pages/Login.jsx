import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';

const Login = () => {
  const navigate = useNavigate();

  // สร้าง State สำหรับเก็บค่าที่พิมพ์
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ยิง API
      const response = await api.post('/auth/login', { 
        username: email, 
        password: password 
      });
      
      // เมื่อ Login สำเร็จ: เก็บ Token และข้อมูล User จริงจาก DB ลงเครื่อง
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert("เข้าสู่ระบบสำเร็จ!");
      navigate('/'); // กลับไปหน้าหลัก
    } catch (error) {
      console.error(error);
      // ถ้าเปรียบเทียบรหัสผ่านใน Backend แล้วไม่ตรง จะเด้งมาที่นี่
      alert(error.response?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ❌");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          เข้าสู่ระบบ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">อีเมล</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">รหัสผ่าน</label>
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
        
        <p className="text-center text-gray-500 text-sm mt-4">
            ยังไม่มีบัญชี? <span className="text-blue-600 cursor-pointer" onClick={() => navigate('/register')}>สมัครสมาชิก</span>
        </p>
      </div>
    </div>
  );
};

export default Login;