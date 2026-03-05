import { useState } from "react";
import api from "../api";

const Check = () => {
  const [lotteryNumber, setLotteryNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setResult(null); //เคลียร์ผลเก่าก่อนตรวจใหม่ทุกครั้ง

    if (lotteryNumber.length !== 6) {
      alert("กรุณากรอกเลขให้ครบ 6 หลัก");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/lottery/check-number", { 
        number: lotteryNumber 
      });
      
      setResult(response.data); 
    } catch (error) {
      console.error(error);
      setResult({ isWin: false, prize: "ระบบยังไม่มีข้อมูลรางวัลของงวดนี้" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-kanit">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl p-10 border border-gray-100 mt-10">
        <h1 className="text-3xl font-black text-blue-900 text-center mb-2 italic">ตรวจรางวัล</h1>
        
        {/* ส่วนฟอร์มกรอกเลข*/}
        <form onSubmit={handleCheck} className="space-y-6">
          <input
            type="text"
            maxLength="6"
            value={lotteryNumber}
            onChange={(e) => setLotteryNumber(e.target.value)}
            placeholder="000000"
            className="w-full text-5xl font-black text-center tracking-[0.3em] py-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black">
            ตรวจผลรางวัล
          </button>
        </form>
  
        {/* ส่วนแสดงผลรางวัล */}
        {result && (
          <div className={`mt-8 p-8 rounded-[2rem] text-center border-4 animate-in fade-in zoom-in duration-300 ${
            result.isWin ? "bg-green-50 border-green-200" : "bg-red-50 border-red-100"
          }`}>
            {result.isWin ? (
              <div className="space-y-2">
                <p className="text-green-600 font-black text-2xl uppercase tracking-tighter">🎉 ยินดีด้วย!</p>
                <h2 className="text-5xl font-black text-green-800 my-4">{result.prize}</h2>
                <p className="text-green-600 font-bold italic border-t border-green-200 pt-4">
                  เลข {lotteryNumber} ของคุณถูกรางวัล (ชิส์)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-500 font-black text-2xl uppercase tracking-tighter">😢 เสียใจด้วยนะจ๊ะ</p>
                <h2 className="text-4xl font-black text-red-700 my-4">ไม่ถูกรางวัล</h2>
                <p className="text-red-500 font-bold italic border-t border-red-100 pt-4">
                  งวดนี้เลขของคุณยังไม่ถูกรางวัล
                </p>
                <p className="text-red-500 font-bold italic ">
                  (เงินของนายฉันขอนะ หึหึหึ)
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* แสดงข้อความกรณีหาข้อมูลไม่พบ*/}
        {!result && !loading && (
          <p className="text-center text-gray-400 mt-6 text-sm italic">
            *ระบบจะอ้างอิงข้อมูลจากงวดล่าสุดที่มีในระบบ
          </p>
        )}
      </div>
    </div>
  );
}

export default Check;