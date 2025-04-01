import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const AddProductPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const sizeOptions = ['S', 'M', 'L', 'XL'];
  const colorOptions = [
    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
    'Purple', 'Pink', 'Orange', 'Gray', 'Brown', 'Teal'
  ];

  // Predefined category hierarchy
  const categoryHierarchy = {
    Men: {
      Clothing: ['Tops', 'Pants', 'Sweaters', 'T-Shirts','Jackets','Activewear'],
      Accessories: ['Watches', 'Wallets', 'Bags', 'Sunglasses', 'Hats', 'Belts'],
      Brands: ['Full Nelson', 'My Way', 'Re-Arranged', 'Counterfeit']
    },
    Women: {
      Clothing: ['Dresses', 'Tops', 'Skirts', 'Bras', 'T-Shirts', 'Jackets', 'Coats', 'Jeans', 'Shorts', 'Sweaters', 'Pantis', 'Activewear'],
      Accessories: ['Jewelry', 'Scarves', 'Handbags', 'Belts', 'Wallets', 'Watches', 'Sunglasses', 'Hats'],
      Brands: ['Full Nelson', 'My Way', 'Re-Arranged', 'Counterfeit']
    },
    Kids: {
      Gadgets: ['Smartphones', 'Tablets', 'Headphones'],
      Appliances: ['Microwaves', 'Blenders', 'Vacuum Cleaners']
    }
  };

  // State for size quantities
  const [sizeQuantities, setSizeQuantities] = useState(
    sizeOptions.reduce((acc, size) => {
      acc[size] = 0;
      return acc;
    }, {})
  );

  // State for custom categories
  const [customTopLevel, setCustomTopLevel] = useState('');
  const [customSecondLevel, setCustomSecondLevel] = useState('');
  const [customThirdLevel, setCustomThirdLevel] = useState('');

  // Watch form fields for category selections
  const topLevelCategory = watch('topLevelCategory', '');
  const secondLevelCategory = watch('secondLevelCategory', '');
  const thirdLevelCategory = watch('thirdLevelCategory', '');

  const handleSizeQuantityChange = (size, value) => {
    const newQuantities = {
      ...sizeQuantities,
      [size]: Math.max(0, parseInt(value) || 0)
    };
    setSizeQuantities(newQuantities);
    
    const total = Object.values(newQuantities).reduce((sum, qty) => sum + qty, 0);
    setValue('quantity', total);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const sizesWithQuantities = Object.entries(sizeQuantities)
        // .filter(([_ , qty]) => qty > 0)
        .filter(([ , qty]) => qty > 0)
        .map(([size, quantity]) => ({ size, quantity }));

      if (sizesWithQuantities.length === 0) {
        toast.error('Please add quantity for at least one size', {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      // Create productData with all required fields
      const productData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        discountedPrice: parseFloat(data.price - (data.price * (data.discountPresent / 100))),
        discountPresent: parseInt(data.discountPresent) || 0,
        quantity: Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0),
        brand: data.brand,
        color: data.color,
        size: sizesWithQuantities,
        imageUrl: data.imageUrl,
        topLevelCategory: data.topLevelCategory === 'new' ? customTopLevel : data.topLevelCategory,
        secondLevelCategory: data.secondLevelCategory === 'new' ? customSecondLevel : data.secondLevelCategory || '',
        thirdLevelCategory: data.thirdLevelCategory === 'new' ? customThirdLevel : data.thirdLevelCategory || ''
      };

      // Send productData to the API
      await axios.post('/api/admin/products/create', productData);

      toast.success('Product added successfully!', {
        position: "top-center",
        autoClose: 3000,
      });
      
      reset();
      setSizeQuantities(
        sizeOptions.reduce((acc, size) => {
          acc[size] = 0;
          return acc;
        }, {})
      );
      setPreviewImage(null);
      setCustomTopLevel('');
      setCustomSecondLevel('');
      setCustomThirdLevel('');
    } catch (error) {
      toast.error('Failed to add product. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuantity = Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700">Add New Product</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to add a new product to your inventory</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 sm:p-8">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-teal-700 border-b pb-2 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title", { required: "Product title is required" })}
                  className={`w-full px-4 py-2 rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-teal-500 focus:border-teal-500`}
                  placeholder="e.g. Cotton T-Shirt"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="brand"
                  {...register("brand", { required: "Brand is required" })}
                  className={`w-full px-4 py-2 rounded-md border ${errors.brand ? 'border-red-500' : 'border-gray-300'} focus:ring-teal-500 focus:border-teal-500`}
                  placeholder="e.g. Nike"
                />
                {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  {...register("description", { required: "Description is required" })}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-teal-500 focus:border-teal-500`}
                  placeholder="Detailed product description..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-teal-700 border-b pb-2 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  {...register("price", { 
                    required: "Price is required",
                    min: { value: 1, message: "Price must be at least $1" }
                  })}
                  className={`w-full px-4 py-2 rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-teal-500 focus:border-teal-500`}
                  placeholder="e.g. 49.99"
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div>
                <label htmlFor="discountPresent" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discountPresent"
                  {...register("discountPresent", { 
                    min: { value: 0, message: "Discount cannot be negative" },
                    max: { value: 100, message: "Discount cannot exceed 100%" }
                  })}
                  className={`w-full px-4 py-2 rounded-md border ${errors.discountPresent ? 'border-red-500' : 'border-gray-300'} focus:ring-teal-500 focus:border-teal-500`}
                  placeholder="e.g. 15"
                  defaultValue={0}
                />
                {errors.discountPresent && <p className="mt-1 text-sm text-red-500">{errors.discountPresent.message}</p>}
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  {...register("quantity")}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 focus:ring-teal-500 focus:border-teal-500"
                  value={totalQuantity}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Attributes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-teal-700 border-b pb-2 mb-4">Product Attributes</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color <span className="text-red-500">*</span>
                </label>
                <select
                  id="color"
                  {...register("color", { required: "Color is required" })}
                  className={`w-full px-4 py-2 rounded-md border ${errors.color ? 'border-red-500' : 'border-gray-300'} focus:ring-teal-500 focus:border-teal-500`}
                >
                  <option value="">Select a color</option>
                  {colorOptions.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                {errors.color && <p className="mt-1 text-sm text-red-500">{errors.color.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sizes & Quantities <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sizeOptions.map((size) => (
                    <div key={size} className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">{size}</label>
                      <input
                        type="number"
                        min="0"
                        value={sizeQuantities[size]}
                        onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                        className="w-full px-3 py-1 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Qty"
                      />
                    </div>
                  ))}
                </div>
                {totalQuantity === 0 && (
                  <p className="mt-2 text-sm text-red-500">Please add quantity for at least one size</p>
                )}
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-teal-700 border-b pb-2 mb-4">Categories</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="topLevelCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Top Level Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="topLevelCategory"
                  {...register("topLevelCategory", { required: "Top level category is required" })}
                  className={`w-full px-4 py-2 rounded-md border ${errors.topLevelCategory ? 'border-red-500' : 'border-gray-300'} focus:ring-teal-500 focus:border-teal-500`}
                >
                  <option value="">Select a category</option>
                  {Object.keys(categoryHierarchy).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="new">Add New Category</option>
                </select>
                {errors.topLevelCategory && <p className="mt-1 text-sm text-red-500">{errors.topLevelCategory.message}</p>}
                {topLevelCategory === 'new' && (
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter new top level category"
                    value={customTopLevel}
                    onChange={(e) => setCustomTopLevel(e.target.value)}
                    required
                  />
                )}
              </div>

              <div>
                <label htmlFor="secondLevelCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Second Level Category
                </label>
                <select
                  id="secondLevelCategory"
                  {...register("secondLevelCategory")}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  disabled={!topLevelCategory || topLevelCategory === 'new'}
                >
                  <option value="">Select a category</option>
                  {topLevelCategory && categoryHierarchy[topLevelCategory] && Object.keys(categoryHierarchy[topLevelCategory]).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="new">Add New Category</option>
                </select>
                {secondLevelCategory === 'new' && (
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter new second level category"
                    value={customSecondLevel}
                    onChange={(e) => setCustomSecondLevel(e.target.value)}
                    required
                  />
                )}
              </div>

              <div>
                <label htmlFor="thirdLevelCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Third Level Category
                </label>
                <select
                  id="thirdLevelCategory"
                  {...register("thirdLevelCategory")}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  disabled={!secondLevelCategory || secondLevelCategory === 'new'}
                >
                  <option value="">Select a category</option>
                  {topLevelCategory && secondLevelCategory && categoryHierarchy[topLevelCategory]?.[secondLevelCategory]?.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="new">Add New Category</option>
                </select>
                {thirdLevelCategory === 'new' && (
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-2 rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter new third level category"
                    value={customThirdLevel}
                    onChange={(e) => setCustomThirdLevel(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-teal-700 border-b pb-2 mb-4">Product Image</h2>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  {...register("imageUrl", { required: "Image URL is required" })}
                  className={`w-full px-4 py-2 rounded-md border ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'} focus:ring-teal-500 focus:border-teal-500`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl.message}</p>}
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or Upload Image
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-teal-50 file:text-teal-700
                      hover:file:bg-teal-100"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {previewImage && (
                <div className="flex-1 flex justify-center">
                  <div className="w-48 h-48 border border-gray-300 rounded-md overflow-hidden">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || totalQuantity === 0}
              className={`px-6 py-3 rounded-md text-white font-medium ${isSubmitting || totalQuantity === 0 
                ? 'bg-teal-400 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </span>
              ) : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default AddProductPage;