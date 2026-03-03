import { FaShoppingCart } from "react-icons/fa";

const BuyLottery = () => {
  const lotteryNumber = "123456";

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // เช็คว่ามีเลขนี้ในตะกร้าแล้วไหม
    const exists = cart.find(item => item.number === lotteryNumber);

    if (exists) {
      alert("เลขนี้อยู่ในตะกร้าแล้ว 🛒");
      return;
    }

    const newItem = {
      number: lotteryNumber,
      addedAt: Date.now(),
      expiresAt: Date.now() + 2 * 60 * 60 * 1000, // 2 ชั่วโมง
    };

    const updatedCart = [...cart, newItem];

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    alert("เพิ่มเข้าตะกร้าแล้ว ✅");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          ซื้อหวย
        </h1>

        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* ฝั่งซ้าย */}
          <div>
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              เลขชุดประจำงวด
            </h2>

            <div className="bg-blue-100 rounded-xl p-6 text-center">
              <p className="text-5xl font-bold text-blue-700 tracking-widest">
                {lotteryNumber}
              </p>
            </div>
          </div>

          {/* ฝั่งขวา */}
          <div className="text-center">

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl shadow-md transition flex items-center justify-center gap-3 mx-auto"
            >
              <FaShoppingCart className="text-2xl" />
              เพิ่มใส่ตะกร้า
            </button>

            <div className="mt-6 space-y-3">

              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-500">เลขหน้า 3 ตัว</p>
                <p className="text-xl font-bold text-blue-600">
                  {lotteryNumber.slice(0, 3)}
                </p>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-500">เลขท้าย 2 ตัว</p>
                <p className="text-xl font-bold text-blue-600">
                  {lotteryNumber.slice(-2)}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BuyLottery;