import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from '../api';

const Payment = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const [name, setName] = useState("");

  const handlePayment = async () => {
    if (!name) return alert("กรุณากรอกชื่อผู้ชำระเงิน");

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนชำระเงิน");
      return navigate('/login');
    }

    try {
      // 🔄 วนลูปจ่ายเงินทุกใบในตะกร้า
      for (const item of cart) {
        await api.post('/lottery/checkout', {
          userId: user.id,
          lotteryId: item.lottery_id // ✅ ใช้ lottery_id ให้ตรงกับ DB
        });
      }

      alert("ชำระเงินสำเร็จ 🎉 ข้อมูลบันทึกลงระบบแล้ว");
      localStorage.removeItem("cart");
      navigate("/orders"); 
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการชำระเงิน");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 font-kanit">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-[2rem] shadow-xl">
        <h1 className="text-3xl font-black text-blue-900 mb-6">ชำระเงิน</h1>

        {cart.length === 0 ? (
          <p className="text-gray-400">ไม่มีสินค้าในตะกร้า</p>
        ) : (
          <>
            <div className="mb-6 space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xl font-bold text-gray-700">เลข {item.lottery_number}</p>
                  <p className="text-blue-600 font-black">฿80.00</p>
                </div>
              ))}
              <div className="pt-4 border-t flex justify-between items-end">
                <p className="font-bold text-gray-400">ยอดรวมทั้งหมด</p>
                <p className="text-3xl font-black text-blue-600">{(cart.length * 80).toLocaleString()} บาท</p>
              </div>
            </div>

            <input
              type="text"
              placeholder="ชื่อผู้ชำระเงิน"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-100 p-4 rounded-2xl mb-6 focus:border-blue-500 outline-none transition-all"
            />

            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 font-bold text-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              ยืนยันชำระเงิน
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;