import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api'; 

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "", 
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            const response = await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                firstname: formData.firstname,
                lastname: formData.lastname,
                birthDate: formData.birthDate
            });

            alert("สมัครสมาชิกสำเร็จ");
            navigate("/login");
        } catch (error) {
            console.error(error);
            // กรณี Username หรือ Email ซ้ำ หลังบ้านจะแจ้งกลับมาที่นี่
            alert(error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่ ❌");
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">สมัครสมาชิก</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/*ช่อง Username*/}
                    <input
                        type="text"
                        name="username"
                        placeholder="ชื่อผู้ใช้งาน (Username)"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            name="firstname"
                            placeholder="ชื่อ"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="นามสกุล"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="text-sm text-gray-500 ml-1">วันเกิด</div>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="อีเมล"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="รหัสผ่าน"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        สมัครสมาชิก
                    </button>
                </form>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                    มีบัญชีอยู่แล้ว? <span className="text-blue-600 cursor-pointer" onClick={() => navigate('/login')}>เข้าสู่ระบบ</span>
                </p>
            </div>
        </div>
    );
};

export default Register;