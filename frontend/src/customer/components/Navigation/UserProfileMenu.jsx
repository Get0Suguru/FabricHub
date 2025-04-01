import React, { useRef, useEffect } from "react";
import { Person } from "@mui/icons-material";
import { LoginForm } from "./AuthForms/LoginForm";
import { RegisterForm } from "./AuthForms/RegisterForm";
import { LogoutForm } from "./AuthForms/LogoutForm";

const UserProfileMenu = ({
  isOpen,
  onToggleModal,
  formState,
  onFormStateChange,
  onNavigateAndClose
}) => {
  const modalRef = useRef(null);

  // Switch between login and register forms
  const switchForm = () => {
    onFormStateChange(formState === "Login" ? "Register" : "Login");
  };

  // Handle user login
  const makeUserLogin = () => {
    onFormStateChange("Logout");
  };

  // Handle user logout
  const handleLogout = () => {
    onFormStateChange("Login");
  };

  // Render the appropriate form component
  let formComponent;
  if (formState === "Login") {
    formComponent = (
      <LoginForm onSwitch={switchForm} toggleLogin={makeUserLogin} />
    );
  } else if (formState === "Register") {
    formComponent = <RegisterForm onSwitch={switchForm} />;
  } else { // "Logout"
    formComponent = <LogoutForm onLogout={handleLogout} onNavigate={onNavigateAndClose} />;
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (isOpen) { // Only call onToggleModal if it's currently open
          onToggleModal(); // This should effectively set isOpen to false
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggleModal, modalRef]);

  return (
    <div>
      {/* Profile Icon Button */}
      <button
        onClick={onToggleModal}
        aria-label="Open Profile Menu"
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Person
          fontSize="large"
          className={formState === "Logout" ? "text-teal-500" : "text-gray-500"}
        />
      </button>

      {/* Modal Overlay and Box */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="profile-modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-[30rem] h-[35rem] p-6 box-border overflow-hidden flex flex-col"
          >
            {formComponent}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;