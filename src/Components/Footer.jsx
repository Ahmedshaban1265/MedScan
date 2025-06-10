import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { NavbarData } from '../../data'
import facebook from '../assets/icons/facebook.png'
import instagram from '../assets/icons/instagram.png'
import linkedin from '../assets/icons/linkedin.png'
import twitter from '../assets/icons/twitter.png'

const Footer = () => {
  return (
   <section className=' px-3 lg:px-20 py-10 '>
      <div className='flex items-center justify-between'>
        <img className='  lg:w-auto w-20' src={logo}/>
        <div className='flex items-center pt-2 gap-2 lg:px-10 lg:gap-10'>
           {
            NavbarData.map((item)=>(
                <div className='text-Secondary-darkGray font-bold lg:font-[600]'>
                    <Link className=' text-[10px] sm:text-[15px] md:text-[14px] lg:text-base' to={item.path}>{item.name}</Link>
                </div>
            ))
           } 
           
        </div>

      </div>
      <div className=' border-[1px] lg:border-[1.6px]  border-Secondary-darkGray lg:border-black-dark shadow-lg opacity-90  w-full rounded-full my-5'/>
       
       <div className=' m-auto text-center lg:flex justify-between items-center'>
        <p className='text-xs lg:text-sm font-[400] text-black-dark'>All rights reserved ® uifry.com | Terms and conditions apply!</p>
           <div className=' py-4 lg:py-0 flex lg:justify-start justify-center gap-5'>
           <img width={32} height={32} src={facebook}/>
           <img width={32} height={32} src={instagram}/>
           <img width={32} height={32} src={linkedin}/>
           <img width={32} height={32} src={twitter}/>
           </div>
       </div>
   </section>
  )
}

export default Footer