import { Button } from "@mui/material"; // ✅ Import from MUI, not Headless UI
import { AddCircleOutline, Dataset, RemoveCircleOutline } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Added useNavigate

const CartItem = ({data, updateRender}) => {
  const navigate = useNavigate(); // Initialized useNavigate

  const handleRemove = async() => {
    await axios.delete(`api/cart/item/${data.id}`)
    .then((res) => console.log(res.data))
    .catch((e)=> console.log(e))
    
    updateRender();

  };

  const handleNavigateToProduct = () => {
    if (data && data.product && data.product.id) {
      navigate(`/product/${data.product.id}`);
    }
  };

  return (
    
      <div className="p-5 mb-5 shadow-lg border rounded-md items-center">
        {/* img + desc - Make this section clickable */}
        <div 
          className="flex flex-column cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-150 ease-in-out" 
          onClick={handleNavigateToProduct} // Added onClick handler
        >
          <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] shrink-0">
            <img
              className="w-full h-full object-cover object-top rounded-sm"
              src={data.product.imageUrl}
              alt=""
            ></img>
          </div>
          <div className="ml-5 mt-4 space-y-1">
            <p className="font-semibold">{data.product.title}</p>
            <p className="opacity-70">Size: {data.size}</p>
            <p className="opacity-70 mt-2">Seller: Khalifa fashion</p>
            <div className="flex space-x-5 items-center text-lg lg:text-xl text-grey-900 mt-6">
              <p className="font-semibold">
                {/* {TODO: add product price } */}
                {"₹"+data.discountedPrice}
              </p>
              <p className="opacity-50 line-through">{data.price}</p>
              <p className="text-green-600 font-semibold">{data.product.discountPresent + "% off" }</p>
            </div>
          </div>
        </div>


        {/* Button div - This part should not trigger navigation */}
        <div className="lg:flex items-center lg:space-x-10 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <IconButton disabled> {/* Disabled for now as functionality not implemented */}
              <RemoveCircleOutline />
            </IconButton>
            <span className="py-1 px-7 border rounded-sm">{data.quantity}</span>
            <IconButton sx={{ color: "rgb(0, 128, 128)" }} disabled> {/* Disabled for now */}
              <AddCircleOutline />
            </IconButton>

          </div>
          <Button
            variant="outlined"  // ✅ Fix: Required for border to work
            sx={{ color: "#00897B", border: "1px solid #00897B" }}
            onClick={() => {handleRemove()}}
          >
            Remove
          </Button>
        </div>
      </div>
   
  );
}

export default CartItem;
