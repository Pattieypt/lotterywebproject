import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from '../api';
import CartDrawer from "../components/CartDrawer";

const BuyLottery = () => {
  const navigate = useNavigate();
  const [allLotteries, setAllLotteries] = useState([]);
  const [filteredLotteries, setFilteredLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); 
  const [showToast, setShowToast] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchData();
    updateCartData();

    // ⏱️ ระบบเช็คเวลาหมดอายุทุก 1 วินาที เพื่อดึงสลากคืนแผง
    const expirationTimer = setInterval(() => {
      checkCartExpiration();
    }, 1000);

    return () => clearInterval(expirationTimer);
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/lottery/available');
      setAllLotteries(response.data);
      setFilteredLotteries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lotteries:", error);
      setLoading(false);
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
      const nums = expiredTickets.map(t => t.lottery_number).join(", ");
      alert(`⏰ หมดเวลาจองเลข: ${nums}\nสลากคืนแผงแล้วจ้า`);
  
      for (const ticket of expiredTickets) {
        await releaseTicketAPI(ticket.lottery_id); // คืนแผงใน DB
      }
  
      localStorage.setItem("cart", JSON.stringify(stillValid));
      setCartItems(stillValid);
      setCartCount(stillValid.length);
      fetchData(); // รีเฟรชแผงทันที
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = allLotteries.filter(lottery => 
      lottery.lottery_number.includes(value)
    );
    setFilteredLotteries(filtered);
    setCurrentPage(1);
  };

  const handleAddToCart = async (lottery) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      // 🔗 ยิง API ไปจองที่หลังบ้าน (เปลี่ยน status เป็น reserved)
      const response = await api.post('/lottery/reserve', {
        lottery_id: lottery.lottery_id,
        user_id: userData.id 
      });

      if (response.status === 200) {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        
        // 🕒 รับเวลาหมดอายุที่คำนวณจาก Server มาเก็บไว้
        const ticketWithTimer = {
          ...lottery,
          expiresAt: new Date(response.data.expiresAt).getTime() 
        };

        const updatedCart = [...cart, ticketWithTimer];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        updateCartData(); 
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการจอง");
    }
  };

  const handleRemoveFromCart = async (id) => {
    const isSuccess = await releaseTicketAPI(id); // คืนแผงใน DB ทันที
    if (isSuccess) {
      const updated = cartItems.filter(item => item.lottery_id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      updateCartData(); 
      fetchData(); // รีเฟรชให้เลขเด้งกลับมา
    } else {
      alert("เกิดข้อผิดพลาดในการคืนสลากสู่แผง");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLotteries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLotteries.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-32 font-kanit">
      
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce pointer-events-none">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-green-400">
            <span className="text-lg font-bold">เพิ่มเข้าตะกร้าแล้ว ✅</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-900 mb-3">สลากกินไม่แบ่งรัฐบาล</h1>
          {allLotteries.length > 0 && (
            <div className="inline-block bg-blue-600 text-white px-8 py-2 rounded-full shadow-lg font-bold text-lg">
              ประจำงวด: {allLotteries[0].name}
            </div>
          )}
        </div>

        <div className="max-w-md mx-auto mb-12 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-blue-400">
            <FaSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="ค้นหาเลขสลากที่ต้องการ..."
            className="w-full pl-14 pr-4 py-5 rounded-[2rem] border-none shadow-xl focus:ring-4 focus:ring-blue-100 text-2xl font-bold tracking-[0.3em] placeholder:tracking-normal placeholder:text-gray-300"
            maxLength={6}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-blue-600 font-bold text-xl animate-pulse">กำลังเปิดแผงสลาก...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((lottery) => {
              const isAdded = cartItems.some(item => item.lottery_id === lottery.lottery_id);

              return (
                <div key={lottery.lottery_id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-gray-100 p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300 font-bold text-xs uppercase">Official Ticket</span>
                    <span className="text-gray-400 font-bold">80.-</span>
                  </div>
                  <div className="text-center my-6">
                    <p className="text-5xl font-black tracking-widest text-gray-800 group-hover:text-blue-600 transition-colors">
                      {lottery.lottery_number}
                    </p>
                  </div>

                  <button
                    onClick={() => !isAdded && handleAddToCart(lottery)}
                    disabled={isAdded}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${
                      isAdded 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
                    }`}
                  >
                    {isAdded ? "✅ เพิ่มในตะกร้าแล้ว" : (
                      <>
                        <FaShoppingCart size={20} /> เพิ่มใส่ตะกร้า
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-4 rounded-2xl bg-white shadow-md hover:bg-blue-50 disabled:opacity-30 transition-all"><FaChevronLeft className="text-blue-600" /></button>
            <span className="font-bold text-gray-700 bg-white px-6 py-2 rounded-full shadow-inner border border-gray-100">หน้า {currentPage} จาก {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-4 rounded-2xl bg-white shadow-md hover:bg-blue-50 disabled:opacity-30 transition-all"><FaChevronRight className="text-blue-600" /></button>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-6 rounded-full shadow-2xl z-50 group transition-all hover:scale-110"
      >
        <FaShoppingCart size={32} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full border-4 border-gray-50 animate-bounce">
            {cartCount}
          </span>
        )}
      </button>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cartItems} 
        onRemove={handleRemoveFromCart}
        navigate={navigate}
      />
    </div>
  );
};

export default BuyLottery;