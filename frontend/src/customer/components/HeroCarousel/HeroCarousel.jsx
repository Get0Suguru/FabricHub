import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { HeroCarouselData } from './HeroCarouselData';
import { useNavigate } from 'react-router-dom';

const HeroCarousel = () => {
    const navigate = useNavigate();

    const handleCarouselItemClick = () => {
        navigate('/products');
    };

    const items = HeroCarouselData.map(
        (item) => (
            <div onClick={handleCarouselItemClick} className="cursor-pointer" role="presentation">
                <img className="w-full h-[640px] object-cover" src={item.image} alt={item.altText || 'Carousel image'} />
            </div>
        )
    )

    return (
    <div >
    <AliceCarousel
            items={items}
            disableButtonsControls

            autoPlay
            autoPlayInterval={2000}
            infinite
            autoPlayStrategy="none"
            disableAutoPlayOnAction={false}
            renderDotsItem={({ isActive }) => (
                <div
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "1px solid #14b8a6",
                        backgroundColor: isActive ? "#14b8a6" : "transparent",
                        margin: "0 5px",
                    }}
                />
            )}

        />
    </div>
    
    )
}

export default HeroCarousel;

