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
        e.preventDefault();

        const loginData = {
            email: email,
            password: password,
        };

        const apiUrl = 'http://medscanapi.runasp.net/api/Auth/login';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            })

            if (response.ok) {
                const responseData = await response.json()
                
                setMessage('تم تسجيل الدخول بنجاح!')
                setMessageType('success')

                // Handle successful login
                login(responseData.userName || responseData.email)
                setAuth(responseData.isAuth || true)
                
                console.log('Login successful:', responseData)

                setTimeout(() => {
                    navigate('/')
                }, 2000);

            } else {
                setMessage('فشل في تسجيل الدخول')
                setMessageType('failed')
                
                try {
                    const errorData = await response.json()
                    console.error('Login error:', errorData);
                    
                    // Handle specific error messages from API
                    if (errorData.message) {
                        setMessage(errorData.message)
                    } else if (errorData.errors) {
                        const errorMessages = Object.values(errorData.errors).flat().join(', ')
                        setMessage(errorMessages)
                    }
                } catch (e) {
                    console.error('Error parsing error response:', e);
                    setMessage('حدث خطأ في تسجيل الدخول')
                }
            }

        } catch (e) {
            console.log('Network error:', e)
            setMessage('خطأ في الاتصال بالخادم')
            setMessageType('failed')
        }

        // Clear form
        setMail('')
        setPassword('')

        // Clear message after 5 seconds
        setTimeout(() => {
            setMessage('')
        }, 5000)
    }

    return (
        <section className=' lg:px-20 py-10 relative'>
        <img className='m-auto  w-[70%]  h-full  hidden lg:block  relative z-0' src={shadow} />
        <div className='lg:flex  lg:w-[70%]  lg:h-[86%]   lg:absolute  start-60  top-14'>
            <div className='  lg:w-1/2 bg-linear-gradient  rounded-s-3xl  hidden lg:flex justify-center items-center '>
                <img className=' z-20  w-72' src={logo} />
            </div>
            <div className='bg-white w-full lg:w-1/2   rounded-e-3xl px-8 py-14'>
                <h2 className='text-center font-semibold text-2xl py-10'>تسجيل الدخول إلى حسابك!</h2>

                <form onSubmit={handleSubmit}>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>البريد الإلكتروني</label>
                        <input 
                            value={email} 
                            onChange={(e) => setMail(e.target.value)} 
                            placeholder='البريد الإلكتروني' 
                            type="email"
                            required
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                        />
                    </div>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>كلمة المرور</label>
                        <input 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            type='password' 
                            placeholder='كلمة المرور' 
                            required
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                        />
                        <div className='text-right mt-1'>
                            <Link to={'/reset-password'} className='text-Primary text-sm hover:underline'>
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
                    </div>

                    <div className='flex justify-center items-center my-2'>
                        <button type='submit' className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg'>
                            تسجيل الدخول
                        </button>
                    </div>

                    <div>
                        <p className={`text-center font-semibold py-1  ${messageType === 'failed' ? 'text-red-700' : 'text-Primary'}`}>
                            {message}
                        </p>
                    </div>

                </form>

                <div className='text-center py-5'>
                    <p className='py-2 text-Secondary-darkGray text-sm'>تسجيل الدخول باستخدام</p>
                    <div className='flex items-center justify-center gap-4 py-2'>
                        <img src={face} alt="Facebook" />
                        <img src={google} alt="Google" />
                        <img src={apple} alt="Apple" />
                    </div>
                    <p className='pt-2 text-black-medium'>
                        ليس لديك حساب؟ <Link to={'/signUp'} className='text-Primary'>إنشاء حساب</Link>
                    </p>
                </div>

            </div>
        </div>
    </section>
    )
}

export default Login

