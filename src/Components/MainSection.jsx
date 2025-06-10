
import React from 'react';
import photo from '../assets/mainPhoto.png';
import camera from '../assets/icons/camera.png';
import arrowRight from '../assets/icons/arrow-right.png';
import { Link } from 'react-router-dom';
import arrow from '../assets/icons/black-arrow.png'
import { useAuth } from '../Auth/AuthProvider';

const MainSection = () => {

  const { auth } = useAuth()
  return (
    <section className='flex flex-col-reverse lg:flex-row gap-5 items-center px-2 lg:px-20'>
      <div className='  w-full lg:w-[55%]'>
        <p className='text-center lg:text-start font-bold text-3xl lg:text-6xl leading-[1.2]'>
          Discover accurate diagnosis & the latest <span className='text-Primary'>treatment methods.</span>
        </p>
        <div className='flex flex-wrap lg:flex-grow-0 items-center gap-1 lg:gap-2 pt-12  pb-3'>

          {
            auth ? (<Link to={'/scan'} className='flex  flex-grow lg:flex-grow-0 items-center gap-2 lg:gap-4 font-[600] lg:font-bold text-[12px] lg:text-lg bg-Primary text-white px-1 lg:px-6 py-2 lg:py-3 rounded-md lg:rounded-xl'>
              Start automated diagnostics
              <img className='w-4 lg:w-6 lg:h-6' src={camera} alt='Camera icon' />
            </Link>) : (

                <Link to={'/'} className=' hover:bg-Secondary-darkGray flex  flex-grow lg:flex-grow-0 items-center gap-2 lg:gap-4 font-[600] lg:font-bold text-[12px] lg:text-lg bg-Primary text-white px-1 lg:px-6 py-2 lg:py-3 rounded-md lg:rounded-xl'>
                  Start automated diagnostics
                  <img className='w-4 lg:w-6 lg:h-6' src={camera} alt='Camera icon' />
                </Link>
            )
          }

          <Link className='flex  flex-grow lg:flex-grow-0 items-center justify-between border-[3px] font-[600] border-Primary lg:py-3 text-[12px] lg:text-base px-2 py-[5px] lg:px-5 rounded-md lg:rounded-xl gap-1 lg:gap-2'>
            Learn More
            <img className='w-3 h-3' src={arrowRight} alt='Arrow icon' />
          </Link>


        </div>

        <div className='lg:w-[40%]'>
          <img className='m-auto' src={arrow} />
          <p className='text-sm text-Primary font-semibold ps-10 text-start'>please login before start automated scan diagnostics</p>
        </div>
      </div>
      <div className=' m-auto w-full lg:w-[45%] pt-16 lg:pt-0'>
        <img className='w-[600px]' src={photo} alt='Main visual' />
      </div>
    </section>
  );
};

export default MainSection;
