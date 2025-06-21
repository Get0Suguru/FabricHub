import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomeSectionCard = ({product}) => {
      // const imageurl= 'https://calvinklein.scene7.com/is/image/CalvinKlein/47B020G_YAA_main?wid=1728&qlt=80%2C0&resMode=sharp2&op_usm=0.9%2C1.0%2C8%2C0&iccEmbed=0&fmt=webp'

      const navigate = useNavigate();

  return (


    // one-item card
    <div className='cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-md
    overflow-hidden w-[16rem] mx-3 my-[2px] hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out'
    onClick={() => navigate(`/product/${product.id}`)}
    >

      {/* img part */}
      <div className='h-[14rem] w-[12rem]'>
        {/* <img className='object-cover object-top w-full h-full' src={imageurl} alt=''></img> */}
        <img className='object-cover object-top w-full h-full' src={product.imageUrl} alt=''></img>

      </div>

      {/* text part */}
      <div className='p-4'>
        <h3 className='text-lg font-medium text-grey-900'>{product.brand}</h3>
        <p className='mt-2 text-sm text-grey-500'>{product.title.substring(0,28)}</p>
      </div>

    </div>
  )
}


export default HomeSectionCard
