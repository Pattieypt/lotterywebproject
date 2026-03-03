import { Link } from "react-router-dom";

const ShortcutCard = ({ icon, title, to }) => {
  return (
    <Link to={to}>
      <div className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg hover:scale-105 transition">

        <div className="text-4xl text-blue-600 mb-2">
          {icon}
        </div>

        <p className="font-semibold text-gray-700">
          {title}
        </p>

      </div>
    </Link>
  );
};

export default ShortcutCard;