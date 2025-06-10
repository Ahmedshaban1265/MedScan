import React from 'react'
import iPhone from '../assets/iPhone.png'
import lines from '../assets/lines.png'
import arrow from '../assets/arrowFrame.png'
const DownloadApp = () => {
    return (
        <section className='lg:flex items-center px-5 lg:px-36'>
            <div className='w-full lg:w-[65%]'>
                <img className='w-full h-auto lg:h-full' src={iPhone} />

            </div>
            <div className='w-full lg:w-[45%]'>
                <div className='relative ms-auto'>
                    <img className='absolute -top-7 lg:-top-10 -start-6 lg:-start-11 w-9  m-auto lg:w-auto ' src={lines} />
                    <h3 className='text-[20px] text-center lg:text-start lg:text-5xl font-[600] text-blue-medium '>Download the  <span className='text-Primary'>MedScan</span> App</h3>
                    <img className='absolute top-16 lg:-start-20 w-8  m-auto lg:w-auto ' src={arrow} />
                    <p className='text-sm text-center lg:text-start lg:text-2xl font-[400] text-gray-500 pt-4'>To book with the best specialized doctors</p>

                    <div className='pt-14'>
                        <p className='text-base text-gray-700 font-[700]'>Get the link to download the app</p>
                        <div className='flex flex-col lg:flex-row gap-2 lg:gap-5 items-center py-2'>
                            <div className='flex w-full lg:w-auto border-2 border-gray-200 rounded-lg'>
                                <p className='border-r-2 border-gray-200 py-3 px-2 font-bold'>+20</p>
                                <input className='flex-grow lg:pe-20 ps-5 py-3' placeholder='Enter phone number' />
                            </div>
                            <button className='w-full lg:w-auto bg-Primary text-white py-3 rounded-lg lg:px-4'>Send SMS</button>
                        </div>
                    </div>


                </div>

            </div>
        </section>
    )
}

export default DownloadApp