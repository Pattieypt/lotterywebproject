import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTicketAlt, FaArrowLeft, FaHashtag, FaChevronRight } from "react-icons/fa";
import api from '../api';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrderHistory(); }, []);

  const fetchOrderHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return navigate('/login');

      const response = await api.get(`/orders/my-lottery/${user.id}`);
      
      // 🏗️ Logic จัดกลุ่มข้อมูลตาม round_name
      const grouped = response.data.reduce((acc, order) => {
        const key = order.round_name || "ไม่ระบุงวด";
        if (!acc[key]) acc[key] = [];
        acc[key].push(order);
        return acc;
      }, {});

      setGroupedOrders(grouped);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-kanit pb-20">
      <div className="bg-white shadow-sm p-5 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><FaArrowLeft /></button>
          <h1 className="text-2xl font-black text-blue-900">สลากของฉัน</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {loading ? (
          <div className="text-center py-20 text-blue-600 font-bold animate-pulse">กำลังดึงข้อมูล...</div>
        ) : Object.keys(groupedOrders).length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2.5rem] shadow-sm">
             <p className="text-gray-400 font-bold">ยังไม่มีประวัติการซื้อ</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.keys(groupedOrders).map((roundName) => (
              <div key={roundName} className="space-y-4">


                {/* ตัวคั่น Category*/}
                <div className="flex items-center gap-4">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-blue-200"></div>
                  <h2 className="text-blue-600 font-black text-lg bg-blue-50 px-6 py-2 rounded-full shadow-sm border border-blue-100">
                    งวด: {roundName}
                  </h2>
                  <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-blue-200"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupedOrders[roundName].map((order, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex justify-between items-center group hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100"><FaHashtag /></div>
                        <div>
                          <p className="text-xs font-bold text-gray-300 uppercase leading-none mb-1">Lottery Number</p>
                          <p className="text-3xl font-black text-gray-800 tracking-widest">{order.lottery_number}</p>
                        </div>
                      </div>
                      <FaChevronRight className="text-gray-200 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;