import React from 'react'
import star from '../assets/star.png'
import underLine from '../assets/underLineText.png'
import { whySectionData } from '../../data'

const WhySection = () => {
  return (
    <section className='  pt-40 lg:pt-0 py-10  px-3 lg:px-20'>
    <div className='relative py-10'>
  <img className='absolute top-10 lg:top-0 left-[8%] lg:left-[32%] w-12 lg:w-auto lg:max-w-[150px]' src={star} alt='Star icon' />
  <h3 className='pt-10 text-center font-[700] text-xl lg:text-[40px] text-black-medium'>Why Choose Us?</h3>
  <img className='m-auto py-2 w-32 lg:w-auto lg:max-w-[200px]' src={underLine} alt='Underline' />
</div>


      <div className='grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
        {
          whySectionData?.map((item)=>(
            <div className='bg-white text-center  rounded-2xl  py-10'>
              <img className='m-auto pb-4' src={item.icon}/>
              <h3 className='font-[600] text-2xl pb-3'>{item.title}</h3>
              <p className='font-[400] text-[16px] text-Secondary-mediumGray px-5 lg:px-10 '>{item.description}</p>
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default WhySection