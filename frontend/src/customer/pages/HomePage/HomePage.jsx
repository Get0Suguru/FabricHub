import React, { useState, useEffect } from 'react';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import HomeSectionCarousel from '../../components/HomeSectionCarousel/HomeSectionCarousel';
import axios from 'axios';

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
  const [apiError, setApiError] = useState(null);

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
        const status = error.response?.status;
        const backendMessage = error.response?.data?.message || error.response?.data?.error;
        setApiError({
          status,
          message: backendMessage || (status ? 'The backend could not load the products.' : 'The backend is not responding.'),
        });
      }
    };

    fetchProducts();
  }, []); // Empty dependency array for mount-only

  return (
    <div>
      <HeroCarousel />
      <div className='space-y-10 flex flex-col justify-center'>
        {apiError && (
          <div role="alert" className="mx-4 lg:mx-8 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-800 shadow-sm">
            <p className="font-semibold">Unable to load products</p>
            <p className="mt-1 text-sm">
              {apiError.message}
              {apiError.status ? ` (HTTP ${apiError.status})` : ''}
            </p>
          </div>
        )}
        {!apiError && sections.map(({ sectionName }) => (
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