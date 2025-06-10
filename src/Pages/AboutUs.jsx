import React from 'react'
import about from '../assets/about.png'
import num1 from '../assets/icons/num1.png'
import num2 from '../assets/icons/num2.png'
import num3 from '../assets/icons/num3.png'
import underLine from '../assets/underLineText.png'
import WhySection from '../Components/WhySection'
import DownloadApp from '../Components/DownloadApp'


const AboutUs = () => {
    return (
        <section className=' px-3 lg:px-20  pt-20 lg:pt-0'>
            <div className='relative pt-6 lg:py-5'>
                <h3 className='lg:pt-10 text-center font-[700] text-xl lg:text-[40px] text-black-medium'>About Us </h3>
                <img className='m-auto py-2 w-32 lg:w-auto lg:max-w-[200px]' src={underLine} alt='Underline' />
                <p className='  py-5 lg:w-[40%] m-auto text-center font-[300] text-lg lg:text-xl text-gray-600'>Who we are and why we did this project ?!</p>
            </div>

            <div className='lg:flex items-center gap-10  w-full'>
                <div className='lg:w-1/2 lg:pt-10'>
                    <h3 className=' py-10 text-center  lg:text-start font-bold lg:font-extrabold text-[18px] lg:text-[38px] text-black-medium '>We are students at <span className='text-lightPrimary'> Modern Academy </span>
                        and we created this project to help people : </h3>

                    <div className='flex items-start lg:gap-3  lg:text-start px-5  text-center'>
                        <img className='inline-block lg:max-w-lg w-9 ' src={num1} />
                        <div className='py-2'>
                            <p className='font-[500]  text-lg lg:text-2xl'>  Saving high cost</p>
                            <p className='text-gray-600 text-[14px] lg:text-[16px] font-[400] lg:w-[60%] py-2'>We aim to provide tools that help people discover diseases instead of paying large sums of money</p>
                        </div>

                    </div>


                    <div className='flex items-start  lg:gap-3  lg:text-start px-5  text-center lg:ps-28 lg:pt-20 lg:py-10'>
                        <img className='inline-block lg:max-w-3xl w-9 ' src={num2} />
                        <div className='py-2'>
                            <p className='font-[500]  text-lg lg:text-2xl'>  Access to the best doctors</p>
                            <p className='text-gray-600 text-[14px] lg:text-[16px]  font-[400] lg:w-[60%] py-2'>Instead of  a long search for doctors, we have provided the best specialized doctors</p>

                        </div>
                    </div>

                    <div className='flex items-start  gap-5 lg:gap-3  lg:text-start px-5  text-center'>
                        <img className='inline-block lg:max-w-3xl w-9 ' src={num3} />
                        <div className='py-2'>
                        <p className='font-[500]  text-lg lg:text-2xl'>  Accurate diagnosis of the disease</p>
                            <p className='text-gray-600 text-[14px] lg:text-[16px]  font-[400] lg:w-[60%] py-2'>Instead of a long search for doctors, we have provided the best specialized doctors</p>

                        </div>
                    </div>

                </div>

                <div className='lg:w-1/2 '>
                    <img className='lg:w-[550px] lg:h-[620px] object-cover m-auto' src={about} />
                </div>
            </div>

            <WhySection/>
            <DownloadApp/>
        </section>
    )
}

export default AboutUs