import React from 'react'

const Form = () => {
    return (
        <form className='px-5 lg:px-10 py-10'>
            <div className='lg:flex w-full gap-10 my-4'>
                <div className='lg:w-1/2'>
                    <label className='font-semibold text-black-medium  py-2 block'>First Name</label>
                    <input className='border-[1px] rounded-[4px] shadow-sm w-full py-1 px-2' placeholder='Ahmed' />
                </div>

                <div className='lg:w-1/2'>
                    <label className='font-semibold text-black-medium py-2 block'>Last Name</label>
                    <input className='border-[1px] rounded-[4px] shadow-sm w-full py-1 px-2' placeholder='Mohammed' />
                </div>

            </div>

            <div className='lg:flex w-full gap-10 my-4'>
                <div className='lg:lg:w-1/2'>
                    <label className='  font-semibold text-black-medium  py-2 block'>Email</label>
                    <input className='border-[1px] rounded-[4px] shadow-sm w-full py-1 px-2' placeholder='Ahmed@gmail.com' />
                </div>

                <div className='lg:w-1/2'>
                    <label className='font-semibold text-black-medium py-2 block'>Phone Number</label>
                    <input className='border-[1px] rounded-[4px] shadow-sm w-full py-1 px-2' placeholder='+20 1999 99 9999' />
                </div>

            </div>
            <div className='py-3'>
                <label className='text-black-medium block font-semibold'>Select Subject ?</label>
                <div className='lg:flex  lg:flex-row flex flex-col  items-start  py-3'>
                   <div> <input className='lg:me-2 ' type='checkbox' /> <span className='lg:me-12  text-gray-800'>General Inquiry</span> </div> 
                  <div> <input className='lg:me-2' type='checkbox' /> <span className='lg:me-12  text-gray-800'>Test Packages</span> </div> 
                  <div>   <input className='lg:me-2' type='checkbox' />  <span className='lg:me-12  text-gray-800'>Help & Support</span></div> 
                  <div>   <input className='lg:me-2' type='checkbox' /> <span className='lg:me-12  text-gray-800'>Report </span></div> 

                </div>

            </div>

            <div className=''>
                <label className=' text-black-medium py-2 block pb-4 font-semibold '>Message</label>
                <textarea className='border-[1px] rounded-[4px] shadow-sm w-full pb-5 pt-2 px-2' placeholder='Write your message' cols={10} />
            </div>
        </form>
    )
}

export default Form