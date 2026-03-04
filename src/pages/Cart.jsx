import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';





const Cart = () => {

  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    const now = Date.now();


    const valid = stored.filter(
      (item) => item.expiresAt && item.expiresAt > now
    );

    localStorage.setItem("cart", JSON.stringify(valid));

    return valid;
  });

  const handleRemove = (number) => {
    const updated = cart.filter((item) => item.number !== number);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        ตะกร้าหวย
      </h1>

      {cart.length === 0 ? (
        <p>ไม่มีรายการในตะกร้า</p>
      ) : (
        <div className="space-y-4">
          {cart.length === 0 ? (
            <p>ไม่มีรายการในตะกร้า</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.number}
                    className="bg-white p-4 rounded-xl shadow flex justify-between"
                  >
                    <div className="font-bold">
                      เลข {item.number}
                    </div>

                    <button
                      onClick={() => handleRemove(item.number)}
                      className="text-red-500"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>

              {/* 🔥 ปุ่มไปหน้า Payment */}
              <button
                onClick={() => navigate("/payment")}
                className="mt-6 bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600"
              >
                ไปชำระเงิน
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;