import React from "react";
import underLine from '../assets/underLineText.png'

import { MeetSectionData } from "../../data";

const MeetDoctors = () => {
  return (
    <section className=' py-0 lg:py-10 px-3 lg:px-20'>
      <div className='relative lg:py-5'>
        <h3 className='lg:pt-10 text-center font-[700] text-xl lg:text-[40px] text-black-medium'>Meet Our Great Doctors </h3>
        <img className='m-auto py-2 w-32 lg:w-auto lg:max-w-[200px]' src={underLine} alt='Underline' />
      </div>

      <div className="container ">
        {MeetSectionData.map((doctor, index) => (
          <div
            key={index}
            className={`bg-linear-gradient  rounded-3xl px-6  pt-5 lg:py-10 h-[60vh] lg:h-[40vh] relative flex shadow-xl lg:w-[70%] my-5 lg:my-10   ${index % 2 === 0 ? '' : 'ms-auto'}`}
          >
            <div className="w-1/2">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className={`lg:absolute bottom-0  ${index % 2 === 0 ? 'start-0' : 'end-0'} `}
              />
            </div>

            <div className={`w-1/2  text-center lg:absolute ${index % 2 === 0 ? 'end-0' : 'start-0'} `}>
              <h3 className="text-base lg:text-2xl  font-[500] lg:font-semibold text-white">
                {doctor.name}
              </h3>
              <p className="text-white opacity-40">{doctor.specialist}</p>
              <div className="py-1 lg:py-2">
                <p className="text-base text-gray-100 font-semibold">
                  Availability:
                </p>
                <p className="text-xs lg:text-sm text-white opacity-40">{doctor.Availability}</p>
              </div>
              <p className=" mt-2 text-gray-100 text-[13px] lg:text-[15px]  lg:px-2">
                {doctor.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetDoctors;