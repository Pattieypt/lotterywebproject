const Orders = () => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-center">
          ประวัติคำสั่งซื้อ
        </h1>

        {orders.length === 0 ? (
          <p className="text-center">ยังไม่มีคำสั่งซื้อ</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow mb-4"
            >
              <p className="font-semibold">
                ผู้ซื้อ: {order.buyer}
              </p>

              <p className="text-sm text-gray-500 mb-2">
                วันที่: {order.date}
              </p>

              {order.items.map((item, index) => (
                <p key={index}>เลข {item.number}</p>
              ))}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Orders;