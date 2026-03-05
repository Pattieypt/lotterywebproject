import { useState, useEffect } from "react";
import { FaTrash, FaTimes, FaArrowRight, FaClock } from "react-icons/fa";

const TicketTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState("คำนวณเวลา...");

  useEffect(() => {
    // ถ้าไม่มีค่า expiresAt ส่งมา ให้ข้ามไปเลยไม่ให้หน้าจอพัง
    if (!expiresAt) return;

    const calculateTime = () => {
      const now = Date.now();
      const target = new Date(expiresAt).getTime();
      const difference = target - now;

      if (isNaN(target) || difference <= 0) {
        setTimeLeft("หมดเวลา");
        return;
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="flex items-center gap-1 text-red-500 font-bold text-xs mt-1">
      <FaClock size={10} />
      <span>{timeLeft}</span>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose, cart = [], onRemove, navigate }) => {
  const totalPrice = cart.length * 80;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full font-kanit">
          <div className="p-6 border-b flex justify-between items-center bg-blue-600 text-white">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">ตะกร้าของฉัน</h2>
              <span className="text-xs opacity-80 font-medium">สลากทั้งหมด {cart.length} ใบ</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><FaTimes size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-24 text-gray-300 italic">ไม่มีสลากในตะกร้า</div>
            ) : (
              cart.map((item) => (
                <div key={item.lottery_id} className="flex justify-between items-center p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 relative">
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">เลขสลาก</p>
                    <p className="text-2xl font-black tracking-[0.2em] text-gray-800">{item.lottery_number}</p>
                    {/* เรียกใช้ตัวนับถอยหลัง */}
                    <TicketTimer expiresAt={item.expiresAt} />
                  </div>
                  <button onClick={() => onRemove(item.lottery_id)} className="p-3 text-gray-300 hover:text-red-500 transition-all"><FaTrash size={18} /></button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-white">
              <div className="flex justify-between items-end mb-6">
                <span className="text-gray-400 font-bold">รวมการสั่งซื้อ</span>
                <span className="text-3xl font-black text-blue-600">{totalPrice.toLocaleString()} <small className="text-xs text-gray-400">บาท</small></span>
              </div>
              <button onClick={() => { onClose(); navigate("/cart"); }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                ดูรายละเอียดตะกร้าเต็ม <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;