import React, { useState } from 'react'
import underLine from '../assets/underLineText.png'
import { QuestionData } from '../../data'
import upArrow from '../assets/icons/arrow-up.png'
import downArrow from '../assets/icons/arrow-down.png'


const AskQuestion = () => {
    const [show, setShow] = useState(false)
    const [UId, setUId] = useState('')
    const openToggle = (id) => {
        setUId(id)
        setShow((prev)=>!prev)
    }
    return (
        <section className='lg:py-10 px-3 lg:px-20'>
            <div className='relative py-5'>
                <h3 className='pt-10 text-center font-[700] text-[20px] lg:text-[40px] text-black-medium'>Frequently Ask Question </h3>
                <img className='m-auto py-2 w-32 lg:w-auto lg:max-w-[200px]' src={underLine} />
            </div>

            <div>
                {
                    QuestionData?.map((item) => (
                        <div className='my-2 lg:mx-28'>
                            <div className='question flex items-center justify-between  border-[1px] px-10 lg:px-12 py-5  rounded-[33px] border-blue-light '>
                                <p className=' text-[12px] lg:text-3xl'>  {item.question}</p>
                                <img onClick={() => openToggle(item.id)} className='w-6 h-6 cursor-pointer' src={downArrow} />
                            </div>
                            <div>
                                {
                                    show && UId === item.id && <div className='bg-Primary py-10 px-10 lg:px-12 rounded-2xl my-5'>
                                        <div className='text-white flex items-center justify-between'>
                                        <h3 className=' text-[16px] lg:text-3xl font-[400]'>{item.answer.title}</h3>
                                         <img onClick={() => setShow(false)} className='w-6 h-6 cursor-pointer' src={upArrow}/>
                                        </div>
                                        <div className='border-[1px] opacity-70 lg:w-[70%] m-auto border-white my-4' />
                                        <div className=' grid lg:grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1 text-gray-200  text-sm lg:text-lg font-[400]'> 
                                            <p>{item.answer.answ1}</p>
                                            <p>{item.answer.answ2}</p>
                                            <p>{item.answer.answ3}</p>
                                            <p>{item.answer.answ4}</p>
                                            <p>{item.answer.answ5}</p>
                                            <p>{item.answer.answ6}</p>
                                        </div>
                                        </div>
                                }
                            </div>
                        </div>
                    ))
                }

            </div>
        </section>
    )
}

export default AskQuestion