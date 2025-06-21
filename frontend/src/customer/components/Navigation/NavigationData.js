const Navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [
        {
          name: 'New Arrivals',
          href: '/products?category=Women',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '/products?category=Women',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', href: '/products?category=Tops&&gender=Women' },
            { name: 'Pants', href: '/products?category=Pants&&gender=Women' },
            { name: 'Shirt', href: '/products?category=Shirt&&gender=Women' },
            { name: 'Jeans', href: '/products?category=Jeans&&gender=Women' },
            { name: 'Jacket', href: '/products?category=Jacket&&gender=Women' },
            { name: 'Skirt', href: '/products?category=Skirt&&gender=Women' },
            { name: 'Dress', href: '/products?category=Dress&&gender=Women' },
            { name: 'Innerwears', href: '/products?category=Innerwear&&gender=Women' },
            { name: 'Browse All', href: '/products?category=Women' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Bracelet', href: '/products?category=Bracelet&&gender=Women' },
            { name: 'Necklace', href: '/products?category=Necklace&&gender=Women' },
            { name: 'Caps', href: '/products?category=Baseball Cap&&gender=Women' },
            { name: 'Bags', href: '/products?category=Bags&&gender=Women' },
            { name: 'Hats', href: '/products?category=Bucket Hat&&gender=Women' },
            { name: 'Belts', href: '/products?category=Belt&&gender=Women' },
            { name: 'Browse All', href: '/products?gender=Women&&category=Accessories' },

          ],
        },
        {
          id: 'brands',
          name: 'Brands',
          items: [
            { name: 'Full Nelson', href: '#' },
            { name: 'My Way', href: '#' },
            { name: 'Re-Arranged', href: '#' },
            { name: 'Counterfeit', href: '#' },
            { name: 'Significant Other', href: '#' },
          ],
        },
      ],
    },
    {
      id: 'men',
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          href: '/products?category=Men',
          imageSrc:
            'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
          imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
        },
        {
          name: 'Artwork Tees',
          href: '/products?category=Men',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg',
          imageAlt:
            'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', href: '/products?category=Tops&&gender=Men' },
            { name: 'Jeans', href: '/products?category=Jeans&&gender=Men' },
            { name: 'Shirts', href: '/products?category=Shirt&&gender=Men' },
            { name: 'Pants', href: '/products?category=Pants&&gender=Men' },
            { name: 'T-Shirts', href: '/products?category=T-Shirt&&gender=Men' },
            { name: 'Jackets', href: '/products?category=Jacket&&gender=Men' },
            { name: 'Brief', href: '/products?category=Brief&&gender=Men' },
            { name: 'Browse All', href: '/products?gender=Men' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Wallets', href: '/products?category=Wallet&&gender=Men' },
            { name: 'Caps', href: '/products?category=Baseball Cap&&gender=Men' },
            { name: 'Hats', href: '/products?category=Bucket Hat&&gender=Men' },
            { name: 'Belts', href: '/products?category=Belt&&gender=Men' },
            { name: 'Sneakers', href: '/products?category=Sneaker&&gender=Men' },
            { name: 'Slides', href: '/products?category=Slide&&gender=Men' },
            { name: 'Browse All', href: '/products?gender=Men&&category=Accessories' },




          ],
        },
        {
          id: 'brands',
          name: 'Brands',
          items: [
            { name: 'Re-Arranged', href: '#' },
            { name: 'Counterfeit', href: '#' },
            { name: 'Full Nelson', href: '#' },
            { name: 'My Way', href: '#' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}

export default Navigation;