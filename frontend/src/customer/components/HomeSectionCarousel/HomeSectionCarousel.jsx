import React, { useState, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import HomeSectionCard from "../HomeSectionCard.jsx/HomeSectionCard";
import Button from "@mui/material/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const HomeSectionCarousel = ({data ,sectionName}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const responsive = {
    0: { items: 1 },
    720: { items: 3 },
    1024: { items: 4.55 },
  };

  const slidePrev = () => carouselRef.current?.slidePrev();
  const slideNext = () => carouselRef.current?.slideNext();
  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  const items = data.map((item, index) => 
    <HomeSectionCard key={index} product={item} />
  );

  return (
    <div className="relative mx-4 lg:mx-8 px-7 pb-4 pt-2 border shadow-lg rounded-lg">
      <h2 className="text-2xl font-extrabold text-grey-800 py-5">{sectionName}</h2>
      <AliceCarousel
        ref={carouselRef}
        items={items}
        disableButtonsControls
        disableDotsControls
        responsive={responsive}
        onSlideChanged={syncActiveIndex}
        activeIndex={activeIndex}
      />
      
      {activeIndex !== items.length - 4 && (
        <Button
          variant="contained"
          className="z-10"
          onClick={slideNext}
          sx={{
            position: "absolute",
            bgcolor: "white",
            top: "50%",
            right: "0rem",
            transform: "translateX(50%) rotate(90deg)",
          }}
          aria-label="next"
        >
          <KeyboardArrowLeftIcon
            sx={{ transform: "rotate(90deg)", color: "teal" }}
          />
        </Button>
      )}

      {activeIndex !== 0 && (
        <Button
          variant="contained"
          className="z-10"
          onClick={slidePrev}
          sx={{
            position: "absolute",
            bgcolor: "white",
            top: "50%",
            left: "0rem",
            transform: "translateX(-50%) rotate(-90deg)",
          }}
          aria-label="previous"
        >
          <KeyboardArrowLeftIcon
            sx={{ transform: "rotate(90deg)", color: "teal" }}
          />
        </Button>
      )}
    </div>
  );
};

export default HomeSectionCarousel;