import React from 'react'
import circle1 from '../assets/icons/circle1.png'
import circle2 from '../assets/icons/circle2.png'
import wave from '../assets/icons/wave.png'
import call from '../assets/icons/call.png'
import mail from '../assets/icons/mail.png'
import address from '../assets/icons/address.png'
import Form from '../Components/Form'

const ContactUs = () => {
  return (
    <section className='py-20 lg:py-28  px-5 lg:px-32'>
      <div className='relative z-5 ' >
        <img className='absolute  w-0 lg:w-[170px] lg:h-[170px]  lg:-start-20  lg:-top-20 z-0' src={circle1} />
        <img className='absolute w-0 lg:w-[170px] lg:h-[170px]   lg:-bottom-16 lg:-end-20 z-0' src={circle2} />


        <div className=' relative  lg:flex w-full border-[1px] p-2 bg-white border-gray-300 rounded-lg '>

          {/* info */}
          <div className=' w-full lg:w-[35%] bg-Primary  text-white rounded-lg  '>
            <div className=' pt-10 ps-10'>
              <h3 className='pb-10 text-2xl lg:text-3xl font-[500] '>Contact Information</h3>
              <div className='flex  gap-5'><img src={call} /> <p className='text-[16px] '>+20 1204944172 </p> </div>
              <div className='flex my-5 gap-5'><img src={mail} /> <p className='text-[16px] '>mohammed@gmail.com </p> </div>
              <div className='flex gap-5'><img src={address} /> <p className='text-[16px] '>Benha ,Al-Qalyubia </p> </div>
            </div>

            <img className=' w-[300px] h-[300px] lg:w-[800px] lg:h-auto' src={wave} />
          </div>
          {/* form */}
          <div className='w-full lg:w-[65%] '>
            <Form />
          </div>

        </div>



      </div>
    </section>
  )
}

export default ContactUs