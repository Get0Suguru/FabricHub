import React from "react";
import { Card, CardMedia, Typography, Box, Link } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
const navigate = useNavigate();

  return (
    <div onClick={()=>navigate(`/product/${product.id}`)} className="productCard w-[15rem] m-3 relative group overflow-visible">
      <Card className="rounded-lg overflow-hidden transition-all duration-300 ease-out transform group-hover:scale-105 group-hover:shadow-2xl hover:z-10">
        <CardMedia
          component="img"
          image={product.imageUrl}
          alt="Women White Top"
          className="h-64 w-full object-cover" // Removed max-w constraint
        />

        <Box className="p-3 space-y-1">
          <Typography variant="subtitle2" className="font-bold text-gray-800">
            {product.brand}
          </Typography>

          <Typography
            variant="body2"
            className="text-gray-600 truncate whitespace-nowrap"
          >
            {product.title}
          </Typography>

          <Typography variant="caption" className="text-gray-400 block">
            Color: {product.color}
          </Typography>

          <Box className="flex items-center gap-2">
            <Typography variant="body1" className="font-bold">
              ₹{product.discountedPrice}
            </Typography>
            <Typography
              variant="caption"
              className="text-gray-500 line-through"
            >
              ₹{product.price}
            </Typography>
            <Typography variant="body2" className="text-green-500">
              {product.discountPresent}% off
            </Typography>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default ProductCard;
