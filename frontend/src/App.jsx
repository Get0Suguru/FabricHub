import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './customer/components/Navigation/NavBar.jsx';
import './App.css'
import HomePage from './customer/pages/HomePage/HomePage.jsx';
import Footer from './customer/components/Footer/Footer.jsx';
import Navigation from './customer/components/Navigation/NavigationData.js';
// import ProductCard from './customer/components/Product/ProductCard.jsx';
import Product from './customer/components/Product/Product.jsx';
import ProductDetails from './customer/components/ProductDetails/ProductDetails.jsx';
import Cart  from './customer/components/Cart/Cart.jsx';
import Checkout from './customer/components/Checkout/Checkout.jsx';
import Order from './customer/components/Order/Order.jsx';
import OrderDetails from './customer/components/Order/OrderDetails.jsx';
import AddProductPage from './customer/pages/AddProduct/AddProductsPage.jsx';
import UserInfo from './customer/pages/UserInfo/UserInfo.jsx';
import { AuthContext } from './context/AuthContext'; // Ensure this path is correct

function App() {
  const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
  const [currentAuthFormState, setCurrentAuthFormState] = useState(() => {
    return localStorage.getItem("authState") || "Login";
  });

  const handleToggleUserProfileModal = useCallback(() => {
    setUserProfileModalOpen(prev => !prev);
  }, []);

  const openAuthModal = useCallback(() => {
    setUserProfileModalOpen(true);
  }, []);

  const handleAuthFormStateChange = useCallback((newState) => {
    setCurrentAuthFormState(newState);
    localStorage.setItem("authState", newState);
    if (newState === "Login" && localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
    // If user logs in successfully (newState becomes 'Logout'), 
    // or registers and then logs in, the modal might need to be closed by the form itself
    // or explicitly here. UserProfileMenu's LoginForm already calls onComplete which is onToggleModal.
  }, []);

  const handleNavigateAndCloseModal = useCallback(() => {
    setUserProfileModalOpen(false);
  }, []);
  
  return (
    <AuthContext.Provider value={{ authFormState: currentAuthFormState, openAuthModal }}>
      <Router>
          <div className="flex flex-col min-h-screen"> {/* Flex container for sticky footer */}
            <Navbar 
              navigation={Navigation} 
              userProfileModalOpen={userProfileModalOpen}
              currentAuthFormState={currentAuthFormState}
              onToggleUserProfileModal={handleToggleUserProfileModal}
              onAuthFormStateChange={handleAuthFormStateChange}
              onNavigateAndCloseModal={handleNavigateAndCloseModal}
            />
            <main className="flex-grow"> {/* Main content area that expands */}
              <Routes>
                <Route path="/addproduct" element={<AddProductPage />} />
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/product/:id" element={<ProductDetails/>}/>
                <Route path="/products" element={<Product/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/account/order" element={<Order/>}/>
                <Route path="/account/order/:id" element={<OrderDetails/>}/>
                <Route path="/account/profile" element={<UserInfo />} />
                <Route path="/test" element={<UserInfo />} />
              </Routes>
            </main>
            <Footer />
          </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App


