import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaHistory, FaChevronRight } from "react-icons/fa";
import api from '../api';
import CartDrawer from "../components/CartDrawer";

// --- Sub-Component: CountdownTimer (แก้ให้รับค่า targetDate ที่ Dynamic) ---
const CountdownTimer = ({ targetDate, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onTimeout) onTimeout(); 
      } else {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onTimeout]);

  return (
    <div className="flex gap-2 items-center text-red-600 font-bold bg-red-50 px-4 py-2 rounded-full border border-red-200 shadow-sm">
      <span className={timeLeft.hours === 0 && timeLeft.minutes < 10 ? "animate-ping" : "animate-pulse"}>●</span>
      <span>ปิดรับใน: {timeLeft.hours}ชม. {timeLeft.minutes}น. {timeLeft.seconds}ว.</span>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [dailyLotteries, setDailyLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]); 
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestResults, setLatestResults] = useState(null);
  const [targetDate, setTargetDate] = useState(null); // ✅ แก้จาก Hardcode เป็น null

  useEffect(() => {
    fetchData();
    fetchLatestResults();
    updateCartData();

    

    const expirationTimer = setInterval(() => {
      checkCartExpiration();
    }, 1000);

    return () => clearInterval(expirationTimer);
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/lottery/available');
      setDailyLotteries(response.data);
  
      if (response.data.length > 0) {
        setTargetDate(response.data[0].end_time);
      }
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
      setLoading(false);
    }
  };

  // ... (ฟังก์ชัน fetchLatestResults, updateCartData, releaseTicketAPI, checkCartExpiration เหมือนเดิม)
  const fetchLatestResults = async () => {
    try {
      const response = await api.get('/lottery/results-latest');
      console.log("ข้อมูลจาก API:", response.data);
      if (response.data) {
        setLatestResults(response.data);
        setTargetDate(response.data.end_time); 
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const updateCartData = () => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(stored);
    setCartCount(stored.length);
  };

  const releaseTicketAPI = async (id) => {
    try {
      const response = await api.post('/lottery/release', { lottery_id: id });
      return response.status === 200;
    } catch (error) { return false; }
  };

  const checkCartExpiration = async () => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    if (stored.length === 0) return;
    const now = Date.now();
    const expiredTickets = stored.filter(item => item.expiresAt <= now);
    const stillValid = stored.filter(item => item.expiresAt > now);
    if (expiredTickets.length > 0) {
      for (const ticket of expiredTickets) { await releaseTicketAPI(ticket.lottery_id); }
      localStorage.setItem("cart", JSON.stringify(stillValid));
      updateCartData();
      fetchData(); 
    }
  };

  const handleRefreshMarket = async () => {
    await fetchData(); // 🔄 เมื่อเวลาหมด ให้โหลดแผงใหม่ทันที
  };

  const handleAddToCart = async (lottery) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await api.post('/lottery/reserve', {
        lottery_id: lottery.lottery_id,
        user_id: userData.id
      });
      if (response.status === 200) {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const ticketWithTimer = { ...lottery, expiresAt: new Date(response.data.expiresAt).getTime() };
        localStorage.setItem("cart", JSON.stringify([...cart, ticketWithTimer]));
        updateCartData();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (error) { alert(error.response?.data?.message || "เกิดข้อผิดพลาด"); }
  };

  const handleRemoveFromCart = async (id) => {
    const isSuccess = await releaseTicketAPI(id);
    if (isSuccess) {
      const updated = cartItems.filter(item => item.lottery_id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      updateCartData();
      fetchData();
    }
  };

  const res = latestResults || {};
  const winningNumber = res.winning_number || "------";
  const lastTwo = res.last_two_digits || "--";
  const lastThree = res.last_three_digits || "---";
  const frontThree = res.front_three_digits || "---";
  return (
    <div className="min-h-screen bg-gray-50 font-kanit pb-32 relative overflow-x-hidden">
      
      {/* Toast แจ้งเตือน */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-green-400">
            <span className="text-lg font-bold">เพิ่มเข้าตะกร้าแล้ว ✅</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section (UI เดิม + ปุ่มดูทั้งหมด) */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-blue-900 tracking-tighter italic">สลากกินไม่แบ่งรัฐบาล</h1>
            <p className="text-gray-400 font-medium">สลากดีไม่มีไม่ได้แล้ว</p>
          </div>

          <div className="flex items-center gap-4">
            {/* ⏱️ ตัวจับเวลาที่รอค่าจาก DB */}
              <CountdownTimer targetDate={targetDate} onTimeout={handleRefreshMarket} />
            

            {/* 🛒 ปุ่ม "ดูทั้งหมด" แบบเรียบๆ ให้เข้ากับ UI เดิม */}
            <button
              onClick={() => navigate('/buy')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              ดูทั้งหมด <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* แผงสลาก (UI เดิมเป๊ะ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {dailyLotteries.slice(0, 4).map((lottery) => {
            const isAdded = cartItems.some(item => item.lottery_id === lottery.lottery_id);
            return (
              <div key={lottery.lottery_id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex justify-between items-center group">
                <div>
                  <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full">ชุดที่ {lottery.round_id}</span>
                  <p className="text-5xl font-black text-gray-800 tracking-widest mt-2">{lottery.lottery_number}</p>
                  <p className="text-gray-400 font-bold mt-1">ราคา ฿80.00</p>
                </div>
                <button
                  onClick={() => !isAdded && handleAddToCart(lottery)}
                  disabled={isAdded}
                  className={`px-8 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${isAdded ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"}`}
                >
                  {isAdded ? "✅ จองแล้ว" : "ซื้อเลขนี้"}
                </button>
              </div>
            );
          })}
        </div>

        {/* ส่วนผลรางวัล*/}
        <div className="max-w-6xl mx-auto p-6">
        {/* ส่วนแสดงผลรางวัล (ใช้ตัวแปร res ด้านบน) */}
        <div className="bg-white rounded-[3rem] p-10 mb-12 border border-gray-100 shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-800">ผลสลากกินเกือบแบ่งรัฐบาล</h2>
            <p className="text-blue-600 font-bold italic uppercase">{res.name || "..."}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 text-center text-white mb-8 shadow-2xl">
            <h3 className="text-lg font-bold opacity-70 uppercase">รางวัลที่ 1</h3>
            <p className="text-7xl md:text-8xl font-black my-4 tracking-[0.2em]">{winningNumber}</p>
            <p className="text-2xl font-bold text-yellow-400 italic">เงินรางวัล 6,000,000 บาท</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-3xl p-6 text-center border border-gray-100">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">เลขหน้า 3 ตัว</p>
              <p className="text-3xl font-black text-blue-800">{frontThree}</p>
              <p className="text-xs text-blue-400 font-bold mt-2">฿4,000</p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-6 text-center border border-gray-100">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">เลขท้าย 3 ตัว</p>
              <p className="text-3xl font-black text-blue-800">{lastThree}</p>
              <p className="text-xs text-blue-400 font-bold mt-2">฿4,000</p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-6 text-center border border-gray-100">
              <p className="text-gray-400 text-xs font-bold uppercase mb-2">เลขท้าย 2 ตัว</p>
              <p className="text-3xl font-black text-blue-800">{lastTwo}</p>
              <p className="text-xs text-blue-400 font-bold mt-2">฿2,000</p>
            </div>
          </div>
        </div>
      </div>

        {/* เมนูลัด (UI เดิมเป๊ะ) */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/buy')} className="flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-green-100 text-green-600 p-4 rounded-2xl mb-3"><FaSearch size={24} /></div>
            <span className="font-bold text-gray-700 text-lg">ตรวจรางวัล</span>
          </button>
          <button onClick={() => navigate('/orders')} className="flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-purple-100 text-purple-600 p-4 rounded-2xl mb-3"><FaHistory size={24} /></div>
            <span className="font-bold text-gray-700 text-lg">ประวัติการซื้อ</span>
          </button>
        </div>
      </div>

      {/* ปุ่มตะกร้า (UI เดิมเป๊ะ) */}
      <button onClick={() => setIsCartOpen(true)} className="fixed bottom-10 right-10 bg-blue-600 text-white p-6 rounded-full shadow-2xl z-50 transition-all hover:scale-110">
        <FaShoppingCart size={32} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full border-4 border-gray-50">
            {cartCount}
          </span>
        )}
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cartItems} onRemove={handleRemoveFromCart} navigate={navigate} />
    </div>
  );
};

export default Home;