import React, { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup } from "@headlessui/react";
import { Grid2, Rating, Snackbar, Paper, Typography } from "@mui/material";
import { CheckCircleOutline as CheckCircleOutlineIcon, ErrorOutline as ErrorOutlineIcon } from "@mui/icons-material";
import ProductReviewCard from "./ProductReviewCard";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authFormState, openAuthModal } = useAuth();

  const [productData, setProductData] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
 

  useEffect(() => {
    // fetch product data
    axios
      .get(`/api/public/products/id/${id}`, { withCredentials: true })
      .then((res) => {
        setProductData(res.data);
        if (res.data.size && res.data.size.length > 0) {
          setSelectedSize(res.data.size[0]);
        }
      }
    )
      .catch((err) => console.log("Error fetching product", err));
  }, [id]);


  // rating's related stuff
  const ratings = productData.ratings || [];
  const totalRatings = ratings.length;
  const avgRating =
    totalRatings > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(
          2
        )
      : 0;

  // Count each star
  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = ratings.filter((r) => r.rating === star).length;
    return acc;
  }, {});

  // Prepare data for progress bars (5 to 1 stars)
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = ratingCounts[star];
    const value = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
    return {
      label: `${star}★`,
      count,
      value,
    };
  });

  // review related STuff
  const reviews = productData.reviews || [];
  // const totalReviews = reviews.length;

  const handleAddToCart = async(e) =>  {
    e.preventDefault();

    if (authFormState !== 'Logout') {
      openAuthModal();
      return;
    }

    if (productData.size && productData.size.length > 0 && !selectedSize) {
        setSnackbarMessage("Please select a size.");
        setSnackbarSeverity("error");
        setIsSnackbarOpen(true);
        return;
    }

    const newCartItemData = {
      productId: id,
      size: selectedSize ? selectedSize.name : undefined,
      quantity: 1,
      price: productData.price
    };

    await axios.post("/api/cart/add", newCartItemData, {withCredentials: true})
    .then((res)=> {
      console.log(res.data);
      setSnackbarMessage(`Added to bag!`);
      setSnackbarSeverity("success");
      setIsSnackbarOpen(true);
    })
    .catch((err) => {
      console.log("Error adding data to cart", err);
      setSnackbarMessage(err.response?.data?.message || "Failed to add item.");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
    });
 

  
  }

  if (!productData || !productData.title) {
    return <div>Loading...</div>;
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  return (
    <div className="bg-white lg:px-20">
      <div className="pt-6 px-2">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {/* // this part belongs to nav part of above  */}
            {[
              productData.topLevelCategory,
              productData.secondLevelCategory,
            ].map((name) => (
              <li key={name}>
                <div className="flex items-center">
                  <span role="button" tabIndex={0} className="mr-2 text-sm font-medium text-gray-900" onClick={()=>navigate(`/products?category=${name}`)}>
                    {name}
                  </span>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}

            <li className="text-sm">
              <span
                role="button"
                tabIndex={0}
                onClick={()=>navigate(`/products?category=${productData.thirdLevelCategory}`)}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {productData.thirdLevelCategory}
              </span>
            </li>
          </ol>
        </nav>
        {/* Main Grid: Image + Info */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 px-4 pt-10">
          {/* Image gallery */}
          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
              <img
                alt={productData.title}
                src={productData.imageUrl}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 max-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24 ">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {productData.brand}
              </h1>
              <h2 className="text-lg lg:text-lg text-grey-900 opacity-60 pt-1">
                {productData.title}
              </h2>
            </div>

            {/* Price & Discount */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className="flex space-x-5 items-center text-lg lg:text-xl text-grey-900 mt-6">
                <p className="font-semibold">
                  ₹{productData.discountedPrice ?? productData.price}
                </p>
                {productData.discountedPrice &&
                  productData.discountedPrice !== productData.price && (
                    <p className="opacity-50 line-through">
                      ₹{productData.price}
                    </p>
                  )}
                {typeof productData.discountPresent === 'number' && (
                  <p className="text-green-600 font-semibold">
                    {productData.discountPresent}% Off
                  </p>
                )}
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                          Number(avgRating) >= rating
                            ? "text-gray-900"
                            : "text-gray-200",
                          "size-5 shrink-0"
                        )}
                      />
                    ))}
                  </div>
                  <p className="sr-only">{Number(avgRating).toFixed(1)} out of 5 stars</p>
                  <a
                    href={reviews.href}
                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {totalRatings} reviews
                  </a>
                </div>
              </div>

              <form className="mt-8">
                {/* Sizes */}

                <div >
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-gray-900">Size</h3>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-4">
                    <RadioGroup
                      value={selectedSize}
                      className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    >
                      {productData.size.map((size) => (
                        <div className="flex flex-col  ">
                          <Radio
                            onClick={() => setSelectedSize(size)}
                            key={size.name}
                            disabled={size.quantity === 0}
                            className={classNames(
                              size.quantity > 0
                                ? "cursor-pointer bg-white text-gray-900 shadow-xs"
                                : "cursor-not-allowed bg-gray-50 text-gray-200",
                              selectedSize && selectedSize.name === size.name
                                ? "ring-2 ring-teal-500"
                                : "hover:bg-gray-50",
                              "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase focus:outline-none sm:flex-1 sm:py-6"
                            )}
                          >
                            <span>{size.name}</span>

                          </Radio>
                          {size.quantity > 0 && (
                            <span className="text-xs font-semibold text-gray-600 mt-1 ml-10">{` ${size.quantity} left only`}</span>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                {/* Button - Add to Bag */}
                <button
                  type="submit"
                  onClick={handleAddToCart}
                  className="mt-10 flex w-2rem items-center justify-center rounded-md border border-transparent bg-teal-600 px-8 py-3 text-base font-medium text-white hover:bg-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"
                >
                  Add to bag
                </button>
              </form>
            </div>

            {/* Description and details */}
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:pt-6 lg:pr-8 lg:pb-16">
              <div>
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6">
                  <p className="text-base text-gray-900 whitespace-pre-line">
                    {`${productData.description}`}
                  </p>
                </div>
              </div>
              {/* You can add highlights/details here if available */}
            </div>
          </div>
        </section>

        {/* Reviews and Rating part */}
        <section className="w-full pb-14">
          {" "}
          {/* ✅ Ensure Full Width */}
          <h1 className="font-semibold text-2xl pb-4 pl-4">
            Recent Review & Rating
          </h1>
          <div className="border rounded-2xl p-5 w-full">
            {" "}
            {/* ✅ Parent width fix */}
            <Grid2
              container
              spacing={4} // ✅ Added spacing to create gap between grids
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between" // ✅ Maintains proper spacing
              sx={{ display: "flex", flexWrap: "nowrap", width: "100%" }}
            >
              {/* ✅ Left Side: Product Reviews */}
              <Grid2
                item
                xs={7}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                className="pl-5"
              >
                <div className="space-y-5">
                  {reviews.map((review, index) => (
                    <ProductReviewCard key={index} review={review} />
                  ))}
                </div>
              </Grid2>

              <Grid2
                item
                xs={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 3,
                  width: "50%",
                }}
              >
                <h1 className="text-xl font-semibold pb-1"> Product Rating</h1>

                {/* ⭐ Rating & Count */}
                <div className="flex items-center space-x-3">
                  <Rating value={Number(avgRating)} precision={0.5} readOnly />
                  <p className="opacity-60">{totalRatings} Ratings</p>
                </div>

                {/* 🔥 Progress Bar */}
                <Box className="mt-5 w-full">
                  <Grid2
                    container
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    sx={{ width: "100%" }}
                  >
                    <Grid2
                      container
                      direction="column"
                      spacing={2}
                      sx={{ width: "100%" }}
                    >
                      {ratingBreakdown.map((rating) => (
                        <Grid2
                          key={rating.label}
                          item
                          xs={7}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <p className="mr-4" style={{ width: 40 }}>
                            {rating.label}
                          </p>

                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              marginRight: 2,
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={rating.value}
                              sx={{
                                width: "100%",
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#d0d0d0",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#4caf50",
                                },
                              }}
                            />
                          </Box>

                          <p
                            className="text-gray-600 ml-4"
                            style={{ minWidth: 24 }}
                          >
                            {rating.count}
                          </p>
                        </Grid2>
                      ))}
                    </Grid2>
                  </Grid2>
                </Box>
              </Grid2>
            </Grid2>
          </div>
        </section>
      </div>
      <Snackbar 
        open={isSnackbarOpen} 
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper 
          elevation={6} 
          sx={{
            p: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            backgroundColor: snackbarSeverity === 'success' ? '#edf7ed' : '#fdeded',
            borderLeft: `5px solid ${snackbarSeverity === 'success' ? '#66bb6a' : '#f44336'}`,
            minWidth: '280px',
          }}
        >
          {snackbarSeverity === 'success' ? 
            <CheckCircleOutlineIcon sx={{ color: '#388e3c', mr: 1.5 }} /> : 
            <ErrorOutlineIcon sx={{ color: '#d32f2f', mr: 1.5 }} />
          }
          <Typography variant="subtitle2" sx={{ color: snackbarSeverity === 'success' ? '#388e3c' : '#d32f2f', fontWeight:'medium' }}>
            {snackbarMessage}
          </Typography>
        </Paper>
      </Snackbar>
    </div>
  );
};

export default ProductDetails;
