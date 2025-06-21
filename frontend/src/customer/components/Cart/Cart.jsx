import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const [cartData, setCartData] = useState(null);

  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/checkout?step=1");
  };

  const fetchCart = () => {
    axios
      .get("/api/cart/get", { withCredentials: true })
      .then((response) => {
        setCartData(response.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate delivery charges and total amount
  const cartValue = cartData?.totalDiscountedPrice ?? cartData?.totalPrice ?? 0;
  const deliveryCharge = cartValue > 499 ? 0 : 69;
  const totalAmount = (cartData?.totalDiscountedPrice ?? cartData?.totalPrice ?? 0) + deliveryCharge;

  return (
    <div className="lg:grid lg:grid-cols-12 lg:px-16 relative mt-5 gap-5 pb-6">
      {/* ✅ Left Side: Cart Items (70%) */}
      <div className="lg:col-span-8">
        {cartData && cartData.cartItems && cartData.cartItems.length > 0 ? (
          cartData.cartItems.map((item) => (
            <CartItem key={item.id} data={item} updateRender={fetchCart} />
          ))
        ) : (
          <Box 
            className="flex flex-col items-center justify-center text-center p-10 lg:p-20"
            sx={{ minHeight: '300px' }}
          >
            <ShoppingBagIcon className="h-32 w-32 text-gray-300 mb-6" />
            <Typography variant="h5" component="h2" className="text-gray-600">
              Your cart is currently empty.
            </Typography>
          </Box>
        )}
      </div>

      {/* ✅ Right Side: Order Details (30%) */}
      <div className="lg:col-span-4 px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
        <div className="border p-4">
          <p className="uppercase font-bold opacity-60 pb-4">Price details</p>
          <hr />
          <div className="space-y-3 font-semibold">
            <div className="flex justify-between pt-3 text-black">
              <span>Price</span>
              <span>{"₹" + (cartData?.totalPrice ?? 0)}</span>
            </div>
            <div className="flex justify-between pt-3 ">
              <span>Discounted price</span>
              <span className="text-green-600">
                {"₹" + (cartData?.totalDiscountedPrice ?? 0)}
              </span>
            </div>
            <div className="flex justify-between pt-3 ">
              <span>Delivery Charges</span>
              <span className="text-green-600">
                {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between pt-3 font-bold">
              <span>Total Amount</span>
              <span className="text-green-600">
                {"₹" + totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
          <Button
            onClick={handleCheckout}
            variant="contained"
            className="w-full"
            sx={{
              mt: "2rem",
              px: "2.5rem",
              py: ".7rem",
              bgcolor: "#14b8a6", // Teal-500
              color: "white",
              '&:hover': {
                bgcolor: "#0f766e", // Teal-700
              }
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
