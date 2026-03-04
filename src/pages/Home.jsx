import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaHistory } from "react-icons/fa";
import api from '../api';
import LotteryCard from "../components/LotteryCard";
import { lotteryResults } from "../data/lottery";

// --- Component สำหรับนับเวลาถอยหลัง (Countdown Timer) ---
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 items-center text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">
      <span className="animate-pulse">●</span>
      <span>ปิดรับใน: {timeLeft.hours}ชม. {timeLeft.minutes}น. {timeLeft.seconds}ว.</span>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [dailyLotteries, setDailyLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // ข้อมูลรางวัลล่าสุด (Mockup จากไฟล์ data ของแพรว)
  const firstPrize = lotteryResults[0];
  const otherPrizes = lotteryResults.slice(1);

  // 🔵 ดึงข้อมูลสลากจาก Backend
  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        // เรียก /lottery/available ตามที่คุยกันไว้ใน Postman
        const response = await api.get('/lottery/available'); 
        setDailyLotteries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching:", error);
        setLoading(false);
      }
    };
    fetchLotteries();
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  const handleAddToCart = (lottery) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find(item => item.lottery_id === lottery.lottery_id);
    
    if (exists) {
      alert("เลขนี้อยู่ในตะกร้าแล้ว");
      return;
    }

    const newCart = [...cart, lottery];
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartCount(newCart.length);
    alert("เพิ่มเข้าตะกร้าแล้ว ✅");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-32">
      <div className="max-w-6xl mx-auto">

        {/* --- Header & Timer (สไตล์นกพลัส) --- */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-800">สลากกินแบ่งรัฐบาล</h1>
            <p className="text-gray-500 mt-1">เลือกเลขที่ใช่ ในเวลาที่ชอบ</p>
          </div>
          <div className="flex items-center gap-4">
            {/* ตั้งเวลาปิดรับเป็นเที่ยงคืนวันนี้หรือวันถัดไป */}
            <CountdownTimer targetDate="2026-03-05T00:00:00" />
            <button 
              onClick={() => navigate('/buy')} 
              className="text-blue-600 font-bold hover:text-blue-800 transition"
            >
              ดูทั้งหมด {'>'}
            </button>
          </div>
        </div>

        {/* --- แผงสลาก (จำกัดการแสดงผล 4 ใบ) --- */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">กำลังเปิดแผงสลาก...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
            {/* .slice(0, 4) เพื่อดึงมาโชว์แค่ 4 ใบแรก */}
            {dailyLotteries.slice(0, 4).map((lottery) => (
              <div
                key={lottery.lottery_id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 p-6 flex justify-between items-center transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 w-fit px-2 py-1 rounded mb-2">ชุดที่ {lottery.round_id}</span>
                  <span className="text-4xl font-black tracking-[0.2em] text-gray-800">
                    {lottery.lottery_number}
                  </span>
                  <span className="text-sm text-gray-400 mt-1">ราคา 80.-</span>
                </div>
                <button
                  onClick={() => handleAddToCart(lottery)}
                  className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
                >
                  เพิ่มใส่ตะกร้า
                </button>
              </div>
            ))}
          </div>
        )}

        {/* --- ส่วนแสดงผลรางวัลล่าสุด --- */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-12 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">ผลสลากล่าสุด</h2>
            <p className="text-gray-400">งวดประจำวันที่ 1 มีนาคม 2569</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white mb-8 shadow-inner">
            <h3 className="text-xl font-medium opacity-80">{firstPrize.prize}</h3>
            <p className="text-6xl font-black my-4 tracking-tighter">{firstPrize.number}</p>
            <p className="text-xl font-bold text-yellow-300">เงินรางวัล {firstPrize.reward}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherPrizes.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">{item.prize}</p>
                <p className="text-2xl font-bold text-blue-700 my-1">{item.number}</p>
                <p className="text-xs text-gray-400">{item.reward}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- เมนูลัดด้านล่าง --- */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/result')}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="bg-green-100 text-green-600 p-4 rounded-2xl mb-3"><FaSearch size={24}/></div>
            <span className="font-bold text-gray-700">ตรวจรางวัล</span>
          </button>
          <button 
            onClick={() => navigate('/my-orders')}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="bg-purple-100 text-purple-600 p-4 rounded-2xl mb-3"><FaHistory size={24}/></div>
            <span className="font-bold text-gray-700">ประวัติการซื้อ</span>
          </button>
        </div>

      </div>

      {/* --- Floating Action Button (ปุ่มตะกร้าลอย) --- */}
      <button
        onClick={() => navigate('/cart')}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-6 rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 flex items-center justify-center z-50 group"
      >
        <FaShoppingCart size={28} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
            {cartCount}
          </span>
        )}
        <span className="absolute right-20 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ไปที่ตะกร้า
        </span>
      </button>
    </div>
  );
};

export default Home;