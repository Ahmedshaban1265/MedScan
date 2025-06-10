import React from 'react'
import underLine from '../assets/underLineText.png'
import serve1 from '../assets/serve1.png'
import serve2 from '../assets/serve2.png'
import serve3 from '../assets/serve3.png'
import AskQuestion from '../Components/AskQuestion'
import MeetDoctors from '../Components/MeetDoctor'



const Services = () => {
    return (
        <section className=' px-3 lg:px-16  pt-20 lg:pt-0'>
            <div className='relative py-6 lg:py-5'>
                <h3 className='lg:pt-10 text-center font-[700] text-xl lg:text-[40px] text-black-medium'>Services </h3>
                <img className='m-auto py-2 w-32 lg:w-auto lg:max-w-[200px]' src={underLine} alt='Underline' />
                <p className='  py-5 lg:w-[40%] m-auto text-center font-[300] text-xl text-gray-600'>We are using artificial intelligence in early diagnosis
                    of brain tumor and skin cancer</p>
            </div>
            <div className='px-4 '>
                 <div className='lg:flex items-center justify-between lg:flex-row flex flex-col-reverse  lg:py-20'>
                <div className='lg:w-1/2'>
                    <h3 className='font-[500] text-[14px] lg:text-[28px] text-black-medium text-center lg:text-start pt-5 lg:py-2'>There are many types of brain tumors, and brain tumors are mainly divided into two types:</h3>
                    <p className=' font-[500] text-[12px] lg:text-base py-2 text-gray-600 text-center lg:text-start lg:pe-28'>1- Benign brain tumors: Benign tumors are not aggressive, do not grow or spread to surrounding tissue, and do not return if removed.</p>
                    <p className=' font-[500]  text-[12px] lg:text-base text-gray-600 text-center lg:text-start lg:pe-28'>2- Malignant brain tumors: Also known as cancerous brain tumors, they are cancerous cells that grow or spread to surrounding tissues, and do not die, unlike normal cells.</p>

                </div>
                <div className='lg:w-1/2'>
                    <img className='m-auto' src={serve1} />

                </div>

            </div>


            <div className='lg:flex items-center justify-between py-10  lg:py-0  '>
                <div className='lg:w-1/2'>
                    <img className='' src={serve2} />

                </div>
                <div className='lg:w-1/2'>
                    <h3 className='font-[500] text-[14px] lg:text-[28px] text-black-medium text-center lg:text-start pt-5 lg:py-2'>Types of skin cancer vary according to the type of cells affected, as well as symptoms and treatment. Here are some of its types :</h3>
                    <p className=' font-[500] text-[12px] lg:text-base py-2 text-gray-600 text-center lg:text-start lg:pe-28'>1- Melanoma skin cancer : It is the least common type, but the most dangerous and aggressive. It may spread easily to other parts of the body, and originates from melanocytes in the skin.</p>
                    <p className=' font-[500]  text-[12px] lg:text-base text-gray-600 text-center lg:text-start lg:pe-28'>2- Non-melanoma skin cancer : It is the most common type of skin cancer, the least aggressive and widespread, and usually occurs in areas of skin exposed to the sun.</p>

                </div>


            </div>


            <div className='lg:flex  items-center justify-between lg:flex-row flex flex-col-reverse py-10  lg:py-16'>
                <div className='lg:w-1/2'>
                    <h3 className='font-[500] text-[14px] lg:text-[28px] text-black-medium text-center lg:text-start pt-5 lg:py-2 lg:pe-10'>We have also created an application through which you can..</h3>
                    <p className=' font-[500] text-[12px] lg:text-base py-2 text-gray-600 text-center lg:text-start lg:pe-28'>1- Diagnosing the disease : All you have to do is upload the image and artificial intelligence will analyze it and display accurate results to you</p>
                    <p className=' font-[500]  text-[12px] lg:text-base text-gray-600 text-center lg:text-start lg:pe-28'>2- Having the best doctors : We have researched and provided you with the best specialized doctors</p>
                    <p className=' font-[500]  text-[12px] lg:text-base text-gray-600 text-center lg:text-start lg:pe-28'>3- Book an appointment : You can book an appointment with the doctor you want very easily</p>

                </div>
                <div className='lg:w-1/2'>
                    <img className='m-auto' src={serve3} />

                </div>

            </div>
            </div>

           

            <AskQuestion/>
            <MeetDoctors/>
        </section>
    )
}

export default Services