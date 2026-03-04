import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaCheckCircle, FaClock } from "react-icons/fa";
import api from '../api';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
    // ⏱️ เช็คหมดเวลาทุกวินาทีเหมือนหน้า BuyLottery
    const timer = setInterval(checkCartExpiration, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(stored);
  };

  // ✅ ฟังก์ชันสั่งหลังบ้านให้ปล่อยเลข (สำคัญมาก!)
  const releaseTicketAPI = async (id) => {
    try {
      await api.post('/lottery/release', { lottery_id: id });
    } catch (error) {
      console.error("Error releasing ticket:", error);
    }
  };

  // ✅ ระบบแจ้งเตือนและคืนสลากเมื่อหมดเวลา
  const checkCartExpiration = async () => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    if (stored.length === 0) return;

    const now = Date.now();
    const expiredTickets = stored.filter(item => item.expiresAt <= now);
    const stillValid = stored.filter(item => item.expiresAt > now);

    if (expiredTickets.length > 0) {
      const ticketNumbers = expiredTickets.map(t => t.lottery_number).join(", ");
      
      // เด้งแจ้งเตือนตามที่แพรวต้องการ
      alert(`⏰ หมดเวลาจองสลากเลข: ${ticketNumbers}\nสลากถูกดึงกลับคืนแผงแล้วจ้า`);

      // ยิง API คืนแผงใน DB
      for (const ticket of expiredTickets) {
        await releaseTicketAPI(ticket.lottery_id);
      }

      localStorage.setItem("cart", JSON.stringify(stillValid));
      setCartItems(stillValid);
    }
  };

  // ✅ ฟังก์ชันลบสลากออกเอง
  const handleRemove = async (id) => {
    // 1. บอกหลังบ้านให้แก้สถานะเป็น available
    await releaseTicketAPI(id);
    
    // 2. ลบออกจากหน้าจอ
    const updated = cartItems.filter(item => item.lottery_id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const totalPrice = cartItems.length * 80;

  return (
    <div className="min-h-screen bg-gray-50 font-kanit pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/buy")} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">ตะกร้าสลากของฉัน</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 mt-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg mb-6">ยังไม่มีสลากในตะกร้า</p>
            <button 
              onClick={() => navigate("/buy")}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100"
            >
              ไปเลือกเลขสวย ๆ กัน!
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {cartItems.map((item) => (
              <div key={item.lottery_id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">Official</span>
                    <span className="text-gray-400 text-xs font-bold">80 บาท</span>
                  </div>
                  <p className="text-4xl font-black text-gray-800 tracking-[0.2em]">{item.lottery_number}</p>
                  
                  {/* แสดงเวลาคงเหลือรายใบ */}
                  <div className="flex items-center gap-1 text-red-500 font-bold text-xs mt-2">
                    <FaClock size={12} />
                    <span>เหลือเวลาจองอีกไม่นาน</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleRemove(item.lottery_id)}
                  className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}

            {/* ส่วนสรุปยอดเงิน */}
            <div className="bg-white mt-6 p-8 rounded-[2.5rem] shadow-xl border-t-4 border-blue-600">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-gray-400 font-bold mb-1">ยอดชำระสุทธิ</p>
                  <p className="text-xs text-blue-400 font-medium">*รวมภาษีมูลค่าเพิ่มแล้ว (ถ้ามี)</p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black text-blue-600">{totalPrice.toLocaleString()}</span>
                  <span className="text-gray-400 font-bold ml-2">บาท</span>
                </div>
              </div>

              <button 
                onClick={() => navigate("/payment")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl text-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <FaCheckCircle /> ยืนยันคำสั่งซื้อ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;