import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Payment = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const [name, setName] = useState("");

  const handlePayment = () => {
    if (!name) {
      alert("กรุณากรอกชื่อผู้ชำระเงิน");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    const newOrder = {
      id: new Date(),
      buyer: name,
      items: cart,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
    localStorage.removeItem("cart");

    alert("ชำระเงินสำเร็จ 🎉");
    navigate("/orders");
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
                <p key={index} className="text-lg">
                  เลข {item.number}
                </p>
              ))}
            </div>

            <input
              type="text"
              placeholder="ชื่อผู้ชำระเงิน"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <button
              onClick={handlePayment}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
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