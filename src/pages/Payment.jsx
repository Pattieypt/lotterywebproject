import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from '../api'; // มั่นใจว่าไฟล์ api.js อยู่ถูกที่นะ!

const Payment = () => {
  const navigate = useNavigate();
  // ดึงข้อมูลหวยจากตะกร้าที่เพื่อนเก็บไว้
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const [name, setName] = useState("");

  // ฟังก์ชันชำระเงินเวอร์ชันเชื่อมต่อ Database
  const handlePayment = async () => {
    // 1. เช็คว่ากรอกชื่อหรือยัง
    if (!name) {
      alert("กรุณากรอกชื่อผู้ชำระเงิน");
      return;
    }

    // 2. ดึงข้อมูล User จากการ Login
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนชำระเงิน");
      return navigate('/login');
    }

    try {
      // 3. วนลูปส่งข้อมูลหวยในตะกร้าไปที่ Backend (กรณีมีหลายใบ)
      // หรือถ้าจะส่งใบเดียวตามในรูป ให้เลือกใบแรกจาก cart
      if (cart.length > 0) {
        const lotteryItem = cart[0]; // สมมติว่าจ่ายทีละใบตามรูปตะกร้า

        await api.post('/orders/checkout', {
          userId: user.id,
          lotteryId: lotteryItem.id // ต้องมั่นใจว่าในตะกร้าเพื่อนเก็บ id ไว้ด้วย
        });

        alert("ชำระเงินสำเร็จ 🎉 ข้อมูลบันทึกลงระบบแล้ว");
        
        // 4. ล้างตะกร้าในเครื่องหลังจ่ายเงินเสร็จ
        localStorage.removeItem("cart");
        navigate("/my-lotteries"); // ไปหน้าดูหวยของตัวเอง
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Server");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">ชำระเงิน</h1>

        {cart.length === 0 ? (
          <p>ไม่มีสินค้าในตะกร้า</p>
        ) : (
          <>
            <div className="mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between border-b py-2">
                   <p className="text-lg">เลข {item.number}</p>
                   <p className="text-gray-500">฿80.00</p>
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="ชื่อผู้ชำระเงิน (เพื่อบันทึกข้อมูล)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <button
              onClick={handlePayment} // เรียกใช้ฟังก์ชันที่เราแก้ใหม่
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 font-bold"
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