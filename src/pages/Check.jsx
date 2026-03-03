import { useState } from "react";

const winningNumber = "123456"; // สมมุติผลรางวัล

const Result = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = () => {
    if (input === winningNumber) {
      setResult("🎉 ยินดีด้วย! คุณถูกรางวัลที่ 1");
    } else if (input.slice(-2) === winningNumber.slice(-2)) {
      setResult("✨ ถูกเลขท้าย 2 ตัว");
    } else {
      setResult("❌ ไม่ถูกรางวัล");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        ตรวจรางวัล
      </h1>

      <input
        type="text"
        placeholder="กรอกเลข 6 หลัก"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 rounded mr-2"
      />

      <button
        onClick={handleCheck}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        ตรวจ
      </button>

      {result && (
        <div className="mt-4 text-lg font-semibold">
          {result}
        </div>
      )}
    </div>
  );
};

export default Result;