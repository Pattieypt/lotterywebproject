import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from '../api';

const BuyLottery = () => {
  const navigate = useNavigate();
  const [allLotteries, setAllLotteries] = useState([]);
  const [filteredLotteries, setFilteredLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // --- ระบบ Pagination (แสดงทีละ 15 ใบ) ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchData();
    updateCartCount();
  }, []);

  const fetchData = async () => {
    try {
      // ดึงข้อมูลที่มีการ JOIN name จาก lottery_rounds มาแล้ว
      const response = await api.get('/lottery/available');
      setAllLotteries(response.data);
      setFilteredLotteries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lotteries:", error);
      setLoading(false);
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  // --- ระบบค้นหาเลข ---
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const filtered = allLotteries.filter(lottery => 
      lottery.lottery_number.includes(value)
    );
    setFilteredLotteries(filtered);
    setCurrentPage(1); // รีเซ็ตไปหน้าแรกเมื่อค้นหาใหม่
  };

  const handleAddToCart = (lottery) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // เช็คโดยใช้ lottery_id ตามโครงสร้าง Database
    const exists = cart.find(item => item.lottery_id === lottery.lottery_id);

    if (exists) {
      alert("เลขนี้อยู่ในตะกร้าแล้ว 🛒");
      return;
    }

    const updatedCart = [...cart, lottery];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount();
    alert("เพิ่มเข้าตะกร้าแล้ว ✅");
  };

  // --- คำนวณการแบ่งหน้า ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLotteries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLotteries.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-32 font-kanit">
      <div className="max-w-7xl mx-auto">
      
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-900 mb-3">
            สลากกินแบ่งไม่รัฐบาล
          </h1>
          {allLotteries.length > 0 && (
            <div className="inline-block bg-blue-600 text-white px-8 py-2 rounded-full shadow-lg font-bold text-lg">
              ประจำงวด: {allLotteries[0].name}
            </div>
          )}
        </div>

        {/* 🔍 Search Bar (ค้นหาเลข) */}
        <div className="max-w-md mx-auto mb-12 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-400 group-focus-within:text-blue-600">
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

        {/* 🎫 แสดงรายการสลาก (Grid Layout) */}
        {loading ? (
          <div className="text-center py-20 text-blue-600 font-bold text-xl animate-pulse">กำลังเปิดแผงสลาก...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.length > 0 ? (
                currentItems.map((lottery) => (
                  <div
                    key={lottery.lottery_id}
                    className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-gray-100 p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 group"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-300 font-bold text-xs">OFFICIAL TICKET</span>
                      <span className="text-gray-400 font-bold">80.-</span>
                    </div>

                    <div className="text-center my-6">
                      <p className="text-5xl font-black tracking-widest text-gray-800 group-hover:text-blue-600 transition-colors">
                        {lottery.lottery_number}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(lottery)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                      <FaShoppingCart size={20} /> เพิ่มใส่ตะกร้า
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-400 text-xl font-medium">
                  ไม่พบเลขสลาก "{searchTerm}" ในระบบ
                </div>
              )}
            </div>

            {/* 🔢 Pagination (ระบบเปลี่ยนหน้า) */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-16">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-4 rounded-2xl bg-white shadow-md hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-all"
                >
                  <FaChevronLeft className="text-blue-600" />
                </button>
                
                <span className="font-bold text-gray-700 bg-white px-6 py-2 rounded-full shadow-inner border border-gray-100">
                  หน้า {currentPage} จาก {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-4 rounded-2xl bg-white shadow-md hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-all"
                >
                  <FaChevronRight className="text-blue-600" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🛒 ปุ่มตะกร้าลอย (Floating Cart) */}
      <button
        onClick={() => navigate('/cart')}
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-6 rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all transform hover:scale-110 flex items-center justify-center z-50 group"
      >
        <FaShoppingCart size={32} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full border-4 border-gray-50 animate-bounce shadow-lg">
            {cartCount}
          </span>
        )}
        <span className="absolute right-24 bg-gray-900 text-white text-xs px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          ดูตะกร้าสินค้า
        </span>
      </button>
    </div>
  );
};

export default BuyLottery;