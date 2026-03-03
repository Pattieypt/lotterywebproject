import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const existingUser = JSON.parse(localStorage.getItem("registeredUser"));

        if (existingUser && existingUser.email === formData.email) {
            alert("อีเมลนี้ถูกใช้งานแล้ว ❌");
            return;
        }

        localStorage.setItem("registeredUser", JSON.stringify(formData));

        alert("สมัครสมาชิกสำเร็จ ✅");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

                <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
                    สมัครสมาชิก
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="ชื่อ"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="text"
                            name="lastName"
                            placeholder="นามสกุล"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

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

            </div>
        </div>
    );
};

export default Register;