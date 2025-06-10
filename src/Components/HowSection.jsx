import React from 'react'
import circle from '../assets/halfCircle.png'


const HowSection = () => {
  return (

    <section class="relative  h-[40vh]  ">
      <div class="imageBackGround  inset-0"> </div>
      {/* <img className='absolute   lg:start-0 top-28 lg:top-10  w-24 lg:w-full' src={circle} /> */}

      <div className='text-center relative z-10'>
        <p className='text-black-medium font-[500] lg:font-[600] text-xl lg:text-4xl py-8'>How does AI assist Radiologists?</p>
        <div className=' text-[16px] lg:text-2xl font-[500] text-Secondary-darkGray  px-5 lg:px-56'>
          <p className=''>The radiologist struggles to identify the disease at its beginning because it does not appear clearly on the x-ray, and this often leads to the inability to accurately identify the disease.</p>
          <p className='py-3'>It helps doctors in early diagnosis of diseases and accurately explains radiology reports to help them make accurate decisions for improved patient care.</p>
        </div>
      </div>
    </section>

  )
}

export default HowSection