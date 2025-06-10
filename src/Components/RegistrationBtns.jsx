import React from 'react'
import { Link } from 'react-router-dom'

const RegistrationBtns = ({className ,gap}) => {
    return (
        <div className={`flex items-center  ${gap}`}>
            <Link to={'/login'} className={` ${className} text-Primary border-2 border-solid border-Primary    rounded-2xl `}>Log in</Link>
            <Link to={'/signUp'} className={`  ${className}  bg-Primary text-white   border-2 rounded-2xl   ` }>Sign UP</Link>
        </div>
    )
}

export default RegistrationBtns