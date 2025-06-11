import React, { useState } from 'react'
import shadow from '../assets/Bg-Shape.png'
import logo from '../assets/logo1.png'
import apple from '../assets/icons/apple.png'
import face from '../assets/icons/face.png'
import google from '../assets/icons/google.png'
import { useAuth } from '../Auth/AuthProvider'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {

    const { login, setAuth } = useAuth()
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const navigate = useNavigate()
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        role: '',
        specialization: '',
        bio: '',
        profilePictureUrl: ''
    })

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (registerData.password !== registerData.confirmPassword) {
            setMessage('كلمات المرور غير متطابقة')
            setMessageType('failed')
            setTimeout(() => setMessage(''), 5000)
            return
        }

        // Prepare data for API (only required fields)
        const apiData = {
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            userName: registerData.userName,
            email: registerData.email,
            password: registerData.password,
            confirmPassword: registerData.confirmPassword,
            phoneNumber: registerData.phoneNumber || '',
            gender: registerData.gender || '',
            dateOfBirth: registerData.dateOfBirth || new Date().toISOString(),
            role: registerData.role || 'Patient',
            specialization: registerData.specialization || '',
            bio: registerData.bio || '',
            profilePictureUrl: registerData.profilePictureUrl || ''
        }

        console.log('Sending registration data:', apiData);

        const apiUrl = 'http://medscanapi.runasp.net/api/Auth/register'

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData),
            })

            if (response.ok) {
                const responseData = await response.json()
                
                setMessage('تم إنشاء الحساب بنجاح!')
                setMessageType('success')

                console.log('Registration successful:', responseData)

                // Auto login after successful registration
                if (responseData.userName || responseData.email) {
                    login(responseData.userName || responseData.email)
                    setAuth(responseData.isAuth || true)
                }

                setTimeout(() => {
                    navigate('/login')
                }, 2000)

            } else {
                setMessage('فشل في إنشاء الحساب')
                setMessageType('failed')
                
                try {
                    const errorData = await response.json()
                    console.error('Registration error:', errorData);
                    
                    // Handle specific error messages from API
                    if (errorData.message) {
                        setMessage(errorData.message)
                    } else if (errorData.errors) {
                        const errorMessages = Object.values(errorData.errors).flat().join(', ')
                        setMessage(errorMessages)
                    }
                } catch (error) {
                    console.error('Error parsing error response:', error);
                    setMessage('حدث خطأ في إنشاء الحساب')
                }
            }
        } catch (e) {
            console.error('Network error:', e)
            setMessage('خطأ في الاتصال بالخادم')
            setMessageType('failed')
        }

        // Clear form
        setRegisterData({
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            gender: '',
            dateOfBirth: '',
            role: '',
            specialization: '',
            bio: '',
            profilePictureUrl: ''
        })

        // Clear message after 5 seconds
        setTimeout(() => {
            setMessage('')
        }, 5000)
    }

    return (
        <section className=' lg:px-20 py-10 relative'>
            <img className='m-auto  w-[70%]  h-full  hidden lg:block  relative z-0' src={shadow} />
            <div className='lg:flex  lg:w-[70%] lg:h-[86%]      lg:absolute  start-60  top-14'>
                <div className='lg:w-1/2 bg-linear-gradient  rounded-s-3xl  hidden lg:flex justify-center items-center '>
                    <img className=' z-20 w-72' src={logo} />
                </div>
                <form onSubmit={handleSubmit} className='bg-white w-full lg:w-1/2   rounded-e-3xl px-8 py-14'>
                    <h2 className='text-center font-semibold text-2xl py-5'>إنشاء حسابك!</h2>
                    
                    <div className='flex gap-3 py-2'>
                        <div className=''>
                            <label className='block  mb-2 text-[14px]'>الاسم الأول</label>
                            <input 
                                onChange={handleRegisterChange} 
                                name='firstName' 
                                value={registerData.firstName} 
                                placeholder='الاسم الأول' 
                                required
                                className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm ' 
                            />
                        </div>
                        <div>
                            <label className='block  mb-2 text-[14px]'>الاسم الأخير</label>
                            <input 
                                onChange={handleRegisterChange} 
                                name='lastName' 
                                value={registerData.lastName} 
                                placeholder='الاسم الأخير' 
                                required
                                className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                            />
                        </div>
                    </div>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>اسم المستخدم</label>
                        <input 
                            onChange={handleRegisterChange} 
                            name='userName' 
                            value={registerData.userName} 
                            placeholder='اسم المستخدم' 
                            required
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                        />
                    </div>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>البريد الإلكتروني</label>
                        <input 
                            onChange={handleRegisterChange} 
                            name='email' 
                            value={registerData.email} 
                            placeholder='البريد الإلكتروني' 
                            type="email"
                            required
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                        />
                    </div>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>كلمة المرور</label>
                        <input 
                            onChange={handleRegisterChange} 
                            name='password' 
                            value={registerData.password} 
                            type='password' 
                            placeholder='كلمة المرور' 
                            required
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                        />
                    </div>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>تأكيد كلمة المرور</label>
                        <input 
                            onChange={handleRegisterChange} 
                            name='confirmPassword' 
                            value={registerData.confirmPassword} 
                            type='password' 
                            placeholder='تأكيد كلمة المرور' 
                            required
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                        />
                    </div>

                    <div className='py-2'>
                        <label className='block  mb-2 text-[14px]'>رقم الهاتف (اختياري)</label>
                        <input 
                            onChange={handleRegisterChange} 
                            name='phoneNumber' 
                            value={registerData.phoneNumber} 
                            placeholder='رقم الهاتف' 
                            type="tel"
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                        />
                    </div>

                    <div className='flex justify-center items-center my-2 '>
                        <button className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg' type='submit'>
                            إنشاء حساب
                        </button>
                    </div>
                    
                    <div>
                        <p className={`text-center font-semibold py-1  ${messageType === 'failed' ? 'text-red-700' : 'text-Primary'}`}>
                            {message}
                        </p>
                    </div>

                    <div className='text-center py-5'>
                        <p className='py-2 text-Secondary-darkGray text-sm'>إنشاء حساب باستخدام</p>
                        <div className='flex items-center justify-center gap-4 py-2'>
                            <img src={face} alt="Facebook" />
                            <img src={google} alt="Google" />
                            <img src={apple} alt="Apple" />
                        </div>
                        <p className='pt-2 text-black-medium'>
                            لديك حساب بالفعل؟ <Link to={'/login'} className='text-Primary'>تسجيل الدخول</Link>
                        </p>
                    </div>

                </form>
            </div>
        </section>
    )
}

export default SignUp

