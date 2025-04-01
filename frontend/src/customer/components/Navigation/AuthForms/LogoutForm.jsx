import React from "react";
import { FaUser, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const LogoutForm = ({ onUserInfo, onOrders, onLogout, onNavigate }) => {
  const navigate = useNavigate();

  const handleOrdersClick = () => {
    if (typeof onOrders === 'function') {
      onOrders();
    }
    navigate('/account/order');
    if (typeof onNavigate === 'function') {
      onNavigate();
    }
  };

  const handleUserInfoClick = () => {
    if (typeof onUserInfo === 'function') {
      onUserInfo();
    }
    navigate('/account/profile');
    if (typeof onNavigate === 'function') {
      onNavigate();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-8 text-teal-700 text-center">
        Welcome!
      </h2>
      <div className="flex flex-col space-y-6 flex-1 justify-center overflow-hidden min-w-0">
        <button
          onClick={handleUserInfoClick}
          className="flex items-center justify-center w-full max-w-full py-3 rounded-md bg-teal-600 text-white font-semibold text-lg hover:bg-teal-700 transition truncate"
        >
          <FaUser className="mr-2" size={20} />
          User Info
        </button>
        <button
          onClick={handleOrdersClick}
          className="flex items-center justify-center w-full max-w-full py-3 rounded-md bg-teal-500 text-white font-semibold text-lg hover:bg-teal-600 transition truncate"
        >
          <FaBoxOpen className="mr-2" size={20} />
          Orders
        </button>
        <button
          onClick={onLogout}
          className="flex items-center justify-center w-full max-w-full py-3 rounded-md border border-teal-600 text-teal-700 font-semibold text-lg hover:bg-teal-50 transition truncate"
        >
          <FaSignOutAlt className="mr-2" size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};
