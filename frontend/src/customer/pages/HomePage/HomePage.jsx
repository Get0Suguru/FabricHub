import React, { useState, useEffect } from 'react';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import HomeSectionCarousel from '../../components/HomeSectionCarousel/HomeSectionCarousel';
import axios from 'axios';

const HomePage = () => {
  // State to store fetched products for each section
  const [sectionData, setSectionData] = useState({
    "Men's Shirts": [],
    "Men's Pants": [],
    "Men's Jackets": [],
    "Women's Tops": [],
    "Women's Jeans": [],
    "Women's Jackets": [],
    "Women's Accessories": [],
    "Men's Sneakers": [],
  });

  // List of sections with parsed gender and category
  const sections = [
    { sectionName: "Men's Shirts", gender: "Men", category: "Shirt" },
    { sectionName: "Men's Pants", gender: "Men", category: "Pants" },
    { sectionName: "Men's Jackets", gender: "Men", category: "Jacket" },
    { sectionName: "Women's Tops", gender: "Women", category: "Tops" },
    { sectionName: "Women's Jeans", gender: "Women", category: "Jeans" },
    { sectionName: "Women's Jackets", gender: "Women", category: "Jacket" },
    { sectionName: "Women's Accessories", gender: "Women", category: "Accessories" },
    { sectionName: "Men's Sneakers", gender: "Men", category: "Sneaker" },
  ];

  // Fetch products for all sections on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        for (const { sectionName, gender, category } of sections) {
          const params = new URLSearchParams();
          if (gender) params.append('gender', gender);
          if (category) params.append('category', category);
          const url = `/api/public/products?${params.toString()}`;
          console.log(`Fetching: ${url}`);
          const { data } = await axios.get(url, { withCredentials: true });

          setSectionData(prev => ({
            ...prev,
            [sectionName]: data.content || [],
          }));

          // Add a delay before fetching the next section
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array for mount-only

  return (
    <div>
      <HeroCarousel />
      <div className='space-y-10 flex flex-col justify-center'>
        {sections.map(({ sectionName }) => (
          <HomeSectionCarousel
            key={sectionName}
            data={sectionData[sectionName]}
            sectionName={sectionName}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;