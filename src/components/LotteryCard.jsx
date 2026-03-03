const LotteryCard = ({ prize, number, reward }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-center hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-600">{prize}</h3>

      <p className="text-3xl font-bold text-blue-600 my-2">
        {number}
      </p>

      <p className="text-sm text-gray-500">{reward}</p>
    </div>
  );
};

export default LotteryCard;