import { Avatar, Box, Grid2, Rating } from "@mui/material";
import { teal } from "@mui/material/colors";
import React from "react";

const ProductReviewCard = ({review}) => {
  return (
    <div className="py-4 border-1 space-y-4">
      
      <Grid2 container spacing={2} alignItems="center" direction="Row" >
        <Grid2 item>
          <Avatar
            className="text-white"
            sx={{ width: 56, height: 56, bgcolor: teal[600] }}
          >
            {review.userName.charAt(0).toUpperCase()}
          </Avatar>
        </Grid2>

        <Grid2 item xs>
          <Box className="space-y-1">
            <Box display="flex" alignItems="center" gap={2}>
              <p className="font-semibold text-lg">{review.userName}</p>
              <p className="opacity-70">April 5, 2023</p>
            </Box>
            <Rating
              value={review.rating}
              name="half-rating-read-only"
              precision={0.5}
              readOnly
            />
          </Box>
        </Grid2>
        </Grid2>

        {/* ✅ Full review below */}
        <Grid2 item xs={12} sm={6} md={3} lg={2}>
        
          <div className="max-w-[600px]">
            <p className="text-md font-sans">
              {review.review}
            </p>
          </div>
        </Grid2>
      
    </div>
  );
};

export default ProductReviewCard;
