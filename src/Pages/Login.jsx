import React, { useState } from 'react'
import shadow from '../assets/Bg-Shape.png'
import logo from '../assets/logo1.png'
import apple from '../assets/icons/apple.png'
import face from '../assets/icons/face.png'
import google from '../assets/icons/google.png'
import { useAuth } from '../Auth/AuthProvider'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const navigate = useNavigate()

    const { setAuth, login } = useAuth()
    const [email, setMail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = async (e) => {
        const loginData = {
            email: email,
            password: password,
        };

        e.preventDefault();

        const apiUrl = 'http://medscanlogin.runasp.net/api/Auth/Login';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', // Tell the API we're sending JSON
                },
                body: JSON.stringify(loginData),
            })

            if (response.ok) {

                setMessage('Login successful!')
                setMessageType('success')

                setTimeout(() => {
                    navigate('/')
                }, 5000);
                const responseData = await response.json()
                login(responseData.userName)
                setAuth(responseData.isAuth)
                console.log(responseData)
                console.log('success')


            } else {

                setMessage('Login Failed')
                setMessageType('failed')
                try {
                    const errorText = await response.text()
                    console.error('Error Text:', errorText);
                    setMessage(errorText)
                    console.log(`Registration failed: ${response.status} - ${errorText}`);
                } catch (e) {

                    console.error('Error parsing error response:', e);
                    console.log(`Registration failed: ${response.status} - Could not parse error response`);
                }

            }

        } catch (e) {
            console.log('failed', e)
            setMessageType('failed')
        }

        setMail('')
        setPassword('')

        setTimeout(() => {
            setMessage('')
        }, 3000)
    }
    return (
        <section className=' lg:px-20 py-10 relative'>
        <img className='m-auto  w-[70%]  h-full  hidden lg:block  relative z-0' src={shadow} />
        <div className='lg:flex  lg:w-[70%]  lg:h-[86%]   lg:absolute  start-60  top-14'>
            <div className='  lg:w-1/2 bg-linear-gradient  rounded-s-3xl  hidden lg:flex justify-center items-center '>
                <img className=' z-20  w-72' src={logo} />
            </div>
            <div className='bg-white w-full lg:w-1/2   rounded-e-3xl px-8 py-14'>
                <h2 className='text-center font-semibold text-2xl py-10'>Login your account!</h2>

                <form onSubmit={handleSubmit}>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>Email</label>
                        <input value={email} onChange={(e) => setMail(e.target.value)} placeholder='email' className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' />

                    </div>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='password' className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' />

                    </div>

                    <div className='flex justify-center items-center my-2'>
                        <button type='submit' className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg'>Login</button>
                    </div>

                    <div><p className={`text-center font-semibold py-1  ${messageType === 'failed' ? 'text-red-700' : 'text-Primary'}`}>{message}</p></div>


                </form>


                <div className='text-center py-5'>
                    <p className='py-2 text-Secondary-darkGray text-sm'>Login With</p>
                    <div className='flex items-center justify-center gap-4 py-2'>
                        <img src={face} />
                        <img src={google} />
                        <img src={apple} />
                    </div>
                    <p className='pt-2 text-black-medium'>Don’t have an account ? <Link to={'/signUp'}  className='text-Primary'>Sign Up</Link></p>
                </div>

            </div>
        </div>
    </section>
    )
}

export default Login