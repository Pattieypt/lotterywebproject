import { useState } from "react";
import LotteryCard from "../components/LotteryCard";
import { lotteryResults } from "../data/lottery";
import ShortcutCard from "../components/ShortcutCard";
import { FaShoppingCart, FaSearch, FaGamepad } from "react-icons/fa";

const generateDailyLotteries = () => {
  const now = Date.now();
  const expireTime = now + 2 * 60 * 60 * 1000;

  return [
    { id: 1, number: "123456", expiresAt: expireTime },
    { id: 2, number: "654321", expiresAt: expireTime },
    { id: 3, number: "111222", expiresAt: expireTime },
    { id: 4, number: "789012", expiresAt: expireTime },
  ];
};

const Home = () => {
  const firstPrize = lotteryResults[0];
  const otherPrizes = lotteryResults.slice(1);

  const [dailyLotteries] = useState(generateDailyLotteries());

  const handleAddToCart = (lottery) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (new Date() > lottery.expiresAt) {
      alert("หมดเวลาจำหน่ายแล้ว ❌");
      return;
    }

    const exists = cart.find(item => item.number === lottery.number);
    if (exists) {
      alert("เลขนี้อยู่ในตะกร้าแล้ว");
      return;
    }

    localStorage.setItem(
      "cart",
      JSON.stringify([...cart, lottery])
    );

    alert("เพิ่มเข้าตะกร้าแล้ว ✅");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* 🔥 ลอตเตอรี่ประจำวัน */}
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          ลอตเตอรี่ประจำวัน (ขาย 2 ชั่วโมง)
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {dailyLotteries.map((lottery, index) => {
            const isExpired = new Date() > lottery.expiresAt;

            return (
              <div
                key={lottery.id}
                className={`rounded-2xl shadow p-6 ${
                  index === 0
                    ? "bg-blue-600 text-white md:col-span-2"
                    : "bg-white"
                }`}
              >
                <p className="text-4xl font-bold tracking-widest">
                  {lottery.number}
                </p>

                <button
                  disabled={isExpired}
                  onClick={() => handleAddToCart(lottery)}
                  className={`mt-4 px-6 py-2 rounded-xl font-semibold ${
                    isExpired
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-yellow-400 text-black hover:bg-yellow-300"
                  }`}
                >
                  {isExpired ? "หมดเวลาแล้ว" : "เพิ่มใส่ตะกร้า"}
                </button>
              </div>
            );
          })}
        </div>

        {/* 🔵 ผลหวยล่าสุด (โครงเดิม) */}
        <h1 className="text-3xl font-bold text-center mb-6">
          ผลหวยล่าสุด
        </h1>

        <p className="text-center text-gray-500 mb-8">
          งวดวันที่ 1 มกราคม 2569
        </p>

        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-600">
              {firstPrize.prize}
            </h2>

            <p className="text-5xl font-bold text-blue-600 my-4">
              {firstPrize.number}
            </p>

            <p className="text-lg text-gray-500">
              {firstPrize.reward}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherPrizes.map((item, index) => (
            <LotteryCard key={index} {...item} />
          ))}
        </div>

        {/* 🔵 เมนูลัด (โครงเดิม) */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-center">
            เมนูลัด
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <ShortcutCard
              icon={<FaShoppingCart />}
              title="ตะกร้า"
              to="/cart"
            />

            <ShortcutCard
              icon={<FaSearch />}
              title="ตรวจรางวัล"
              to="/result"
            />

            <ShortcutCard
              icon={<FaGamepad />}
              title="เกมถูหวย"
            />

          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;