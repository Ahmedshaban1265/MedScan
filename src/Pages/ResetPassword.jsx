import React, { useState } from 'react'
import shadow from '../assets/Bg-Shape.png'
import logo from '../assets/logo1.png'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
    const [step, setStep] = useState(1) // 1: request reset, 2: verify code, 3: new password
    const [email, setEmail] = useState('')
    const [resetCode, setResetCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')

    const handleRequestReset = async (e) => {
        e.preventDefault()

        const apiUrl = 'http://medscanapi.runasp.net/api/Auth/request-password-reset'

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            if (response.ok) {
                setMessage('تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني')
                setMessageType('success')
                setStep(2)
            } else {
                const errorData = await response.json()
                setMessage(errorData.message || 'فشل في إرسال رمز إعادة التعيين')
                setMessageType('failed')
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('خطأ في الاتصال بالخادم')
            setMessageType('failed')
        }

        setTimeout(() => setMessage(''), 5000)
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault()

        const apiUrl = 'http://medscanapi.runasp.net/api/Auth/verify-reset-code'

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    resetCode 
                }),
            })

            if (response.ok) {
                setMessage('تم التحقق من الرمز بنجاح')
                setMessageType('success')
                setStep(3)
            } else {
                const errorData = await response.json()
                setMessage(errorData.message || 'رمز التحقق غير صحيح')
                setMessageType('failed')
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('خطأ في الاتصال بالخادم')
            setMessageType('failed')
        }

        setTimeout(() => setMessage(''), 5000)
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setMessage('كلمات المرور غير متطابقة')
            setMessageType('failed')
            setTimeout(() => setMessage(''), 5000)
            return
        }

        const apiUrl = 'http://medscanapi.runasp.net/api/Auth/reset-password'

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    resetCode,
                    newPassword 
                }),
            })

            if (response.ok) {
                setMessage('تم تغيير كلمة المرور بنجاح')
                setMessageType('success')
                
                setTimeout(() => {
                    window.location.href = '/login'
                }, 2000)
            } else {
                const errorData = await response.json()
                setMessage(errorData.message || 'فشل في تغيير كلمة المرور')
                setMessageType('failed')
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('خطأ في الاتصال بالخادم')
            setMessageType('failed')
        }

        setTimeout(() => setMessage(''), 5000)
    }

    return (
        <section className='lg:px-20 py-10 relative'>
            <img className='m-auto w-[70%] h-full hidden lg:block relative z-0' src={shadow} />
            <div className='lg:flex lg:w-[70%] lg:h-[86%] lg:absolute start-60 top-14'>
                <div className='lg:w-1/2 bg-linear-gradient rounded-s-3xl hidden lg:flex justify-center items-center'>
                    <img className='z-20 w-72' src={logo} />
                </div>
                <div className='bg-white w-full lg:w-1/2 rounded-e-3xl px-8 py-14'>
                    
                    {step === 1 && (
                        <>
                            <h2 className='text-center font-semibold text-2xl py-10'>إعادة تعيين كلمة المرور</h2>
                            <form onSubmit={handleRequestReset}>
                                <div className='py-2'>
                                    <label className='block mb-2 text-[14px]'>البريد الإلكتروني</label>
                                    <input 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder='البريد الإلكتروني' 
                                        type="email"
                                        required
                                        className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                                    />
                                </div>
                                <div className='flex justify-center items-center my-4'>
                                    <button type='submit' className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg'>
                                        إرسال رمز إعادة التعيين
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className='text-center font-semibold text-2xl py-10'>التحقق من الرمز</h2>
                            <form onSubmit={handleVerifyCode}>
                                <div className='py-2'>
                                    <label className='block mb-2 text-[14px]'>رمز التحقق</label>
                                    <input 
                                        value={resetCode} 
                                        onChange={(e) => setResetCode(e.target.value)} 
                                        placeholder='أدخل رمز التحقق' 
                                        required
                                        className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                                    />
                                </div>
                                <div className='flex justify-center items-center my-4'>
                                    <button type='submit' className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg'>
                                        التحقق من الرمز
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className='text-center font-semibold text-2xl py-10'>كلمة المرور الجديدة</h2>
                            <form onSubmit={handleResetPassword}>
                                <div className='py-2'>
                                    <label className='block mb-2 text-[14px]'>كلمة المرور الجديدة</label>
                                    <input 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        type='password' 
                                        placeholder='كلمة المرور الجديدة' 
                                        required
                                        className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                                    />
                                </div>
                                <div className='py-2'>
                                    <label className='block mb-2 text-[14px]'>تأكيد كلمة المرور</label>
                                    <input 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        type='password' 
                                        placeholder='تأكيد كلمة المرور' 
                                        required
                                        className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm' 
                                    />
                                </div>
                                <div className='flex justify-center items-center my-4'>
                                    <button type='submit' className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg'>
                                        تغيير كلمة المرور
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    <div>
                        <p className={`text-center font-semibold py-1 ${messageType === 'failed' ? 'text-red-700' : 'text-Primary'}`}>
                            {message}
                        </p>
                    </div>

                    <div className='text-center py-5'>
                        <p className='pt-2 text-black-medium'>
                            تذكرت كلمة المرور؟ <Link to={'/login'} className='text-Primary'>تسجيل الدخول</Link>
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ResetPassword

